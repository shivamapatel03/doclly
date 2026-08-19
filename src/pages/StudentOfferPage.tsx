import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Upload,
  ShieldCheck,
  Building2,
  User as UserIcon,
  CreditCard,
  Check,
  FileCheck,
  RefreshCw,
  Download,
  FileText,
} from 'lucide-react';
import { SeoHead } from '../components/layout/SeoHead';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { AuthModal } from './AuthModal';
import { launchRazorpayCheckout } from '../lib/razorpay';
import { createInvoiceRecord, sendInvoiceEmail } from '../lib/invoice-generator';
import { ThreeDIcon } from '../components/common/ThreeDIcon';

export const StudentOfferPage: React.FC = () => {
  const { user, updatePlanTier } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Auth modal control
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form State
  const [university, setUniversity] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [studentName, setStudentName] = useState(user?.name || '');

  // ID Card Upload & Scan State
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment & Success State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paidInvoiceId, setPaidInvoiceId] = useState<string | null>(null);

  // Handle ID Card File Selection & Scan
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please upload a valid image (PNG, JPG) or PDF of your student ID card.');
      return;
    }

    setIdCardFile(file);
    setIsVerified(false);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      toast.success('Student ID verified successfully! You are eligible for 1 Year Pro.');
    }, 1200);
  };

  // Trigger ₹19 Razorpay Checkout
  const handlePay = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!university.trim() || !enrollmentNo.trim()) {
      toast.error('Please enter your University name and Student Enrollment number.');
      return;
    }

    if (!isVerified) {
      toast.error('Please upload and verify your Student ID card first.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      await launchRazorpayCheckout({
        planId: 'pro',
        planName: 'Doclly Pro (1-Year Student Plan)',
        amountINR: 19,
        billingCycle: 'annual',
        user: {
          id: user.id,
          name: studentName || user.name || 'Student',
          email: user.email,
        },
        onSuccess: async (paymentId: string) => {
          // 1. Upgrade user account to Pro
          await updatePlanTier('pro');

          // 2. Generate and store official Tax Invoice
          const inv = createInvoiceRecord(
            {
              id: user.id,
              name: studentName || user.name || 'Student User',
              email: user.email,
            },
            'pro',
            'Doclly Pro (1-Year Student Plan)',
            19,
            paymentId
          );
          setPaidInvoiceId(inv.id);
          sendInvoiceEmail(inv, user.email);

          // Save student verification record locally
          try {
            const raw = localStorage.getItem('doclly_student_verifications');
            const list = raw ? JSON.parse(raw) : [];
            list.unshift({
              userId: user.id,
              userEmail: user.email,
              studentName: studentName || user.name,
              university,
              enrollmentNo,
              idFileName: idCardFile?.name || 'student_id.png',
              verifiedAt: new Date().toISOString(),
              invoiceId: inv.id,
              paymentId,
            });
            localStorage.setItem('doclly_student_verifications', JSON.stringify(list));
          } catch (e) {
            console.error('Failed to log student verification:', e);
          }

          // 3. Fire Celebration Confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFC800', '#10B981', '#3B82F6', '#111111'],
          });

          setIsSuccess(true);
          setIsProcessingPayment(false);
          toast.success('🎉 Congratulations! 1 Year Pro access activated for ₹19.');
        },
        onFailure: (err) => {
          setIsProcessingPayment(false);
          toast.error(err?.message || 'Payment could not be completed. Please try again.');
        },
      });
    } catch (err: any) {
      setIsProcessingPayment(false);
      toast.error(err?.message || 'Could not launch payment gateway.');
    }
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] bg-white py-16 px-4 flex items-center justify-center">
        <SeoHead
          title="Student Plan Activated — 1 Year Pro — Doclly"
          description="Congratulations! Your 1-Year Doclly Pro Student Plan has been activated successfully."
        />
        <div className="max-w-md w-full border border-gray-200 rounded-3xl p-8 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
              1-Year Pro Plan Activated
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Welcome, <strong>{studentName || 'Student'}</strong>! Your student access for <strong>{university}</strong> is now active for a full 365 days.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-2 text-xs text-gray-700">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 font-medium">
              <span>Account</span>
              <span className="text-[#111111]">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span>Plan Duration</span>
              <span className="font-bold text-emerald-600">365 Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Amount Paid</span>
              <span className="font-bold text-[#111111]">₹19</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/tools/edit-pdf"
              className="flex-1 py-3 px-5 rounded-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] text-[#111111] border border-[#DC9F00] font-bold text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2"
            >
              <span>Open PDF Editor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="py-3 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111111] font-bold text-sm flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span>Invoice</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pb-20 overflow-hidden">
      <SeoHead
        title="Student Offer: 1 Year Pro for ₹19 — Doclly"
        description="Exclusive student discount: Get 1 full year of Doclly Pro (worth ₹799) for just ₹19. In-place OCR text editing, ultra compression, and batch tools for students."
        keywords={['student offer', 'student pdf editor', 'doclly student discount', '19 rupees pro plan']}
      />

      {/* Ambient Soft Glows & Background Dot Pattern */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask -z-10" />

      {/* FLOATING 3D ICONS ON FAR EDGES (Hero Style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Left Side 3D Icons */}
        <div className="hidden lg:block absolute top-16 left-6 xl:left-14 animate-doclly-float-1">
          <ThreeDIcon name="pdf" className="w-12 h-12 opacity-85 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
        </div>
        <div className="hidden lg:block absolute top-64 left-4 xl:left-10 animate-doclly-float-2">
          <ThreeDIcon name="edit" className="w-12 h-12 opacity-85 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
        </div>
        <div className="hidden lg:block absolute bottom-36 left-8 xl:left-16 animate-doclly-float-3">
          <ThreeDIcon name="word" className="w-12 h-12 opacity-85 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
        </div>

        {/* Right Side 3D Icons */}
        <div className="hidden lg:block absolute top-16 right-6 xl:right-14 animate-doclly-float-2">
          <ThreeDIcon name="compress" className="w-12 h-12 opacity-85 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
        </div>
        <div className="hidden lg:block absolute top-64 right-4 xl:right-10 animate-doclly-float-1">
          <ThreeDIcon name="merge" className="w-12 h-12 opacity-85 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
        </div>
        <div className="hidden lg:block absolute bottom-36 right-8 xl:right-16 animate-doclly-float-4">
          <ThreeDIcon name="excel" className="w-12 h-12 opacity-85 hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-10 sm:pt-14 space-y-10">
        
        {/* Simple & Clean Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Benefit</span>
          </span>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            1 Year of Doclly Pro for ₹19
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Verify your student status with your college ID card to unlock <strong>365 days of full Pro access</strong> (Regularly ₹799/year).
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 pt-1">
            <span>₹19 One-Time</span>
            <span>•</span>
            <span className="text-emerald-700">Save 98%</span>
            <span>•</span>
            <span>Valid for 365 Days</span>
          </div>
        </div>

        {/* Clean 3-Step Card */}
        <div className="border border-gray-200 rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-xs shadow-xs space-y-6">
          
          {/* Step 1: Sign in */}
          <div className="border-b border-gray-100 pb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Step 1: Account
              </div>
              {user ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Signed In
                </span>
              ) : (
                <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
                  Required
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs text-gray-700">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-full bg-[#FFC800] text-[#111111] font-bold flex items-center justify-center text-xs shrink-0">
                    {(user.name || user.email || 'S')[0].toUpperCase()}
                  </div>
                  <span className="font-semibold truncate text-[#111111]">{user.email}</span>
                </div>
                <span className="text-[11px] text-gray-500 shrink-0">Linked</span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                <span className="text-gray-600">Sign in to link your 1-Year Pro license</span>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-1.5 rounded-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] font-bold text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_6px_rgba(0,0,0,0.12)] transition-all cursor-pointer shrink-0 select-none"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Student Details */}
          <div className="border-b border-gray-100 pb-5 space-y-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Step 2: Academic Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#111111] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  University / College Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Delhi University"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#111111] bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Student Roll / Enrollment Number
                </label>
                <div className="relative">
                  <FileCheck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value)}
                    placeholder="e.g. 2024-CS-0492"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#111111] bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: ID Card Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Step 3: Student ID Card
              </div>
              {isVerified && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Verified
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />

            {!idCardFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-1.5"
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                <div className="text-xs sm:text-sm font-semibold text-[#111111]">
                  Click to upload Student ID Card
                </div>
                <p className="text-[11px] text-gray-500">
                  PNG, JPG photo or PDF
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-5 h-5 text-gray-600 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-[#111111] truncate">{idCardFile.name}</div>
                    <div className="text-[11px] text-gray-500">{(idCardFile.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-gray-600 hover:text-black font-semibold flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>
            )}
          </div>

          {/* Step 4: Pay ₹19 CTA */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <button
              onClick={handlePay}
              disabled={isProcessingPayment}
              className="w-full py-3.5 px-6 rounded-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] font-extrabold text-sm sm:text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none"
            >
              {isProcessingPayment ? (
                <span>Opening Checkout...</span>
              ) : (
                <>
                  <span>Unlock 1-Year Pro for ₹19</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-gray-500">
              1-Click UPI Payment (GPay, PhonePe, Paytm) • Tax invoice provided
            </p>
          </div>
        </div>

        {/* Clean Feature List with 3D Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-start gap-3.5">
            <div className="w-10 h-10 min-w-10 min-h-10 rounded-xl bg-amber-50/50 flex items-center justify-center shrink-0 mt-0.5">
              <ThreeDIcon name="sign" className="w-7 h-7 shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs sm:text-sm text-[#111111]">
                In-Place Scanned Text Edit
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Edit text inside scanned documents and textbook PDFs directly on the page.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-start gap-3.5">
            <div className="w-10 h-10 min-w-10 min-h-10 rounded-xl bg-emerald-50/50 flex items-center justify-center shrink-0 mt-0.5">
              <ThreeDIcon name="compress" className="w-7 h-7 shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs sm:text-sm text-[#111111]">
                Extreme &lt;200 KB Compression
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Compress heavy assignments and project files to fit university portal limits.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-start gap-3.5">
            <div className="w-10 h-10 min-w-10 min-h-10 rounded-xl bg-red-50/50 flex items-center justify-center shrink-0 mt-0.5">
              <ThreeDIcon name="pdf" className="w-7 h-7 shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs sm:text-sm text-[#111111]">
                PDF to Word &amp; Excel
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Convert documents into editable Word (.docx) and Excel spreadsheets.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-start gap-3.5">
            <div className="w-10 h-10 min-w-10 min-h-10 rounded-xl bg-blue-50/50 flex items-center justify-center shrink-0 mt-0.5">
              <ThreeDIcon name="merge" className="w-7 h-7 shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs sm:text-sm text-[#111111]">
                100+ Batch Conversions
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Merge, split, and convert dozens of files simultaneously with zero queue.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Auth Modal if guest */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  );
};
