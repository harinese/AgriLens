import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import CropReport from '../components/CropReport';
import { SkeletonReport } from '../components/Skeletons';
import { analyzeCropImage } from '../services/geminiApi';

export default function ScannerPage() {
  const { saveScanResult } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageSelect = async (base64, mimeType, dataUrl) => {
    setIsProcessing(true);
    setError(null);
    setReport(null);
    setImageUrl(dataUrl);

    try {
      const result = await analyzeCropImage(base64, mimeType);
      setReport(result);

      // Save to farmer profile
      saveScanResult(result, dataUrl);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.message.includes('API')
          ? 'Could not connect to AI service. Please check your API key and try again.'
          : 'Failed to analyze the image. Please try again with a clearer photo.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setReport(null);
    setError(null);
    setImageUrl(null);
  };

  return (
    <div className="page-transition pb-24 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Crop Scanner</h1>
        <p className="text-sm text-stone-500 mt-1">
          Upload or capture a photo of your crop for AI-powered disease analysis
        </p>
      </div>

      {/* Upload Section */}
      {!report && (
        <div className="mb-6">
          <ImageUploader
            onImageSelect={handleImageSelect}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {/* Processing State */}
      {isProcessing && <SkeletonReport />}

      {/* Error State */}
      {error && (
        <div className="glass-card p-6 border border-danger-200 bg-danger-50/50 mb-4">
          <div className="flex items-start gap-3">
            <span className="status-dot status-dot-red mt-1.5" />
            <div>
              <h3 className="font-semibold text-danger-800 mb-1">Analysis Failed</h3>
              <p className="text-sm text-danger-700">{error}</p>
              <button
                onClick={resetScan}
                className="mt-3 text-sm font-medium text-danger-600 hover:text-danger-800 underline bg-transparent border-none cursor-pointer"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report */}
      {report && (
        <>
          <div className="mb-4">
            <button
              onClick={resetScan}
              className="text-sm font-medium text-forest-600 hover:text-forest-800 inline-flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M10 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Scan another crop
            </button>
          </div>
          <CropReport data={report} imageUrl={imageUrl} />
        </>
      )}

      {/* Tips Section (shown when idle) */}
      {!report && !isProcessing && !error && (
        <div className="mt-8">
          <h2 className="section-title mb-4">Tips for Best Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Good Lighting', desc: 'Take photos in natural daylight for accurate color detection' },
              { title: 'Close-Up Shots', desc: 'Capture affected leaves or stems up close for better analysis' },
              { title: 'Clear Focus', desc: 'Ensure the image is sharp and not blurry for precise identification' },
              { title: 'Show Symptoms', desc: 'Include discolored, spotted, or wilting areas in the frame' },
            ].map((tip) => (
              <div key={tip.title} className="glass-card glass-card-hover p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-forest-400" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-800 text-sm">{tip.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
