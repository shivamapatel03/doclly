import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Pen, Type, Upload, Eraser, Check } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (signatureDataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  
  // Draw State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Type State
  const [typedName, setTypedName] = useState('John Doe');
  const [selectedFont, setSelectedFont] = useState<'cursive1' | 'cursive2' | 'cursive3'>('cursive1');

  // Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Initialize Canvas
  useEffect(() => {
    if (isOpen && activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleSave = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        onSaveSignature(canvas.toDataURL('image/png'));
        onClose();
      }
    } else if (activeTab === 'type') {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111111';
        let fontStyle = 'italic 48px "Brush Script MT", cursive, sans-serif';
        if (selectedFont === 'cursive2') fontStyle = 'italic 42px "Lucida Handwriting", cursive, sans-serif';
        if (selectedFont === 'cursive3') fontStyle = 'italic 46px "Segoe Script", cursive, sans-serif';
        
        ctx.font = fontStyle;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName || 'Signature', 200, 60);
        onSaveSignature(canvas.toDataURL('image/png'));
        onClose();
      }
    } else if (activeTab === 'upload') {
      if (uploadedImage) {
        onSaveSignature(uploadedImage);
        onClose();
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Signature"
      description="Draw, type, or upload your electronic signature."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Mode Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'draw'
                ? 'bg-[#FFC800] text-[#111111] border border-[#E5E5E5] shadow-2xs'
                : 'text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5]'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
            Draw
          </button>
          <button
            onClick={() => setActiveTab('type')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'type'
                ? 'bg-[#FFC800] text-[#111111] border border-[#E5E5E5] shadow-2xs'
                : 'text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'upload'
                ? 'bg-[#FFC800] text-[#111111] border border-[#E5E5E5] shadow-2xs'
                : 'text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Image
          </button>
        </div>

        {/* Tab 1: Draw Canvas */}
        {activeTab === 'draw' && (
          <div className="space-y-3">
            <div className="relative border border-[#E5E5E5] rounded-xl bg-[#F5F5F5] overflow-hidden">
              <canvas
                ref={canvasRef}
                width={460}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 cursor-crosshair touch-none bg-white"
              />
              <div className="absolute bottom-2 left-3 pointer-events-none text-[11px] text-gray-400">
                Sign on the line above
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600"
              >
                <Eraser className="w-3.5 h-3.5" /> Clear canvas
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Type Signature */}
        {activeTab === 'type' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Your Full Name</label>
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#6B7280]">Select Handwriting Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cursive1', font: 'font-serif italic', preview: 'Style 1' },
                  { id: 'cursive2', font: 'italic tracking-wider', preview: 'Style 2' },
                  { id: 'cursive3', font: 'font-mono italic font-bold', preview: 'Style 3' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedFont(s.id as any)}
                    className={`p-3 text-center border rounded-lg cursor-pointer transition-all ${
                      selectedFont === s.id
                        ? 'border-[#111111] bg-[#FFC800]/20 text-[#111111] font-semibold'
                        : 'border-[#E5E5E5] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <div className={`text-lg truncate ${s.font}`}>{typedName || 'Signature'}</div>
                    <span className="text-[10px] text-gray-400">{s.preview}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Upload Image */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <div className="p-6 border-2 border-dashed border-[#E5E5E5] rounded-xl text-center bg-[#F5F5F5]">
              {uploadedImage ? (
                <div className="space-y-3">
                  <img
                    src={uploadedImage}
                    alt="Signature"
                    className="max-h-24 mx-auto object-contain bg-white p-2 border border-[#E5E5E5] rounded"
                  />
                  <label className="inline-block text-xs font-bold text-[#111111] hover:underline cursor-pointer">
                    Change image
                    <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-2">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                  <p className="text-xs font-semibold text-[#111111]">Upload signature image (PNG, JPG)</p>
                  <p className="text-[11px] text-[#6B7280]">Transparent background recommended</p>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Check className="w-4 h-4" />}
            onClick={handleSave}
            disabled={
              (activeTab === 'draw' && !hasDrawn) ||
              (activeTab === 'type' && !typedName.trim()) ||
              (activeTab === 'upload' && !uploadedImage)
            }
          >
            Apply Signature
          </Button>
        </div>
      </div>
    </Modal>
  );
};
