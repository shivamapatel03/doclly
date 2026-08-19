import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Upload,
  ShieldCheck,
  Sparkles,
  Clock,
  Building2,
  User as UserIcon,
  CreditCard,
  Check,
  FileCheck,
  AlertCircle,
  RefreshCw,
  Download,
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
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: not started, 1: reading, 2: validating, 3: verified
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment & Success State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paidInvoiceId, setPaidInvoiceId] = useState<string | null>(null);

  // Handle ID Card File Selection & Animated Scan
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please upload a valid image (PNG, JPG) or PDF of your student ID card.');
      return;
    }

    setIdCardFile(file);
    setIsVerified(false);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIdCardPreview(null);
    }

    // Trigger Smart In-Browser Scanner Simulation
    runIdScanAnimation();
  };

  const runIdScanAnimation = () => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        setIsScanning(false);
        setIsVerified(true);
        toast.success('Student ID verified successfully! You are eligible for 1 Year Pro.');
      }, 1200);
    }, 1000);
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
            'Doclly Pro (1-Year Student Plan Special)',
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
            particleCount: 120,
            spread: 80,
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
      <div className="min-h-[85vh] bg-[#FAF9F6] py-12 px-4 flex items-center justify-center">
        <SeoHead
          title="Student Plan Activated — 1 Year Pro Free — Doclly"
          description="Congratulations! Your 1-Year Doclly Pro Student Plan has been activated successfully."
        />
        <div className="max-w-lg w-full bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-YEAR STUDENT PRO ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              You&rsquo;re All Set, {studentName || 'Student'}!
            </h1>
            <p className="text-sm text-[#6B7280]">
              Your student status at <strong>{university}</strong> has been verified. You now have 365 days of full Doclly Pro features for just ₹19.
            </p>
          </div>

          {/* Plan Details Card */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 text-left space-y-2.5 text-xs text-[#374151]">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2 font-semibold">
              <span>Account</span>
              <span className="text-[#111111]">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
              <span>Duration</span>
              <span className="font-bold text-emerald-600">365 Days (1 Full Year)</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
              <span>Amount Paid</span>
              <span className="font-bold text-[#111111]">₹19 (Tax Inclusive)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Invoice Ref</span>
              <span className="font-mono text-[#6B7280]">{paidInvoiceId || 'INV-STUDENT-2026'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/tools/edit-pdf"
              className="flex-1 py-3 px-5 rounded-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] font-extrabold text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <span>Start Editing PDFs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="py-3 px-5 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#111111] border border-[#D5D5D5] font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#6B7280]" />
              <span>Dashboard &amp; Invoice</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-16">
      <SeoHead
        title="Student Offer: 1 Year Pro for ₹19 — Doclly"
        description="Exclusive student discount: Get 1 full year of Doclly Pro (worth ₹799) for just ₹19. In-place OCR text editing, ultra compression, and batch tools for students."
        keywords={['student offer', 'student pdf editor', 'doclly student discount', '19 rupees pro plan']}
      />

      {/* Top Banner Notice */}
      <div className="bg-[#111111] text-white py-2.5 px-4 text-center text-xs font-semibold select-none flex items-center justify-center gap-2 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-[#FFC800] animate-pulse" />
        <span>⚡ <strong>Special Student Benefit</strong>: ₹799/yr Pro Plan for just ₹19 • Limited 2-Month Promotional Window!</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-extrabold shadow-2xs">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            <span>BACK TO COLLEGE SPECIAL • VALID 2 MONTHS</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight">
            Get 1 Year of Doclly Pro <br className="hidden sm:inline" />
            for Just <span className="text-[#D97706] underline decoration-[#FFC800] decoration-wavy decoration-2">₹19</span>
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
            Verify your student identity with your college ID card to unlock <strong>365 days of full Pro access</strong> (Regular price ₹799/yr) — including in-place OCR text editing, &lt;200KB compression, and batch tools.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#6B7280] pt-1">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> 100% Free For 365 Days
            </span>
            <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> 2 Months Limited Offer
            </span>
          </div>
        </div>

        {/* Multi-Step Student Verification Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          
          {/* Step 1: Authentication */}
          <div className="border-b border-[#F0F0F0] pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-bold text-[#111111]">
                  Student Account Login
                </h2>
              </div>
              {user ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Signed In
                </span>
              ) : (
                <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
                  Sign in required
                </span>
              )}
            </div>

            {user ? (
              <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFC800] text-[#111111] font-extrabold flex items-center justify-center">
                    {(user.name || user.email || 'S')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-[#111111]">{user.name || 'Student Account'}</div>
                    <div className="text-[#6B7280]">{user.email}</div>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/60 px-2.5 py-1 rounded-full">
                  Linked to License
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-amber-900 text-center sm:text-left">
                  Please log in or create a free account so your 1-Year Pro subscription can be linked permanently.
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-[#FFC800] text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  Sign In / Create Account
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Academic Details */}
          <div className="border-b border-[#F0F0F0] pb-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-[#111111]">
                Academic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Full Name (as on Student ID)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#111111] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  University / College / Institute Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Delhi University / IIT / Mumbai Univ"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#111111] bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Student Enrollment / Roll Number
                </label>
                <div className="relative">
                  <FileCheck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value)}
                    placeholder="e.g. 2024-CS-0492 or ENR88291"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#111111] bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: ID Card Upload & Smart Scan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-bold text-[#111111]">
                  Student ID Card Scan &amp; Verification
                </h2>
              </div>
              {isVerified && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified Student
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
                className="border-2 border-dashed border-[#CBD5E1] hover:border-[#FFC800] bg-[#F8FAFC] hover:bg-[#FFFBEB]/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-[#D97706] group-hover:scale-105 transition-all shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#111111]">
                  Upload your College / School Student ID Card
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Upload PNG, JPG photo or PDF of your student ID card (Front side)
                </p>
                <span className="inline-block text-[11px] font-bold text-[#111111] bg-white border border-[#CBD5E1] px-3 py-1 rounded-full shadow-2xs mt-1">
                  Browse File or Take Photo
                </span>
              </div>
            ) : (
              <div className="border border-[#E5E5E5] rounded-2xl p-4 bg-[#F9FAFB] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0">
                      <ThreeDIcon name="pdf" className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111111] truncate max-w-[200px] sm:max-w-xs">
                        {idCardFile.name}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        {(idCardFile.size / 1024).toFixed(1)} KB • Student ID Card
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#111111] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change File</span>
                  </button>
                </div>

                {/* Scanning Animation Progress Bar */}
                {isScanning && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                    <div className="flex justify-between text-xs font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        {scanStep === 1
                          ? 'Scanning ID Card Image...'
                          : scanStep === 2
                          ? 'Validating Student Credentials...'
                          : 'Finalizing Verification...'}
                      </span>
                      <span>{scanStep === 1 ? '35%' : scanStep === 2 ? '78%' : '100%'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFC800] transition-all duration-500 ease-out"
                        style={{ width: scanStep === 1 ? '35%' : scanStep === 2 ? '78%' : '100%' }}
                      />
                    </div>
                  </div>
                )}

                {/* Verified Confirmation */}
                {isVerified && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ID Card verified! Eligible for ₹19 1-Year Free Pro Plan.</span>
                    </div>
                    <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full">
                      VALID
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 4: Pay ₹19 CTA */}
          <div className="pt-4 border-t border-[#F0F0F0] space-y-3">
            <div className="flex items-center justify-between bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
              <div>
                <div className="text-xs font-bold text-[#111111]">Doclly 1-Year Student Pro Plan</div>
                <div className="text-[11px] text-[#64748B]">Includes all 25+ PDF tools, OCR, &amp; 100+ batch queue</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#94A3B8] line-through mr-1.5">₹799</span>
                <span className="text-lg font-black text-[#111111]">₹19</span>
                <div className="text-[10px] font-bold text-emerald-600">Save 98%</div>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessingPayment}
              className="w-full py-4 px-6 rounded-full bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] active:bg-[#E6B400] text-[#111111] border border-[#DC9F00] font-black text-sm sm:text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none"
            >
              {isProcessingPayment ? (
                <span>Opening 1-Click UPI Checkout...</span>
              ) : (
                <>
                  <span>Verify &amp; Unlock 1-Year Pro for ₹19</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B7280]">
              <CreditCard className="w-3.5 h-3.5 text-[#111111]" />
              <span>Instant 1-Click UPI (GPay, PhonePe, Paytm) • Automatic Invoice Provided</span>
            </div>
          </div>
        </div>

        {/* Feature Comparison / Value Prop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              ✍️
            </div>
            <h3 className="font-extrabold text-sm text-[#111111]">In-Place OCR Text Editor</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Edit scanned notes, textbook PDFs, and assignment questions directly on the page without converting.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              📉
            </div>
            <h3 className="font-extrabold text-sm text-[#111111]">Extreme &lt;200KB Compression</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Shrink large scanned projects, marksheets, and college applications to fit strict portal upload limits.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-extrabold text-sm text-[#111111]">100+ Batch Conversions</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Convert, merge, split, and sign dozens of study materials and presentations simultaneously in 1 click.
            </p>
          </div>
        </div>

        {/* Student FAQ */}
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="text-lg font-bold text-[#111111]">
            Student Offer Frequently Asked Questions
          </h2>
          <div className="divide-y divide-[#F0F0F0] text-xs sm:text-sm text-[#4B5563]">
            <div className="py-3 space-y-1">
              <div className="font-bold text-[#111111]">Who is eligible for the ₹19 Student Offer?</div>
              <p className="text-xs text-[#6B7280]">
                Any student enrolled in a school, college, university, or coaching institute with a valid student ID card or enrollment slip.
              </p>
            </div>
            <div className="py-3 space-y-1">
              <div className="font-bold text-[#111111]">How long is this special offer valid?</div>
              <p className="text-xs text-[#6B7280]">
                This special promotional student rate is valid for the next 2 months. Once claimed, your Pro access lasts for a full 365 days (1 year).
              </p>
            </div>
            <div className="py-3 space-y-1">
              <div className="font-bold text-[#111111]">Are my uploaded ID cards safe and private?</div>
              <p className="text-xs text-[#6B7280]">
                Yes, our verification runs in-browser to confirm student status and adheres to Doclly&rsquo;s strict privacy standards.
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
