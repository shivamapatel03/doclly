import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Send, Download, FileText, ArrowRight } from 'lucide-react';
import { Invoice, sendInvoiceEmail, downloadInvoicePdf } from '../../lib/invoice-generator';
import { useToast } from './Toast';

interface EmailInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const EmailInvoiceModal: React.FC<EmailInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const toast = useToast();

  // Keep email synced with invoice customer email
  React.useEffect(() => {
    if (invoice) {
      setEmail(invoice.customerEmail || '');
      setIsSent(false);
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    try {
      const res = await sendInvoiceEmail(invoice, email);
      setIsSending(false);
      setIsSent(true);
      toast.success(res.message);
    } catch (err: any) {
      setIsSending(false);
      toast.error(err?.message || 'Failed to send invoice email.');
    }
  };

  const handleDirectDownload = async () => {
    try {
      await downloadInvoicePdf(invoice);
      toast.success('Invoice PDF downloaded!');
    } catch (err) {
      toast.error('Failed to download invoice PDF.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#E5E5E5] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150 p-6 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#6B7280] hover:text-[#111111] hover:bg-gray-100 rounded-full transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#111111] tracking-tight">
              Email Tax Invoice
            </h3>
            <p className="text-xs text-[#6B7280]">
              Send an official PDF receipt copy to your mailbox.
            </p>
          </div>
        </div>

        {/* Invoice Summary Pill */}
        <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E5E5] rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Invoice Number:</span>
            <span className="font-bold text-[#111111]">{invoice.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Plan:</span>
            <span className="font-bold text-[#111111]">{invoice.planName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Amount Paid:</span>
            <span className="font-extrabold text-[#111111]">
              ₹{invoice.amount.toFixed(2)} (Incl. GST)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Transaction ID:</span>
            <span className="font-mono text-[11px] text-gray-700">{invoice.paymentId}</span>
          </div>
        </div>

        {/* Email Form */}
        {isSent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Invoice Email Dispatched!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Sent to <strong>{email}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDirectDownload}
                className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111]">
                Recipient Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-hidden focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all"
              />
              <p className="text-[11px] text-[#6B7280]">
                You can enter your company finance or alternate accounting email.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isSending}
                className="flex-1 py-2.5 px-4 bg-[#FFC800] hover:bg-[#E5B200] text-[#111111] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <span>Sending Email...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Invoice to Email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectDownload}
                title="Download PDF directly"
                className="p-2.5 border border-[#E5E5E5] hover:bg-gray-50 rounded-xl text-[#111111] transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
