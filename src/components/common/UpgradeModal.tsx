import React, { useState } from 'react';
import { X, Check, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';
import { launchRazorpayCheckout } from '../../lib/razorpay';
import { AuthModal } from '../../pages/AuthModal';
import { createInvoiceRecord, sendInvoiceEmail } from '../../lib/invoice-generator';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureReason?: string;
  source?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  featureReason = 'Unlock full in-place scanned PDF editing & unlimited 100+ batch conversions.',
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, updatePlanTier } = useAuth();
  const toast = useToast();

  if (!isOpen) return null;

  const isAnnual = billingCycle === 'annual';
  const price = isAnnual ? 799 : 99;
  const priceLabel = isAnnual ? '₹799 / yr' : '₹99 / mo';
  const priceDisplay = billingCycle === 'monthly' ? '₹99' : '₹799';
  const subtext = billingCycle === 'monthly' ? 'per month • cancel anytime' : 'per year (just ₹66/mo • Save 33%)';

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsProcessing(true);
    await launchRazorpayCheckout({
      planId: 'pro',
      planName: 'Doclly Pro',
      amountINR: price,
      billingCycle,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      onSuccess: async (paymentId) => {
        const invoice = createInvoiceRecord(
          user,
          'pro',
          isAnnual ? 'Doclly Pro Annual' : 'Doclly Pro Monthly',
          price,
          paymentId
        );
        // Automatically dispatch official invoice to user's email
        sendInvoiceEmail(invoice, user.email).catch(console.error);

        await updatePlanTier('pro');
        setIsProcessing(false);
        onClose();
        toast.success(`🎉 Welcome to Doclly Pro! Invoice #${invoice.id} sent to ${user.email}`);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        if (err?.message !== 'Checkout cancelled') {
          toast.error(err?.message || 'Payment failed. Please try again.');
        }
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-x-hidden overflow-y-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full border border-[#E5E5E5] shadow-2xl overflow-y-auto relative animate-in zoom-in-95 duration-150 p-4 sm:p-6 space-y-4 my-auto max-h-[92dvh]">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#6B7280] hover:text-[#111111] hover:bg-gray-100 rounded-full transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1 pt-1">
            <div className="inline-flex items-center px-3 py-0.5 bg-[#0F172A] text-white rounded-full text-[11px] font-black border border-[#FFC800]/40 shadow-2xs">
              <span>DOCLLY PRO</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#111111] tracking-tight">
              Unlock All Pro Features
            </h3>
            <p className="text-xs text-[#6B7280] px-1">
              {featureReason}
            </p>
          </div>

          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-center pt-1">
            <div className="inline-flex p-1 bg-[#F3F4F6] border border-[#E5E5E5] rounded-xl text-xs font-bold w-full">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#111111] shadow-2xs font-extrabold'
                    : 'text-[#6B7280] hover:text-[#111111]'
                }`}
              >
                Monthly (₹99)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-white text-[#111111] shadow-2xs font-extrabold'
                    : 'text-[#6B7280] hover:text-[#111111]'
                }`}
              >
                <span>Annual (₹799)</span>
                <span className="px-1 py-0.2 text-[8px] font-black bg-[#FFC800] text-[#111111] rounded">
                  SAVE 33%
                </span>
              </button>
            </div>
          </div>

          {/* Short 3-Point Checklist */}
          <div className="space-y-2 py-2 text-xs text-[#374151] border-y border-gray-100">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
              <span>Extreme 90% Ultra Compression (&lt;200 KB)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
              <span>Unlimited In-Place Scanned Text OCR Editing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
              <span>100+ Batch Files Queue &amp; Invoice UPI QR</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full py-3 px-5 rounded-xl bg-[#FFC800] hover:bg-[#E5B200] text-[#111111] font-extrabold text-sm transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none"
            >
              {isProcessing ? (
                <span>Opening Checkout...</span>
              ) : (
                <>
                  <span>Get Pro — {billingCycle === 'monthly' ? '₹99/mo' : '₹799/yr'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]">
              <Lock className="w-3 h-3 text-[#111111]" />
              <span>1-Click UPI (GPay, PhonePe, Paytm) • Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal if user needs to login first */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </>
  );
};
