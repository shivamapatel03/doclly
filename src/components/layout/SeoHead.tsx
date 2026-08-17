import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update document title
    document.title = title ? `${title}` : 'Doclly — Everything you need to work with documents';

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update meta keywords
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }
  }, [title, description, keywords]);

  return null;
};
