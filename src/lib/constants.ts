import { ToolDefinition, CategoryInfo } from '../types/tool';

export const TOOL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'convert',
    name: 'Convert from PDF',
    description: 'Convert PDF files to editable Word, Excel, PowerPoint, JPG, and Text formats.',
    iconName: 'RefreshCw',
  },
  {
    id: 'to-pdf',
    name: 'Convert to PDF',
    description: 'Transform Word, Excel, PPT, JPG, and HTML files into standard PDF documents.',
    iconName: 'FilePlus',
  },
  {
    id: 'organize',
    name: 'Organize PDF',
    description: 'Merge, split, remove, extract, reorder, and rotate pages effortlessly.',
    iconName: 'Files',
  },
  {
    id: 'optimize',
    name: 'Optimize PDF',
    description: 'Compress file size and flatten forms without losing visual quality.',
    iconName: 'Minimize2',
  },
  {
    id: 'edit-security',
    name: 'Edit & Security',
    description: 'Sign, watermark, protect with password, unlock, and add page numbers.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'office',
    name: 'Spreadsheets & Data',
    description: 'Work with Excel (.xlsx) and CSV datasets, deduplicate, and clean data.',
    iconName: 'Table',
  },
];

export const ALL_TOOLS: ToolDefinition[] = [
  // --- 1. ORGANIZE PDF ---
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'organize',
    description: 'Combine multiple PDF files into one single organized document in seconds.',
    iconName: 'Files',
    route: '/tools/merge-pdf',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 20,
    outputFormat: 'PDF',
    actionButtonText: 'Merge PDFs',
    seo: {
      title: 'Merge PDF Files Online — Free & Private — Doclly',
      description: 'Combine multiple PDF files into a single document. Reorder pages and merge with 100% privacy.',
      keywords: ['merge pdf', 'combine pdf', 'join pdfs online', 'merge documents'],
      faq: [
        { question: 'How do I merge multiple PDF files?', answer: 'Upload your PDF files, drag them into your preferred order, and click "Merge PDFs".' },
        { question: 'Is my data secure?', answer: 'Yes, all processing happens locally in your browser. No files are uploaded to third-party servers.' }
      ]
    }
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'organize',
    description: 'Extract specific pages or page ranges into separate standalone PDF files.',
    iconName: 'Scissors',
    route: '/tools/split-pdf',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF / ZIP',
    actionButtonText: 'Split PDF',
    seo: {
      title: 'Split PDF Online — Extract Pages Easily — Doclly',
      description: 'Split PDF files by page ranges or extract single pages instantly with our free split tool.',
      keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf splitter'],
      faq: [
        { question: 'Can I extract a custom page range like 1-3, 5?', answer: 'Yes! Simply enter your desired ranges or select pages visually.' }
      ]
    }
  },
  {
    id: 'remove-pages',
    name: 'Remove Pages',
    category: 'organize',
    description: 'Select and delete unwanted pages from any PDF document.',
    iconName: 'Trash2',
    route: '/tools/remove-pages',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Remove Selected Pages',
    seo: {
      title: 'Remove Pages from PDF Online — Doclly',
      description: 'Delete specific pages from your PDF file. Fast, free, and completely client-side.',
      keywords: ['remove pdf pages', 'delete pages from pdf', 'cut pdf pages'],
      faq: [{ question: 'How do I delete pages?', answer: 'Upload your PDF, click on the thumbnails you want to remove, and download the trimmed file.' }]
    }
  },
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    category: 'organize',
    description: 'Save only the chosen pages from your PDF into a brand new PDF.',
    iconName: 'Copy',
    route: '/tools/extract-pages',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Extract Pages',
    seo: {
      title: 'Extract Pages from PDF Online — Doclly',
      description: 'Select exact pages from a PDF and download a new document containing only those pages.',
      keywords: ['extract pdf pages', 'select pdf pages', 'pdf page extractor'],
      faq: [{ question: 'Can I extract multiple non-consecutive pages?', answer: 'Yes, pick any combination of pages to create a custom PDF.' }]
    }
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    category: 'organize',
    description: 'Sort, reorder, delete, and rotate pages with an interactive visual grid.',
    iconName: 'LayoutGrid',
    route: '/tools/organize-pdf',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Save Organized PDF',
    seo: {
      title: 'Organize PDF Pages Online — Doclly',
      description: 'Drag and drop to rearrange PDF pages, rotate upside-down pages, and delete unwanted pages.',
      keywords: ['organize pdf', 'reorder pdf pages', 'sort pdf pages'],
      faq: [{ question: 'How do I reorder pages?', answer: 'Drag and drop page thumbnail cards to reposition them.' }]
    }
  },

  // --- 2. CONVERT FROM PDF ---
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'convert',
    description: 'Convert PDF documents into editable Microsoft Word (.docx) documents.',
    iconName: 'FileText',
    route: '/tools/pdf-to-word',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 5,
    outputFormat: 'DOCX',
    actionButtonText: 'Convert to Word',
    seo: {
      title: 'PDF to Word Converter — Convert PDF to DOCX Free — Doclly',
      description: 'Convert PDF files to editable Microsoft Word (.docx) documents with layout and text fidelity.',
      keywords: ['pdf to word', 'convert pdf to docx', 'pdf to doc', 'pdf to word editable'],
      faq: [
        { question: 'Will the converted Word document be fully editable?', answer: 'Yes! Text, paragraphs, and headings are extracted into native Word document format.' }
      ]
    }
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    category: 'convert',
    description: 'Detect financial tables, bank statements, and rows to export clean XLSX spreadsheets.',
    iconName: 'Table',
    route: '/tools/pdf-to-excel',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'XLSX',
    actionButtonText: 'Convert to Excel',
    seo: {
      title: 'PDF to Excel Converter — Extract Tables to XLSX — Doclly',
      description: 'Convert bank statements, invoices, and table data from PDF into Microsoft Excel (.xlsx) spreadsheets.',
      keywords: ['pdf to excel', 'pdf to xlsx', 'convert pdf table to excel', 'extract table from pdf'],
      faq: [
        { question: 'Does it support scanned tables?', answer: 'Yes, our spatial extractor maps text columns and allows you to edit before downloading.' }
      ]
    }
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PowerPoint',
    category: 'convert',
    description: 'Convert PDF presentation slides into editable Microsoft PowerPoint (.pptx) decks.',
    iconName: 'Presentation',
    route: '/tools/pdf-to-ppt',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PPTX',
    actionButtonText: 'Convert to PowerPoint',
    seo: {
      title: 'PDF to PowerPoint Converter — PDF to PPTX — Doclly',
      description: 'Turn your PDF pages into presentation slides in Microsoft PowerPoint format.',
      keywords: ['pdf to ppt', 'pdf to pptx', 'convert pdf to powerpoint'],
      faq: [{ question: 'Can I edit slides after conversion?', answer: 'Yes, each slide corresponds directly to your PDF page.' }]
    }
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'convert',
    description: 'Extract every page from your PDF as a high-resolution JPG or PNG image.',
    iconName: 'Image',
    route: '/tools/pdf-to-jpg',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'JPG / ZIP',
    actionButtonText: 'Convert to Images',
    seo: {
      title: 'PDF to JPG Converter — High Quality Image Export — Doclly',
      description: 'Extract all pages of a PDF to high-resolution JPG images in seconds.',
      keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to picture', 'pdf to png'],
      faq: [{ question: 'What image resolution is generated?', answer: 'Pages are rendered at 2x crisp retina resolution.' }]
    }
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    category: 'convert',
    description: 'Extract all readable plain text from PDF documents into lightweight .txt files.',
    iconName: 'FileCode',
    route: '/tools/pdf-to-text',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 5,
    outputFormat: 'TXT',
    actionButtonText: 'Extract Plain Text',
    seo: {
      title: 'PDF to Text Converter — Extract Text from PDF — Doclly',
      description: 'Extract text streams from PDF files into UTF-8 text files.',
      keywords: ['pdf to text', 'extract text from pdf', 'pdf to txt'],
      faq: [{ question: 'Does this work on all pages?', answer: 'Yes, extracts all text across all document pages.' }]
    }
  },

  // --- 3. CONVERT TO PDF ---
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'to-pdf',
    description: 'Convert DOCX documents and Word files into professional PDF format.',
    iconName: 'FilePlus',
    route: '/tools/word-to-pdf',
    popular: true,
    accepts: ['.docx', '.doc', '.txt'],
    acceptsDescription: 'Word & Text files',
    maxFiles: 5,
    outputFormat: 'PDF',
    actionButtonText: 'Convert to PDF',
    seo: {
      title: 'Word to PDF Converter — Convert DOCX to PDF — Doclly',
      description: 'Convert Microsoft Word (.docx) files to standardized PDF documents with universal formatting.',
      keywords: ['word to pdf', 'docx to pdf', 'convert doc to pdf', 'word converter'],
      faq: [{ question: 'Are fonts preserved?', answer: 'Yes, formatting and typography are standardized into portable PDF format.' }]
    }
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    category: 'to-pdf',
    description: 'Convert spreadsheets (.xlsx, .xls, .csv) into clean printable PDF documents.',
    iconName: 'FileSpreadsheet',
    route: '/tools/excel-to-pdf',
    accepts: ['.xlsx', '.xls', '.csv'],
    acceptsDescription: 'Excel & CSV files',
    maxFiles: 5,
    outputFormat: 'PDF',
    actionButtonText: 'Convert to PDF',
    seo: {
      title: 'Excel to PDF Converter — Convert XLSX to PDF — Doclly',
      description: 'Convert Microsoft Excel spreadsheets into clean, printable landscape PDF tables.',
      keywords: ['excel to pdf', 'xlsx to pdf', 'csv to pdf'],
      faq: [{ question: 'How are broad sheets handled?', answer: 'Spreadsheets are rendered in high-width landscape mode.' }]
    }
  },
  {
    id: 'ppt-to-pdf',
    name: 'PowerPoint to PDF',
    category: 'to-pdf',
    description: 'Convert PPT and PPTX slide decks into presentation-ready PDF handouts.',
    iconName: 'Presentation',
    route: '/tools/ppt-to-pdf',
    accepts: ['.pptx', '.ppt'],
    acceptsDescription: 'PowerPoint files',
    maxFiles: 5,
    outputFormat: 'PDF',
    actionButtonText: 'Convert to PDF',
    seo: {
      title: 'PowerPoint to PDF Converter — PPTX to PDF — Doclly',
      description: 'Convert PowerPoint slide presentations into shareable PDF documents.',
      keywords: ['ppt to pdf', 'pptx to pdf', 'powerpoint converter'],
      faq: [{ question: 'Does each slide become a page?', answer: 'Yes, each slide matches one page in the PDF.' }]
    }
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'to-pdf',
    description: 'Combine multiple JPG, PNG, and WebP images into a single PDF document.',
    iconName: 'Images',
    route: '/tools/jpg-to-pdf',
    popular: true,
    accepts: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptsDescription: 'Image files',
    maxFiles: 20,
    outputFormat: 'PDF',
    actionButtonText: 'Convert Images to PDF',
    seo: {
      title: 'JPG to PDF Converter — Convert Images to PDF — Doclly',
      description: 'Convert and combine JPG, PNG, and WebP pictures into a unified multi-page PDF document.',
      keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'photos to pdf'],
      faq: [{ question: 'Can I reorder images before converting?', answer: 'Yes, drag and drop images to set their order in the PDF.' }]
    }
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    category: 'to-pdf',
    description: 'Convert HTML code snippets, web pages, or markdown to PDF format.',
    iconName: 'Code',
    route: '/tools/html-to-pdf',
    accepts: ['.html', '.htm', '.txt'],
    acceptsDescription: 'HTML & Web files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Convert HTML to PDF',
    seo: {
      title: 'HTML to PDF Converter Online — Doclly',
      description: 'Convert web code and HTML files into standard PDF documents.',
      keywords: ['html to pdf', 'webpage to pdf', 'code to pdf'],
      faq: [{ question: 'Are styles rendered?', answer: 'Yes, clean standard typography and tags are converted to PDF format.' }]
    }
  },

  // --- 4. OPTIMIZE & EDIT ---
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'optimize',
    description: 'Reduce PDF file size while maintaining crystal-clear text and image quality.',
    iconName: 'Minimize2',
    route: '/tools/compress-pdf',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 5,
    outputFormat: 'PDF',
    actionButtonText: 'Compress PDF',
    seo: {
      title: 'Compress PDF Online — Reduce File Size — Doclly',
      description: 'Compress PDF documents with Balanced, Low, or High compression with instant size comparison.',
      keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf optimizer'],
      faq: [
        { question: 'How much can Doclly compress my PDF?', answer: 'Depending on embedded images, size is typically reduced by 40% to 85%.' }
      ]
    }
  },
  {
    id: 'flatten-pdf',
    name: 'Flatten PDF',
    category: 'optimize',
    description: 'Flatten interactive form fields, annotations, and layers into permanent page content.',
    iconName: 'Layers',
    route: '/tools/flatten-pdf',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 5,
    outputFormat: 'PDF',
    actionButtonText: 'Flatten PDF',
    seo: {
      title: 'Flatten PDF Online — Lock Form Fields & Layers — Doclly',
      description: 'Flatten fillable PDF forms and annotations into read-only static PDF pages.',
      keywords: ['flatten pdf', 'lock pdf form', 'make pdf read only'],
      faq: [{ question: 'What does flattening do?', answer: 'It converts fillable form inputs into permanent text so they cannot be edited.' }]
    }
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    category: 'edit-security',
    description: 'Draw, type, or upload your official digital signature and stamp onto any page.',
    iconName: 'PenLine',
    route: '/tools/sign-pdf',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Sign & Download',
    seo: {
      title: 'Sign PDF Online — Free Electronic Signature — Doclly',
      description: 'Sign contracts, NDAs, and agreements. Draw, type, or upload transparent PNG signatures.',
      keywords: ['sign pdf', 'electronic signature pdf', 'fill and sign pdf', 'e-sign'],
      faq: [
        { question: 'Is the electronic signature legally binding?', answer: 'Doclly generates standard electronic signatures suitable for commercial agreements.' }
      ]
    }
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'edit-security',
    description: 'Stamp customized text watermarks like "CONFIDENTIAL" or "DRAFT" across all pages.',
    iconName: 'Stamp',
    route: '/tools/watermark-pdf',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Add Watermark',
    seo: {
      title: 'Add Watermark to PDF Online — Doclly',
      description: 'Stamp custom text or confidential watermarks with custom rotation and opacity.',
      keywords: ['watermark pdf', 'add watermark to pdf', 'stamp pdf'],
      faq: [{ question: 'Can I change opacity?', answer: 'Yes, customize transparency from light ghost watermark to bold stamp.' }]
    }
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    category: 'edit-security',
    description: 'Encrypt your PDF document with a password to prevent unauthorized viewing.',
    iconName: 'Lock',
    route: '/tools/protect-pdf',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Encrypt & Protect',
    seo: {
      title: 'Protect PDF Online — Password Protect PDF — Doclly',
      description: 'Add password encryption to your PDF documents with client-side security.',
      keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf', 'lock pdf with password'],
      faq: [{ question: 'Will I need the password to open it?', answer: 'Yes, readers must enter the password to view the PDF.' }]
    }
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'edit-security',
    description: 'Remove password protection and printing restrictions from your PDF.',
    iconName: 'Unlock',
    route: '/tools/unlock-pdf',
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Unlock PDF',
    seo: {
      title: 'Unlock PDF Online — Remove PDF Password — Doclly',
      description: 'Remove password security and restrictions from PDF files instantly.',
      keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf'],
      faq: [{ question: 'Can I unlock my password-protected file?', answer: 'Yes, unlock your PDF to freely edit, print, and share.' }]
    }
  },
  {
    id: 'compare-documents',
    name: 'Compare PDF',
    category: 'edit-security',
    description: 'Side-by-side visual and textual comparison to pinpoint added and deleted clauses.',
    iconName: 'GitCompare',
    route: '/tools/compare-documents',
    accepts: ['.pdf', '.docx', '.txt'],
    acceptsDescription: 'PDF & Word files',
    maxFiles: 2,
    outputFormat: 'Visual Diff',
    actionButtonText: 'Compare Documents',
    seo: {
      title: 'Compare PDF Documents Online — Redline Diff — Doclly',
      description: 'Compare two versions of a contract or PDF to find differences, added clauses, and deleted text.',
      keywords: ['compare pdf', 'pdf diff', 'compare documents online', 'contract redline'],
      faq: [{ question: 'How are differences shown?', answer: 'Additions are marked in green, deletions in red, with side-by-side view.' }]
    }
  },

  // --- 5. SPREADSHEETS & DATA ---
  {
    id: 'csv-to-excel',
    name: 'CSV to Excel',
    category: 'office',
    description: 'Convert raw comma or semicolon delimited CSV files into styled Excel (.xlsx) workbooks.',
    iconName: 'Table',
    route: '/tools/csv-to-excel',
    accepts: ['.csv', 'text/csv'],
    acceptsDescription: 'CSV files',
    maxFiles: 1,
    outputFormat: 'XLSX',
    actionButtonText: 'Convert to Excel',
    seo: {
      title: 'Convert CSV to Excel (.xlsx) Online — Doclly',
      description: 'Transform CSV files into native Microsoft Excel spreadsheets with auto-formatted column widths.',
      keywords: ['csv to excel', 'convert csv to xlsx', 'csv to spreadsheet'],
      faq: [{ question: 'Does it handle large CSVs?', answer: 'Yes, processed client-side with full UTF-8 character preservation.' }]
    }
  },
  {
    id: 'excel-to-csv',
    name: 'Excel to CSV',
    category: 'office',
    description: 'Extract clean, UTF-8 encoded comma-separated values (CSV) from Excel workbooks.',
    iconName: 'FileSpreadsheet',
    route: '/tools/excel-to-csv',
    accepts: ['.xlsx', '.xls'],
    acceptsDescription: 'Excel workbooks',
    maxFiles: 1,
    outputFormat: 'CSV',
    actionButtonText: 'Export CSV',
    seo: {
      title: 'Convert Excel (.xlsx) to CSV Online — Doclly',
      description: 'Export clean CSV files from Excel sheets without software lock-in.',
      keywords: ['excel to csv', 'xlsx to csv', 'convert spreadsheet to csv'],
      faq: [{ question: 'Is UTF-8 encoding supported?', answer: 'Yes, international characters and accents are preserved.' }]
    }
  },
  {
    id: 'excel-cleanup',
    name: 'Excel Data Cleanup',
    category: 'office',
    description: 'Remove duplicate rows, trim trailing whitespace, and normalize tabular data in one click.',
    iconName: 'CheckCheck',
    route: '/tools/excel-cleanup',
    accepts: ['.xlsx', '.csv'],
    acceptsDescription: 'Excel & CSV files',
    maxFiles: 1,
    outputFormat: 'Cleaned XLSX / CSV',
    actionButtonText: 'Clean Data',
    seo: {
      title: 'Clean Excel & CSV Data Online — Doclly',
      description: 'Deduplicate rows, sanitize whitespace, and normalize tabular data in one click.',
      keywords: ['excel cleanup', 'csv deduplication', 'clean spreadsheet online'],
      faq: [{ question: 'Are blank rows removed?', answer: 'Yes, you can customize cleanup rules before downloading.' }]
    }
  },
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceINR: '₹0',
    period: 'forever',
    description: 'Essential document utilities for everyday tasks and quick conversions.',
    cta: 'Start Free',
    isPrimary: false,
    features: [
      'Access to all 25+ PDF converter & editing tools',
      'Merge, split, rotate, and organize PDFs',
      'Convert PDF to Word, Excel, PPT, and JPG',
      'Convert Word, Excel, and JPG to PDF',
      'Max 25 MB file size limit',
      'Unlimited client-side conversions',
      '100% private zero-retention guarantee',
    ],
    limitations: [
      'Single-file queue processing',
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    priceINR: '₹499',
    period: '/month',
    annualPriceINR: '₹399',
    description: 'High-speed batch processing for freelancers, students, and professionals.',
    cta: 'Start Pro Free Trial',
    isPrimary: true,
    badge: 'Most Popular',
    features: [
      'Unlimited operations on all 25+ tools',
      'Large files up to 500 MB',
      'Batch conversion of up to 50 files simultaneously',
      'Highest DPI optical rendering & raster compression',
      'Document Comparison & Redline Diff',
      'Priority high-speed processing engine',
      'No advertisements, commercial use license',
    ],
    limitations: []
  },
  {
    id: 'business',
    name: 'Business',
    priceINR: '₹1,999',
    period: '/month',
    annualPriceINR: '₹1,599',
    description: 'Enterprise document conversion & compliance tools for teams.',
    cta: 'Contact Sales',
    isPrimary: false,
    features: [
      'Everything in Pro for up to 10 team members',
      'Unlimited batch processing up to 2 GB per file',
      'High-volume conversion API for developers',
      'Shared team conversion folders',
      'Audit log tracking and compliance exports',
      'Custom domain & company branding',
      'Dedicated 24/7 priority enterprise support',
    ],
    limitations: []
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How is Doclly different from other PDF converter websites?',
    answer: 'Doclly is built on modern WebAssembly and Web APIs. Your PDF conversions, merges, compressions, and edits execute 100% locally in your browser memory. Your files are never uploaded to remote servers, giving you instant speed and absolute privacy.'
  },
  {
    question: 'Are my uploaded documents kept private and secure?',
    answer: 'Yes. We adhere to a strict zero-retention philosophy. Your files never leave your device and are cleared from browser memory as soon as you download or reset.'
  },
  {
    question: 'Can I convert scanned PDFs to Word or Excel?',
    answer: 'Yes! Our spatial layout engine detects lines and tabular structures inside PDFs and exports them to clean Word (.docx) and Excel (.xlsx) files.'
  },
  {
    question: 'What file formats can I convert to and from PDF?',
    answer: 'Doclly supports PDF, Microsoft Word (.docx, .doc), Microsoft Excel (.xlsx, .xls), CSV, PowerPoint (.pptx, .ppt), JPG, PNG, WebP, HTML, and plain text files.'
  },
  {
    question: 'Is there a limit on file size?',
    answer: 'Free users can process files up to 25 MB. Pro users enjoy large file limits up to 500 MB with simultaneous batch conversions.'
  }
];
export const WORKFLOW_PRESETS: any[] = [];


