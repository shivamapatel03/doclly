export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  structuredData?: Record<string, any>;
  suggestions?: string[];
}

export type ExtractionDocType = 'invoice' | 'receipt' | 'resume' | 'contract' | 'form' | 'custom';

export interface ExtractedInvoice {
  invoiceNumber: string;
  vendorName: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentTerms: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
}

export interface ExtractedResume {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface ExtractedContract {
  title: string;
  parties: string[];
  effectiveDate: string;
  expirationDate: string;
  governingLaw: string;
  keyObligations: string[];
  terminationClauses: string[];
  liabilityLimit: string;
  confidentialityTerms: string;
}

export interface DocumentDiffResult {
  addedWords: number;
  removedWords: number;
  unchangedWords: number;
  similarityScore: number;
  chunks: {
    type: 'added' | 'removed' | 'unchanged';
    value: string;
  }[];
}
