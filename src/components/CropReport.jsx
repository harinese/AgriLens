import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function UrgencyBadge({ level }) {
  const config = {
    'act now': { className: 'badge-red', dot: 'status-dot-red' },
    'monitor': { className: 'badge-yellow', dot: 'status-dot-yellow' },
    'routine': { className: 'badge-green', dot: 'status-dot-green' },
  };
  const c = config[level?.toLowerCase()] || config['routine'];
  return (
    <span className={`badge ${c.className}`}>
      <span className={`status-dot ${c.dot}`} />
      {level}
    </span>
  );
}

function SeverityBadge({ severity }) {
  const config = {
    'severe': 'badge-red',
    'moderate': 'badge-yellow',
    'mild': 'badge-yellow',
    'none': 'badge-green',
  };
  return (
    <span className={`badge ${config[severity?.toLowerCase()] || 'badge-green'}`}>
      {severity}
    </span>
  );
}

function PesticideCard({ pesticide }) {
  return (
    <div className="bg-white/60 rounded-xl p-4 border border-stone-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-200">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-stone-800 text-sm">{pesticide.name}</h4>
        {pesticide.is_toxic && (
          <span className="bg-danger-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Toxic
          </span>
        )}
      </div>
      <div className="space-y-1.5 text-xs text-stone-600">
        <div className="flex items-start gap-2">
          <span className="text-forest-600 font-medium min-w-[70px]">Type:</span>
          <span className="capitalize">{pesticide.type}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-forest-600 font-medium min-w-[70px]">Dosage:</span>
          <span className="font-mono bg-forest-50 px-1.5 py-0.5 rounded">{pesticide.dosage}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-forest-600 font-medium min-w-[70px]">Apply:</span>
          <span>{pesticide.application_method}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-forest-600 font-medium min-w-[70px]">Frequency:</span>
          <span>{pesticide.frequency}</span>
        </div>
        {pesticide.precautions && (
          <div className="mt-2 p-2 bg-bronze-50 rounded-lg border border-bronze-200">
            <span className="text-bronze-700 text-[11px]">Warning: {pesticide.precautions}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CropReport({ data, imageUrl }) {
  const reportRef = useRef(null);

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#FAFAF9',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `agrilens-report-${data.crop_name || 'crop'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#FAFAF9',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`agrilens-report-${data.crop_name || 'crop'}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AgriLens Report: ${data.crop_name}`,
          text: `Crop: ${data.crop_name}\nDisease: ${data.disease_detected}\nUrgency: ${data.urgency_level}\n\nAnalyzed by AgriLens`,
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share error:', err);
      }
    } else {
      const text = `AgriLens Report\nCrop: ${data.crop_name}\nDisease: ${data.disease_detected}\nSeverity: ${data.disease_severity}\nUrgency: ${data.urgency_level}`;
      navigator.clipboard.writeText(text);
      alert('Report summary copied to clipboard!');
    }
  };

  if (!data) return null;

  return (
    <div className="page-transition">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={handleDownloadImage} className="btn-secondary text-xs py-2 px-3">
          Save as Image
        </button>
        <button onClick={handleDownloadPDF} className="btn-secondary text-xs py-2 px-3">
          Download PDF
        </button>
        <button onClick={handleShare} className="btn-secondary text-xs py-2 px-3">
          Share
        </button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-4">
        {/* Header Card */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {imageUrl && (
              <img src={imageUrl} alt="Scanned crop" className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-sm" />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-stone-900">{data.crop_name}</h2>
                <UrgencyBadge level={data.urgency_level} />
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-blue">{data.crop_age_estimate}</span>
                <SeverityBadge severity={data.disease_severity} />
              </div>
              <p className="text-sm text-stone-600">{data.disease_description}</p>
            </div>
          </div>
        </div>

        {/* Disease & Treatment */}
        {data.disease_detected?.toLowerCase() !== 'healthy' && (
          <div className="glass-card p-6">
            <h3 className="section-title mb-4 flex items-center gap-2">
              Disease Detected:
              <span className={data.disease_severity === 'severe' ? 'text-danger-600' : 'text-bronze-600'}>
                {data.disease_detected}
              </span>
            </h3>

            <div className="mb-4">
              <h4 className="font-semibold text-stone-700 mb-2 text-sm">Treatment Plan</h4>
              <div className="space-y-2">
                {data.treatment_plan?.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-forest-50/50 p-3 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary text-white text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-stone-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pesticides */}
        {data.recommended_pesticides?.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="section-title mb-4">Recommended Pesticides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.recommended_pesticides.map((p, i) => (
                <PesticideCard key={i} pesticide={p} />
              ))}
            </div>
          </div>
        )}

        {/* Organic Alternatives */}
        {data.organic_alternatives?.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="section-title mb-3">Organic Alternatives</h3>
            <div className="space-y-2">
              {data.organic_alternatives.map((alt, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-stone-700">
                  <span className="text-forest-500 mt-0.5 font-bold">›</span>
                  <span>{alt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fertilizer Suggestions */}
        {data.fertilizer_suggestions && (
          <div className="glass-card p-6">
            <h3 className="section-title mb-3">Fertilizer Suggestions</h3>
            <p className="text-sm text-stone-700 leading-relaxed">{data.fertilizer_suggestions}</p>
          </div>
        )}

        {/* General Tips */}
        {data.general_crop_tips?.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="section-title mb-3">Crop Care Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.general_crop_tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-stone-50 p-3 rounded-lg text-sm text-stone-700">
                  <span className="text-forest-500 font-bold">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-stone-400 py-2">
          Analyzed by AgriLens AI — {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
