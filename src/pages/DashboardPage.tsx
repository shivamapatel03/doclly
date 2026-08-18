import React, { useState, useEffect } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/common/Button';
import { DocumentStorage } from '../lib/storage';
import {
  Trash2,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFile3DIcon, ThreeDIcon } from '../components/common/ThreeDIcon';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import {
  launchRazorpayCheckout,
  getPaymentHistory,
  RazorpayTransaction,
} from '../lib/razorpay';
import { DocItem } from '../types/document';

import { AuthModal } from './AuthModal';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent' | 'billing' | 'account'>('overview');
  const { user, isLoading, updatePlanTier, updateProfile, signOut } = useAuth();
  const { showToast } = useToast();

  const [docs, setDocs] = useState<DocItem[]>([]);
  const [payments, setPayments] = useState<RazorpayTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userNameInput, setUserNameInput] = useState(user?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    if (user?.id) {
      setDocs(DocumentStorage.getDocuments(user.id));
      setPayments(getPaymentHistory());
      setUserNameInput(user.name || '');
    } else {
      setDocs([]);
      setPayments([]);
    }
  }, [user]);

  const planTier = user?.planTier || 'free';
  const stats = DocumentStorage.getUserStats(planTier, user?.id);

  const planDisplayName =
    planTier === 'business'
      ? 'Business Plan'
      : planTier === 'pro'
      ? 'Pro Plan'
      : 'Free Starter';

  const handleDeleteDoc = (docId: string, docName: string) => {
    if (!user) return;
    const updated = DocumentStorage.deletePermanently(docId, user.id);
    setDocs(updated);
    showToast(`Removed "${docName}" from workspace.`, 'info');
  };

  const handleDownloadDoc = async (doc: DocItem) => {
    showToast(`Preparing download for "${doc.name}"...`, 'success');
    try {
      await DocumentStorage.downloadDocument(doc, user?.id);
    } catch (err: any) {
      showToast(err?.message || 'Failed to download document.', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim()) return;
    setIsSavingProfile(true);
    try {
      await updateProfile({ name: userNameInput.trim() });
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpgradePlan = (targetPlan: 'pro' | 'business', amountINR: number) => {
    if (!user) {
      showToast('Please sign in to upgrade your subscription.', 'info');
      return;
    }

    setIsUpgrading(true);
    const planName = targetPlan === 'pro' ? 'Pro Plan' : 'Business Plan';

    launchRazorpayCheckout({
      planId: targetPlan,
      planName,
      amountINR,
      billingCycle: 'monthly',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      onSuccess: async (paymentId) => {
        await updatePlanTier(targetPlan);
        setPayments(getPaymentHistory());
        setIsUpgrading(false);
        showToast(
          `🎉 Payment successful (${paymentId})! Upgraded to ${planName}.`,
          'success'
        );
      },
      onFailure: (err) => {
        setIsUpgrading(false);
        showToast(err?.message || 'Payment was cancelled.', 'info');
      },
    });
  };

  const handleDowngradeFree = async () => {
    await updatePlanTier('free');
    showToast('Plan changed to Free Starter tier.', 'info');
  };

  const filteredDocs = docs.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const storageUsedMB = (stats.storageUsedBytes / (1024 * 1024)).toFixed(2);
  const totalStorageGB = (stats.totalStorageBytes / (1024 * 1024 * 1024)).toFixed(0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading your workspace...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
        <SeoHead
          title="Sign In — Doclly Dashboard"
          description="Sign in or create an account to access your personal document workspace and dashboard."
        />
        <Breadcrumb items={[{ label: 'Dashboard' }]} />

        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto bg-amber-50 rounded-3xl border border-amber-100 flex items-center justify-center shadow-2xs">
            <ThreeDIcon name="user" className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              Sign in to your Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
              Please sign in or create a free account to access your private workspace documents, cloud storage quotas, recent files, and subscription billing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuth('signin')}
              className="w-full sm:w-auto px-6 py-3 bg-[#FFC800] hover:bg-[#E5B200] text-[#111111] font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-black text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Create Free Account
            </button>
          </div>

          <div className="pt-6 border-t border-[#E5E5E5] flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <ThreeDIcon name="security" className="w-4 h-4" />
              100% Secure & Private
            </span>
            <span className="flex items-center gap-1.5">
              <ThreeDIcon name="storage" className="w-4 h-4" />
              1 GB Free Cloud Storage
            </span>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SeoHead
        title="Dashboard — Doclly"
        description="Manage processed documents, cloud storage quotas, billing, and user settings."
      />
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            {user ? `${user.name}'s Dashboard` : 'Workspace Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Track document processing quotas, recent files, and subscription billing.
          </p>
        </div>

        {planTier !== 'free' && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full bg-[#FFC800] text-[#111111] border border-[#E5B200] shadow-2xs">
              <ThreeDIcon
                name={planTier === 'business' ? 'diamond' : 'crown'}
                className="w-4 h-4"
              />
              <span>{planTier === 'business' ? 'Business Pro User' : 'Pro User'}</span>
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#E5E5E5] overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon3d: 'overview' },
          { id: 'recent', label: `Recent Files (${docs.length})`, icon3d: 'folder' },
          { id: 'billing', label: 'Billing & Plans', icon3d: 'billing' },
          { id: 'account', label: 'Account Profile', icon3d: 'user' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#FFC800] text-[#111111] border border-[#E5E5E5] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5]'
              }`}
            >
              <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                <ThreeDIcon name={tab.icon3d} className="w-5 h-5" />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW
         ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Real Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-semibold">Documents Processed</span>
                <ThreeDIcon name="folder" className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{docs.length}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Real workspace count</span>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-semibold">Time Saved</span>
                <ThreeDIcon name="clock" className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{docs.length * 3} min</p>
              <span className="text-[11px] text-[#6B7280]">Based on automated tasks</span>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-semibold">Storage Quota</span>
                <ThreeDIcon name="storage" className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">
                {storageUsedMB} MB{' '}
                <span className="text-xs text-gray-400 font-normal">/ {totalStorageGB} GB</span>
              </p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-[#FFC800] h-full"
                  style={{
                    width: `${Math.max(
                      2,
                      Math.min(100, (stats.storageUsedBytes / stats.totalStorageBytes) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recent Files Table Preview */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThreeDIcon name="folder" className="w-5 h-5" />
                <h3 className="text-sm font-bold text-[#111111]">Recent Workspace Documents</h3>
              </div>
              {docs.length > 0 && (
                <button
                  onClick={() => setActiveTab('recent')}
                  className="text-xs font-bold text-[#111111] hover:underline cursor-pointer"
                >
                  View All ({docs.length}) →
                </button>
              )}
            </div>

            {docs.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-[#E5E5E5] rounded-xl space-y-3">
                <div className="flex justify-center">
                  <ThreeDIcon name="folder" className="w-14 h-14" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">No files in workspace yet</h4>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
                    Upload, convert, merge, or compress your PDF documents to see them here.
                  </p>
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] rounded-lg transition-colors shadow-2xs"
                >
                  <ThreeDIcon name="flash" className="w-4 h-4" />
                  <span>Process a Document</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E5E5]">
                {docs.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3 flex items-center justify-between text-xs sm:text-sm hover:bg-[#FAFAFA] rounded-lg px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">{getFile3DIcon(doc.name, 'w-6 h-6')}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#111111] truncate">{doc.name}</p>
                        <p className="text-[11px] text-[#6B7280]">
                          {(doc.size / 1024).toFixed(1)} KB • {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDownloadDoc(doc)}
                        className="p-1.5 text-gray-500 hover:text-[#111111] hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id, doc.name)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RECENT FILES
         ========================================================================= */}
      {activeTab === 'recent' && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl shrink-0">
                <ThreeDIcon name="folder" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111]">Document History</h3>
                <p className="text-xs text-[#6B7280]">
                  All documents generated and processed in this session.
                </p>
              </div>
            </div>
            {docs.length > 0 && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="px-3 py-1.5 text-xs border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111] w-full sm:w-64"
              />
            )}
          </div>

          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-[#E5E5E5] rounded-xl space-y-3">
              <div className="flex justify-center">
                <ThreeDIcon name="folder" className="w-14 h-14" />
              </div>
              <h4 className="text-sm font-bold text-[#111111]">
                {searchQuery ? 'No documents match your search.' : 'No documents saved yet.'}
              </h4>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] rounded-lg transition-colors shadow-2xs"
              >
                <ThreeDIcon name="flash" className="w-4 h-4" />
                <span>Upload Document Now</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5]">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="py-3 flex items-center justify-between text-xs sm:text-sm hover:bg-[#FAFAFA] rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">{getFile3DIcon(doc.name, 'w-7 h-7')}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#111111] truncate">{doc.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        {(doc.size / 1024).toFixed(1)} KB • {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-[#111111] rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id, doc.name)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: BILLING & RAZORPAY
         ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Active Subscription Card: Shown only for Pro / Paid Users */}
          {planTier !== 'free' && (
            <div className="bg-[#FFFDF0] border-2 border-[#FFC800] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-[#FFC800] rounded-2xl shrink-0 shadow-2xs border border-[#E5B200]">
                    <ThreeDIcon
                      name={planTier === 'business' ? 'diamond' : 'crown'}
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-[#FFC800] text-[#111111] rounded-full border border-[#E5B200]">
                        {planTier === 'business' ? 'Business Pro User' : 'Pro User'}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        ● Active
                      </span>
                    </div>
                    <p className="text-xs text-[#111111] font-medium mt-1">
                      {planTier === 'pro'
                        ? 'Pro membership active with 25 GB cloud storage & unlimited fast processing.'
                        : 'Enterprise grade plan with 100 GB storage & dedicated support.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDowngradeFree}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50 border border-gray-300 rounded-lg transition-colors cursor-pointer self-start sm:self-center"
                >
                  Cancel Plan
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#FFC800]/40 text-xs">
                <div className="p-3 bg-white/90 border border-[#FFC800]/50 rounded-xl flex items-center gap-3">
                  <ThreeDIcon name="storage" className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-[#6B7280] font-medium">Cloud Storage Capacity</span>
                    <p className="text-sm font-bold text-[#111111] mt-0.5">{totalStorageGB} GB Total</p>
                  </div>
                </div>
                <div className="p-3 bg-white/90 border border-[#FFC800]/50 rounded-xl flex items-center gap-3">
                  <ThreeDIcon name="billing" className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-[#6B7280] font-medium">Payment Method</span>
                    <p className="text-sm font-bold text-[#111111] mt-0.5">UPI / Cards / NetBanking</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Options */}
          {planTier !== 'business' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#111111]">
                  {planTier === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Instant secure checkout. Cancel anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pro Tier Option */}
                {planTier !== 'pro' && (
                  <div className="p-6 bg-white border-2 border-[#FFC800] rounded-2xl space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <ThreeDIcon name="crown" className="w-6 h-6" />
                          <h4 className="text-lg font-bold text-[#111111]">Pro Plan</h4>
                        </div>
                        <span className="px-2.5 py-0.5 text-[10px] font-bold text-[#111111] bg-[#FFC800] rounded-full">
                          Most Popular
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#111111]">₹499</span>
                        <span className="text-xs text-[#6B7280]">/ month</span>
                      </div>
                      <ul className="space-y-2 text-xs text-[#111111] pt-3 border-t border-gray-100">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>25 GB Cloud Storage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Unlimited Document Batch Conversions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Priority High-Speed Server Processing</span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleUpgradePlan('pro', 499)}
                      disabled={isUpgrading}
                      className="w-full mt-4 flex items-center justify-center bg-[#FFC800] hover:bg-[#E6B400] text-[#111111] font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-xs cursor-pointer"
                    >
                      Upgrade to Pro (₹499)
                    </Button>
                  </div>
                )}

                {/* Business Tier Option */}
                <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl space-y-4 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ThreeDIcon name="diamond" className="w-6 h-6" />
                        <h4 className="text-lg font-bold text-[#111111]">Business Plan</h4>
                      </div>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-[#111111] rounded-full">
                        Enterprise
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#111111]">₹1,999</span>
                      <span className="text-xs text-[#6B7280]">/ month</span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#111111] pt-3 border-t border-gray-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>100 GB High-Capacity Storage</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Custom Document Watermarking & APIs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>24/7 Dedicated Support & SLA</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleUpgradePlan('business', 1999)}
                    disabled={isUpgrading}
                    variant="outline"
                    className="w-full mt-4 flex items-center justify-center font-bold text-xs sm:text-sm py-2.5 rounded-xl border-[#111111] text-[#111111] hover:bg-gray-100 shadow-2xs cursor-pointer"
                  >
                    Upgrade to Business (₹1,999)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Invoices History */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <ThreeDIcon name="receipt" className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#111111]">Billing & Payment History</h3>
            </div>
            {payments.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
                <ThreeDIcon name="receipt" className="w-10 h-10 mx-auto opacity-70" />
                <p className="text-xs text-[#6B7280]">
                  No past transactions recorded yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E5E5]">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <ThreeDIcon name="receipt" className="w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-semibold text-[#111111]">
                          {p.planName} Subscription ({p.billingCycle})
                        </p>
                        <p className="text-[11px] text-[#6B7280]">
                          ID: {p.paymentId} • {p.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#111111]">₹{p.amountINR}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ACCOUNT PROFILE
         ========================================================================= */}
      {activeTab === 'account' && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-6 max-w-2xl shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-indigo-50 rounded-2xl shrink-0 border border-indigo-100">
              <ThreeDIcon name="user" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">Account Settings</h3>
              <p className="text-xs text-[#6B7280]">
                Manage your personal identity, login method, and profile details.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Full Name</label>
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || 'guest@doclly.app'}
                disabled
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] bg-gray-50 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                <ThreeDIcon name="security" className="w-3.5 h-3.5 inline-block shrink-0" />
                <span>Authentication provider: <span className="capitalize font-semibold text-gray-600">{user?.provider || 'Email/Password'}</span></span>
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#E5E5E5]">
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={isSavingProfile}
                className="font-bold"
              >
                {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
              </Button>

              {user && (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Sign Out of Account
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
