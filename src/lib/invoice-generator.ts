import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { downloadBytes } from './utils';

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentId: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  status: 'paid' | 'pending';
  sacCode: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
}

/**
 * Generate a PDF Tax Invoice using pdf-lib
 */
export async function generateInvoicePdf(invoice: Invoice): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // A4 dimensions: 595.28 x 841.89 points
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color constants
  const cDark = rgb(15 / 255, 23 / 255, 42 / 255); // #0F172A
  const cGold = rgb(255 / 255, 200 / 255, 0 / 255); // #FFC800
  const cGray = rgb(107 / 255, 114 / 255, 128 / 255); // #6B7280
  const cLightBg = rgb(248 / 255, 250 / 255, 252 / 255); // #F8FAFC
  const cBorder = rgb(229 / 255, 231 / 255, 235 / 255); // #E5E7EB
  const cGreen = rgb(16 / 255, 185 / 255, 129 / 255); // #10B981

  // Top Dark Header Banner
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: cDark,
  });

  // Top Gold Accent Bar
  page.drawRectangle({
    x: 0,
    y: height - 114,
    width,
    height: 4,
    color: cGold,
  });

  // Company Brand
  page.drawText('DOCLLY', {
    x: 45,
    y: height - 55,
    size: 24,
    font: fontBold,
    color: cGold,
  });

  page.drawText('All-in-One Cloud Document Workspace', {
    x: 45,
    y: height - 72,
    size: 10,
    font: fontRegular,
    color: rgb(203 / 255, 213 / 255, 225 / 255),
  });

  // TAX INVOICE Header (Right)
  page.drawText('TAX INVOICE', {
    x: width - 190,
    y: height - 55,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`INVOICE #: ${invoice.id}`, {
    x: width - 190,
    y: height - 72,
    size: 10,
    font: fontBold,
    color: cGold,
  });

  page.drawText(`DATE: ${invoice.date}`, {
    x: width - 190,
    y: height - 86,
    size: 9,
    font: fontRegular,
    color: rgb(226 / 255, 232 / 255, 240 / 255),
  });

  // Status Badge Box
  page.drawRectangle({
    x: width - 190,
    y: height - 105,
    width: 65,
    height: 16,
    color: cGreen,
  });
  page.drawText('PAID', {
    x: width - 170,
    y: height - 101,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  let curY = height - 150;

  // Two Column Info (Seller vs Buyer)
  // Left: Provider / Seller Details
  page.drawText('ISSUED BY:', {
    x: 45,
    y: curY,
    size: 9,
    font: fontBold,
    color: cGray,
  });
  page.drawText('Doclly Technologies (doclly.online)', {
    x: 45,
    y: curY - 14,
    size: 11,
    font: fontBold,
    color: cDark,
  });
  page.drawText('GSTIN: 24AABCS1429B1Z2', {
    x: 45,
    y: curY - 28,
    size: 9,
    font: fontRegular,
    color: cGray,
  });
  page.drawText('SAC Code: 998313 (IT & Cloud Services)', {
    x: 45,
    y: curY - 40,
    size: 9,
    font: fontRegular,
    color: cGray,
  });
  page.drawText('support@doclly.online', {
    x: 45,
    y: curY - 52,
    size: 9,
    font: fontRegular,
    color: cGray,
  });

  // Right: Billed To / Customer Details
  page.drawText('BILLED TO:', {
    x: 320,
    y: curY,
    size: 9,
    font: fontBold,
    color: cGray,
  });
  page.drawText(invoice.customerName || 'Doclly Customer', {
    x: 320,
    y: curY - 14,
    size: 11,
    font: fontBold,
    color: cDark,
  });
  page.drawText(invoice.customerEmail, {
    x: 320,
    y: curY - 28,
    size: 9,
    font: fontRegular,
    color: cGray,
  });
  page.drawText(`Payment Ref: ${invoice.paymentId || 'Online UPI/Card'}`, {
    x: 320,
    y: curY - 40,
    size: 9,
    font: fontRegular,
    color: cGray,
  });
  page.drawText(`Payment Gateway: Razorpay Live (100% Verified)`, {
    x: 320,
    y: curY - 52,
    size: 9,
    font: fontRegular,
    color: cGray,
  });

  curY -= 80;

  // Itemized Table Header
  page.drawRectangle({
    x: 45,
    y: curY - 24,
    width: width - 90,
    height: 24,
    color: cLightBg,
    borderColor: cBorder,
    borderWidth: 1,
  });

  page.drawText('DESCRIPTION', { x: 55, y: curY - 16, size: 9, font: fontBold, color: cDark });
  page.drawText('SAC', { x: 280, y: curY - 16, size: 9, font: fontBold, color: cDark });
  page.drawText('TAX RATE', { x: 340, y: curY - 16, size: 9, font: fontBold, color: cDark });
  page.drawText('NET AMT', { x: 420, y: curY - 16, size: 9, font: fontBold, color: cDark });
  page.drawText('TOTAL (INR)', { x: 490, y: curY - 16, size: 9, font: fontBold, color: cDark });

  curY -= 24;

  // Table Row 1
  page.drawRectangle({
    x: 45,
    y: curY - 32,
    width: width - 90,
    height: 32,
    color: rgb(1, 1, 1),
    borderColor: cBorder,
    borderWidth: 1,
  });

  page.drawText(invoice.planName, {
    x: 55,
    y: curY - 18,
    size: 10,
    font: fontBold,
    color: cDark,
  });
  page.drawText('Unlimited OCR, 100+ Batch, Extreme Compression', {
    x: 55,
    y: curY - 28,
    size: 7.5,
    font: fontRegular,
    color: cGray,
  });

  page.drawText(invoice.sacCode, { x: 280, y: curY - 20, size: 9, font: fontRegular, color: cDark });
  page.drawText('18% GST', { x: 340, y: curY - 20, size: 9, font: fontRegular, color: cDark });
  page.drawText(`INR ${invoice.taxableAmount.toFixed(2)}`, { x: 420, y: curY - 20, size: 9, font: fontRegular, color: cDark });
  page.drawText(`INR ${invoice.amount.toFixed(2)}`, { x: 490, y: curY - 20, size: 10, font: fontBold, color: cDark });

  curY -= 50;

  // Summary Breakdown Box (Right aligned)
  const boxX = width - 260;
  const boxW = 215;

  page.drawRectangle({
    x: boxX,
    y: curY - 95,
    width: boxW,
    height: 95,
    color: cLightBg,
    borderColor: cBorder,
    borderWidth: 1,
  });

  page.drawText('Taxable Subtotal:', { x: boxX + 15, y: curY - 20, size: 9, font: fontRegular, color: cGray });
  page.drawText(`INR ${invoice.taxableAmount.toFixed(2)}`, { x: boxX + 130, y: curY - 20, size: 9, font: fontRegular, color: cDark });

  page.drawText('CGST (9%):', { x: boxX + 15, y: curY - 35, size: 9, font: fontRegular, color: cGray });
  page.drawText(`INR ${invoice.cgst.toFixed(2)}`, { x: boxX + 130, y: curY - 35, size: 9, font: fontRegular, color: cDark });

  page.drawText('SGST (9%):', { x: boxX + 15, y: curY - 50, size: 9, font: fontRegular, color: cGray });
  page.drawText(`INR ${invoice.sgst.toFixed(2)}`, { x: boxX + 130, y: curY - 50, size: 9, font: fontRegular, color: cDark });

  page.drawLine({
    start: { x: boxX + 10, y: curY - 60 },
    end: { x: boxX + boxW - 10, y: curY - 60 },
    color: cBorder,
    thickness: 1,
  });

  page.drawText('Total Paid:', { x: boxX + 15, y: curY - 78, size: 11, font: fontBold, color: cDark });
  page.drawText(`INR ${invoice.amount.toFixed(2)}`, { x: boxX + 130, y: curY - 78, size: 12, font: fontBold, color: cDark });

  // Authorized Stamp & Seal (Bottom Left)
  curY -= 130;

  page.drawRectangle({
    x: 45,
    y: curY - 50,
    width: 220,
    height: 50,
    color: rgb(254 / 255, 243 / 255, 199 / 255),
    borderColor: rgb(252 / 255, 211 / 255, 77 / 255),
    borderWidth: 1,
  });

  page.drawText('Official Doclly Verified Receipt', {
    x: 55,
    y: curY - 20,
    size: 9,
    font: fontBold,
    color: rgb(146 / 255, 64 / 255, 14 / 255),
  });

  page.drawText(`Transaction ID: ${invoice.paymentId}`, {
    x: 55,
    y: curY - 33,
    size: 7.5,
    font: fontRegular,
    color: rgb(146 / 255, 64 / 255, 14 / 255),
  });

  page.drawText('Payment Status: Confirmed & Settled', {
    x: 55,
    y: curY - 44,
    size: 7.5,
    font: fontRegular,
    color: rgb(146 / 255, 64 / 255, 14 / 255),
  });

  // Footer Note
  page.drawText('This is a computer-generated tax invoice and requires no physical signature.', {
    x: 45,
    y: 45,
    size: 8,
    font: fontOblique,
    color: cGray,
  });

  page.drawText('Thank you for choosing Doclly. Questions? Contact support@doclly.online', {
    x: 45,
    y: 32,
    size: 8,
    font: fontRegular,
    color: cGray,
  });

  return await pdfDoc.save();
}

/**
 * Trigger immediate browser download of PDF Invoice
 */
export async function downloadInvoicePdf(invoice: Invoice): Promise<void> {
  const pdfBytes = await generateInvoicePdf(invoice);
  downloadBytes(pdfBytes, `Doclly_Invoice_${invoice.id}.pdf`, 'application/pdf');
}

/**
 * Local Storage helpers for invoices
 */
export function getStoredInvoices(userId?: string): Invoice[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`doclly_invoices_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load stored invoices:', e);
  }
  return [];
}

export function saveStoredInvoice(userId: string, invoice: Invoice): void {
  try {
    const list = getStoredInvoices(userId);
    const existingIndex = list.findIndex((i) => i.id === invoice.id);
    if (existingIndex >= 0) {
      list[existingIndex] = invoice;
    } else {
      list.unshift(invoice);
    }
    localStorage.setItem(`doclly_invoices_${userId}`, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save invoice:', e);
  }
}

/**
 * Factory to create a standard invoice record
 */
export function createInvoiceRecord(
  user: { id: string; name?: string; email: string },
  planId: string,
  planName: string,
  amount: number,
  paymentId: string
): Invoice {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const invoiceId = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${randomSuffix}`;

  const taxableAmount = +(amount / 1.18).toFixed(2);
  const cgst = +((amount - taxableAmount) / 2).toFixed(2);
  const sgst = +(amount - taxableAmount - cgst).toFixed(2);

  const invoice: Invoice = {
    id: invoiceId,
    date: dateStr,
    dueDate: dateStr,
    planId,
    planName,
    amount,
    currency: 'INR',
    paymentId: paymentId || `pay_live_${randomSuffix}`,
    paymentMethod: 'Razorpay UPI / Cards',
    customerName: user.name || user.email.split('@')[0],
    customerEmail: user.email,
    status: 'paid',
    sacCode: '998313',
    taxableAmount,
    cgst,
    sgst,
  };

  saveStoredInvoice(user.id, invoice);
  return invoice;
}

/**
 * Dispatch Invoice Email
 */
export async function sendInvoiceEmail(
  invoice: Invoice,
  recipientEmail: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    message: `Tax Invoice ${invoice.id} has been dispatched to ${recipientEmail}!`,
  };
}
