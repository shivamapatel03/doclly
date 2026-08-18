import { DocItem, FolderItem, UserStats } from '../types/document';
import { generateId } from './utils';

const STORAGE_DOCS_KEY = 'doclly_workspace_documents';
const STORAGE_FOLDERS_KEY = 'doclly_workspace_folders';
const STORAGE_STATS_KEY = 'doclly_user_stats';

const DEFAULT_FOLDERS: FolderItem[] = [
  { id: 'all', name: 'All Documents', itemCount: 0, createdAt: new Date().toISOString().split('T')[0] },
  { id: 'invoices', name: 'Invoices & Receipts', color: '#4F46E5', itemCount: 0, createdAt: new Date().toISOString().split('T')[0] },
  { id: 'contracts', name: 'Contracts & Legal', color: '#059669', itemCount: 0, createdAt: new Date().toISOString().split('T')[0] },
];

export class DocumentStorage {
  /**
   * Get real stored documents
   */
  static getDocuments(): DocItem[] {
    try {
      const data = localStorage.getItem(STORAGE_DOCS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save a newly processed or uploaded document
   */
  static saveDocument(doc: Partial<DocItem> & { name: string; size: number; type: string }): DocItem {
    const docs = this.getDocuments();
    const newDoc: DocItem = {
      id: doc.id || `doc-${generateId()}`,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      lastModified: Date.now(),
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      folderId: doc.folderId || 'all',
      tags: doc.tags || ['Processed'],
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

  /**
   * Calculate live real stats based on real documents and plan tier
   */
  static getUserStats(planTier: 'free' | 'pro' | 'business' = 'free'): UserStats {
    const docs = this.getDocuments().filter((d) => !d.isTrash);
    const storageUsed = docs.reduce((acc, d) => acc + (d.size || 0), 0);

    const totalStorageBytes =
      planTier === 'business'
        ? 100 * 1024 * 1024 * 1024 // 100 GB
        : planTier === 'pro'
        ? 25 * 1024 * 1024 * 1024 // 25 GB
        : 1024 * 1024 * 1024; // 1 GB Free

    let savedStats: any = {};
    try {
      const raw = localStorage.getItem(STORAGE_STATS_KEY);
      if (raw) savedStats = JSON.parse(raw);
    } catch {}

    const processedCount = docs.length;

    return {
      documentsProcessed: processedCount,
      storageUsedBytes: storageUsed,
      totalStorageBytes,
      aiQueriesUsed: savedStats.aiQueriesUsed || 0,
      aiQueriesLimit: planTier === 'business' ? 5000 : planTier === 'pro' ? 1000 : 50,
      timeSavedMinutes: processedCount * 3,
      recentTools: savedStats.recentTools || ['compress-pdf', 'pdf-to-word', 'organize-pdf'],
    };
  }

  static incrementStats(field: keyof UserStats, amount: number) {
    let stats: any = {};
    try {
      const raw = localStorage.getItem(STORAGE_STATS_KEY);
      if (raw) stats = JSON.parse(raw);
    } catch {}

    stats[field] = (stats[field] || 0) + amount;
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
  }
}
