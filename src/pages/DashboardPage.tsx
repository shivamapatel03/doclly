import React, { useState } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/common/Button';
import { DocumentStorage } from '../lib/storage';
import { ALL_TOOLS } from '../lib/constants';
import {
  BarChart2,
  FileText,
  Sparkles,
  Clock,
  HardDrive,
  CreditCard,
  User,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent' | 'saved' | 'ai' | 'billing' | 'account'>('overview');
  const stats = DocumentStorage.getUserStats();
  const docs = DocumentStorage.getDocuments();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SeoHead title="Account Dashboard — Doclly" description="Overview of processed files, AI usage, and subscription tier." />
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">User Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Track document processing quotas, recent activity, and account settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold text-[#111111] bg-[#FFC800] border border-[#E5E5E5] rounded-full shadow-2xs">
            Plan: Pro Tier (Active)
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E5E5E5] overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart2 },
          { id: 'recent', label: 'Recent Files', icon: FileText },
          { id: 'saved', label: 'Saved Tools', icon: Settings },
          { id: 'ai', label: 'AI History', icon: Sparkles },
          { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
          { id: 'account', label: 'Account Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-[#FFC800] text-[#111111] border border-[#E5E5E5] shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>Documents Processed</span>
                <FileText className="w-4 h-4 text-[#111111]" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{stats.documentsProcessed}</p>
              <span className="text-[11px] text-emerald-600 font-medium">↑ 12% this week</span>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>AI Queries Used</span>
                <Sparkles className="w-4 h-4 text-[#111111]" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">
                {stats.aiQueriesUsed} <span className="text-xs text-gray-400 font-normal">/ {stats.aiQueriesLimit}</span>
              </p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#FFC800] h-full w-[18%]" />
              </div>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>Time Saved</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{stats.timeSavedMinutes} min</p>
              <span className="text-[11px] text-[#6B7280]">Automated conversion time</span>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>Cloud Storage</span>
                <HardDrive className="w-4 h-4 text-[#111111]" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">34 MB <span className="text-xs text-gray-400 font-normal">/ 5 GB</span></p>
              <span className="text-[11px] text-emerald-600 font-medium">99.3% free capacity</span>
            </div>
          </div>

          {/* Recent Files Table Preview */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111111]">Recent Workspace Files</h3>
              <Link to="/workspace" className="text-xs font-bold text-[#111111] hover:underline">
                View All Files →
              </Link>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              {docs.slice(0, 3).map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#111111] shrink-0" />
                    <span className="font-semibold text-[#111111]">{doc.name}</span>
                  </div>
                  <span className="text-[#6B7280]">{doc.uploadedAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Recent Files */}
      {activeTab === 'recent' && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-base font-bold text-[#111111]">Recently Processed Documents</h3>
          <div className="divide-y divide-[#E5E5E5]">
            {docs.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#111111] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#111111]">{doc.name}</p>
                    <p className="text-xs text-[#6B7280]">{(doc.size / 1024).toFixed(1)} KB • {doc.uploadedAt}</p>
                  </div>
                </div>
                <Link to="/workspace" className="text-xs text-[#111111] font-bold hover:underline">
                  Open
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Saved Tools */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ALL_TOOLS.filter((t) => t.popular).map((tool) => (
            <Link
              key={tool.id}
              to={tool.route}
              className="p-4 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded-xl transition-all shadow-2xs"
            >
              <h4 className="text-sm font-bold text-[#111111]">{tool.name}</h4>
              <p className="text-xs text-[#6B7280] mt-1">{tool.description}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Tab 4: AI History */}
      {activeTab === 'ai' && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-base font-bold text-[#111111]">AI Query History</h3>
          <div className="space-y-3">
            {[
              { q: 'Summarize key clauses and Net 30 payment terms', time: '1 hour ago', doc: 'Master_Services_Agreement_2026.pdf' },
              { q: 'Extract vendor name, invoice date, and total tax amount', time: '3 hours ago', doc: 'Acme_Invoice_INV-0849.pdf' },
              { q: 'Translate agreement terms into Gujarati', time: 'Yesterday', doc: 'Contract_Agreement_2026.pdf' },
            ].map((item, i) => (
              <div key={i} className="p-3.5 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span className="font-bold text-[#111111]">{item.doc}</span>
                  <span>{item.time}</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#111111]">{item.q}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Billing */}
      {activeTab === 'billing' && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-6 max-w-2xl shadow-2xs">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Subscription & Quotas</h3>
            <p className="text-xs text-[#6B7280]">Current plan: Pro Tier (₹499/month)</p>
          </div>
          <div className="p-4 bg-[#FFC800]/20 rounded-xl border border-[#FFC800]/50 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#111111]">Pro Membership Active</p>
              <p className="text-xs text-[#6B7280]">Renews on September 15, 2026</p>
            </div>
            <Link to="/pricing" className="text-xs font-bold text-[#111111] hover:underline">
              Change Plan
            </Link>
          </div>
          <div className="space-y-2 text-xs text-[#6B7280]">
            <div className="flex justify-between py-1.5 border-b border-[#E5E5E5]">
              <span>Next billing amount</span>
              <span className="font-bold text-[#111111]">₹499 + GST</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E5E5]">
              <span>Payment method</span>
              <span className="font-bold text-[#111111]">UPI / Card ending in 4242</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Account */}
      {activeTab === 'account' && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-6 max-w-2xl shadow-2xs">
          <h3 className="text-base font-bold text-[#111111]">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Email Address</label>
              <input type="email" defaultValue="user@doclly.app" className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]" />
            </div>
            <div className="pt-2">
              <Button size="sm" variant="primary">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
