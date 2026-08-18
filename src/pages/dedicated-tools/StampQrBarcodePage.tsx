import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  QrCode,
  Barcode as BarcodeIcon,
  Download,
  FileText,
  Loader2,
  DollarSign,
  Globe,
} from "lucide-react";
import { SeoHead } from "../../components/layout/SeoHead";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { UploadZone } from "../../components/tools/UploadZone";
import { ThreeDIcon } from "../../components/common/ThreeDIcon";
import { useToast } from "../../components/common/Toast";
import { FileSession } from "../../lib/file-session";
import { downloadBytes } from "../../lib/utils";
import { DocumentStorage } from "../../lib/storage";
import { renderPageToDataUrl, getPdfPageCount } from "../../lib/pdf-editor/pdfRenderer";
import {
  type CodeType,
  type QrPresetType,
  type BarcodeFormat,
  type QrOptions,
  type BarcodeOptions,
  type StampPosition,
  generateQrDataUrl,
  generateBarcodeDataUrl,
  stampCodeOnPdf,
} from "../../lib/barcode-engine";

export const StampQrBarcodePage: React.FC = () => {
  const location = useLocation();
  const toast = useToast();

  // Mode: "stamp" on PDF or "standalone" code generator
  const [activeTab, setActiveTab] = useState<"stamp" | "standalone">("stamp");

  // Code type: QR vs Barcode
  const [codeType, setCodeType] = useState<CodeType>("qr");

  // QR Code Options
  const [qrOptions, setQrOptions] = useState<QrOptions>({
    content: "https://doclly.com/invoice/INV-2026",
    preset: "upi",
    upiId: "merchant@okhdfcbank",
    upiName: "Doclly Store",
    upiAmount: "499.00",
    upiNote: "Invoice #INV-2026-881",
    fgColor: "#111111",
    bgColor: "#FFFFFF",
    errorCorrectionLevel: "M",
    margin: 2,
  });

  // Barcode Options
  const [barcodeOptions, setBarcodeOptions] = useState<BarcodeOptions>({
    content: "INV-2026-88912",
    format: "CODE128",
    fgColor: "#111111",
    bgColor: "#FFFFFF",
    showText: true,
    text: "INVOICE #INV-2026-88912",
    fontSize: 14,
    height: 60,
    width: 2.2,
    margin: 8,
  });

  // Generated Code Data URL
  const [previewCodeUrl, setPreviewCodeUrl] = useState<string>("");

  // PDF File & Preview
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>("");
  const [isRenderingPdf, setIsRenderingPdf] = useState(false);
  const [isStamping, setIsStamping] = useState(false);

  // Stamp Position
  const [stampPos, setStampPos] = useState<StampPosition>({
    preset: "bottom-right",
    xPercent: 70,
    yPercent: 75,
    widthPt: 95,
    heightPt: 95,
    pageTarget: "first",
    customPages: "1",
  });

  // Auto-load file from Router or FileSession
  useEffect(() => {
    const f = (location.state as any)?.file || FileSession.getFile();
    if (f && f.name.toLowerCase().endsWith(".pdf") && !pdfFile) {
      handlePdfSelected([f]);
    }
  }, []); // eslint-disable-line

  // Re-generate Code preview whenever options change
  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      try {
        if (codeType === "qr") {
          const url = await generateQrDataUrl(qrOptions);
          if (isMounted) setPreviewCodeUrl(url);
        } else {
          const url = generateBarcodeDataUrl(barcodeOptions);
          if (isMounted) setPreviewCodeUrl(url);
        }
      } catch (err) {
        console.warn("Code generation error:", err);
      }
    };
    generate();
    return () => {
      isMounted = false;
    };
  }, [codeType, qrOptions, barcodeOptions]);

  // Adjust default stamp dimensions based on code type
  useEffect(() => {
    if (codeType === "qr") {
      setStampPos((prev) => ({ ...prev, widthPt: 95, heightPt: 95 }));
    } else {
      setStampPos((prev) => ({ ...prev, widthPt: 160, heightPt: 55 }));
    }
  }, [codeType]);

  const handlePdfSelected = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setPdfFile(f);
    FileSession.setFile(f);
    setIsRenderingPdf(true);

    try {
      const count = await getPdfPageCount(f);
      setPdfPageCount(count);
      const { dataUrl } = await renderPageToDataUrl(f, 1, 1.2);
      setPdfPreviewUrl(dataUrl);
    } catch (err) {
      console.error("PDF preview error:", err);
      toast.error("Could not render PDF preview.");
    } finally {
      setIsRenderingPdf(false);
    }
  };

  const handleStampAndDownload = async () => {
    if (!pdfFile || !previewCodeUrl) {
      toast.error("Please upload a PDF document and generate a code.");
      return;
    }

    setIsStamping(true);
    try {
      const stampedBytes = await stampCodeOnPdf(pdfFile, previewCodeUrl, stampPos);
      const baseName = pdfFile.name.replace(/\.pdf$/i, "");
      const outName = `${baseName}_stamped.pdf`;

      downloadBytes(stampedBytes, outName);

      DocumentStorage.saveDocument({
        name: outName,
        size: stampedBytes.byteLength,
        type: "application/pdf",
        data: stampedBytes,
      });

      toast.success("Stamped PDF downloaded successfully!");
    } catch (err: any) {
      console.error("Stamping failed:", err);
      toast.error(err.message || "Failed to stamp code onto the PDF.");
    } finally {
      setIsStamping(false);
    }
  };

  const handleDownloadStandaloneCode = () => {
    if (!previewCodeUrl) return;
    const a = document.createElement("a");
    a.href = previewCodeUrl;
    a.download = codeType === "qr" ? "doclly_qr_code.png" : "doclly_barcode.png";
    a.click();
    toast.success("Image downloaded successfully!");
  };

  return (
    <div className="min-h-[90vh] bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="QR Code & Barcode Stamper for Invoices & Tickets — Doclly"
        description="Generate custom UPI payment QR codes, URL barcodes, and stamp them directly onto invoices, tickets, and contracts."
        keywords={["qr code pdf", "stamp qr on invoice", "barcode generator", "upi qr code generator"]}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
          <div>
            <Breadcrumb
              items={[
                { label: "Tools", to: "/tools" },
                { label: "QR & Barcode Stamper" },
              ]}
            />
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <ThreeDIcon name="barcode" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#111111]">QR Code & Barcode Stamper</h1>
                <p className="text-xs text-[#6B7280]">
                  Generate payment QR codes, tracking barcodes, and stamp directly onto invoices, tickets & receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="inline-flex p-1 bg-[#EAEAEA] rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab("stamp")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "stamp"
                  ? "bg-white text-[#111111] shadow-xs"
                  : "text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Stamp on PDF / Invoice
            </button>
            <button
              onClick={() => setActiveTab("standalone")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "standalone"
                  ? "bg-white text-[#111111] shadow-xs"
                  : "text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Standalone Generator
            </button>
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Code Configuration (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-5">
            {/* Code Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Select Code Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCodeType("qr")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    codeType === "qr"
                      ? "bg-[#FFF9DB] border-[#FFC800] text-[#111111] shadow-xs"
                      : "bg-white border-[#E5E5E5] text-[#6B7280] hover:bg-[#F9F9F9]"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-600" />
                  QR Code (Payment / URL)
                </button>
                <button
                  type="button"
                  onClick={() => setCodeType("barcode")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    codeType === "barcode"
                      ? "bg-[#FFF9DB] border-[#FFC800] text-[#111111] shadow-xs"
                      : "bg-white border-[#E5E5E5] text-[#6B7280] hover:bg-[#F9F9F9]"
                  }`}
                >
                  <BarcodeIcon className="w-4 h-4 text-amber-600" />
                  Barcode (Invoices / ID)
                </button>
              </div>
            </div>

            {/* QR Code Specific Form */}
            {codeType === "qr" && (
              <div className="space-y-4">
                {/* QR Preset Tabs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#374151]">QR Purpose</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#F3F4F6] p-1 rounded-xl">
                    {[
                      { id: "upi", label: "UPI Pay", icon: <DollarSign className="w-3 h-3" /> },
                      { id: "url", label: "Web URL", icon: <Globe className="w-3 h-3" /> },
                      { id: "text", label: "Invoice #", icon: <FileText className="w-3 h-3" /> },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setQrOptions((prev) => ({ ...prev, preset: p.id as QrPresetType }))}
                        className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          qrOptions.preset === p.id
                            ? "bg-white text-[#111111] shadow-xs"
                            : "text-[#6B7280] hover:text-[#111111]"
                        }`}
                      >
                        {p.icon}
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset: UPI Payment Details */}
                {qrOptions.preset === "upi" && (
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 space-y-2.5">
                    <span className="text-[11px] font-bold text-amber-900 block">💳 UPI Payment Configuration</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">UPI ID / VPA *</label>
                        <input
                          type="text"
                          placeholder="e.g. store@okhdfcbank"
                          value={qrOptions.upiId}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiId: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">Payee / Store Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Doclly Store"
                          value={qrOptions.upiName}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiName: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">Amount (₹ INR)</label>
                        <input
                          type="number"
                          placeholder="e.g. 499.00"
                          value={qrOptions.upiAmount}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiAmount: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">Transaction Note / Inv #</label>
                        <input
                          type="text"
                          placeholder="e.g. Inv #1024"
                          value={qrOptions.upiNote}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiNote: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preset: URL or Generic Text */}
                {qrOptions.preset !== "upi" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#374151]">
                      {qrOptions.preset === "url" ? "Target URL" : "Text Content / Invoice #"}
                    </label>
                    <input
                      type="text"
                      placeholder={qrOptions.preset === "url" ? "https://..." : "INV-2026-001"}
                      value={qrOptions.content}
                      onChange={(e) => setQrOptions({ ...qrOptions, content: e.target.value })}
                      className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:border-[#111111]"
                    />
                  </div>
                )}

                {/* Colors */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-[#6B7280] block mb-1">Code Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrOptions.fgColor}
                        onChange={(e) => setQrOptions({ ...qrOptions, fgColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[#E5E5E5] p-0.5"
                      />
                      <span className="text-xs font-mono text-[#374151]">{qrOptions.fgColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#6B7280] block mb-1">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrOptions.bgColor === "transparent" ? "#FFFFFF" : qrOptions.bgColor}
                        onChange={(e) => setQrOptions({ ...qrOptions, bgColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[#E5E5E5] p-0.5"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setQrOptions({
                            ...qrOptions,
                            bgColor: qrOptions.bgColor === "transparent" ? "#FFFFFF" : "transparent",
                          })
                        }
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all cursor-pointer ${
                          qrOptions.bgColor === "transparent"
                            ? "bg-[#111111] text-white"
                            : "bg-white text-[#6B7280]"
                        }`}
                      >
                        Transparent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Barcode Specific Form */}
            {codeType === "barcode" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Barcode Value / Invoice ID *</label>
                  <input
                    type="text"
                    value={barcodeOptions.content}
                    onChange={(e) => setBarcodeOptions({ ...barcodeOptions, content: e.target.value })}
                    placeholder="e.g. INV-2026-88912"
                    className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111111] focus:border-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#6B7280]">Standard Format</label>
                    <select
                      value={barcodeOptions.format}
                      onChange={(e) =>
                        setBarcodeOptions({ ...barcodeOptions, format: e.target.value as BarcodeFormat })
                      }
                      className="w-full border border-[#E5E5E5] rounded-xl px-2.5 py-1.5 text-xs text-[#111111] bg-white cursor-pointer"
                    >
                      <option value="CODE128">CODE128 (Invoices / Alpha)</option>
                      <option value="CODE39">CODE39 (General)</option>
                      <option value="EAN13">EAN-13 (13 Digits)</option>
                      <option value="UPC">UPC-A (12 Digits)</option>
                      <option value="ITF14">ITF-14 (Packaging)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#6B7280]">Display Text Below</label>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="showText"
                        checked={barcodeOptions.showText}
                        onChange={(e) => setBarcodeOptions({ ...barcodeOptions, showText: e.target.checked })}
                        className="w-4 h-4 accent-[#FFC800] cursor-pointer"
                      />
                      <label htmlFor="showText" className="text-xs text-[#374151] cursor-pointer select-none">
                        Print text label
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#6B7280]">
                    <span>Barcode Height</span>
                    <span className="font-mono">{barcodeOptions.height}px</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={120}
                    value={barcodeOptions.height}
                    onChange={(e) => setBarcodeOptions({ ...barcodeOptions, height: Number(e.target.value) })}
                    className="w-full accent-[#FFC800] h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: PDF Visual Stamper or Standalone Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {activeTab === "stamp" ? (
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#111111]">Invoice / PDF Visual Stamper</h2>
                    <p className="text-[11px] text-[#6B7280]">
                      {pdfFile ? `${pdfFile.name} (${pdfPageCount} pages)` : "Upload a PDF document to position stamp."}
                    </p>
                  </div>
                  {pdfFile && (
                    <button
                      onClick={() => {
                        setPdfFile(null);
                        setPdfPreviewUrl("");
                      }}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Replace PDF
                    </button>
                  )}
                </div>

                {!pdfFile ? (
                  <div className="py-4">
                    <UploadZone
                      onFilesSelected={handlePdfSelected}
                      accepts={[".pdf"]}
                      acceptsDescription="PDF Invoices, Tickets, Receipts, Contracts"
                      maxFiles={1}
                      multiple={false}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Position Presets & Controls */}
                    <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl p-3.5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#111111]">Stamp Position:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {[
                            { id: "bottom-right", label: "Bottom Right" },
                            { id: "top-right", label: "Top Right" },
                            { id: "bottom-left", label: "Bottom Left" },
                            { id: "top-left", label: "Top Left" },
                            { id: "center", label: "Center" },
                          ].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setStampPos({ ...stampPos, preset: p.id as any })}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                stampPos.preset === p.id
                                  ? "bg-[#111111] text-white border-[#111111]"
                                  : "bg-white text-[#6B7280] border-[#E5E5E5] hover:bg-[#F3F4F6]"
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E5E5E5]">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#374151]">Apply to Pages</label>
                          <select
                            value={stampPos.pageTarget}
                            onChange={(e) => setStampPos({ ...stampPos, pageTarget: e.target.value as any })}
                            className="w-full border border-[#E5E5E5] rounded-lg px-2.5 py-1.5 text-xs text-[#111111] bg-white cursor-pointer"
                          >
                            <option value="first">First Page Only (Invoice Standard)</option>
                            <option value="last">Last Page Only</option>
                            <option value="all">All Pages ({pdfPageCount})</option>
                            <option value="custom">Custom Range (e.g. 1, 3-5)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-[#374151]">
                            <span>Stamp Size</span>
                            <span className="font-mono">{stampPos.widthPt} pt</span>
                          </div>
                          <input
                            type="range"
                            min={40}
                            max={220}
                            value={stampPos.widthPt}
                            onChange={(e) =>
                              setStampPos({
                                ...stampPos,
                                widthPt: Number(e.target.value),
                                heightPt: codeType === "qr" ? Number(e.target.value) : Math.round(Number(e.target.value) * 0.4),
                              })
                            }
                            className="w-full accent-[#FFC800] h-1.5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live PDF Page Preview with Visual Stamp */}
                    <div className="relative bg-[#4B5563] p-4 rounded-xl flex items-center justify-center min-h-[300px] overflow-hidden">
                      {isRenderingPdf ? (
                        <div className="flex flex-col items-center gap-2 text-white">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="text-xs">Loading page preview...</span>
                        </div>
                      ) : pdfPreviewUrl ? (
                        <div className="relative bg-white shadow-2xl rounded-xs max-w-full overflow-hidden">
                          <img src={pdfPreviewUrl} alt="PDF Preview" className="max-h-[380px] w-auto block" />

                          {/* Visual Stamp Overlay */}
                          {previewCodeUrl && (
                            <div
                              style={{
                                width: `${Math.round(stampPos.widthPt * 0.55)}px`,
                                height: `${Math.round(stampPos.heightPt * 0.55)}px`,
                                ...(stampPos.preset === "top-right" && { top: "12px", right: "12px" }),
                                ...(stampPos.preset === "top-left" && { top: "12px", left: "12px" }),
                                ...(stampPos.preset === "bottom-right" && { bottom: "12px", right: "12px" }),
                                ...(stampPos.preset === "bottom-left" && { bottom: "12px", left: "12px" }),
                                ...(stampPos.preset === "center" && {
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }),
                              }}
                              className="absolute bg-white/95 border border-amber-400 p-0.5 rounded-xs shadow-md flex items-center justify-center pointer-events-none animate-in zoom-in-95 duration-100"
                            >
                              <img src={previewCodeUrl} alt="Stamp" className="w-full h-full object-contain" />
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Primary Action Button */}
                    <button
                      onClick={handleStampAndDownload}
                      disabled={isStamping}
                      className="w-full py-3 bg-[#FFC800] hover:bg-[#f0b800] disabled:bg-[#FFF0A0] text-[#111111] text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      {isStamping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {isStamping ? "Stamping Document..." : "Stamp & Download PDF"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Standalone Code Preview & PNG Export */
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-5">
                <div className="border-b border-[#E5E5E5] pb-3">
                  <h2 className="text-sm font-bold text-[#111111]">High-Resolution Code Preview</h2>
                  <p className="text-[11px] text-[#6B7280]">
                    Generated at 600 DPI vector clarity. Download as PNG for physical print or web integration.
                  </p>
                </div>

                <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-8 rounded-xl flex flex-col items-center justify-center min-h-[260px]">
                  {previewCodeUrl ? (
                    <div className="p-4 bg-white rounded-xl shadow-md border border-[#E5E5E5] max-w-xs text-center space-y-2">
                      <img src={previewCodeUrl} alt="Generated Code" className="max-h-48 mx-auto object-contain" />
                      {codeType === "qr" && qrOptions.preset === "upi" && (
                        <div className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded">
                          Scan to Pay ₹{qrOptions.upiAmount || "0"}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Loader2 className="w-6 h-6 animate-spin text-[#9CA3AF]" />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadStandaloneCode}
                    className="py-2.5 bg-[#FFC800] hover:bg-[#f0b800] text-[#111111] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download High-Res PNG
                  </button>

                  <button
                    onClick={() => setActiveTab("stamp")}
                    className="py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111111] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Stamp onto a PDF Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
