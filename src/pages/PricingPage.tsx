import React, { useState } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { PRICING_PLANS } from '../lib/constants';
import { Check, X } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const toast = useToast();

  const handlePlanSelect = (planName: string) => {
    toast.success(`Selected ${planName} plan! Redirecting to secure checkout...`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 relative">
      {/* Ambient background glow and pattern */}
      <div className="doclly-ambient-glow opacity-60" />
      <div className="absolute inset-0 doclly-dot-pattern opacity-35 pointer-events-none doclly-radial-mask" />

      <SeoHead
        title="Simple, Transparent Pricing — Doclly"
        description="Free forever tier for quick tasks. Upgrade to Pro (₹499/mo) or Business (₹1,999/mo) for unlimited AI extraction and batch workflows."
      />

      <Breadcrumb items={[{ label: 'Pricing' }]} />

      {/* Header & Annual Switch */}
      <div className="text-center max-w-2xl mx-auto space-y-4 relative z-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
          Simple, transparent plans.
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280]">
          Process documents for free forever, or upgrade for unlimited AI power, batch workflows, and team collaboration.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center p-1 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl text-xs font-semibold shadow-2xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-[#111111] shadow-2xs border border-[#E5E5E5]'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-white text-[#111111] shadow-2xs border border-[#E5E5E5]'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold text-[#111111] bg-[#FFC800] px-1.5 py-0.2 rounded-full border border-[#E5E5E5]">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const price =
            billingCycle === 'annual' && plan.annualPriceINR
              ? plan.annualPriceINR
              : plan.priceINR;

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
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 text-[11px] font-bold text-[#111111] bg-[#FFC800] border border-[#E5E5E5] rounded-full shadow-2xs">
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
                    {plan.id === 'free' ? 'forever' : billingCycle === 'annual' ? '/mo (billed annually)' : '/month'}
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
                  onClick={() => handlePlanSelect(plan.name)}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                    plan.isPrimary
                      ? 'bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] border border-[#E5E5E5]'
                      : 'bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#111111] border border-[#E5E5E5]'
                  }`}
                >
                  {plan.cta}
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
                <th className="px-5 py-3 font-semibold text-center w-28 text-[#111111]">Pro</th>
                <th className="px-5 py-3 font-semibold text-center w-28">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {[
                { name: 'Basic PDF Tools (Merge, Split, Rotate)', free: '10/day', pro: 'Unlimited', biz: 'Unlimited' },
                { name: 'Max File Size', free: '25 MB', pro: '250 MB', biz: '1 GB' },
                { name: 'AI Document Assistant & Chat', free: '5 queries/day', pro: 'Unlimited', biz: 'Unlimited' },
                { name: 'Smart Invoice & Receipt OCR (Excel Export)', free: false, pro: true, biz: true },
                { name: 'Multi-Step Automated Workflows', free: false, pro: true, biz: true },
                { name: 'Contract Diff & Redline Compare', free: false, pro: true, biz: true },
                { name: 'Cloud Workspace & Shared Folders', free: false, pro: '5 GB', biz: '50 GB' },
                { name: 'Developer REST API Access', free: false, pro: false, biz: true },
                { name: 'Dedicated Priority Support', free: false, pro: true, biz: '24/7 Phone & Email' },
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
    </div>
  );
};
