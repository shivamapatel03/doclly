import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageExtension() {
  const zip = new JSZip();
  const extDir = path.join(process.cwd(), 'doclly-extension');
  const outputFile = path.join(process.cwd(), 'doclly-extension.zip');

  function addFolderToZip(folderPath, zipFolder) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subZip = zipFolder.folder(file);
        addFolderToZip(fullPath, subZip);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(file, content);
      }
    }
  }

  console.log('📦 Packaging doclly-extension into doclly-extension.zip...');
  addFolderToZip(extDir, zip);

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outputFile, buffer);

  console.log(`✅ Extension packaged successfully!`);
  console.log(`📄 File created: ${outputFile} (${(buffer.length / 1024).toFixed(1)} KB)`);
  console.log(`🚀 Ready for upload to Chrome Web Store & Edge Addons!`);
}

packageExtension().catch(console.error);
