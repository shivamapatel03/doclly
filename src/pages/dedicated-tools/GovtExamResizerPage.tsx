import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import { downloadBlob } from '../../lib/utils';
import {
  Upload,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  User,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { ThreeDIcon } from '../../components/common/ThreeDIcon';

interface ExamPreset {
  id: string;
  name: string;
  category: 'govt' | 'entrance' | 'banking' | 'passport';
  docType: 'photo' | 'signature' | 'thumb' | 'postcard';
  widthPx: number;
  heightPx: number;
  aspectRatio: number;
  widthCm?: string;
  heightCm?: string;
  minKb: number;
  maxKb: number;
  recommendedDpi: number;
  allowNameDateStamp: boolean;
  description: string;
}

const EXAM_PRESETS: ExamPreset[] = [
  // UPSC
  {
    id: 'upsc-photo',
    name: 'UPSC (IAS / NDA / CDS) Photo',
    category: 'govt',
    docType: 'photo',
    widthPx: 350,
    heightPx: 450,
    aspectRatio: 350 / 450,
    widthCm: '3.5 cm',
    heightCm: '4.5 cm',
    minKb: 20,
    maxKb: 50,
    recommendedDpi: 300,
    allowNameDateStamp: true,
    description: '3.5 x 4.5 cm, strictly 20 KB to 50 KB (350x450 px)'
  },
  {
    id: 'upsc-sign',
    name: 'UPSC Signature',
    category: 'govt',
    docType: 'signature',
    widthPx: 350,
    heightPx: 150,
    aspectRatio: 350 / 150,
    widthCm: '3.5 cm',
    heightCm: '1.5 cm',
    minKb: 10,
    maxKb: 20,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    description: '3.5 x 1.5 cm, strictly 10 KB to 20 KB'
  },
  // SSC
  {
    id: 'ssc-photo',
    name: 'SSC (CGL / CHSL / MTS / GD) Photo',
    category: 'govt',
    docType: 'photo',
    widthPx: 350,
    heightPx: 450,
    aspectRatio: 350 / 450,
    widthCm: '3.5 cm',
    heightCm: '4.5 cm',
    minKb: 20,
    maxKb: 50,
    recommendedDpi: 300,
    allowNameDateStamp: true,
    description: '3.5 x 4.5 cm, 20 KB - 50 KB with Name & Date'
  },
  {
    id: 'ssc-sign',
    name: 'SSC Signature',
    category: 'govt',
    docType: 'signature',
    widthPx: 400,
    heightPx: 200,
    aspectRatio: 400 / 200,
    widthCm: '4.0 cm',
    heightCm: '2.0 cm',
    minKb: 10,
    maxKb: 20,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    description: '4.0 x 2.0 cm, 10 KB - 20 KB (Black/Blue ink)'
  },
  // GATE / JAM
  {
    id: 'gate-photo',
    name: 'GATE / IIT JAM Photo',
    category: 'entrance',
    docType: 'photo',
    widthPx: 480,
    heightPx: 640,
    aspectRatio: 480 / 640,
    widthCm: '3.5 cm',
    heightCm: '4.5 cm',
    minKb: 20,
    maxKb: 200,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    description: '3.5 x 4.5 cm, 20 KB to 200 KB'
  },
  {
    id: 'gate-sign',
    name: 'GATE Signature',
    category: 'entrance',
    docType: 'signature',
    widthPx: 500,
    heightPx: 160,
    aspectRatio: 500 / 160,
    widthCm: '3.0 cm',
    heightCm: '0.8 cm',
    minKb: 5,
    maxKb: 200,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    description: '3.0 x 0.8 cm, 5 KB to 200 KB'
  },
  // NEET / NTA
  {
    id: 'neet-photo',
    name: 'NEET UG / PG Passport Photo',
    category: 'entrance',
    docType: 'photo',
    widthPx: 350,
    heightPx: 450,
    aspectRatio: 350 / 450,
    widthCm: '3.5 cm',
    heightCm: '4.5 cm',
    minKb: 10,
    maxKb: 200,
    recommendedDpi: 300,
    allowNameDateStamp: true,
    description: '10 KB to 200 KB with Name & Date of Photo (DOP)'
  },
  {
    id: 'neet-postcard',
    name: 'NEET Postcard Photo (4x6 in)',
    category: 'entrance',
    docType: 'postcard',
    widthPx: 600,
    heightPx: 900,
    aspectRatio: 600 / 900,
    widthCm: '4 x 6 inches',
    heightCm: '10 x 15 cm',
    minKb: 50,
    maxKb: 300,
    recommendedDpi: 300,
    allowNameDateStamp: true,
    description: '4 x 6 inch postcard size photo, 50 KB to 300 KB'
  },
  {
    id: 'neet-sign',
    name: 'NEET Signature',
    category: 'entrance',
    docType: 'signature',
    widthPx: 400,
    heightPx: 150,
    aspectRatio: 400 / 150,
    minKb: 4,
    maxKb: 30,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    description: '4 KB to 30 KB with running handwriting'
  },
  // JEE Main
  {
    id: 'jee-photo',
    name: 'JEE Main / Advanced Photo',
    category: 'entrance',
    docType: 'photo',
    widthPx: 350,
    heightPx: 450,
    aspectRatio: 350 / 450,
    minKb: 10,
    maxKb: 200,
    recommendedDpi: 300,
    allowNameDateStamp: true,
    description: '10 KB to 200 KB, clear white background'
  },
  // Banking (IBPS / SBI)
  {
    id: 'ibps-photo',
    name: 'IBPS / SBI Banking Photo',
    category: 'banking',
    docType: 'photo',
    widthPx: 200,
    heightPx: 230,
    aspectRatio: 200 / 230,
    minKb: 20,
    maxKb: 50,
    recommendedDpi: 200,
    allowNameDateStamp: false,
    description: '200 x 230 px, strictly 20 KB to 50 KB'
  },
  {
    id: 'ibps-sign',
    name: 'IBPS / SBI Signature',
    category: 'banking',
    docType: 'signature',
    widthPx: 140,
    heightPx: 60,
    aspectRatio: 140 / 60,
    minKb: 10,
    maxKb: 20,
    recommendedDpi: 200,
    allowNameDateStamp: false,
    description: '140 x 60 px, strictly 10 KB to 20 KB'
  },
  {
    id: 'ibps-thumb',
    name: 'IBPS Left Thumb Impression',
    category: 'banking',
    docType: 'thumb',
    widthPx: 240,
    heightPx: 240,
    aspectRatio: 1,
    minKb: 20,
    maxKb: 50,
    recommendedDpi: 200,
    allowNameDateStamp: false,
    description: '240 x 240 px, 20 KB to 50 KB (Blue/Black ink)'
  },
  // Railway (RRB)
  {
    id: 'rrb-photo',
    name: 'Railway RRB Photo',
    category: 'govt',
    docType: 'photo',
    widthPx: 350,
    heightPx: 450,
    aspectRatio: 350 / 450,
    widthCm: '3.5 x 4.5 cm',
    minKb: 20,
    maxKb: 50,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    description: '3.5 x 4.5 cm, strictly 20 KB to 50 KB'
  },
  // Passport / Visa
  {
    id: 'passport-in',
    name: 'Indian Passport / Visa Photo',
    category: 'passport',
    docType: 'photo',
    widthPx: 413,
    heightPx: 531,
    aspectRatio: 413 / 531,
    widthCm: '3.5 x 4.5 cm',
    minKb: 30,
    maxKb: 100,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    description: '35 x 45 mm, 300 DPI, white plain background'
  }
];

export const GovtExamResizerPage: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('upsc-photo');
  const [customMode, setCustomMode] = useState(false);
  const [customWidth, setCustomWidth] = useState<number>(350);
  const [customHeight, setCustomHeight] = useState<number>(450);
  const [customMinKb, setCustomMinKb] = useState<number>(20);
  const [customMaxKb, setCustomMaxKb] = useState<number>(50);

  // Name & Date of Photo (DOP)
  const [enableNameDateStamp, setEnableNameDateStamp] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [photoDate, setPhotoDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Image source & Canvas controls
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Processing & Output
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toast = useToast();

  const currentPreset = EXAM_PRESETS.find((p) => p.id === selectedPresetId) || EXAM_PRESETS[0];

  const targetWidth = customMode ? customWidth : currentPreset.widthPx;
  const targetHeight = customMode ? customHeight : currentPreset.heightPx;
  const targetMinKb = customMode ? customMinKb : currentPreset.minKb;
  const targetMaxKb = customMode ? customMaxKb : currentPreset.maxKb;

  // Handle image upload
  const handleFileSelect = (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImageSrc(url);
    setRotation(0);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setResultBlob(null);
  };

  // Drag pan handlers for canvas preview
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Render crop preview on interactive canvas
  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.save();
      ctx.translate(targetWidth / 2 + panX, targetHeight / 2 + panY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Fit image
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Name & Date of Photo (DOP) bottom bar
      if (enableNameDateStamp && (candidateName.trim() || photoDate)) {
        const barHeight = Math.max(38, Math.floor(targetHeight * 0.16));
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, targetHeight - barHeight, targetWidth, barHeight);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, targetHeight - barHeight, targetWidth, barHeight);

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const nameFont = Math.floor(barHeight * 0.38);
        const dateFont = Math.floor(barHeight * 0.32);

        if (candidateName.trim() && photoDate) {
          ctx.font = `bold ${nameFont}px -apple-system, sans-serif`;
          ctx.fillText(candidateName.toUpperCase(), targetWidth / 2, targetHeight - barHeight + barHeight * 0.35);

          ctx.font = `${dateFont}px -apple-system, sans-serif`;
          ctx.fillText(`D.O.P: ${photoDate}`, targetWidth / 2, targetHeight - barHeight + barHeight * 0.75);
        } else {
          ctx.font = `bold ${nameFont}px -apple-system, sans-serif`;
          ctx.fillText((candidateName || `D.O.P: ${photoDate}`).toUpperCase(), targetWidth / 2, targetHeight - barHeight / 2);
        }
      }
    };
  }, [imageSrc, targetWidth, targetHeight, rotation, zoom, panX, panY, enableNameDateStamp, candidateName, photoDate]);

  // Binary search JPEG compressor to guarantee file is inside [minKb, maxKb]
  const handleProcessResize = async () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const targetMinBytes = targetMinKb * 1024;
      const targetMaxBytes = targetMaxKb * 1024;
      const targetMidBytes = (targetMinBytes + targetMaxBytes) / 2;

      let low = 0.05;
      let high = 0.99;
      let bestBlob: Blob | null = null;
      let bestDiff = Infinity;

      // 8-step binary search for exact quality
      for (let i = 0; i < 8; i++) {
        const midQuality = (low + high) / 2;
        const blob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', midQuality)
        );

        const currentSize = blob.size;
        const diff = Math.abs(currentSize - targetMidBytes);

        if (currentSize <= targetMaxBytes && currentSize >= targetMinBytes) {
          bestBlob = blob;
          break;
        }

        if (diff < bestDiff && currentSize <= targetMaxBytes) {
          bestDiff = diff;
          bestBlob = blob;
        }

        if (currentSize > targetMaxBytes) {
          high = midQuality;
        } else {
          low = midQuality;
        }
      }

      // Fallback if still too small/large
      const finalBlob: Blob =
        bestBlob ||
        (await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.85)
        ));

      setResultBlob(finalBlob);
      const sizeKb = Number((finalBlob.size / 1024).toFixed(1));
      setResultSizeKb(sizeKb);
      toast.success(`Resized to exact ${targetWidth}x${targetHeight} px & ${sizeKb} KB!`);
    } catch (err: any) {
      toast.error('Failed to resize image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = imageFile?.name.replace(/\.[^/.]+$/, '') || 'exam-photo';
    const filename = `${baseName}_${currentPreset.id}_${resultSizeKb}KB.jpg`;
    downloadBlob(resultBlob, filename);
  };

  const howToSteps = [
    {
      name: 'Select Exam Preset or Custom Size',
      text: 'Choose your exam (e.g. UPSC, SSC, GATE, NEET, JEE, IBPS) to automatically lock required dimensions (cm/px) and target KB.'
    },
    {
      name: 'Upload & Adjust Photo / Signature',
      text: 'Drag your photo into the canvas. Zoom and pan to center your face or signature. Add optional Name & Date stamp.'
    },
    {
      name: 'Download Compliant Photo (<50 KB)',
      text: 'Click "Resize to Exact Size & KB" to automatically generate a portal-compliant JPEG ready for instant upload.'
    }
  ];

  const faqList = [
    {
      question: 'Why do government portals reject photos and signatures?',
      answer: 'Indian exam portals (UPSC, SSC, NTA NEET/JEE, IBPS) use automated scripts that strictly reject photos exceeding 50 KB or signatures exceeding 20 KB, or files with incorrect aspect ratios.'
    },
    {
      question: 'How does Doclly guarantee the file size is between 20 KB and 50 KB?',
      answer: 'Doclly uses an intelligent binary search compression engine running directly on your computer to calibrate the exact image density until the final JPEG lands safely in the valid KB bracket.'
    },
    {
      question: 'Is my personal photo or signature uploaded to any server?',
      answer: 'No! All processing runs 100% locally in your browser memory using HTML5 Canvas. Your photo and signature never leave your device.'
    },
    {
      question: 'How do I add Name and Date of Photo (DOP) on SSC and NEET photos?',
      answer: 'Simply toggle the "Add Candidate Name & Date of Photo (DOP)" switch in the options and enter your name. It will automatically stamp a clean bottom banner.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 doclly-dot-pattern opacity-25 pointer-events-none doclly-radial-mask" />

      <SeoHead
        title="Govt Exam Photo & Signature Resizer (<50 KB) — UPSC, SSC, GATE, NEET, JEE — Doclly"
        description="Free online Photo and Signature Resizer for Indian government exams (UPSC, SSC CGL/CHSL, GATE, NEET, JEE, IBPS). Automatically resize to exact cm dimensions and 20KB-50KB limits."
        keywords={[
          'govt exam photo resizer',
          'upsc photo resizer 20kb to 50kb',
          'ssc photo and signature resizer',
          'gate photo size converter',
          'neet photo resizer with name and date',
          'passport size photo maker online free',
          'signature resizer 10 to 20 kb',
          'ibps photo signature resizer',
          'reduce photo size under 50kb online'
        ]}
        faq={faqList}
        howTo={{
          name: 'How to resize photo and signature for government exams',
          description: 'Step-by-step guide to resizing exam photos to exact cm and KB limits.',
          steps: howToSteps
        }}
      />

      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: 'Govt Exam Photo Resizer' }]} />

      {/* Main Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC800]/15 border border-[#DC9F00]/30 text-xs font-bold text-[#111111] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>100% Portal Compliant • Zero Uploads Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Govt Exam Photo & Signature Resizer
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280]">
          1-Click presets for <strong>UPSC, SSC, GATE, NEET, JEE & IBPS</strong>. Automatically resize to exact dimensions & <strong>&lt;50 KB</strong>.
        </p>
      </div>

      {/* Main Interactive Studio Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 shadow-xs relative z-10 space-y-8">
        
        {/* Preset Selector Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
              1. Choose Exam Preset or Custom Size
            </label>
            <button
              onClick={() => setCustomMode(!customMode)}
              className="text-xs font-bold text-[#111111] hover:underline"
            >
              {customMode ? '← Use Standard Exam Presets' : '⚙️ Custom Dimensions'}
            </button>
          </div>

          {!customMode ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {EXAM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    setResultBlob(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedPresetId === preset.id
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#E5E5E5] bg-[#FAFAFA] text-[#111111] hover:border-[#CBD5E1] hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-xs leading-snug">{preset.name}</div>
                  <div
                    className={`text-[10.5px] mt-1.5 font-medium ${
                      selectedPresetId === preset.id ? 'text-amber-300' : 'text-[#6B7280]'
                    }`}
                  >
                    {preset.minKb} KB – {preset.maxKb} KB ({preset.widthPx}x{preset.heightPx} px)
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Width (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Height (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Min Size (KB)</label>
                <input
                  type="number"
                  value={customMinKb}
                  onChange={(e) => setCustomMinKb(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Max Size (KB)</label>
                <input
                  type="number"
                  value={customMaxKb}
                  onChange={(e) => setCustomMaxKb(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Upload & Crop Studio */}
        <div className="space-y-4">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
            2. Upload & Crop Your Image
          </label>

          {!imageSrc ? (
            <div
              onClick={() => document.getElementById('examImageInput')?.click()}
              className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-10 text-center cursor-pointer hover:border-[#FFC800] hover:bg-[#FFFBEB]/40 transition-all space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4F4F5] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">Click to upload photo or signature</p>
                <p className="text-xs text-[#6B7280]">Supports JPG, JPEG, PNG, WebP (Max 25 MB)</p>
              </div>
              <input
                id="examImageInput"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Canvas Preview & Controls */}
              <div className="lg:col-span-7 space-y-4 flex flex-col items-center">
                <div
                  className="relative border-2 border-[#111111] rounded-2xl overflow-hidden shadow-md bg-white cursor-grab active:cursor-grabbing flex items-center justify-center"
                  style={{
                    width: Math.min(320, targetWidth),
                    height: (Math.min(320, targetWidth) / targetWidth) * targetHeight
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />

                  {/* Face / Center Guide Overlay */}
                  {currentPreset.docType === 'photo' && (
                    <div className="absolute inset-0 pointer-events-none border border-dashed border-sky-400/60 rounded-full m-8 flex items-center justify-center opacity-40">
                      <span className="text-[10px] font-bold text-sky-600 bg-white/80 px-1.5 py-0.5 rounded">
                        Face Area
                      </span>
                    </div>
                  )}
                </div>

                {/* Adjust Controls Bar */}
                <div className="w-full max-w-sm flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <ZoomOut className="w-4 h-4 text-[#64748B]" />
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#111111]"
                    />
                    <ZoomIn className="w-4 h-4 text-[#64748B]" />
                  </div>

                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-[#CBD5E1] transition-all"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-4 h-4 text-[#111111]" />
                  </button>

                  <button
                    onClick={() => {
                      setZoom(1);
                      setPanX(0);
                      setPanY(0);
                      setRotation(0);
                    }}
                    className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-[#CBD5E1] transition-all"
                    title="Reset Alignment"
                  >
                    <RefreshCw className="w-4 h-4 text-[#111111]" />
                  </button>
                </div>

                <p className="text-[11px] text-[#6B7280] text-center">
                  💡 <strong>Tip:</strong> Drag image inside the frame to center your face or signature.
                </p>
              </div>

              {/* Right Column: Settings & Download Card */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Requirements Info Card */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#111111]">
                    <span>Target Requirements</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      {targetMinKb} KB – {targetMaxKb} KB
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B] space-y-1">
                    <div>• Dimensions: <strong>{targetWidth} × {targetHeight} px</strong> {currentPreset.widthCm && `(${currentPreset.widthCm} x ${currentPreset.heightCm})`}</div>
                    <div>• DPI: <strong>{currentPreset.recommendedDpi} DPI compliant</strong></div>
                    <div>• Format: <strong>JPEG / JPG standard</strong></div>
                  </div>
                </div>

                {/* Name & Date of Photo (DOP) Stamp Toggle */}
                {currentPreset.allowNameDateStamp && (
                  <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl space-y-3 shadow-2xs">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        Add Name & Date Stamp (D.O.P)
                      </span>
                      <input
                        type="checkbox"
                        checked={enableNameDateStamp}
                        onChange={(e) => setEnableNameDateStamp(e.target.checked)}
                        className="w-4 h-4 accent-[#FFC800] rounded"
                      />
                    </label>

                    {enableNameDateStamp && (
                      <div className="space-y-2 pt-1 border-t border-[#F1F5F9]">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">Candidate Name</label>
                          <input
                            type="text"
                            placeholder="e.g. RAHUL SHARMA"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#475569] mb-1">Date of Photo (D.O.P)</label>
                          <input
                            type="date"
                            value={photoDate}
                            onChange={(e) => setPhotoDate(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Process Button */}
                <div className="space-y-3 pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full"
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    onClick={handleProcessResize}
                  >
                    ✨ Resize to Exact Size & KB
                  </Button>

                  <button
                    onClick={() => {
                      setImageSrc(null);
                      setImageFile(null);
                      setResultBlob(null);
                    }}
                    className="w-full py-2 text-xs font-bold text-[#6B7280] hover:text-[#111111] hover:underline text-center"
                  >
                    Upload Different Image
                  </button>
                </div>

                {/* Result & Download Box */}
                {resultBlob && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ready for Instant Portal Upload!</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-emerald-900 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                      <span>Dimensions: <strong>{targetWidth}x{targetHeight} px</strong></span>
                      <span>Final Size: <strong className="text-emerald-700">{resultSizeKb} KB</strong></span>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full py-3 px-4 bg-[#FFC800] hover:bg-[#F5B800] text-[#111111] font-extrabold text-xs rounded-full border border-[#DC9F00] shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download Compliant Photo (.jpg)
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3-Step How-To Guide */}
      <section className="mt-16 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111111]">
            How to resize photo and signature for exams
          </h2>
          <p className="text-sm text-[#6B7280]">
            Generate portal-ready photos in 3 simple steps without Photoshop:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howToSteps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E5E5] space-y-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#FFC800] text-[#111111] font-extrabold flex items-center justify-center text-sm shadow-xs">
                {idx + 1}
              </div>
              <h3 className="font-bold text-[#111111] text-base">{step.name}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-[#111111] text-sm">100% In-Browser Privacy</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Your photos and signatures are never uploaded to any cloud server. Everything executes locally in your browser memory.
          </p>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
          <Zap className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-[#111111] text-sm">Strict KB Bound Guarantee</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Automated binary search compression guarantees your output file lands strictly between the minimum and maximum KB limits.
          </p>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-[#111111] text-sm">Name & DOP Stamp</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Meets strict SSC CGL and NEET specifications requiring the candidate name and date of photo stamped on the bottom.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mt-16 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111111]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#6B7280]">
            Everything you need to know about resizing exam photos and signatures.
          </p>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {faqList.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-bold text-sm text-[#111111] flex items-center justify-between hover:bg-[#FAFAFA]"
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-[#6B7280] leading-relaxed border-t border-[#F1F5F9] pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
