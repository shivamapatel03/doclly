import React, { useState, useEffect } from "react";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { SeoHead } from "../../components/layout/SeoHead";
import { UploadZone } from "../../components/tools/UploadZone";
import { Button } from "../../components/common/Button";
import { ProgressBar } from "../../components/common/ProgressBar";
import { useToast } from "../../components/common/Toast";
import { ThreeDIcon } from "../../components/common/ThreeDIcon";
import {
  cleanSpreadsheetData,
  parseSpreadsheet,
  CleanSpreadsheetOptions,
  CleanSpreadsheetResult,
  SpreadsheetPreview,
} from "../../lib/office-engine";
import { downloadBytes, downloadBlob, formatFileSize } from "../../lib/utils";
import { DocumentStorage } from "../../lib/storage";
import { FileSession } from "../../lib/file-session";
import { useLocation } from "react-router-dom";
import {
  FileSpreadsheet,
  Download,
  Search,
  Replace,
  Type,
} from "lucide-react";

export const ExcelCleanupPage: React.FC = () => {
  const location = useLocation();
  const toast = useToast();

  const [file, setFile] = useState<File | null>(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    return f && (f.name.endsWith(".xlsx") || f.name.endsWith(".xls") || f.name.endsWith(".csv")) ? f : null;
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Original Data Preview
  const [originalPreview, setOriginalPreview] = useState<SpreadsheetPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Cleanup Options
  const [options, setOptions] = useState<CleanSpreadsheetOptions>({
    deduplicate: true,
    trimWhitespace: true,
    removeEmptyRows: true,
    textCase: "none",
    findText: "",
    replaceText: "",
    outputFormat: "xlsx",
  });

  // Cleaned Result
  const [result, setResult] = useState<CleanSpreadsheetResult | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  // Auto-parse preview when file changes
  useEffect(() => {
    if (file) {
      setIsLoadingPreview(true);
      setResult(null);
      parseSpreadsheet(file)
        .then((p) => {
          setOriginalPreview(p);
          if (file.name.toLowerCase().endsWith(".csv")) {
            setOptions((prev) => ({ ...prev, outputFormat: "csv" }));
          } else {
            setOptions((prev) => ({ ...prev, outputFormat: "xlsx" }));
          }
        })
        .catch((err) => {
          console.error("Error parsing spreadsheet preview:", err);
        })
        .finally(() => {
          setIsLoadingPreview(false);
        });
    } else {
      setOriginalPreview(null);
      setResult(null);
    }
  }, [file]);

  const handleClean = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const cleanRes = await cleanSpreadsheetData(file, options);
      setProgress(100);
      setResult(cleanRes);

      const ext = options.outputFormat === "csv" ? "csv" : "xlsx";
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const outFilename = `Cleaned_${baseName}.${ext}`;

      // Store in DocumentStorage
      DocumentStorage.saveDocument({
        name: outFilename,
        size: options.outputFormat === "csv" ? cleanRes.csvText.length : cleanRes.data.byteLength,
        type: options.outputFormat === "csv" ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        data: options.outputFormat === "csv" ? cleanRes.csvText : cleanRes.data,
      });

      toast.success(`Data cleaned successfully! Removed ${cleanRes.duplicatesRemoved} duplicate(s) and ${cleanRes.emptyRowsRemoved} empty row(s).`);
    } catch (err: any) {
      console.error("Data cleaning error:", err);
      toast.error(err.message || "Failed to clean spreadsheet data.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = options.outputFormat === "csv" ? "csv" : "xlsx";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const outFilename = `Cleaned_${baseName}.${ext}`;

    if (options.outputFormat === "csv") {
      const blob = new Blob([result.csvText], { type: "text/csv;charset=utf-8;" });
      downloadBlob(blob, outFilename);
    } else {
      downloadBytes(
        result.data,
        outFilename,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    }
  };

  const activeHeaders = result?.headers || originalPreview?.headers || [];
  const activeRows = (result?.previewRows || originalPreview?.rows || []).filter((row) => {
    if (!searchFilter) return true;
    return row.some((c) => String(c).toLowerCase().includes(searchFilter.toLowerCase()));
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SeoHead
        title="Excel & CSV Data Cleanup — Remove Duplicates & Normalize — Doclly"
        description="Clean, deduplicate, trim whitespace, and normalize Excel spreadsheets and CSV files in your browser."
        keywords={["excel cleanup", "csv cleanup", "remove duplicate rows excel", "clean spreadsheet online"]}
      />
      <Breadcrumb items={[{ label: "Tools", to: "/" }, { label: "Excel & CSV Data Cleanup" }]} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-16 h-16 flex items-center justify-center mx-auto drop-shadow-md">
          <ThreeDIcon name="excel" className="w-16 h-16" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Excel &amp; CSV Data Cleanup
        </h1>
        <p className="text-sm text-[#6B7280]">
          Remove duplicates, trim trailing whitespace, drop empty rows, and normalize case — 100% in your browser.
        </p>
      </div>

      {!file ? (
        <div className="max-w-xl mx-auto bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <UploadZone
            onFilesSelected={(files) => files[0] && setFile(files[0])}
            accepts={[".xlsx", ".xls", ".csv", ".tsv", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
            acceptsDescription="Excel (.xlsx, .xls) or CSV files"
            maxFiles={1}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Cleaning Controls Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
            {/* File info card */}
            <div className="flex items-center justify-between p-3.5 bg-[#F9F9F9] rounded-xl border border-[#E5E5E5]">
              <div className="flex items-center gap-3 min-w-0">
                <ThreeDIcon name="excel" className="w-8 h-8 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#111111] truncate">{file.name}</h4>
                  <p className="text-[11px] text-[#6B7280]">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs font-bold text-[#6B7280] hover:text-[#111111] hover:underline shrink-0 ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Options Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Cleaning Rules
              </h3>

              {/* Deduplicate */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E5E5] hover:bg-[#FBFBFB] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.deduplicate}
                  onChange={(e) => setOptions((prev) => ({ ...prev, deduplicate: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[#FFC800] rounded cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#111111] block">Remove Duplicate Rows</span>
                  <span className="text-[#6B7280] text-[11px]">Delete exact duplicate rows across all columns</span>
                </div>
              </label>

              {/* Trim Whitespace */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E5E5] hover:bg-[#FBFBFB] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.trimWhitespace}
                  onChange={(e) => setOptions((prev) => ({ ...prev, trimWhitespace: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[#FFC800] rounded cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#111111] block">Trim Whitespace</span>
                  <span className="text-[#6B7280] text-[11px]">Strip leading and trailing spaces from all cells</span>
                </div>
              </label>

              {/* Remove Blank Rows */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E5E5] hover:bg-[#FBFBFB] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.removeEmptyRows}
                  onChange={(e) => setOptions((prev) => ({ ...prev, removeEmptyRows: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[#FFC800] rounded cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#111111] block">Drop Blank Rows</span>
                  <span className="text-[#6B7280] text-[11px]">Remove rows that contain no data</span>
                </div>
              </label>

              {/* Text Casing */}
              <div className="p-3 rounded-xl border border-[#E5E5E5] space-y-1.5">
                <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Text Case Transformation</span>
                </label>
                <select
                  value={options.textCase}
                  onChange={(e) => setOptions((prev) => ({ ...prev, textCase: e.target.value as any }))}
                  className="w-full text-xs font-semibold p-2 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg cursor-pointer"
                >
                  <option value="none">Keep Original Case</option>
                  <option value="upper">UPPERCASE (ALL CAPS)</option>
                  <option value="lower">lowercase</option>
                  <option value="title">Title Case (Capitalize Each Word)</option>
                </select>
              </div>

              {/* Find and Replace */}
              <div className="p-3 rounded-xl border border-[#E5E5E5] space-y-2">
                <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                  <Replace className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Find &amp; Replace (Optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Find text..."
                    value={options.findText}
                    onChange={(e) => setOptions((prev) => ({ ...prev, findText: e.target.value }))}
                    className="text-xs p-2 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={options.replaceText}
                    onChange={(e) => setOptions((prev) => ({ ...prev, replaceText: e.target.value }))}
                    className="text-xs p-2 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg"
                  />
                </div>
              </div>

              {/* Output Format */}
              <div className="p-3 rounded-xl border border-[#E5E5E5] space-y-2">
                <label className="text-xs font-bold text-[#111111] block">Export As</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOptions((prev) => ({ ...prev, outputFormat: "xlsx" }))}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      options.outputFormat === "xlsx"
                        ? "bg-[#111111] text-white"
                        : "bg-[#F5F5F5] text-[#6B7280] hover:bg-[#EAEAEA]"
                    }`}
                  >
                    .xlsx (Excel)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptions((prev) => ({ ...prev, outputFormat: "csv" }))}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      options.outputFormat === "csv"
                        ? "bg-[#111111] text-white"
                        : "bg-[#F5F5F5] text-[#6B7280] hover:bg-[#EAEAEA]"
                    }`}
                  >
                    .csv (CSV)
                  </button>
                </div>
              </div>
            </div>

            {/* Clean Button */}
            <div className="pt-2">
              <Button
                size="lg"
                variant="primary"
                className="w-full"
                disabled={isProcessing}
                isLoading={isProcessing}
                onClick={handleClean}
              >
                {result ? "Re-Clean Spreadsheet" : "Clean Spreadsheet"}
              </Button>
            </div>

            {isProcessing && (
              <ProgressBar progress={progress} label="Applying cleanup transformations..." />
            )}
          </div>

          {/* RIGHT: Live Data Preview & KPI Summary (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* KPI Cards when cleaned */}
            {result && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl text-center shadow-2xs">
                  <span className="block text-xl font-extrabold text-[#111111]">{result.originalRowCount}</span>
                  <span className="text-[11px] text-[#6B7280] font-medium">Original Rows</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center shadow-2xs">
                  <span className="block text-xl font-extrabold text-emerald-700">{result.cleanedRowCount}</span>
                  <span className="text-[11px] text-emerald-700 font-medium">Cleaned Rows</span>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center shadow-2xs">
                  <span className="block text-xl font-extrabold text-amber-700">{result.duplicatesRemoved}</span>
                  <span className="text-[11px] text-amber-700 font-medium">Duplicates Removed</span>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-center shadow-2xs">
                  <span className="block text-xl font-extrabold text-purple-700">{result.emptyRowsRemoved}</span>
                  <span className="text-[11px] text-purple-700 font-medium">Blanks Dropped</span>
                </div>
              </div>
            )}

            {/* Action Bar (Download + Search in preview) */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter preview data..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl"
                />
              </div>

              {result ? (
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FFC800] hover:bg-[#f0b800] text-[#111111] text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cleaned File (.{options.outputFormat})</span>
                </button>
              ) : (
                <span className="text-xs text-[#6B7280] font-medium">
                  Showing first {activeRows.length} rows preview
                </span>
              )}
            </div>

            {/* Data Grid Table */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-2xs">
              <div className="p-3.5 bg-[#F9F9F9] border-b border-[#E5E5E5] flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  {result ? "Cleaned Data Preview" : "Raw Data Preview"}
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  {activeHeaders.length} columns • {activeRows.length} rows shown
                </span>
              </div>

              {isLoadingPreview ? (
                <div className="p-12 text-center text-xs text-[#6B7280]">
                  Loading spreadsheet data...
                </div>
              ) : activeHeaders.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#6B7280]">
                  No data found in spreadsheet.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#F5F5F5] sticky top-0 z-10 border-b border-[#E5E5E5]">
                      <tr>
                        <th className="p-2.5 font-bold text-[#6B7280] w-12 text-center border-r border-[#E5E5E5]">#</th>
                        {activeHeaders.map((header, idx) => (
                          <th
                            key={idx}
                            className="p-2.5 font-bold text-[#111111] whitespace-nowrap border-r border-[#E5E5E5] last:border-r-0"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {activeRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#F9F9F9] transition-colors">
                          <td className="p-2.5 text-[#9CA3AF] text-center font-mono text-[10px] border-r border-[#E5E5E5]">
                            {rIdx + 1}
                          </td>
                          {activeHeaders.map((_, cIdx) => (
                            <td
                              key={cIdx}
                              className="p-2.5 text-[#111111] whitespace-nowrap border-r border-[#E5E5E5] last:border-r-0 max-w-[200px] truncate"
                              title={String(row[cIdx] ?? "")}
                            >
                              {String(row[cIdx] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
