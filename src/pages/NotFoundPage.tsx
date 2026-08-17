import React from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/layout/SeoHead';
import { Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <SeoHead title="Page Not Found — Doclly" description="The requested document tool or page could not be found." />

      <div className="w-16 h-16 rounded-2xl bg-[#FFC800] text-[#111111] flex items-center justify-center font-extrabold text-2xl border border-[#E5E5E5] shadow-2xs">
        404
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
        Page Not Found
      </h1>

      <p className="text-xs sm:text-sm text-[#6B7280] max-w-sm">
        The document tool, article, or page you were looking for doesn&rsquo;t exist or has moved.
      </p>

      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
