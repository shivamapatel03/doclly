import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
}

interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  faq?: FaqItem[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = 'https://www.doclly.online/logo/image.png',
  faq,
}) => {
  const location = useLocation();
  const currentUrl = canonicalUrl || `https://www.doclly.online${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('Doclly') ? title : `${title} — Doclly`;
    document.title = formattedTitle;

    // Helper function to set or create meta tag
    const setMeta = (selector: string, attr: string, value: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Meta Description & Keywords
    setMeta('meta[name="description"]', 'name', 'description', description);
    
    const defaultKeywords = [
      'free pdf tools',
      'img to pdf',
      'pdf to image',
      'compress pdf',
      'pdf to word',
      'pdf to excel',
      'edit pdf online',
      'sign pdf free',
      'secure document tools',
      'doclly online',
    ];
    const combinedKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));
    setMeta('meta[name="keywords"]', 'name', 'keywords', combinedKeywords.join(', '));
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large');

    // 3. Canonical Link Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 4. OpenGraph Tags
    setMeta('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Doclly');
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');

    // 5. Twitter Card Tags
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', currentUrl);

    // 6. Dynamic JSON-LD Structured Data Schema for Search Engines
    const schemaId = 'doclly-dynamic-jsonld';
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData: any = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: formattedTitle,
      url: currentUrl,
      description,
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'All Web Browsers (Windows, Mac, iOS, Android, Linux)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '14250',
        bestRating: '5',
        worstRating: '1',
      },
    };

    // If FAQ items are present, add FAQPage schema
    if (faq && faq.length > 0) {
      schemaData['mainEntity'] = faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      }));
    }

    schemaScript.text = JSON.stringify(schemaData);

    return () => {
      // Cleanup dynamic schema on route change
      const dynamicSchema = document.getElementById(schemaId);
      if (dynamicSchema) {
        dynamicSchema.remove();
      }
    };
  }, [title, description, keywords, currentUrl, ogImage, faq]);

  return null;
};
