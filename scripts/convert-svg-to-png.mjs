import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svgDir = path.resolve('public/3d-icons');
const pngDir = path.resolve('public/3d-icons-png');

if (!fs.existsSync(pngDir)) {
  fs.mkdirSync(pngDir, { recursive: true });
}

const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));
console.log(`Found ${files.length} SVGs to convert to PNG (512x512)...`);

let successCount = 0;
for (const file of files) {
  const svgPath = path.join(svgDir, file);
  let svgContent = fs.readFileSync(svgPath, 'utf-8');
  
  // Ensure valid XML namespace and entity decoding
  if (!svgContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgContent = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  svgContent = svgContent.replace(/&amp;/g, '&').replace(/&/g, '&amp;');

  try {
    const resvg = new Resvg(Buffer.from(svgContent), {
      fitTo: {
        mode: 'width',
        value: 512,
      },
      background: 'rgba(0, 0, 0, 0)', // Transparent
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const pngName = file.replace(/\.svg$/, '.png');
    
    // Save to public/3d-icons-png/
    fs.writeFileSync(path.join(pngDir, pngName), pngBuffer);
    
    // Also save alongside in public/3d-icons/
    fs.writeFileSync(path.join(svgDir, pngName), pngBuffer);
    successCount++;
  } catch (err) {
    console.error(`Error converting ${file}:`, err.message);
  }
}

console.log(`Successfully converted ${successCount} / ${files.length} 3D icons to HD transparent PNGs (512x512 px)!`);
