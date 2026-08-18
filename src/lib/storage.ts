import { DocItem, FolderItem, UserStats, SaveDocOptions } from '../types/document';
import { generateId } from './utils';
import { supabase, isSupabaseConfigured } from './supabase';
import { FileStore } from './fileStore';

const DEFAULT_FOLDERS: FolderItem[] = [
  { id: 'all', name: 'All Documents', itemCount: 0, createdAt: new Date().toISOString().split('T')[0] },
  { id: 'invoices', name: 'Invoices & Receipts', color: '#4F46E5', itemCount: 0, createdAt: new Date().toISOString().split('T')[0] },
  { id: 'contracts', name: 'Contracts & Legal', color: '#059669', itemCount: 0, createdAt: new Date().toISOString().split('T')[0] },
];

export class DocumentStorage {
  /**
   * Helper to retrieve currently logged-in user ID
   */
  public static getActiveUserId(): string {
    try {
      const saved = localStorage.getItem('doclly_active_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u?.id) return u.id;
      }
    } catch {}
    return 'guest';
  }

  private static getDocsKey(userId?: string): string {
    const uid = userId || this.getActiveUserId();
    return `doclly_docs_${uid}`;
  }

  private static getFoldersKey(userId?: string): string {
    const uid = userId || this.getActiveUserId();
    return `doclly_folders_${uid}`;
  }

  private static getStatsKey(userId?: string): string {
    const uid = userId || this.getActiveUserId();
    return `doclly_stats_${uid}`;
  }

