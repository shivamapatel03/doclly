import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Sparkles } from 'lucide-react';
import { ExtractedInvoice, ExtractedResume, ExtractedContract } from '../../types/ai';
import { Button } from '../common/Button';
import { convertTextOrRowsToExcel } from '../../lib/office-engine';
import { downloadBytes, downloadBlob } from '../../lib/utils';
import { useToast } from '../common/Toast';

interface StructuredDataPreviewProps {
  type: 'invoice' | 'receipt' | 'resume' | 'contract';
  data: ExtractedInvoice | ExtractedResume | ExtractedContract | any;
}

export const StructuredDataPreview: React.FC<StructuredDataPreviewProps> = ({ type, data: initialData }) => {
  const [data] = useState<any>(initialData);
  const toast = useToast();

  const isInvoice = type === 'invoice' || type === 'receipt';

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      if (isInvoice) {
        const inv = data as ExtractedInvoice;
        const headers = ['Field / Item', 'Value / Quantity', 'Rate / Subtotal', 'Amount'];
        const rows = [
          ['Invoice Number', inv.invoiceNumber, '', ''],
          ['Vendor', inv.vendorName, '', ''],
          ['Customer', inv.customerName, '', ''],
          ['Date', inv.invoiceDate, '', ''],
          ['Due Date', inv.dueDate, '', ''],
          ['--- LINE ITEMS ---', '---', '---', '---'],
          ...inv.lineItems.map((item) => [item.description, item.quantity, item.unitPrice, item.amount]),
          ['--- TOTALS ---', '---', '---', '---'],
          ['Subtotal', '', '', inv.subtotal],
          ['GST / Tax (18%)', '', '', inv.taxAmount],
          ['Total Amount', '', '', inv.totalAmount],
        ];

        const bytes = await convertTextOrRowsToExcel(headers, rows, 'Extracted Invoice');
        downloadBytes(bytes, `Extracted_${inv.invoiceNumber || 'Invoice'}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        toast.success('Excel spreadsheet downloaded!');
      } else {
        const headers = ['Key', 'Extracted Value'];
        const rows = Object.entries(data).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : String(v)]);
        const bytes = await convertTextOrRowsToExcel(headers, rows, 'Extracted Data');
        downloadBytes(bytes, `Extracted_${type}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        toast.success('Excel spreadsheet downloaded!');
      }
    } catch {
      toast.error('Could not generate Excel file.');
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    try {
      if (isInvoice) {
        const inv = data as ExtractedInvoice;
        let csv = `Field,Value\nInvoice Number,"${inv.invoiceNumber}"\nVendor,"${inv.vendorName}"\nCustomer,"${inv.customerName}"\nDate,"${inv.invoiceDate}"\n\nDescription,Quantity,Unit Price,Amount\n`;
        inv.lineItems.forEach((li) => {
          csv += `"${li.description}",${li.quantity},${li.unitPrice},${li.amount}\n`;
        });
        csv += `\nSubtotal,,,"${inv.subtotal}"\nTax (GST),,,"${inv.taxAmount}"\nTotal,,,"${inv.totalAmount}"\n`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `Extracted_${inv.invoiceNumber || 'Invoice'}.csv`);
        toast.success('CSV file downloaded!');
      } else {
        let csv = 'Key,Value\n';
        Object.entries(data).forEach(([k, v]) => {
          csv += `"${k}","${typeof v === 'object' ? JSON.stringify(v).replace(/"/g, '""') : v}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `Extracted_${type}.csv`);
        toast.success('CSV file downloaded!');
      }
    } catch {
      toast.error('Could not generate CSV file.');
    }
  };

  return (
    <div className="w-full bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-2xs">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 bg-[#F5F5F5] border-b border-[#E5E5E5] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFC800]/20 text-[#111111] flex items-center justify-center border border-[#FFC800]/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111111] capitalize">{type} Extraction Summary</h3>
            <p className="text-[11px] text-[#6B7280]">AI parsed structured data fields</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            onClick={handleExportCsv}
          >
            Download CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            onClick={handleExportExcel}
          >
            Download Excel
          </Button>
        </div>
      </div>

      {/* Structured Fields Grid */}
      <div className="p-5">
        {isInvoice ? (
          <div className="space-y-6">
            {/* Top metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F5F5] p-4 rounded-xl border border-[#E5E5E5]">
              <div>
                <span className="text-[11px] text-[#6B7280] font-semibold uppercase">Invoice #</span>
                <p className="text-sm font-bold text-[#111111] mt-0.5">{data.invoiceNumber}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#6B7280] font-semibold uppercase">Invoice Date</span>
                <p className="text-sm font-medium text-[#111111] mt-0.5">{data.invoiceDate}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#6B7280] font-semibold uppercase">Vendor</span>
                <p className="text-sm font-medium text-[#111111] mt-0.5 truncate">{data.vendorName}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#6B7280] font-semibold uppercase">Customer</span>
                <p className="text-sm font-medium text-[#111111] mt-0.5 truncate">{data.customerName}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-2.5">
                Extracted Line Items
              </h4>
              <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F5F5F5] text-[#6B7280] border-b border-[#E5E5E5]">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Description</th>
                      <th className="px-4 py-2.5 font-semibold w-20 text-center">Qty</th>
                      <th className="px-4 py-2.5 font-semibold w-28 text-right">Unit Price</th>
                      <th className="px-4 py-2.5 font-semibold w-28 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {data.lineItems?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#F5F5F5]/50">
                        <td className="px-4 py-2.5 font-medium text-[#111111]">{item.description}</td>
                        <td className="px-4 py-2.5 text-center text-[#6B7280]">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-[#6B7280]">₹{item.unitPrice?.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-[#111111]">₹{item.amount?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary Calculation */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 bg-[#F5F5F5] p-4 rounded-xl border border-[#E5E5E5] space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#111111]">₹{data.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Tax / GST (18%)</span>
                  <span className="font-medium text-[#111111]">₹{data.taxAmount?.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-[#E5E5E5] flex justify-between text-base font-bold text-[#111111]">
                  <span>Total Amount</span>
                  <span className="text-[#111111] font-extrabold">₹{data.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Generic key-value view for Contract / Resume */
          <div className="space-y-4">
            <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden">
              {Object.entries(data).map(([key, value]: [string, any], idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs sm:text-sm gap-2 hover:bg-[#F5F5F5]">
                  <span className="font-semibold text-[#111111] capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <div className="sm:col-span-2 text-[#6B7280]">
                    {Array.isArray(value) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {value.map((item, i) => (
                          <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
                        ))}
                      </ul>
                    ) : typeof value === 'object' ? (
                      <pre className="text-xs bg-[#F5F5F5] p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
                    ) : (
                      <span>{String(value)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
