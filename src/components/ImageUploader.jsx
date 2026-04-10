import { useRef, useState, useCallback } from 'react';

export default function ImageUploader({ onImageSelect, isProcessing }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      const mimeType = file.type;
      onImageSelect(base64, mimeType, dataUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-forest-400 bg-forest-50 scale-[1.01]'
              : 'border-stone-300 bg-white/50 hover:border-forest-300 hover:bg-forest-50/30'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-50 to-forest-100">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-forest-500" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          </div>
          <h3 className="text-base font-semibold text-stone-800 mb-1">
            Drop your crop photo here
          </h3>
          <p className="text-sm text-stone-400 mb-6">
            or click to browse — supports JPEG, PNG, WebP
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="btn-primary text-sm"
            >
              Upload Photo
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="btn-secondary text-sm"
            >
              Take Photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="crop-file-upload"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            id="crop-camera-capture"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img src={preview} alt="Crop preview" className="w-full max-h-80 object-cover" />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center text-white">
                  <div className="inline-block w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin-slow mb-3" />
                  <p className="font-medium text-sm">Analyzing your crop...</p>
                  <p className="text-xs text-white/60 mt-1">This may take a few seconds</p>
                </div>
              </div>
            )}
          </div>
          {!isProcessing && (
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-stone-600 shadow-md transition-all duration-200 hover:scale-110 border-none cursor-pointer text-sm"
              title="Remove image"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
