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
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Calendar,
  User,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  Search
} from 'lucide-react';

interface ExamPreset {
  id: string;
  name: string;
  category: 'all' | 'govt' | 'entrance' | 'banking' | 'passport';
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
  tag: string;
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
    tag: '20-50 KB'
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
    tag: '10-20 KB'
  },
  // SSC
  {
    id: 'ssc-photo',
    name: 'SSC (CGL / CHSL / MTS) Photo',
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
    tag: '20-50 KB'
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
    tag: '10-20 KB'
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
    tag: '20-200 KB'
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
    tag: '5-200 KB'
  },
  // NEET
  {
    id: 'neet-photo',
    name: 'NEET UG / PG Photo',
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
    tag: '10-200 KB'
  },
  {
    id: 'neet-postcard',
    name: 'NEET Postcard (4x6 in)',
    category: 'entrance',
    docType: 'postcard',
    widthPx: 600,
    heightPx: 900,
    aspectRatio: 600 / 900,
    widthCm: '4 x 6 in',
    heightCm: '10 x 15 cm',
    minKb: 50,
    maxKb: 300,
    recommendedDpi: 300,
    allowNameDateStamp: true,
    tag: '50-300 KB'
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
    tag: '4-30 KB'
  },
  // JEE
  {
    id: 'jee-photo',
    name: 'JEE Main / Adv Photo',
    category: 'entrance',
    docType: 'photo',
    widthPx: 350,
    heightPx: 450,
    aspectRatio: 350 / 450,
    minKb: 10,
    maxKb: 200,
    recommendedDpi: 300,
    allowNameDateStamp: true,
    tag: '10-200 KB'
  },
  // Banking
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
    tag: '20-50 KB'
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
    tag: '10-20 KB'
  },
  {
    id: 'ibps-thumb',
    name: 'IBPS Thumb Impression',
    category: 'banking',
    docType: 'thumb',
    widthPx: 240,
    heightPx: 240,
    aspectRatio: 1,
    minKb: 20,
    maxKb: 50,
    recommendedDpi: 200,
    allowNameDateStamp: false,
    tag: '20-50 KB'
  },
  // Railway
  {
    id: 'rrb-photo',
    name: 'Railway RRB Photo',
    category: 'govt',
    docType: 'photo',
    widthPx: 350,
    heightPx: 450,
    aspectRatio: 350 / 450,
    minKb: 20,
    maxKb: 50,
    recommendedDpi: 300,
    allowNameDateStamp: false,
    tag: '20-50 KB'
  },
  // Passport
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
    tag: '30-100 KB'
  }
];

