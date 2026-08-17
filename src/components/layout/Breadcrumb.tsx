import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-[#6B7280] mb-6" aria-label="Breadcrumb">
      <Link to="/" className="inline-flex items-center hover:text-[#111111] transition-colors">
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          {item.to ? (
            <Link to={item.to} className="hover:text-[#111111] transition-colors truncate max-w-[180px]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#111111] font-medium truncate max-w-[220px]" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
