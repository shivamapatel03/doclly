import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { CommandMenu } from './components/common/CommandMenu';
import { AuthModal } from './pages/AuthModal';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

// Pages
import { HomePage } from './pages/HomePage';
import { DocumentActionsPage } from './pages/DocumentActionsPage';
import { ToolPage } from './pages/ToolPage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { StudentOfferPage } from './pages/StudentOfferPage';

// Scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const AppContent: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const isStudentSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('student.');

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#111111] antialiased">
      <ScrollToTop />

      {/* Product Hunt Launch Announcement Bar */}
      <AnnouncementBar />
      
      {/* Sticky Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={isStudentSubdomain ? <StudentOfferPage /> : <HomePage />} />
          <Route path="/document-actions" element={<DocumentActionsPage />} />
          
          {/* Student 1-Year Pro for ₹19 Offer */}
          <Route path="/student" element={<StudentOfferPage />} />
          <Route path="/student-offer" element={<StudentOfferPage />} />
          <Route path="/students" element={<StudentOfferPage />} />

          {/* Dedicated & Generic Tool Routes */}
          <Route path="/tools/:toolId" element={<ToolPage />} />
          
          {/* Direct Root Tool URLs for Google SEO (like iLovePDF) */}
          <Route path="/pdf-to-word" element={<ToolPage />} />
          <Route path="/pdf_to_word" element={<ToolPage />} />
          <Route path="/pdf-to-word-converter" element={<ToolPage />} />
          <Route path="/compress-pdf" element={<ToolPage />} />
          <Route path="/compress_pdf" element={<ToolPage />} />
          <Route path="/merge-pdf" element={<ToolPage />} />
          <Route path="/merge_pdf" element={<ToolPage />} />
          <Route path="/split-pdf" element={<ToolPage />} />
          <Route path="/split_pdf" element={<ToolPage />} />
          <Route path="/edit-pdf" element={<ToolPage />} />
          <Route path="/edit_pdf" element={<ToolPage />} />
          <Route path="/pdf-to-excel" element={<ToolPage />} />
          <Route path="/pdf_to_excel" element={<ToolPage />} />
          <Route path="/pdf-to-jpg" element={<ToolPage />} />
          <Route path="/pdf_to_jpg" element={<ToolPage />} />
          <Route path="/jpg-to-pdf" element={<ToolPage />} />
          <Route path="/jpg_to_pdf" element={<ToolPage />} />
          <Route path="/word-to-pdf" element={<ToolPage />} />
          <Route path="/word_to_pdf" element={<ToolPage />} />
          <Route path="/sign-pdf" element={<ToolPage />} />
          <Route path="/watermark-pdf" element={<ToolPage />} />
          <Route path="/protect-pdf" element={<ToolPage />} />
          <Route path="/unlock-pdf" element={<ToolPage />} />
          <Route path="/organize-pdf" element={<ToolPage />} />
          <Route path="/remove-pages" element={<ToolPage />} />
          <Route path="/extract-pages" element={<ToolPage />} />
          <Route path="/compare-pdf" element={<ToolPage />} />
          
          {/* Govt & Entrance Exam Photo/Signature Resizer Routes */}
          <Route path="/govt-exam-resizer" element={<ToolPage />} />
          <Route path="/photo-resizer" element={<ToolPage />} />
          <Route path="/signature-resizer" element={<ToolPage />} />
          <Route path="/exam-photo-resizer" element={<ToolPage />} />
          <Route path="/upsc-photo-resizer" element={<ToolPage />} />
          <Route path="/ssc-photo-resizer" element={<ToolPage />} />
          <Route path="/gate-photo-resizer" element={<ToolPage />} />
          <Route path="/passport-photo-maker" element={<ToolPage />} />
          
          {/* Dashboard, Pricing & Legal */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          
          {/* Blog & Guides */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          
          {/* Auth Callback (Google OAuth popup redirect target) */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Command Menu (Ctrl+K) */}
      <CommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />

      {/* PWA Install Banner */}
      <PwaInstallPrompt />

      {/* Vercel Speed Insights & Web Analytics */}
      <SpeedInsights />
      <Analytics />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
