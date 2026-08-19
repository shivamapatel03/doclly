import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { FileText, ShieldCheck, CreditCard, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Terms of Service & User Agreement — Doclly"
        description="Review the terms and conditions for using Doclly online document utility tools, PDF editor, Pro subscriptions, and privacy guarantees."
      />

      <Breadcrumb items={[{ label: 'Terms of Service' }]} />

      {/* Header */}
      <div className="space-y-3 border-b border-[#E5E5E5] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#111111] bg-[#FFC800]/20 border border-[#FFC800]/40">
          <FileText className="w-3.5 h-3.5 text-[#111111]" />
          <span>Official User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Terms of Service
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#6B7280]">
          <span>Effective Date: August 18, 2026</span>
          <span>•</span>
          <span>Website: <span className="font-semibold text-[#111111]">https://www.doclly.online</span></span>
          <span>•</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active & Enforceable
          </span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#FFC800]/20 border border-[#FFC800]/40 text-[#111111] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#111111]">100% Document Ownership</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            You retain full intellectual property rights to all uploaded and generated files. We claim zero ownership.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#111111]">Transparent Billing</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Simple ₹99/mo Pro pricing. No hidden fees, instant Razorpay GST invoices, and 1-click cancellation anytime.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#111111]">Privacy-First Operations</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Core conversion and manipulation utilities run client-side in memory with zero permanent server retention.
          </p>
        </div>
      </div>

      {/* Main Terms Content */}
      <div className="prose prose-gray max-w-none text-xs sm:text-sm text-[#4B5563] leading-relaxed space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Doclly (accessible via <strong>https://www.doclly.online</strong>, <strong>https://doclly.app</strong>, and associated services), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and our Privacy Policy. If you do not agree to these Terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            2. Description of Services
          </h2>
          <p>
            Doclly provides web-based digital document utilities, including but not limited to PDF conversion, compression, splitting, merging, watermarking, electronic signing, in-place scanned text OCR editing, invoice barcode & UPI QR stamping, and AI document assistance.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Free Starter Tier:</strong> Client-side document processing with standard daily task quotas and zero account creation required for basic utilities.</li>
            <li><strong>Doclly Pro Tier (₹99/month):</strong> Enhanced limits including 100+ batch file queue, 90% extreme compression (&lt;200KB), scanned text OCR editing, UPI QR auto-stamping, and official tax invoice receipts.</li>
            <li><strong>Business Team Tier (₹999/month):</strong> Multi-seat team workspaces, developer API keys, and priority support.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            3. User Accounts & Security
          </h2>
          <p>
            When creating an account via email or Google OAuth authentication, you agree to provide accurate and complete information. You are responsible for safeguarding your login credentials and for all activities that occur under your account. You must notify Doclly immediately of any unauthorized use or security breach.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            4. Subscriptions, Payments & Strict No-Refund Policy
          </h2>
          <p>
            Subscription fees are billed in Indian Rupees (INR) or localized currencies via authorized payment gateways (including Razorpay).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Billing Cycle:</strong> Subscriptions renew automatically on a monthly or annual basis unless cancelled prior to the renewal date.</li>
            <li><strong>Tax & GST Compliance:</strong> Invoices include statutory GST and applicable taxes. Downloadable PDF invoices are automatically generated and delivered to your registered email upon checkout.</li>
            <li><strong>Cancellation:</strong> You may cancel your recurring subscription at any time directly from the Account Dashboard. Your Pro access will remain active until the end of your current paid billing period without future renewal charges.</li>
            <li>
              <strong>Non-Refundable Payments (Strict No-Refund Policy):</strong> All payments made for Doclly Pro or Business subscriptions are <strong>strictly non-refundable</strong>. Once a transaction is successfully completed, the paid amount cannot be refunded, returned, or credited under any circumstances. This policy applies because full access to digital Pro utilities, instant OCR computing capacity, extreme compression engines, and batch conversion features is provisioned immediately upon purchase.
            </li>
          </ul>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium leading-relaxed">
            <strong>Important Notice:</strong> By proceeding with checkout or entering your payment details, you expressly acknowledge and agree that all fees paid are final and non-refundable.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            5. Document Ownership & Intellectual Property
          </h2>
          <p>
            <strong>Your Content Remains Yours:</strong> You retain complete and exclusive ownership of all documents, text, images, and data uploaded to or generated by Doclly. Doclly does not claim any intellectual property rights over your files.
          </p>
          <p>
            We will never sell, rent, or use your uploaded documents to train public machine learning or foundation models.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            6. Acceptable Use Policy
          </h2>
          <p>
            You agree not to use Doclly for any unlawful, harmful, or fraudulent purpose. You strictly agree not to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Upload viruses, malware, or malicious code designed to compromise system integrity.</span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Forge electronic signatures or alter government identity records unlawfully.</span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Attempt to reverse-engineer or systematically scrape document tools without API authorization.</span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Circumvent rate limits or tamper with subscription quota counters.</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            7. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p>
            Doclly services are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. While we utilize modern web technologies to preserve document formatting fidelity, Doclly does not guarantee 100% typographic accuracy for complex legacy document schemas. To the maximum extent permitted by law, Doclly shall not be liable for indirect, incidental, or consequential damages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            8. Modifications to Terms
          </h2>
          <p>
            Doclly reserves the right to modify these Terms at any time. When material changes are made, we will update the &ldquo;Last updated&rdquo; timestamp at the top of this page and provide notice through our platform. Continued use of our services constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            9. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] border-b border-gray-100 pb-1">
            10. Contact Information
          </h2>
          <p>
            If you have any questions, compliance inquiries, or legal notices concerning these Terms of Service, please contact us:
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5 text-xs text-[#111111]">
            <p><strong>Entity:</strong> Doclly Document Technologies</p>
            <p><strong>Website:</strong> <a href="https://www.doclly.online" className="text-blue-600 hover:underline font-semibold">https://www.doclly.online</a></p>
            <p><strong>Support & Legal Email:</strong> <span className="font-semibold text-[#111111]">support@doclly.online</span> / <span className="font-semibold text-[#111111]">legal@doclly.online</span></p>
          </div>
        </section>
      </div>

      {/* Bottom CTA Card */}
      <div className="p-6 bg-[#0F172A] rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Have questions about our privacy or tools?</h3>
          <p className="text-xs text-gray-400">Explore our zero-retention security policy and enterprise features.</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/privacy"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-full text-xs font-bold border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)] transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            Privacy Policy
          </Link>
          <Link
            to="/pricing"
            className="px-4 py-2 bg-[#FFC800] hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] rounded-full text-xs font-bold border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.15)] transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            View Pricing
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
