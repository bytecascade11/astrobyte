#!/usr/bin/env node
import sharp from 'sharp';
import { 
  readdirSync, 
  statSync, 
  mkdirSync, 
  existsSync, 
  writeFileSync
} from 'fs';
import { join, parse, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── CONFIG ──
const CONFIG = {
  widths: [480, 800, 1200],
  quality: 80,
};

// ── DIRECTORIES ──
const SOURCE_DIRS = [
  { path: 'public/images/posts', type: 'public', output: 'public/images/posts/optimized' },
  { path: 'src/assets/posts', type: 'assets', output: 'src/assets/posts/optimized' },
];

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i;

// ── HELPERS ──
function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function getAllImages(dir, basePath = dir) {
  const images = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('optimized')) {
      images.push(...getAllImages(fullPath, basePath));
    } else if (stat.isFile() && IMAGE_EXTENSIONS.test(item)) {
      images.push({
        fullPath,
        relativePath: relative(basePath, fullPath),
        ...parse(fullPath),
      });
    }
  }
  return images;
}

// ── MAIN ──
async function main() {
  console.log('🔍 Scanning for images...\n');
  const allManifest = {};
  
  for (const source of SOURCE_DIRS) {
    const fullPath = join(ROOT, source.path);
    if (!existsSync(fullPath)) {
      console.log(`⚠️  Skipping (not found): ${source.path}`);
      continue;
    }
    
    console.log(`📁 Processing: ${source.path}`);
    const images = getAllImages(fullPath);
    console.log(`   Found ${images.length} images\n`);
    if (images.length === 0) continue;
    
    ensureDir(join(ROOT, source.output));
    
    for (const image of images) {
      const key = image.relativePath.replace(/\\/g, '/');
      const outDir = join(ROOT, source.output, dirname(image.relativePath));
      ensureDir(outDir);
      
      const optimized = {};
      
      for (const width of CONFIG.widths) {
        const outputName = `${image.name}-${width}.webp`;
        const outputPath = join(outDir, outputName);
        const publicPath = outputPath.replace(ROOT, '').replace(/\\/g, '/');
        
        // Skip if already up to date
        if (existsSync(outputPath)) {
          const outStat = statSync(outputPath);
          const inStat = statSync(image.fullPath);
          if (outStat.mtime > inStat.mtime) {
            optimized[width] = publicPath;
            continue;
          }
        }
        
        try {
          const metadata = await sharp(image.fullPath).metadata();
          const targetWidth = Math.min(width, metadata.width || width);
          
          await sharp(image.fullPath)
            .resize(targetWidth, null, { withoutEnlargement: true, fit: 'inside' })
            .webp({ quality: CONFIG.quality })
            .toFile(outputPath);
          
          optimized[width] = publicPath;
          process.stdout.write('.');
        } catch (err) {
          console.error(`\n❌ Failed: ${image.fullPath}`, err.message);
        }
      }
      
      allManifest[key] = {
        original: image.fullPath.replace(ROOT, '').replace(/\\/g, '/'),
        type: source.type,
        optimized
      };
    }
    
    console.log(`\n✅ Done: ${source.path}\n`);
  }
  
  // Write manifest
  const manifestPath = join(ROOT, 'src/data/image-manifest.json');
  ensureDir(dirname(manifestPath));
  writeFileSync(manifestPath, JSON.stringify(allManifest, null, 2));
  
  console.log(`\n📝 Manifest: src/data/image-manifest.json`);
  console.log(`📊 Images: ${Object.keys(allManifest).length}`);
}

main().catch(err => {
  console.error('💥 Error:', err);
  process.exit(1);
});
