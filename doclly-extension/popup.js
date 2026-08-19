// Doclly Standalone Extension Application Logic (Zero Redirects)

const BASE_URL = 'https://www.doclly.online';

// Tool Registry
const TOOLS = [
  // 1. Optimize
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Optimize & shrink file size', category: 'optimize', icon: 'compress.png', isStandalone: true, keywords: ['compress', 'shrink', 'reduce', 'size', 'kb', 'mb'] },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Add password encryption', category: 'edit', icon: 'protect.png', isStandalone: true, keywords: ['protect', 'password', 'encrypt', 'security', 'lock'] },
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove password restrictions', category: 'optimize', icon: 'unlock.png', isStandalone: true, keywords: ['unlock', 'decrypt', 'password'] },

  // 2. Organize & Merge
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple PDFs into 1', category: 'organize', icon: 'merge.png', isStandalone: true, multiFile: true, keywords: ['merge', 'combine', 'join', 'append'] },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Extract pages or split ranges', category: 'organize', icon: 'split.png', isStandalone: true, keywords: ['split', 'extract', 'separate', 'pages'] },
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Rotate pages 90°, 180° or 270°', category: 'organize', icon: 'organize.png', isStandalone: true, keywords: ['rotate', 'turn', 'orient', 'degrees'] },
  { id: 'watermark-pdf', name: 'Watermark PDF', desc: 'Add text watermark overlay', category: 'edit', icon: 'watermark.png', isStandalone: true, keywords: ['watermark', 'stamp', 'confidential', 'logo'] },
  { id: 'remove-pages', name: 'Remove Pages', desc: 'Delete unwanted PDF pages', category: 'organize', icon: 'remove-pages.png', isStandalone: true, keywords: ['remove', 'delete', 'cut', 'pages'] },

  // 3. Convert & Images
  { id: 'jpg-to-pdf', name: 'JPG / Images to PDF', desc: 'Convert photos to PDF', category: 'convert', icon: 'image.png', isStandalone: true, multiFile: true, accept: 'image/*', keywords: ['image', 'jpg', 'jpeg', 'png', 'photos'] },
  { id: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert to editable DOCX', category: 'convert', icon: 'word.png', isStandalone: false, keywords: ['word', 'docx', 'doc'] },
  { id: 'pdf-to-excel', name: 'PDF to Excel', desc: 'Extract tables to XLSX', category: 'convert', icon: 'excel.png', isStandalone: false, keywords: ['excel', 'xlsx', 'tables'] },
  { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', desc: 'Slides to editable PPTX', category: 'convert', icon: 'ppt.png', isStandalone: false, keywords: ['powerpoint', 'ppt', 'slides'] },
  { id: 'edit-pdf', name: 'Edit Scanned PDF', desc: 'In-place OCR text editing', category: 'edit', icon: 'sign.png', isStandalone: false, keywords: ['edit', 'modify', 'ocr', 'text'] },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Draw, type or stamp signature', category: 'edit', icon: 'sign.png', isStandalone: false, keywords: ['sign', 'signature'] },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Visual side-by-side diff', category: 'edit', icon: 'compare.png', isStandalone: false, keywords: ['compare', 'diff', 'redline'] }
];

// App State
let currentView = 'catalog'; // 'catalog' | 'processor' | 'success'
let activeTool = null;
let activeCategory = 'all';
let currentQuery = '';
let selectedFiles = [];
let processedBlob = null;
let processedFileName = '';

// DOM Elements
const catalogView = document.getElementById('catalogView');
const processorView = document.getElementById('processorView');
const successView = document.getElementById('successView');

const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const toolsGrid = document.getElementById('toolsGrid');
const noResults = document.getElementById('noResults');
const noResultsQuery = document.getElementById('noResultsQuery');
const tabButtons = document.querySelectorAll('.tab-btn');

const backToCatalogBtn = document.getElementById('backToCatalogBtn');
const activeToolTitle = document.getElementById('activeToolTitle');
const toolDropzone = document.getElementById('toolDropzone');
const toolFileInput = document.getElementById('toolFileInput');
const toolDropTitle = document.getElementById('toolDropTitle');
const toolDropSub = document.getElementById('toolDropSub');
const selectedFilesList = document.getElementById('selectedFilesList');
const toolOptionsBox = document.getElementById('toolOptionsBox');
const progressContainer = document.getElementById('progressContainer');
const progressBarFill = document.getElementById('progressBarFill');
const progressStatusText = document.getElementById('progressStatusText');
const btnExecuteProcess = document.getElementById('btnExecuteProcess');

const resultFilename = document.getElementById('resultFilename');
const resultSize = document.getElementById('resultSize');
const successDesc = document.getElementById('successDesc');
const btnDownloadResult = document.getElementById('btnDownloadResult');
const btnProcessAnother = document.getElementById('btnProcessAnother');
const logoHomeBtn = document.getElementById('logoHomeBtn');

// View Switching
function switchView(viewName) {
  currentView = viewName;
  catalogView.classList.toggle('active', viewName === 'catalog');
  processorView.classList.toggle('active', viewName === 'processor');
  successView.classList.toggle('active', viewName === 'success');
}

