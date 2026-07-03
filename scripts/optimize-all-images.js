#!/usr/bin/env node
import sharp from 'sharp';
import { 
  readdirSync, 
  statSync, 
  mkdirSync, 
  existsSync, 
  writeFileSync,
  copyFileSync
} from 'fs';
import { join, parse, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── CONFIG ──
const CONFIG = {
  widths: [480, 800, 1200],
  quality: 80,
  formats: ['webp'], // Add 'avif' if you want AVIF too (slower)
};

// ── DIRECTORIES TO SCAN ──
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
        dir: dirname(fullPath),
        ...parse(fullPath),
      });
    }
  }
  
  return images;
}

async function optimizeImage(image, outputDir) {
  const { name, ext, base, relativePath } = image;
  const subDir = dirname(relativePath);
  const outDir = join(outputDir, subDir);
  ensureDir(outDir);
  
  const results = {};
  
  for (const format of CONFIG.formats) {
    results[format] = {};
    
    for (const width of CONFIG.widths) {
      const outputName = `${name}-${width}.${format}`;
      const outputPath = join(outDir, outputName);
      
      // Skip if already exists and newer
      if (existsSync(outputPath)) {
        const outStat = statSync(outputPath);
        const inStat = statSync(image.fullPath);
        if (outStat.mtime > inStat.mtime) {
          results[format][width] = outputPath.replace(ROOT, '').replace(/\\/g, '/');
          continue;
        }
      }
      
      try {
        let pipeline = sharp(image.fullPath);
        
        // Get metadata for resizing
        const metadata = await pipeline.metadata();
        const targetWidth = Math.min(width, metadata.width || width);
        
        pipeline = pipeline.resize(targetWidth, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        });
        
        if (format === 'webp') {
          pipeline = pipeline.webp({ quality: CONFIG.quality, effort: 4 });
        } else if (format === 'avif') {
          pipeline = pipeline.avif({ quality: CONFIG.quality, effort: 4 });
        }
        
        await pipeline.toFile(outputPath);
        results[format][width] = outputPath.replace(ROOT, '').replace(/\\/g, '/');
        process.stdout.write('.');
      } catch (err) {
        console.error(`\nFailed: ${image.fullPath}`, err.message);
        results[format][width] = null;
      }
    }
  }
  
  return results;
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
      allManifest[key] = {
        source: image.fullPath.replace(ROOT, '').replace(/\\/g, '/'),
        type: source.type,
        optimized: await optimizeImage(image, join(ROOT, source.output)),
      };
    }
    
    console.log(`\n✅ Done: ${source.path}\n`);
  }
  
  // Write manifest
  const manifestPath = join(ROOT, 'src/data/image-manifest.json');
  ensureDir(dirname(manifestPath));
  writeFileSync(manifestPath, JSON.stringify(allManifest, null, 2));
  
  console.log(`\n📝 Manifest written: src/data/image-manifest.json`);
  console.log(`📊 Total images: ${Object.keys(allManifest).length}`);
  console.log('\n🎉 All done! Run `npm run build` to deploy.');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
