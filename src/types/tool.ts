export type ToolCategory = 'convert' | 'to-pdf' | 'organize' | 'optimize' | 'edit' | 'sign' | 'edit-security' | 'ai' | 'office';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  iconName: string; // Lucide icon name
  route: string;
  badge?: string;
  popular?: boolean;
  accepts: string[]; // e.g. ['.pdf'], ['.docx', '.doc'], ['.xlsx', '.csv'], ['image/*']
  acceptsDescription: string;
  maxFiles?: number;
  outputFormat: string;
  actionButtonText: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    faq: { question: string; answer: string }[];
  };
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
}
