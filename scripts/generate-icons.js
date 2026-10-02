import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const svgPath = path.resolve('public/favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  const targets = [
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
  ];

  for (const { name, size } of targets) {
    const outputPath = path.resolve('public', name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
