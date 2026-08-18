export interface DocItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  uploadedAt: string;
  url?: string;
  storagePath?: string;
  hasBinary?: boolean;
  folderId?: string;
  tags?: string[];
  isFavorite?: boolean;
  isTrash?: boolean;
  pageCount?: number;
  thumbnailUrl?: string;
  extractedText?: string;
}

export interface SaveDocOptions extends Partial<DocItem> {
  name: string;
  size: number;
  type: string;
  data?: Blob | Uint8Array | ArrayBuffer | string;
}

export interface FolderItem {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  itemCount: number;
}

export interface WorkflowPreset {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'business' | 'student' | 'finance' | 'legal';
  estimatedSeconds: number;
  steps: {
    id: string;
    name: string;
    toolId: string;
    description: string;
  }[];
}

export interface UserStats {
  documentsProcessed: number;
  storageUsedBytes: number;
  totalStorageBytes: number;
  aiQueriesUsed: number;
  aiQueriesLimit: number;
  timeSavedMinutes: number;
  recentTools: string[];
}
