import sharp from "sharp";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";

const OUTPUT_DIR = "public/og-watermarked";
const LOGO_PATH = "public/watermark-logo.png";

async function watermark(inputPath: string, outputPath: string): Promise<void> {
  const base = sharp(inputPath);
  const { width, height } = await base.metadata();

  if (!width || !height) {
    throw new Error(`Could not read dimensions for ${inputPath}`);
  }

  const logoWidth = Math.round(width * 0.18); // ~18% of image width
  const logo = await sharp(LOGO_PATH)
    .resize({ width: logoWidth })
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();

  const padding = Math.round(width * 0.02);

  await base
    .composite([
      {
        input: logo,
        left: width - (logoMeta.width ?? 0) - padding,
        top: height - (logoMeta.height ?? 0) - padding,
      },
    ])
    .jpeg({ quality: 85 })
    .toFile(outputPath);
}

async function run(): Promise<void> {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = await glob("src/content/**/*.{md,mdx}");

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data } = matter(raw);
    if (!data.image) continue;

    const parts = file.split(path.sep);
    const collection = parts[parts.length - 2];
    const slug = path.basename(file, path.extname(file));

    const inputPath = path.join("public", data.image.replace(/^\//, ""));
    const outDir = path.join(OUTPUT_DIR, collection);
    fs.mkdirSync(outDir, { recursive: true });
    const outputPath = path.join(outDir, `${slug}.jpg`);

    if (!fs.existsSync(inputPath)) {
      console.warn(`Skipping ${collection}/${slug}: image not found at ${inputPath}`);
      continue;
    }

    await watermark(inputPath, outputPath);
    console.log(`Watermarked: ${collection}/${slug}`);
  }
}

run();
