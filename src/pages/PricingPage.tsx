import React, { useState } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { PRICING_PLANS } from '../lib/constants';
import { Check, X } from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { launchRazorpayCheckout } from '../lib/razorpay';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const { user, updatePlanTier } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (plan: typeof PRICING_PLANS[0]) => {
    if (!user) {
      setAuthMode('signup');
      setIsAuthOpen(true);
      return;
    }

    if (plan.id === 'free') {
      updatePlanTier('free');
      showToast('You are on the Free Starter plan.', 'info');
      navigate('/dashboard');
      return;
    }

    const targetPlan = plan.id as 'pro' | 'business';
    const amountINR =
      targetPlan === 'pro'
        ? billingCycle === 'annual'
          ? 799
          : 99
        : billingCycle === 'annual'
        ? 7999
        : 999;

    setIsProcessing(true);

    launchRazorpayCheckout({
      planId: targetPlan,
      planName: plan.name,
      amountINR,
      billingCycle,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      onSuccess: async (paymentId) => {
        await updatePlanTier(targetPlan);
        setIsProcessing(false);
        showToast(
          `🎉 Payment successful (${paymentId})! Upgraded to ${plan.name}.`,
          'success'
        );
        navigate('/dashboard');
      },
      onFailure: (err) => {
        setIsProcessing(false);
        showToast(err?.message || 'Payment cancelled.', 'info');
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 relative">
      {/* Ambient background glow and pattern */}
      <div className="doclly-ambient-glow opacity-60" />
      <div className="absolute inset-0 doclly-dot-pattern opacity-35 pointer-events-none doclly-radial-mask" />

      <SeoHead
        title="Simple, Transparent Pricing — Doclly Pro (₹99/mo)"
        description="Edit scanned PDF text like MS Word, auto-stamp invoices, and batch process 100+ files with Doclly Pro for just ₹99/mo."
      />

      <Breadcrumb items={[{ label: 'Pricing' }]} />

      {/* Header & Annual Switch */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
          Adobe Acrobat power. Just ₹99.
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] max-w-2xl mx-auto">
          Process documents for free forever, or unlock unlimited in-place scanned PDF text editing, UPI invoice stamping, and 100+ batch files for less than a cup of coffee.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center p-1 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl text-xs font-semibold shadow-2xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-[#111111] shadow-2xs border border-[#E5E5E5]'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Monthly Billing (₹99)
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-white text-[#111111] shadow-2xs border border-[#E5E5E5]'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            <span>Annual Billing (₹799/yr)</span>
            <span className="text-[10px] font-bold text-[#111111] bg-[#FFC800] px-1.5 py-0.2 rounded-full border border-[#E5E5E5]">
              Save 33% (₹66/mo)
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4">
        {PRICING_PLANS.map((plan) => {
          const price =
            billingCycle === 'annual' && plan.annualPriceINR
              ? plan.annualPriceINR
              : plan.priceINR;

          const isCurrentPlan = user?.planTier === plan.id;

          return (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between transition-all ${
                plan.isPrimary
                  ? 'bg-white border-[#111111] ring-2 ring-[#FFC800]/60 shadow-md relative'
                  : 'bg-white border-[#E5E5E5]'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 text-[11px] font-bold text-[#111111] bg-[#FFC800] border border-[#111111]/15 rounded-full shadow-xs z-20 whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#111111]">{plan.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl font-extrabold text-[#111111]">{price}</span>
                  <span className="text-xs text-[#6B7280]">
                    {plan.id === 'free' ? 'forever' : billingCycle === 'annual' ? '/year (₹66/mo)' : '/month'}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] space-y-3 text-xs text-[#111111]">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider text-[11px] block">
                    What&rsquo;s included:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}

                  {plan.limitations?.map((lim, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-gray-400">
                      <X className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                      <span>{lim}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isProcessing || isCurrentPlan}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    isCurrentPlan
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : plan.isPrimary
                      ? 'bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] border border-[#E5E5E5]'
                      : 'bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#111111] border border-[#E5E5E5]'
                  }`}
                >
                  {isCurrentPlan ? 'Current Active Plan' : plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto space-y-6 pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111111] text-center">
          Compare All Features
        </h2>

        <div className="border border-[#E5E5E5] rounded-2xl bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F5F5F5] text-[#6B7280] border-b border-[#E5E5E5]">
              <tr>
                <th className="px-5 py-3 font-semibold">Feature</th>
                <th className="px-5 py-3 font-semibold text-center w-28">Free</th>
                <th className="px-5 py-3 font-semibold text-center w-28 text-[#111111]">Doclly Pro (₹99)</th>
                <th className="px-5 py-3 font-semibold text-center w-28">Business Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {[
                { name: 'All 25+ PDF Tools Access', free: true, pro: true, biz: true },
                { name: 'Batch / Bulk File Processing', free: '1–3 files', pro: '100 files in 1 click', biz: 'Unlimited' },
                { name: 'In-Place Scanned PDF Text Edit (OCR)', free: '1 page test', pro: 'Unlimited Full Document', biz: 'Unlimited' },
                { name: 'Invoice UPI QR & Barcode Auto-Stamping', free: '1 file', pro: 'Batch Auto-Stamp (100+)', biz: 'Multi-Seat API' },
                { name: 'Extreme 90% Ultra Compression (<200KB)', free: false, pro: true, biz: true },
                { name: 'Max File Size Limit', free: '25 MB', pro: '500 MB', biz: '2 GB' },
                { name: 'High-Speed VIP Priority Engine', free: false, pro: true, biz: true },
                { name: 'Commercial Use License & Support', free: false, pro: true, biz: 'Dedicated 24/7' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F5F5F5]/50">
                  <td className="px-5 py-3 font-medium text-[#111111]">{row.name}</td>
                  <td className="px-5 py-3 text-center text-[#6B7280]">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                    ) : (
                      row.free
                    )}
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-[#111111] bg-[#FFC800]/10">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                    ) : (
                      row.pro
                    )}
                  </td>
                  <td className="px-5 py-3 text-center text-[#111111] font-medium">
                    {typeof row.biz === 'boolean' ? (
                      row.biz ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                    ) : (
                      row.biz
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
