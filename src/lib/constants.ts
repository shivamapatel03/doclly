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
      title: 'Merge PDF Files Online Free & Secure — Best PDF Combiner — Doclly',
      description: 'Combine multiple PDF files into one single document in seconds. 100% free, secure client-side zero-retention architecture with drag-and-drop page reordering.',
      keywords: ['merge pdf free', 'combine pdf files online', 'join pdf documents', 'best pdf merger', 'merge pdf without limit', 'merge pdf secure', 'doclly online'],
      faq: [
        { question: 'How do I merge multiple PDF files for free?', answer: 'Upload your PDF files, drag them into your preferred order, and click "Merge PDFs". Your combined file is created instantly.' },
        { question: 'Is my data secure when merging PDFs?', answer: 'Yes! All processing happens directly inside your browser memory with zero file uploads to external servers.' }
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
      title: 'Split PDF Online Free — Extract & Separate PDF Pages — Doclly',
      description: 'Split PDF files by custom page ranges or extract individual pages instantly with our 100% free and private PDF splitter.',
      keywords: ['split pdf free', 'extract pdf pages', 'separate pdf files', 'pdf splitter online', 'cut pdf pages free', 'split pdf secure'],
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
      title: 'Remove Pages from PDF Online Free & Secure — Doclly',
      description: 'Delete unwanted pages from your PDF file. 100% free, fast, and completely client-side in-memory processing.',
      keywords: ['remove pdf pages free', 'delete pages from pdf', 'cut pdf pages', 'trim pdf online'],
      faq: [{ question: 'How do I delete pages from a PDF?', answer: 'Upload your PDF, click on the thumbnails you want to remove, and download the trimmed file.' }]
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
      title: 'Extract Pages from PDF Online Free — Doclly',
      description: 'Select exact pages from a PDF and download a new document containing only those pages with zero quality loss.',
      keywords: ['extract pdf pages free', 'select pdf pages', 'pdf page extractor online', 'save specific pdf pages'],
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
      title: 'Organize PDF Pages Online Free — Reorder & Rotate — Doclly',
      description: 'Drag and drop to rearrange PDF pages, rotate upside-down pages, and delete unwanted pages with zero data retention.',
      keywords: ['organize pdf free', 'reorder pdf pages', 'sort pdf pages', 'rotate pdf pages online'],
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
      title: 'PDF to Word Converter Free & Editable (.docx) — Best PDF to DOCX — Doclly',
      description: 'Convert PDF files to editable Microsoft Word (.docx) documents with layout, fonts, and text fidelity preserved. 100% free and private.',
      keywords: ['pdf to word converter free', 'convert pdf to docx', 'pdf to doc editable online', 'best pdf to word', 'convert pdf to word without losing formatting'],
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
      title: 'PDF to Excel Converter Free (.xlsx) — Extract Tables & Statements — Doclly',
      description: 'Convert bank statements, invoices, and table data from PDF into Microsoft Excel (.xlsx) spreadsheets with spatial layout recognition.',
      keywords: ['pdf to excel converter free', 'pdf to xlsx', 'convert pdf table to excel', 'extract bank statement pdf to excel', 'pdf to spreadsheet'],
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
      title: 'PDF to PowerPoint Converter Free — Convert PDF to PPTX — Doclly',
      description: 'Turn your PDF pages into presentation slides in Microsoft PowerPoint format for free.',
      keywords: ['pdf to ppt free', 'pdf to pptx', 'convert pdf to powerpoint online', 'pdf presentation to ppt'],
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
      title: 'PDF to JPG & Image Converter Free — High Resolution 300 DPI Export — Doclly',
      description: 'Extract and convert PDF pages into high-resolution JPG or PNG images. 100% free, fast, and completely secure.',
      keywords: ['pdf to jpg converter free', 'pdf to image', 'pdf to png', 'convert pdf to jpeg high resolution', 'pdf to picture online', '300 dpi pdf to image'],
      faq: [{ question: 'What image resolution is generated?', answer: 'Pages are rendered at 2x crisp retina resolution (up to 300 DPI).' }]
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
      title: 'PDF to Text Converter Free — Extract Plain Text from PDF — Doclly',
      description: 'Extract text streams and copyable characters from PDF files into UTF-8 text files instantly.',
      keywords: ['pdf to text free', 'extract text from pdf', 'pdf to txt online', 'copy text from pdf'],
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
      title: 'Word to PDF Converter Free — Convert DOCX to PDF Online — Doclly',
      description: 'Convert Microsoft Word (.docx) files to standardized PDF documents with universal formatting and font preservation.',
      keywords: ['word to pdf free', 'docx to pdf online', 'convert doc to pdf', 'best word to pdf converter'],
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
      title: 'Excel to PDF Converter Free — Convert XLSX to PDF Online — Doclly',
      description: 'Convert Microsoft Excel spreadsheets into clean, printable landscape PDF tables for free.',
      keywords: ['excel to pdf free', 'xlsx to pdf online', 'csv to pdf', 'convert spreadsheet to pdf'],
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
      title: 'PowerPoint to PDF Converter Free — PPTX to PDF — Doclly',
      description: 'Convert PowerPoint slide presentations into shareable PDF documents online for free.',
      keywords: ['ppt to pdf free', 'pptx to pdf online', 'powerpoint to pdf converter'],
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
      title: 'JPG to PDF & Image to PDF Converter Free — Convert Photos to PDF — Doclly',
      description: 'Convert and combine JPG, PNG, and WebP images into a single high quality PDF document. 100% free, secure, and private.',
      keywords: ['jpg to pdf free', 'image to pdf', 'img to pdf', 'png to pdf', 'photos to pdf', 'convert pictures to pdf free', 'best image to pdf converter'],
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
      title: 'HTML to PDF Converter Online Free — Doclly',
      description: 'Convert web code and HTML files into standard PDF documents with zero data retention.',
      keywords: ['html to pdf free', 'webpage to pdf', 'code to pdf', 'convert html to pdf online'],
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
      title: 'Compress PDF Online Free & Secure — Reduce PDF Size (Up to 90%) — Doclly',
      description: 'Compress PDF documents with Balanced, Low, or Extreme 90% compression with instant before/after file size comparison. 100% free and private.',
      keywords: ['compress pdf free', 'reduce pdf size online', 'shrink pdf file', 'compress pdf under 200kb', 'best pdf compressor', 'compress pdf secure', 'pdf optimizer online'],
      faq: [
        { question: 'How much can Doclly compress my PDF?', answer: 'Depending on embedded images, size is typically reduced by 40% to 90% while maintaining font sharpness.' }
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
      title: 'Flatten PDF Online Free — Lock Form Fields & Layers — Doclly',
      description: 'Flatten fillable PDF forms, signatures, and annotations into permanent read-only static PDF pages.',
      keywords: ['flatten pdf free', 'lock pdf form', 'make pdf read only', 'flatten fillable pdf online'],
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
      title: 'Sign PDF Online Free — Legally Binding Electronic Signature Maker — Doclly',
      description: 'Sign contracts, NDAs, and agreements for free. Draw, type, or upload transparent PNG signatures with ISO 32000-1 compliance.',
      keywords: ['sign pdf free', 'electronic signature pdf', 'draw signature online', 'fill and sign pdf', 'e-sign pdf free', 'sign contract online'],
      faq: [
        { question: 'Is the electronic signature legally binding?', answer: 'Doclly generates standard electronic signatures suitable for commercial agreements.' }
      ]
    }
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    category: 'edit-security',
    description: 'Add text, images, signatures, shapes, highlights, and redactions to any PDF page in your browser.',
    iconName: 'PenLine',
    route: '/tools/edit-pdf',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF files',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Edit PDF',
    seo: {
      title: 'Free PDF Editor Online — Edit PDF Text, Annotate & Sign Documents — Doclly',
      description: '100% free in-browser PDF editor. Add and edit text, insert images, add signatures, shapes, highlights, and redactions. No upload required, 100% private.',
      keywords: ['edit pdf free', 'free pdf editor online', 'edit pdf text', 'add text to pdf free', 'annotate pdf', 'redact pdf online', 'best free pdf editor'],
      faq: [
        { question: 'Can I edit text in an existing PDF?', answer: 'Yes — select the Text tool, click anywhere on the page, and type. Choose font size and color from the properties panel.' },
        { question: 'How do I remove sensitive text?', answer: 'Use the Redact tool to draw a white rectangle over the text, then download the PDF.' }
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
      title: 'Watermark PDF Online Free — Add Custom Text & Stamps — Doclly',
      description: 'Stamp customized text or confidential watermarks across all PDF pages with custom rotation and opacity.',
      keywords: ['watermark pdf free', 'add watermark to pdf', 'stamp pdf online', 'confidential watermark pdf'],
      faq: [{ question: 'Can I change opacity?', answer: 'Yes, customize transparency from light ghost watermark to bold stamp.' }]
    }
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'edit-security',
    description: 'Generate high-resolution UPI payment QR codes, URL QR codes, and barcodes for download.',
    iconName: 'QrCode',
    route: '/tools/qr-code-generator',
    popular: true,
    accepts: [],
    acceptsDescription: 'Custom Text & URLs',
    maxFiles: 0,
    outputFormat: 'PNG / PDF',
    actionButtonText: 'Generate Code',
    seo: {
      title: 'Free QR Code & Barcode Generator — UPI Payment QR & 600 DPI Download — Doclly',
      description: 'Generate custom UPI payment QR codes, website URLs, and retail barcodes with 600 DPI vector clarity. 100% free and instant.',
      keywords: ['qr code generator free', 'upi qr code generator', 'barcode generator online', 'generate custom qr code', 'free payment qr code', 'high resolution qr code'],
      faq: [
        { question: 'Can I generate a UPI scan-to-pay QR code?', answer: 'Yes! Enter your UPI ID, receiver name, and optional amount to generate an instant payment QR.' }
      ]
    }
  },
  {
    id: 'stamp-qr-barcode',
    name: 'Stamp QR on PDF',
    category: 'edit-security',
    description: 'Stamp UPI payment QR codes, tracking barcodes, and custom codes directly onto invoices & tickets.',
    iconName: 'Stamp',
    route: '/tools/stamp-qr-barcode',
    popular: true,
    accepts: ['.pdf', 'application/pdf'],
    acceptsDescription: 'PDF Invoices, Tickets, Receipts, Contracts',
    maxFiles: 1,
    outputFormat: 'PDF',
    actionButtonText: 'Stamp on PDF',
    seo: {
      title: 'Stamp QR Code & Barcode on PDF Invoices — Doclly',
      description: 'Stamp custom UPI payment QR codes and barcodes directly onto invoices, tickets, and contracts with live placement.',
      keywords: ['stamp qr code pdf', 'add qr to invoice', 'stamp barcode pdf', 'invoice qr code'],
      faq: [
        { question: 'Can I add a scan-to-pay UPI QR code to my invoices?', answer: 'Yes! Simply enter your UPI ID, store name, and invoice amount. Doclly creates an instant payment QR code and stamps it directly on your invoice PDF.' },
        { question: 'Does it support retail barcodes?', answer: 'Yes, it supports standard CODE128, EAN-13, UPC-A, and CODE39 formats.' }
      ]
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
    name: 'Free Starter',
    priceINR: '₹0',
    period: 'forever',
    description: 'Essential document utilities for everyday tasks and quick single-file conversions.',
    cta: 'Start Free',
    isPrimary: false,
    features: [
      'Access to all 25+ PDF converter & editing tools',
      'Merge, split, rotate, and organize PDFs',
      'Convert PDF to Word, Excel, PPT, and Images',
      'Standard PDF compression (up to 60% reduction)',
      '1-Page scanned text detection preview',
      'Max 25 MB file size limit',
      '100% private in-browser processing guarantee',
    ],
    limitations: [
      'Single-file queue (1–3 files at once)',
      'Standard compression ratio only',
    ]
  },
  {
    id: 'pro',
    name: 'Doclly Pro',
    priceINR: '₹99',
    period: '/month',
    annualPriceINR: '₹799',
    annualMonthlyEquivalent: '₹66/mo',
    description: 'Full Adobe Acrobat power at 95% less cost. In-place text editing, UPI QR auto-stamps & 100+ bulk files.',
    cta: 'Get Pro — ₹99',
    isPrimary: true,
    badge: 'Most Popular',
    features: [
      'Unlimited In-Place Scanned PDF Text Editing (OCR)',
      'Batch process up to 100 files simultaneously in 1 click',
      'Multi-Invoice UPI QR & Barcode Auto-Stamping Studio',
      'Extreme 90% Ultra Compression (Under 200 KB for Govt Portals)',
      'Large files up to 500 MB (Full books & bank statements)',
      'Document Comparison & Visual Redline Diff',
      'High-Speed VIP Priority Engine & Zero Ads',
      'Commercial use license & priority email support',
    ],
    limitations: []
  },
  {
    id: 'business',
    name: 'Business Team',
    priceINR: '₹999',
    period: '/month',
    annualPriceINR: '₹7,999',
    annualMonthlyEquivalent: '₹666/mo',
    description: 'Everything in Pro for teams, CA firms, law offices, and high-volume billing companies.',
    cta: 'Get Business',
    isPrimary: false,
    features: [
      'Everything in Pro for up to 10 team seats',
      'Unlimited batch processing up to 2 GB per file',
      'High-volume conversion API keys for developers',
      'Shared team document vault & folders',
      'Audit log tracking and compliance exports',
      'Custom company branding on exports',
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