  /**
   * Get documents scoped to specific user
   */
  static getDocuments(userId?: string): DocItem[] {
    try {
      const uid = userId || this.getActiveUserId();
      const key = this.getDocsKey(uid);
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);

      // Fallback migration for existing demo data when user is active
      const legacy = localStorage.getItem('doclly_workspace_documents');
      if (legacy && uid !== 'guest') {
        try {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(key, JSON.stringify(parsed));
          return parsed;
        } catch {}
      } else if (legacy && uid === 'guest') {
        return JSON.parse(legacy);
      }

      return [];
    } catch {
      return [];
    }
  }

  /**
   * Save a newly processed or uploaded document for a user with binary persistence
   */
  static saveDocument(doc: SaveDocOptions, userId?: string): DocItem {
    const uid = userId || this.getActiveUserId();
    const docs = this.getDocuments(uid);
    const newDocId = doc.id || `doc-${generateId()}`;
    const hasBinaryData = Boolean(doc.data);

    const newDoc: DocItem = {
      id: newDocId,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      lastModified: Date.now(),
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      folderId: doc.folderId || 'all',
      tags: doc.tags || ['Processed'],
      isFavorite: !!doc.isFavorite,
      isTrash: false,
      pageCount: doc.pageCount || 1,
      hasBinary: hasBinaryData,
      storagePath: doc.storagePath || `${uid}/${newDocId}_${doc.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
      extractedText: doc.extractedText,
    };

    // Save binary data to IndexedDB & Supabase Storage if present
    if (doc.data) {
      FileStore.saveBinary(newDoc.id, newDoc.name, doc.data, newDoc.type, uid);
    }

    const updated = [newDoc, ...docs.filter((d) => d.id !== newDoc.id)];
    localStorage.setItem(this.getDocsKey(uid), JSON.stringify(updated));
    this.incrementStats('documentsProcessed', 1, uid);

    // Sync metadata to Supabase documents table if live and logged in
    if (isSupabaseConfigured() && uid !== 'guest' && supabase) {
      supabase
        .from('documents')
        .upsert({
          id: newDoc.id,
          user_id: uid,
          name: newDoc.name,
          file_size: newDoc.size,
          mime_type: newDoc.type,
          folder_id: newDoc.folderId !== 'all' ? newDoc.folderId : null,
          is_favorite: newDoc.isFavorite,
          is_trash: newDoc.isTrash,
          page_count: newDoc.pageCount,
          storage_path: newDoc.storagePath,
          created_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase document sync note:', error.message);
        });
    }

    return newDoc;
  }

  /**
   * Safely download any document, retrieving genuine binary or producing compliant fallback
   */
  static async downloadDocument(doc: DocItem, userId?: string): Promise<void> {
    const uid = userId || this.getActiveUserId();
    await FileStore.downloadDocument(doc, uid);
  }

  /**
   * Retrieve document binary Blob
   */
  static async getDocumentBlob(docId: string, userId?: string): Promise<Blob | null> {
    const uid = userId || this.getActiveUserId();
    return await FileStore.getBinary(docId, uid);
  }

  static toggleFavorite(docId: string, userId?: string): DocItem[] {
    const uid = userId || this.getActiveUserId();
    const docs = this.getDocuments(uid).map((d) =>
      d.id === docId ? { ...d, isFavorite: !d.isFavorite } : d
    );
    localStorage.setItem(this.getDocsKey(uid), JSON.stringify(docs));

    if (isSupabaseConfigured() && uid !== 'guest' && supabase) {
      const item = docs.find((d) => d.id === docId);
      if (item) {
        supabase.from('documents').update({ is_favorite: item.isFavorite }).eq('id', docId).then();
      }
    }
    return docs;
  }

  static moveToTrash(docId: string, userId?: string): DocItem[] {
    const uid = userId || this.getActiveUserId();
    const docs = this.getDocuments(uid).map((d) =>
      d.id === docId ? { ...d, isTrash: true } : d
    );
    localStorage.setItem(this.getDocsKey(uid), JSON.stringify(docs));

    if (isSupabaseConfigured() && uid !== 'guest' && supabase) {
      supabase.from('documents').update({ is_trash: true }).eq('id', docId).then();
    }
    return docs;
  }

  static restoreFromTrash(docId: string, userId?: string): DocItem[] {
    const uid = userId || this.getActiveUserId();
    const docs = this.getDocuments(uid).map((d) =>
      d.id === docId ? { ...d, isTrash: false } : d
    );
    localStorage.setItem(this.getDocsKey(uid), JSON.stringify(docs));

    if (isSupabaseConfigured() && uid !== 'guest' && supabase) {
      supabase.from('documents').update({ is_trash: false }).eq('id', docId).then();
    }
    return docs;
  }

  static deletePermanently(docId: string, userId?: string): DocItem[] {
    const uid = userId || this.getActiveUserId();
    const docs = this.getDocuments(uid).filter((d) => d.id !== docId);
    localStorage.setItem(this.getDocsKey(uid), JSON.stringify(docs));

    // Delete from IndexedDB and Supabase
    FileStore.deleteBinary(docId, uid);

    if (isSupabaseConfigured() && uid !== 'guest' && supabase) {
      supabase.from('documents').delete().eq('id', docId).eq('user_id', uid).then();
    }
    return docs;
  }

  static getFolders(userId?: string): FolderItem[] {
    const uid = userId || this.getActiveUserId();
    try {
      const data = localStorage.getItem(this.getFoldersKey(uid));
      return data ? JSON.parse(data) : DEFAULT_FOLDERS;
    } catch {
      return DEFAULT_FOLDERS;
    }
  }

  static createFolder(name: string, color = '#4F46E5', userId?: string): FolderItem[] {
    const uid = userId || this.getActiveUserId();
    const folders = this.getFolders(uid);
    const newFolder: FolderItem = {
      id: generateId(),
      name,
      color,
      createdAt: new Date().toISOString().split('T')[0],
      itemCount: 0,
    };
    const updated = [...folders, newFolder];
    localStorage.setItem(this.getFoldersKey(uid), JSON.stringify(updated));

    if (isSupabaseConfigured() && uid !== 'guest' && supabase) {
      supabase
        .from('folders')
        .insert({
          id: newFolder.id,
          user_id: uid,
          name: newFolder.name,
          color: newFolder.color,
        })
        .then();
    }

    return updated;
  }

  /**
   * Calculate real live stats based on real documents and plan tier for a user
   */
  static getUserStats(planTier: 'free' | 'pro' | 'business' = 'free', userId?: string): UserStats {
    const uid = userId || this.getActiveUserId();
    const docs = this.getDocuments(uid).filter((d) => !d.isTrash);
    const storageUsed = docs.reduce((acc, d) => acc + (d.size || 0), 0);

    const totalStorageBytes =
      planTier === 'business'
        ? 100 * 1024 * 1024 * 1024 // 100 GB
        : planTier === 'pro'
        ? 25 * 1024 * 1024 * 1024 // 25 GB
        : 1024 * 1024 * 1024; // 1 GB Free

    let savedStats: any = {};
    try {
      const raw = localStorage.getItem(this.getStatsKey(uid));
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

  static incrementStats(field: keyof UserStats, amount: number, userId?: string) {
    const uid = userId || this.getActiveUserId();
    let stats: any = {};
    try {
      const raw = localStorage.getItem(this.getStatsKey(uid));
      if (raw) stats = JSON.parse(raw);
    } catch {}

    stats[field] = (stats[field] || 0) + amount;
    localStorage.setItem(this.getStatsKey(uid), JSON.stringify(stats));
  }
}
