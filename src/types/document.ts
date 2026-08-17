export interface DocItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  uploadedAt: string;
  url?: string;
  folderId?: string;
  tags?: string[];
  isFavorite?: boolean;
  isTrash?: boolean;
  pageCount?: number;
  thumbnailUrl?: string;
  extractedText?: string;
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
