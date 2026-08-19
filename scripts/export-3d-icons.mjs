import fs from 'fs';
import path from 'path';

const srcFile = path.resolve('src/components/common/ThreeDIcon.tsx');
const outputDir = path.resolve('public/3d-icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const content = fs.readFileSync(srcFile, 'utf-8');

// Match each export const ...3DIcon = ... => ( <svg ... > ... </svg> )
const iconRegex = /export\s+const\s+([A-Za-z0-9]+3DIcon)\s*:\s*React\.FC<[^>]*>\s*=\s*\([^)]*\)\s*=>\s*\(\s*(<svg[\s\S]*?<\/svg>)\s*\);/g;

let match;
let count = 0;
const iconNames = [];

while ((match = iconRegex.exec(content)) !== null) {
  const componentName = match[1];
  let svgContent = match[2];

  // Convert React JSX attributes to standard SVG attributes
  svgContent = svgContent
    .replace(/className=\{[^}]+\}/g, '')
    .replace(/className="[^"]*"/g, '')
    .replace(/strokeWidth=/g, 'stroke-width=')
    .replace(/strokeOpacity=/g, 'stroke-opacity=')
    .replace(/fillOpacity=/g, 'fill-opacity=')
    .replace(/strokeLinecap=/g, 'stroke-linecap=')
    .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
    .replace(/strokeDasharray=/g, 'stroke-dasharray=')
    .replace(/stopColor=/g, 'stop-color=')
    .replace(/stopOpacity=/g, 'stop-opacity=')
    .replace(/clipPath=/g, 'clip-path=')
    .replace(/gradientUnits=/g, 'gradientUnits=')
    .replace(/userSpaceOnUse/g, 'userSpaceOnUse');

  // Format nice filename: e.g. Word3DIcon -> word-3d.svg / word.svg
  let filename = componentName
    .replace(/3DIcon$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  const filePath = path.join(outputDir, `${filename}.svg`);
  fs.writeFileSync(filePath, svgContent.trim() + '\n', 'utf-8');
  iconNames.push(`${filename}.svg`);
  count++;
}

console.log(`Successfully exported ${count} 3D vector icons to public/3d-icons/`);
console.log(iconNames.join(', '));
