import { DocItem, FolderItem, UserStats } from '../types/document';
import { generateId } from './utils';

const STORAGE_DOCS_KEY = 'doclly_workspace_documents';
const STORAGE_FOLDERS_KEY = 'doclly_workspace_folders';
const STORAGE_STATS_KEY = 'doclly_user_stats';

const DEFAULT_FOLDERS: FolderItem[] = [
  { id: 'all', name: 'All Documents', itemCount: 3, createdAt: '2026-08-01' },
  { id: 'invoices', name: 'Invoices & Receipts', color: '#4F46E5', itemCount: 2, createdAt: '2026-08-05' },
  { id: 'contracts', name: 'Contracts & Legal', color: '#059669', itemCount: 1, createdAt: '2026-08-10' },
  { id: 'study', name: 'Study Notes', color: '#D97706', itemCount: 0, createdAt: '2026-08-12' },
];

const DEFAULT_DOCUMENTS: DocItem[] = [
  {
    id: 'doc-1',
    name: 'Sample_Master_Services_Agreement_2026.pdf',
    size: 245000,
    type: 'application/pdf',
    lastModified: Date.now() - 86400000 * 2,
    uploadedAt: '2 days ago',
    folderId: 'contracts',
    tags: ['Legal', 'Contract', 'Active'],
    isFavorite: true,
    pageCount: 4,
    extractedText: 'Master Services Agreement entered into by Doclly Cloud Services and Acme Corp...',
  },
  {
    id: 'doc-2',
    name: 'Acme_Invoice_INV-0849.pdf',
    size: 112000,
    type: 'application/pdf',
    lastModified: Date.now() - 86400000 * 4,
    uploadedAt: '4 days ago',
    folderId: 'invoices',
    tags: ['Finance', 'Invoice', 'Paid'],
    isFavorite: true,
    pageCount: 1,
    extractedText: 'Invoice INV-2026-0849 Total: ₹50,150 Vendor: Doclly Cloud Services...',
  },
  {
    id: 'doc-3',
    name: 'Q3_Financial_Projections_Data.xlsx',
    size: 89000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    lastModified: Date.now() - 86400000 * 6,
    uploadedAt: '6 days ago',
    folderId: 'invoices',
    tags: ['Excel', 'Spreadsheet'],
    isFavorite: false,
    pageCount: 3,
  },
];

const DEFAULT_STATS: UserStats = {
  documentsProcessed: 42,
  storageUsedBytes: 34 * 1024 * 1024, // 34 MB
  totalStorageBytes: 1024 * 1024 * 1024 * 5, // 5 GB
  aiQueriesUsed: 89,
  aiQueriesLimit: 500,
  timeSavedMinutes: 180,
  recentTools: ['merge-pdf', 'compress-pdf', 'ai-extract', 'sign-pdf'],
};

export class DocumentStorage {
  static getDocuments(): DocItem[] {
    try {
      const data = localStorage.getItem(STORAGE_DOCS_KEY);
      return data ? JSON.parse(data) : DEFAULT_DOCUMENTS;
    } catch {
      return DEFAULT_DOCUMENTS;
    }
  }

  static saveDocument(doc: Partial<DocItem> & { name: string; size: number; type: string }): DocItem {
    const docs = this.getDocuments();
    const newDoc: DocItem = {
      id: doc.id || `doc-${generateId()}`,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      lastModified: Date.now(),
      uploadedAt: 'Just now',
      folderId: doc.folderId || 'all',
      tags: doc.tags || ['Recent'],
      isFavorite: !!doc.isFavorite,
      isTrash: false,
      pageCount: doc.pageCount || 1,
      extractedText: doc.extractedText,
    };

    const updated = [newDoc, ...docs.filter((d) => d.id !== newDoc.id)];
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
    this.incrementStats('documentsProcessed', 1);
    return newDoc;
  }

  static toggleFavorite(docId: string): DocItem[] {
    const docs = this.getDocuments().map((d) =>
      d.id === docId ? { ...d, isFavorite: !d.isFavorite } : d
    );
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
    return docs;
  }

  static moveToTrash(docId: string): DocItem[] {
    const docs = this.getDocuments().map((d) =>
      d.id === docId ? { ...d, isTrash: true } : d
    );
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
    return docs;
  }

  static restoreFromTrash(docId: string): DocItem[] {
    const docs = this.getDocuments().map((d) =>
      d.id === docId ? { ...d, isTrash: false } : d
    );
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
    return docs;
  }

  static deletePermanently(docId: string): DocItem[] {
    const docs = this.getDocuments().filter((d) => d.id !== docId);
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
    return docs;
  }

  static getFolders(): FolderItem[] {
    try {
      const data = localStorage.getItem(STORAGE_FOLDERS_KEY);
      return data ? JSON.parse(data) : DEFAULT_FOLDERS;
    } catch {
      return DEFAULT_FOLDERS;
    }
  }

  static createFolder(name: string, color = '#4F46E5'): FolderItem[] {
    const folders = this.getFolders();
    const newFolder: FolderItem = {
      id: generateId(),
      name,
      color,
      createdAt: new Date().toISOString().split('T')[0],
      itemCount: 0,
    };
    const updated = [...folders, newFolder];
    localStorage.setItem(STORAGE_FOLDERS_KEY, JSON.stringify(updated));
    return updated;
  }

  static getUserStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_STATS_KEY);
      return data ? JSON.parse(data) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  }

  static incrementStats(field: keyof UserStats, amount: number) {
    const stats = this.getUserStats();
    if (typeof stats[field] === 'number') {
      (stats[field] as number) += amount;
      localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    }
  }
}
