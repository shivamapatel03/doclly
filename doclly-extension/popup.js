// Doclly Extension Core Logic

const BASE_URL = 'https://www.doclly.online';

const TOOLS = [
  // 1. Edit & Sign
  { id: 'edit-pdf', name: 'Edit Scanned PDF', desc: 'In-place OCR text editing', category: 'edit', icon: 'sign.png', keywords: ['edit', 'modify', 'ocr', 'text', 'scanned', 'write'] },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Draw, type or stamp signature', category: 'edit', icon: 'sign.png', keywords: ['sign', 'signature', 'draw', 'stamp'] },
  { id: 'watermark-pdf', name: 'Watermark PDF', desc: 'Add text or logo stamp', category: 'edit', icon: 'watermark.png', keywords: ['watermark', 'stamp', 'confidential', 'logo'] },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Visual side-by-side diff', category: 'edit', icon: 'compare.png', keywords: ['compare', 'diff', 'redline', 'version'] },
  { id: 'invoice-qr-stamp', name: 'Invoice UPI QR', desc: 'Auto-stamp payment QR codes', category: 'edit', icon: 'qr-code.png', keywords: ['qr', 'upi', 'invoice', 'barcode', 'payment', 'bill'] },

  // 2. Convert
  { id: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert to editable DOCX', category: 'convert', icon: 'word.png', keywords: ['word', 'docx', 'doc', 'convert'] },
  { id: 'word-to-pdf', name: 'Word to PDF', desc: 'DOCX to clean PDF', category: 'convert', icon: 'pdf.png', keywords: ['word', 'docx', 'doc', 'convert', 'pdf'] },
  { id: 'pdf-to-excel', name: 'PDF to Excel', desc: 'Extract tables to XLSX', category: 'convert', icon: 'excel.png', keywords: ['excel', 'xlsx', 'csv', 'sheets', 'tables'] },
  { id: 'excel-to-pdf', name: 'Excel to PDF', desc: 'Spreadsheets to PDF', category: 'convert', icon: 'excel.png', keywords: ['excel', 'xlsx', 'spreadsheet'] },
  { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', desc: 'Slides to editable PPTX', category: 'convert', icon: 'ppt.png', keywords: ['powerpoint', 'ppt', 'pptx', 'slides', 'presentation'] },
  { id: 'ppt-to-pdf', name: 'PowerPoint to PDF', desc: 'Presentations to PDF', category: 'convert', icon: 'ppt.png', keywords: ['ppt', 'pptx', 'powerpoint', 'slides'] },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Export high-res images', category: 'convert', icon: 'image.png', keywords: ['jpg', 'jpeg', 'png', 'image', 'picture', 'photo'] },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', desc: 'Photos & scans to PDF', category: 'convert', icon: 'image.png', keywords: ['image', 'jpg', 'png', 'photo', 'scan'] },
  { id: 'pdf-to-text', name: 'PDF to Text', desc: 'Extract raw text (.txt)', category: 'convert', icon: 'text.png', keywords: ['text', 'txt', 'extract', 'copy'] },
  { id: 'html-to-pdf', name: 'HTML to PDF', desc: 'Webpages & code to PDF', category: 'convert', icon: 'html.png', keywords: ['html', 'webpage', 'code', 'url'] },

  // 3. Optimize
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Shrink <200 KB with 90% ratio', category: 'optimize', icon: 'compress.png', keywords: ['compress', 'shrink', 'reduce', 'size', 'kb', 'mb'] },
  { id: 'flatten-pdf', name: 'Flatten PDF', desc: 'Lock form fields & layers', category: 'optimize', icon: 'flatten.png', keywords: ['flatten', 'lock', 'layers', 'form'] },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Add 256-bit AES password', category: 'optimize', icon: 'protect.png', keywords: ['protect', 'password', 'encrypt', 'security', 'lock'] },
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove password & restrictions', category: 'optimize', icon: 'unlock.png', keywords: ['unlock', 'decrypt', 'password', 'remove'] },

  // 4. Organize
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple PDFs into 1', category: 'organize', icon: 'merge.png', keywords: ['merge', 'combine', 'join', 'append'] },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Extract pages or split ranges', category: 'organize', icon: 'split.png', keywords: ['split', 'extract', 'separate', 'pages'] },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Reorder, rotate & delete pages', category: 'organize', icon: 'organize.png', keywords: ['organize', 'reorder', 'rotate', 'sort'] },
  { id: 'remove-pages', name: 'Remove Pages', desc: 'Delete unwanted PDF pages', category: 'organize', icon: 'remove-pages.png', keywords: ['remove', 'delete', 'cut', 'pages'] },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Save specific pages as PDF', category: 'organize', icon: 'extract-pages.png', keywords: ['extract', 'save', 'pages', 'select'] }
];

let activeCategory = 'all';
let currentQuery = '';

const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const toolsGrid = document.getElementById('toolsGrid');
const noResults = document.getElementById('noResults');
const noResultsQuery = document.getElementById('noResultsQuery');
const tabButtons = document.querySelectorAll('.tab-btn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const logoLink = document.getElementById('logoLink');

// Render Tools
function renderTools() {
  const q = currentQuery.trim().toLowerCase();

  const filtered = TOOLS.filter(tool => {
    // Category match
    const categoryMatch = activeCategory === 'all' || tool.category === activeCategory;
    if (!categoryMatch) return false;

    // Search query match
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
    const card = document.createElement('a');
    card.className = 'tool-card';
    card.href = `${BASE_URL}/tools/${tool.id}`;
    card.target = '_blank';

    card.innerHTML = `
      <img src="icons/3d/${tool.icon}" alt="${tool.name}" class="tool-icon" onerror="this.src='icons/icon32.png'">
      <div class="tool-info">
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.desc}</div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      e.preventDefault();
      openDocllyUrl(`${BASE_URL}/tools/${tool.id}`);
    });

    toolsGrid.appendChild(card);
  });
}

// Open URL helper (handles chrome tabs)
function openDocllyUrl(url) {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
  currentQuery = e.target.value;
  searchClear.style.display = currentQuery ? 'block' : 'none';
  renderTools();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  currentQuery = '';
  searchClear.style.display = 'none';
  searchInput.focus();
  renderTools();
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.getAttribute('data-category');
    renderTools();
  });
});

logoLink.addEventListener('click', () => {
  openDocllyUrl(BASE_URL);
});

// Dropzone & File Click Handlers
dropzone.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) {
    openDocllyUrl(`${BASE_URL}/document-actions`);
  }
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  openDocllyUrl(`${BASE_URL}/document-actions`);
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (searchInput.value) {
      searchInput.value = '';
      currentQuery = '';
      searchClear.style.display = 'none';
      renderTools();
    }
  } else if (e.key === 'Enter') {
    const firstCard = toolsGrid.querySelector('.tool-card');
    if (firstCard) {
      firstCard.click();
    }
  }
});

// Initial Render
renderTools();
