import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { convertTextOrRowsToExcel } from '../../lib/office-engine';
import { extractTextAndTablesFromPdf } from '../../lib/pdf-text-extractor';
import { downloadBytes } from '../../lib/utils';
import { ALL_TOOLS } from '../../lib/constants';
import { FileSpreadsheet, Plus, Sparkles, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

export const PdfToExcelPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.id === 'pdf-to-excel')!;
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Extracted table state
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<(string | number)[][]>([]);

  const [excelBytes, setExcelBytes] = useState<Uint8Array | null>(null);
  const toast = useToast();

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const extracted = await extractTextAndTablesFromPdf(selected);
      setHeaders(extracted.headers);
      setRows(extracted.rows);
      setProgress(100);
      toast.success(`Extracted ${extracted.rows.length} rows (${extracted.headers.length} columns) from "${selected.name}"!`);
    } catch (err: any) {
      toast.error(err.message || 'Could not parse tables from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

const handleAddRow = () => {
    const newRow = headers.map((_, i) => (i === 0 ? `${rows.length + 1}` : ''));
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (idx: number) => {
    if (rows.length <= 1) {
      toast.error('Table must have at least one row.');
      return;
    }
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleConvert = async () => {
    if (!file || headers.length === 0) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(70);
      const bytes = await convertTextOrRowsToExcel(headers, rows, 'Extracted Data');
      setProgress(100);
      setExcelBytes(bytes);
      const filename = `${file.name.replace(/\.[^/.]+$/, '')}.xlsx`;
      downloadBytes(
        bytes,
        filename,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      DocumentStorage.saveDocument({
        name: filename,
        size: bytes.byteLength,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      toast.success('Generated Excel (.xlsx) workbook successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to convert PDF to Excel.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (excelBytes && file) {
      downloadBytes(
        excelBytes,
        `${file.name.replace(/\.[^/.]+$/, '')}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />
      <SeoHead
        title={tool?.seo?.title || 'PDF to Excel Converter — Doclly'}
        description={tool?.seo?.description || 'Convert PDF tables, bank statements, and invoices into Excel spreadsheets (.xlsx).'}
        keywords={tool?.seo?.keywords || ['pdf to excel', 'pdf to xlsx', 'convert pdf to spreadsheet']}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'PDF to Excel' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          PDF to Excel Converter
        </h1>
        <p className="text-sm text-[#6B7280]">
          Detect financial tables, transaction statements, and row data inside PDFs and convert to XLSX.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs relative z-10">
        {excelBytes ? (
          <ResultDownloadCard
            filename={`${file?.name.replace(/\.[^/.]+$/, '') || 'extracted_table'}.xlsx`}
            fileSize={excelBytes.byteLength}
            onDownload={handleDownload}
            onStartOver={() => {
              setFile(null);
              setExcelBytes(null);
              setProgress(0);
              setHeaders([]);
              setRows([]);
            }}
          />
        ) : (
          <>
            {!file ? (
              <div className="space-y-4">
                <UploadZone
                  onFilesSelected={handleFileSelected}
                  accepts={['.pdf', 'application/pdf']}
                  acceptsDescription="PDF documents containing tables or text"
                  maxFiles={1}
                />
                
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      Extracted {rows.length} rows across {headers.length} columns
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setHeaders([]);
                      setRows([]);
                    }}
                    className="text-xs text-[#111111] font-bold hover:underline"
                  >
                    Change file
                  </button>
                </div>

                {/* Table Preview & Live Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                      Detected Table Data Preview ({rows.length} rows)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] bg-white border border-[#E5E5E5] hover:bg-[#F5F5F5] px-2.5 py-1 rounded-lg shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                  </div>

                  <div className="border border-[#E5E5E5] rounded-xl overflow-hidden overflow-x-auto max-h-80">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead className="bg-[#F5F5F5] text-[#6B7280] border-b border-[#E5E5E5] sticky top-0 z-10">
                        <tr>
                          {headers.map((h, i) => (
                            <th
                              key={i}
                              className={`px-3 py-2.5 font-bold text-[#111111] ${
                                i === 0 ? 'w-20 min-w-[70px]' : i === headers.length - 1 ? 'min-w-[180px]' : 'min-w-[140px]'
                              }`}
                            >
                              <input
                                type="text"
                                value={h}
                                onChange={(e) => {
                                  const next = [...headers];
                                  next[i] = e.target.value;
                                  setHeaders(next);
                                }}
                                className="bg-transparent font-bold text-[#111111] border-0 focus:outline-none focus:ring-1 focus:ring-[#FFC800] rounded px-1 w-full"
                              />
                            </th>
                          ))}
                          <th className="w-10 px-2 py-2.5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#F5F5F5]/50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2">
                                <input
                                  type="text"
                                  value={String(cell ?? '')}
                                  onChange={(e) => {
                                    const nextRows = [...rows];
                                    nextRows[rIdx][cIdx] = e.target.value;
                                    setRows(nextRows);
                                  }}
                                  className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#FFC800] rounded px-1 py-0.5 text-xs text-[#111111]"
                                />
                              </td>
                            ))}
                            <td className="px-2 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(rIdx)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                title="Delete row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    disabled={isProcessing || rows.length === 0}
                    isLoading={isProcessing}
                    onClick={handleConvert}
                    leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                  >
                    Download Excel (.xlsx)
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Building XLSX workbook from PDF..." />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