export const GovtExamResizerPage: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('upsc-photo');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [presetSearch, setPresetSearch] = useState('');
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

  // Filter Presets for Sidebar
  const filteredPresets = EXAM_PRESETS.filter((p) => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    if (!catMatch) return false;
    if (!presetSearch) return true;
    return p.name.toLowerCase().includes(presetSearch.toLowerCase()) || p.tag.toLowerCase().includes(presetSearch.toLowerCase());
  });

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

  // Binary search JPEG compressor
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
      name: 'Select Exam Preset in Sidebar',
      text: 'Choose your target exam (UPSC, SSC, GATE, NEET, JEE, IBPS) to automatically lock dimensions and KB limits.'
    },
    {
      name: 'Upload & Align in Studio',
      text: 'Drop photo or signature. Use zoom, rotate, and center guide. Add Name & Date of Photo (DOP) if required.'
    },
    {
      name: 'Download Compliant File (<50 KB)',
      text: 'Click "Resize to Exact Size & KB" to get your portal-compliant JPEG ready for instant upload.'
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
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

      {/* Main Clean Header */}
      <div className="text-center max-w-2xl mx-auto space-y-1 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Govt Exam Photo & Signature Resizer
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          1-Click presets for <strong>UPSC, SSC, GATE, NEET, JEE & IBPS</strong>. Exact dimensions & <strong>&lt;50 KB</strong>.
        </p>
      </div>

      {/* Main Studio Card: Two-Column Workspace Layout (No Vertical Scrolling) */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 sm:p-6 shadow-xs relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: PRESET SELECTOR SIDEBAR                      */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 border border-[#E5E5E5] rounded-2xl p-4 bg-[#FAFAFA] flex flex-col space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
              Exam Presets
            </span>
            <button
              onClick={() => setCustomMode(!customMode)}
              className="text-[11px] font-bold text-[#111111] hover:underline flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              {customMode ? 'Presets' : 'Custom'}
            </button>
          </div>

          {!customMode ? (
            <>
              {/* Category Filter Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'govt', label: 'Govt' },
                  { id: 'entrance', label: 'Entrance' },
                  { id: 'banking', label: 'Banking' },
                  { id: 'passport', label: 'Passport' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 text-[10.5px] font-bold rounded-full transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-[#111111] text-white shadow-2xs'
                        : 'bg-white border border-[#E5E5E5] text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search exam (UPSC, SSC, GATE)..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs outline-none focus:border-[#111111]"
                />
              </div>

              {/* Presets Vertical Scroll List */}
              <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                {filteredPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setResultBlob(null);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedPresetId === preset.id
                        ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                        : 'border-[#E5E5E5] bg-white text-[#111111] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs truncate">{preset.name}</div>
                      <div
                        className={`text-[10px] ${
                          selectedPresetId === preset.id ? 'text-zinc-300' : 'text-[#6B7280]'
                        }`}
                      >
                        {preset.widthPx}x{preset.heightPx} px {preset.widthCm && `(${preset.widthCm})`}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                        selectedPresetId === preset.id
                          ? 'bg-[#FFC800] text-[#111111]'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}
                    >
                      {preset.tag}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3 p-3 bg-white border border-[#E2E8F0] rounded-xl">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] mb-0.5">Width (px)</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] mb-0.5">Height (px)</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] mb-0.5">Min KB</label>
                  <input
                    type="number"
                    value={customMinKb}
                    onChange={(e) => setCustomMinKb(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] mb-0.5">Max KB</label>
                  <input
                    type="number"
                    value={customMaxKb}
                    onChange={(e) => setCustomMaxKb(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Current Target Specs Footer */}
          <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Target Bound:</span>
            <strong className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {targetMinKb} KB – {targetMaxKb} KB
            </strong>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: MAIN INTERACTIVE STUDIO & DOWNLOAD          */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {!imageSrc ? (
            <div
              onClick={() => document.getElementById('examImageInputMain')?.click()}
              className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-12 text-center cursor-pointer hover:border-[#FFC800] hover:bg-[#FFFBEB]/40 transition-all flex flex-col items-center justify-center space-y-3 min-h-[340px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F4F4F5] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">Click to upload photo or signature</p>
                <p className="text-xs text-[#6B7280]">Supports JPG, JPEG, PNG, WebP</p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Active Preset: {customMode ? 'Custom Dimensions' : currentPreset.name}
              </span>
              <input
                id="examImageInputMain"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Studio Canvas Area */}
              <div className="md:col-span-6 flex flex-col items-center space-y-3">
                <div
                  className="relative border-2 border-[#111111] rounded-2xl overflow-hidden shadow-md bg-white cursor-grab active:cursor-grabbing flex items-center justify-center"
                  style={{
                    width: Math.min(260, targetWidth),
                    height: (Math.min(260, targetWidth) / targetWidth) * targetHeight
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />

                  {/* Face Guide Overlay for Photos */}
                  {currentPreset.docType === 'photo' && (
                    <div className="absolute inset-0 pointer-events-none border border-dashed border-sky-400/60 rounded-full m-6 flex items-center justify-center opacity-40">
                      <span className="text-[9px] font-bold text-sky-600 bg-white/80 px-1 py-0.5 rounded">
                        Face
                      </span>
                    </div>
                  )}
                </div>

                {/* Compact Zoom & Rotate Toolbar */}
                <div className="w-full max-w-[260px] flex items-center justify-between gap-2 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 flex-1">
                    <ZoomOut className="w-3.5 h-3.5 text-[#64748B]" />
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#111111]"
                    />
                    <ZoomIn className="w-3.5 h-3.5 text-[#64748B]" />
                  </div>

                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1 hover:bg-white rounded border border-transparent hover:border-[#CBD5E1]"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#111111]" />
                  </button>

                  <button
                    onClick={() => {
                      setZoom(1);
                      setPanX(0);
                      setPanY(0);
                      setRotation(0);
                    }}
                    className="p-1 hover:bg-white rounded border border-transparent hover:border-[#CBD5E1]"
                    title="Reset Alignment"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#111111]" />
                  </button>
                </div>
              </div>

              {/* Studio Right Controls & Download Action */}
              <div className="md:col-span-6 space-y-4">
                
                {/* Active Preset Specs Banner */}
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#111111]">
                    <span>{customMode ? 'Custom Specs' : currentPreset.name}</span>
                    <span className="text-emerald-700">{targetMinKb} - {targetMaxKb} KB</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Output: <strong>{targetWidth}x{targetHeight} px</strong> ({currentPreset.recommendedDpi} DPI)
                  </div>
                </div>

                {/* Name & Date Stamp (DOP) */}
                {currentPreset.allowNameDateStamp && (
                  <div className="p-3 bg-white border border-[#E5E5E5] rounded-xl space-y-2 text-xs">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-[#111111] flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        Add Name & Date Stamp
                      </span>
                      <input
                        type="checkbox"
                        checked={enableNameDateStamp}
                        onChange={(e) => setEnableNameDateStamp(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#FFC800] rounded"
                      />
                    </label>

                    {enableNameDateStamp && (
                      <div className="space-y-1.5 pt-1.5 border-t border-[#F1F5F9]">
                        <input
                          type="text"
                          placeholder="Candidate Name (e.g. RAHUL SHARMA)"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded font-bold"
                        />
                        <input
                          type="date"
                          value={photoDate}
                          onChange={(e) => setPhotoDate(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Resize CTA Button */}
                <div className="space-y-2">
                  <Button
                    size="md"
                    variant="primary"
                    className="w-full py-3"
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
                    className="w-full text-[11px] font-bold text-[#6B7280] hover:text-[#111111] hover:underline text-center"
                  >
                    Change Image
                  </button>
                </div>

                {/* Result & Instant Download Box */}
                {resultBlob && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ready for Instant Upload!</span>
                    </div>

                    <div className="flex items-center justify-between text-[11.5px] text-emerald-900 bg-white/70 p-2 rounded-xl border border-emerald-100">
                      <span>{targetWidth}x{targetHeight} px</span>
                      <strong className="text-emerald-700">{resultSizeKb} KB (Compliant)</strong>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full py-2.5 px-3 bg-[#FFC800] hover:bg-[#F5B800] text-[#111111] font-extrabold text-xs rounded-full border border-[#DC9F00] shadow-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Compliant JPEG
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3-Step How-To Guide */}
      <section className="mt-14 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl font-extrabold text-[#111111]">
            How to resize photo and signature for exams
          </h2>
          <p className="text-xs text-[#6B7280]">
            Generate portal-ready photos in 3 simple steps without Photoshop:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {howToSteps.map((step, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-2 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-[#FFC800] text-[#111111] font-extrabold flex items-center justify-center text-xs shadow-xs">
                {idx + 1}
              </div>
              <h3 className="font-bold text-[#111111] text-sm">{step.name}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mt-14 space-y-5">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl font-extrabold text-[#111111]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#6B7280]">
            Everything you need to know about resizing exam photos and signatures.
          </p>
        </div>

        <div className="space-y-2.5 max-w-2xl mx-auto">
          {faqList.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-4 py-3 text-left font-bold text-xs sm:text-sm text-[#111111] flex items-center justify-between hover:bg-[#FAFAFA]"
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-3 text-xs text-[#6B7280] leading-relaxed border-t border-[#F1F5F9] pt-2.5">
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