// Render Tools in Catalog
function renderCatalogTools() {
  const q = currentQuery.trim().toLowerCase();

  const filtered = TOOLS.filter(tool => {
    const categoryMatch = activeCategory === 'all' || tool.category === activeCategory;
    if (!categoryMatch) return false;

    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.desc.toLowerCase().includes(q) ||
      tool.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  toolsGrid.innerHTML = '';

  if (filtered.length === 0) {
    toolsGrid.style.display = 'none';
    noResults.style.display = 'block';
    noResultsQuery.textContent = currentQuery;
    return;
  }

  toolsGrid.style.display = 'grid';
  noResults.style.display = 'none';

  filtered.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';

    card.innerHTML = `
      <img src="icons/3d/${tool.icon}" alt="${tool.name}" class="tool-icon" onerror="this.src='icons/icon32.png'">
      <div class="tool-info">
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.isStandalone ? '⚡ Offline in extension' : tool.desc}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      openTool(tool);
    });

    toolsGrid.appendChild(card);
  });
}

// Open Specific Tool
function openTool(tool) {
  if (!tool.isStandalone) {
    // Web only tool (e.g. OCR Editor) -> open on website
    chrome.tabs.create({ url: `${BASE_URL}/tools/${tool.id}` });
    return;
  }

  activeTool = tool;
  selectedFiles = [];
  processedBlob = null;

  activeToolTitle.textContent = tool.name;
  btnExecuteProcess.textContent = `Process with ${tool.name}`;
  btnExecuteProcess.disabled = true;
  progressContainer.style.display = 'none';
  selectedFilesList.style.display = 'none';
  selectedFilesList.innerHTML = '';

  // Setup Dropzone
  toolFileInput.multiple = !!tool.multiFile;
  toolFileInput.accept = tool.accept || '.pdf';
  toolDropTitle.textContent = tool.multiFile ? 'Click to select multiple files' : 'Click to select PDF file';
  toolDropSub.textContent = 'or drag and drop here';

  // Build Tool Options
  buildToolOptions(tool);

  switchView('processor');
}

// Build Tool Options Box
function buildToolOptions(tool) {
  toolOptionsBox.innerHTML = '';

  if (tool.id === 'compress-pdf') {
    toolOptionsBox.innerHTML = `
      <div class="option-group">
        <label class="option-label">Compression Mode</label>
        <select class="option-select" id="optCompressLevel">
          <option value="recommended" selected>⚡ Recommended (Smart stream optimization)</option>
          <option value="extreme">📉 Extreme (Maximum size reduction)</option>
        </select>
      </div>
    `;
  } else if (tool.id === 'split-pdf') {
    toolOptionsBox.innerHTML = `
      <div class="option-group">
        <label class="option-label">Page Range to Extract</label>
        <input type="text" class="option-input" id="optSplitRange" placeholder="e.g. 1-3, 5, 8 (or leave blank for all)">
      </div>
    `;
  } else if (tool.id === 'rotate-pdf') {
    toolOptionsBox.innerHTML = `
      <div class="option-group">
        <label class="option-label">Rotation Angle</label>
        <select class="option-select" id="optRotateDegrees">
          <option value="90" selected>Rotate 90° Clockwise</option>
          <option value="180">Rotate 180° Upside Down</option>
          <option value="270">Rotate 270° Counter-Clockwise</option>
        </select>
      </div>
    `;
  } else if (tool.id === 'protect-pdf') {
    toolOptionsBox.innerHTML = `
      <div class="option-group">
        <label class="option-label">Enter Password</label>
        <input type="password" class="option-input" id="optPassword" placeholder="Set document password">
      </div>
    `;
  } else if (tool.id === 'watermark-pdf') {
    toolOptionsBox.innerHTML = `
      <div class="option-group">
        <label class="option-label">Watermark Text</label>
        <input type="text" class="option-input" id="optWatermarkText" value="CONFIDENTIAL" placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY">
      </div>
    `;
  } else if (tool.id === 'remove-pages') {
    toolOptionsBox.innerHTML = `
      <div class="option-group">
        <label class="option-label">Pages to Delete</label>
        <input type="text" class="option-input" id="optRemovePages" placeholder="e.g. 2, 4, 7">
      </div>
    `;
  } else {
    toolOptionsBox.innerHTML = `
      <div style="color: #64748B; font-size: 11px; text-align: center;">
        ⚡ Instant offline conversion ready.
      </div>
    `;
  }
}

// Handle File Selection
function handleFilesChosen(files) {
  if (!files || files.length === 0) return;

  selectedFiles = Array.from(files);
  selectedFilesList.innerHTML = '';
  selectedFilesList.style.display = 'block';

  selectedFiles.forEach(f => {
    const row = document.createElement('div');
    row.className = 'file-row';
    row.innerHTML = `
      <span class="file-row-name">📄 ${f.name}</span>
      <span class="file-row-size">${(f.size / 1024).toFixed(1)} KB</span>
    `;
    selectedFilesList.appendChild(row);
  });

  toolDropTitle.textContent = `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`;
  toolDropSub.textContent = 'Click to change files';
  btnExecuteProcess.disabled = false;
}

// Execute PDF Processing (Zero Redirects)
btnExecuteProcess.addEventListener('click', async () => {
  if (selectedFiles.length === 0 || !activeTool) return;

  btnExecuteProcess.disabled = true;
  progressContainer.style.display = 'block';
  progressBarFill.style.width = '10%';
  progressStatusText.textContent = 'Initializing engine...';

  const updateProgress = (percent, text) => {
    progressBarFill.style.width = `${percent}%`;
    progressStatusText.textContent = text;
  };

  try {
    const t0 = performance.now();
    let resultBlob = null;
    let outName = 'processed.pdf';

    const baseName = selectedFiles[0].name.replace(/\.[^/.]+$/, '');

    if (activeTool.id === 'merge-pdf') {
      resultBlob = await window.DocllyEngine.mergePdfs(selectedFiles, updateProgress);
      outName = `${baseName}_merged.pdf`;
    } else if (activeTool.id === 'compress-pdf') {
      const level = document.getElementById('optCompressLevel')?.value || 'recommended';
      resultBlob = await window.DocllyEngine.compressPdf(selectedFiles[0], level, updateProgress);
      outName = `${baseName}_compressed.pdf`;
    } else if (activeTool.id === 'split-pdf') {
      const range = document.getElementById('optSplitRange')?.value || '';
      resultBlob = await window.DocllyEngine.splitPdf(selectedFiles[0], range, updateProgress);
      outName = `${baseName}_split.pdf`;
    } else if (activeTool.id === 'rotate-pdf') {
      const deg = parseInt(document.getElementById('optRotateDegrees')?.value || '90', 10);
      resultBlob = await window.DocllyEngine.rotatePdf(selectedFiles[0], deg, updateProgress);
      outName = `${baseName}_rotated.pdf`;
    } else if (activeTool.id === 'protect-pdf') {
      const pass = document.getElementById('optPassword')?.value || '';
      resultBlob = await window.DocllyEngine.protectPdf(selectedFiles[0], pass, updateProgress);
      outName = `${baseName}_protected.pdf`;
    } else if (activeTool.id === 'watermark-pdf') {
      const text = document.getElementById('optWatermarkText')?.value || 'CONFIDENTIAL';
      resultBlob = await window.DocllyEngine.watermarkPdf(selectedFiles[0], text, updateProgress);
      outName = `${baseName}_watermarked.pdf`;
    } else if (activeTool.id === 'remove-pages') {
      const pages = document.getElementById('optRemovePages')?.value || '';
      resultBlob = await window.DocllyEngine.removePages(selectedFiles[0], pages, updateProgress);
      outName = `${baseName}_edited.pdf`;
    } else if (activeTool.id === 'jpg-to-pdf') {
      resultBlob = await window.DocllyEngine.imagesToPdf(selectedFiles, updateProgress);
      outName = `images_converted.pdf`;
    } else {
      throw new Error('Tool processor not found.');
    }

    const elapsed = ((performance.now() - t0) / 1000).toFixed(1);

    processedBlob = resultBlob;
    processedFileName = outName;

    // Show Success View
    resultFilename.textContent = outName;
    resultSize.textContent = `New size: ${(resultBlob.size / 1024).toFixed(1)} KB`;
    successDesc.textContent = `Processed offline in ${elapsed}s with 100% privacy (zero server uploads).`;

    switchView('success');

  } catch (err) {
    alert('Processing Error: ' + (err.message || err));
    btnExecuteProcess.disabled = false;
    progressContainer.style.display = 'none';
  }
});

// Download Processed File
btnDownloadResult.addEventListener('click', () => {
  if (!processedBlob) return;

  const url = URL.createObjectURL(processedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = processedFileName || 'doclly-document.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 2000);
});

// Process Another Button
btnProcessAnother.addEventListener('click', () => {
  switchView('catalog');
});

backToCatalogBtn.addEventListener('click', () => {
  switchView('catalog');
});

// Dropzone Listeners
toolDropzone.addEventListener('click', () => {
  toolFileInput.click();
});

toolFileInput.addEventListener('change', (e) => {
  handleFilesChosen(e.target.files);
});

toolDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  toolDropzone.classList.add('dragover');
});

toolDropzone.addEventListener('dragleave', () => {
  toolDropzone.classList.remove('dragover');
});

toolDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  toolDropzone.classList.remove('dragover');
  handleFilesChosen(e.dataTransfer.files);
});

// Search & Filter Listeners
searchInput.addEventListener('input', (e) => {
  currentQuery = e.target.value;
  searchClear.style.display = currentQuery ? 'block' : 'none';
  renderCatalogTools();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  currentQuery = '';
  searchClear.style.display = 'none';
  searchInput.focus();
  renderCatalogTools();
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.getAttribute('data-category');
    renderCatalogTools();
  });
});

logoHomeBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: BASE_URL });
});

// Initial Load
renderCatalogTools();
