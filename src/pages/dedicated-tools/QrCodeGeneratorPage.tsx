import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  Barcode as BarcodeIcon,
  Download,
  Copy,
  Check,
  Globe,
  DollarSign,
  FileText,
  Phone,
  Wifi,
  Mail,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SeoHead } from "../../components/layout/SeoHead";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { ThreeDIcon } from "../../components/common/ThreeDIcon";
import { useToast } from "../../components/common/Toast";
import { FileSession } from "../../lib/file-session";
import {
  type CodeType,
  type QrPresetType,
  type BarcodeFormat,
  type QrOptions,
  type BarcodeOptions,
  generateQrDataUrl,
  generateBarcodeDataUrl,
} from "../../lib/barcode-engine";

export const QrCodeGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [codeType, setCodeType] = useState<CodeType>("qr");
  const [copied, setCopied] = useState(false);

  // QR Code Options
  const [qrOptions, setQrOptions] = useState<QrOptions>({
    content: "https://doclly.com",
    preset: "url",
    upiId: "merchant@okhdfcbank",
    upiName: "Doclly Store",
    upiAmount: "499.00",
    upiNote: "Order #1024",
    fgColor: "#111111",
    bgColor: "#FFFFFF",
    errorCorrectionLevel: "H",
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
    height: 65,
    width: 2.2,
    margin: 8,
  });

  const [previewCodeUrl, setPreviewCodeUrl] = useState<string>("");

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
        console.warn("Generation error:", err);
      }
    };
    generate();
    return () => {
      isMounted = false;
    };
  }, [codeType, qrOptions, barcodeOptions]);

  const handleDownloadPng = () => {
    if (!previewCodeUrl) return;
    const a = document.createElement("a");
    a.href = previewCodeUrl;
    a.download = codeType === "qr" ? "qrcode.png" : "barcode.png";
    a.click();
    toast.success("High-resolution PNG downloaded!");
  };

  const handleCopyToClipboard = async () => {
    if (!previewCodeUrl) return;
    try {
      const res = await fetch(previewCodeUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      toast.success("Copied image to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy directly to clipboard. Please download the PNG.");
    }
  };

  const handleGoToPdfStamper = () => {
    navigate("/tools/stamp-qr-barcode");
  };

  return (
    <div className="min-h-[90vh] bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Free QR Code & Barcode Generator — Doclly"
        description="Generate custom UPI payment QR codes, URL QR codes, and retail barcodes. Download in high-resolution PNG or SVG."
        keywords={["qr code generator", "upi qr code generator", "barcode generator", "free qr maker"]}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
          <div>
            <Breadcrumb
              items={[
                { label: "Tools", to: "/tools" },
                { label: "QR Code & Barcode Generator" },
              ]}
            />
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <ThreeDIcon name="qrcode" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#111111]">QR Code & Barcode Generator</h1>
                <p className="text-xs text-[#6B7280]">
                  Create custom UPI payment QR codes, website URLs, and retail barcodes with 600 DPI clarity.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGoToPdfStamper}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFF9DB] hover:bg-[#FFF3B8] text-amber-950 border border-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            Stamp on PDF / Invoice
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </button>
        </div>

        {/* Main Studio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Configuration (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-5">
            {/* Mode Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Format</label>
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
                  QR Code
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
                  Barcode
                </button>
              </div>
            </div>

            {/* QR Options */}
            {codeType === "qr" && (
              <div className="space-y-4">
                {/* Presets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#374151]">QR Type</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#F3F4F6] p-1 rounded-xl">
                    {[
                      { id: "url", label: "Website URL", icon: <Globe className="w-3 h-3" /> },
                      { id: "upi", label: "UPI Pay", icon: <DollarSign className="w-3 h-3" /> },
                      { id: "text", label: "Plain Text", icon: <FileText className="w-3 h-3" /> },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setQrOptions({ ...qrOptions, preset: p.id as QrPresetType })}
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

                {/* UPI Fields */}
                {qrOptions.preset === "upi" ? (
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-2.5">
                    <span className="text-[11px] font-bold text-amber-900 block">💳 UPI Payment Configuration</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">UPI ID / VPA *</label>
                        <input
                          type="text"
                          placeholder="e.g. store@okhdfcbank"
                          value={qrOptions.upiId}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiId: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">Payee Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Doclly Store"
                          value={qrOptions.upiName}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiName: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">Amount (₹ INR)</label>
                        <input
                          type="number"
                          placeholder="e.g. 499.00"
                          value={qrOptions.upiAmount}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiAmount: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-amber-800">Note / Reference</label>
                        <input
                          type="text"
                          placeholder="e.g. Invoice #1024"
                          value={qrOptions.upiNote}
                          onChange={(e) => setQrOptions({ ...qrOptions, upiNote: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111111]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#374151]">
                      {qrOptions.preset === "url" ? "Target Web Address" : "Content Text"}
                    </label>
                    <input
                      type="text"
                      placeholder={qrOptions.preset === "url" ? "https://example.com" : "Type text or ID..."}
                      value={qrOptions.content}
                      onChange={(e) => setQrOptions({ ...qrOptions, content: e.target.value })}
                      className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                    />
                  </div>
                )}

                {/* Colors & Margin */}
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

            {/* Barcode Options */}
            {codeType === "barcode" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#374151]">Barcode Value / Alphanumeric ID *</label>
                  <input
                    type="text"
                    value={barcodeOptions.content}
                    onChange={(e) => setBarcodeOptions({ ...barcodeOptions, content: e.target.value })}
                    placeholder="e.g. INV-2026-88912"
                    className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111111]"
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
                      <option value="CODE128">CODE128 (Universal)</option>
                      <option value="CODE39">CODE39 (Alphanumeric)</option>
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
                        id="genShowText"
                        checked={barcodeOptions.showText}
                        onChange={(e) => setBarcodeOptions({ ...barcodeOptions, showText: e.target.checked })}
                        className="w-4 h-4 accent-[#FFC800] cursor-pointer"
                      />
                      <label htmlFor="genShowText" className="text-xs text-[#374151] cursor-pointer select-none">
                        Print text label
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#6B7280]">
                    <span>Height</span>
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

          {/* Right Column: High-Res Preview & Export (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#E5E5E5] pb-3">
              <h2 className="text-sm font-bold text-[#111111]">Live High-Res Preview</h2>
              <p className="text-[11px] text-[#6B7280]">Vector-sharp 600 DPI export.</p>
            </div>

            <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-6 rounded-xl flex flex-col items-center justify-center min-h-[220px]">
              {previewCodeUrl ? (
                <div className="p-4 bg-white rounded-xl shadow-md border border-[#E5E5E5] text-center space-y-2 max-w-[240px]">
                  <img src={previewCodeUrl} alt="Generated Code" className="max-h-44 mx-auto object-contain" />
                  {codeType === "qr" && qrOptions.preset === "upi" && (
                    <div className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 py-0.5 px-2 rounded">
                      Scan to Pay ₹{qrOptions.upiAmount || "0"}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleDownloadPng}
                className="w-full py-3 bg-[#FFC800] hover:bg-[#f0b800] text-[#111111] text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                Download High-Res PNG
              </button>

              <button
                onClick={handleCopyToClipboard}
                className="w-full py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111111] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Image to Clipboard"}
              </button>

              <button
                onClick={handleGoToPdfStamper}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-700" />
                Stamp onto an Invoice / PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
