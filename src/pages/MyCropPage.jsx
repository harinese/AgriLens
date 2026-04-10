import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ScanHistoryCard({ scan }) {
  const date = new Date(scan.date);
  const severityColor = {
    severe: 'status-dot-red',
    moderate: 'status-dot-yellow',
    mild: 'status-dot-yellow',
    none: 'status-dot-green',
  };

  return (
    <div className="glass-card glass-card-hover p-4">
      <div className="flex items-start gap-3">
        {scan.imageUrl && (
          <img src={scan.imageUrl} alt={scan.crop_name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-stone-800 truncate">{scan.crop_name}</h4>
            <span className={`status-dot ${severityColor[scan.disease_severity?.toLowerCase()] || 'status-dot-green'}`} />
          </div>
          <p className="text-xs text-stone-500 mb-1">
            {scan.disease_detected === 'Healthy' ? 'Healthy' : scan.disease_detected}
          </p>
          <p className="text-[11px] text-stone-400">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MyCropPage() {
  const { farmer } = useAuth();
  const currentCrop = farmer?.currentCrop;
  const lastScan = currentCrop?.lastScan;
  const scanHistory = farmer?.scanHistory || [];

  return (
    <div className="page-transition pb-24 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">My Crop</h1>
        <p className="text-sm text-stone-500 mt-1">
          Your current crop status and scan history
        </p>
      </div>

      {/* Current Crop Card */}
      {currentCrop ? (
        <div className="glass-card p-6 mb-6 border-l-4 border-l-forest-500">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {lastScan?.imageUrl && (
              <img
                src={lastScan.imageUrl}
                alt={currentCrop.name}
                className="w-full sm:w-28 h-28 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-stone-900">{currentCrop.name}</h2>
                {lastScan && (
                  <span className={`badge ${
                    lastScan.urgency_level?.toLowerCase() === 'act now' ? 'badge-red' :
                    lastScan.urgency_level?.toLowerCase() === 'monitor' ? 'badge-yellow' : 'badge-green'
                  }`}>
                    <span className={`status-dot ${
                      lastScan.urgency_level?.toLowerCase() === 'act now' ? 'status-dot-red' :
                      lastScan.urgency_level?.toLowerCase() === 'monitor' ? 'status-dot-yellow' : 'status-dot-green'
                    }`} />
                    {lastScan.urgency_level}
                  </span>
                )}
              </div>

              {lastScan && (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge badge-blue">{lastScan.crop_age_estimate}</span>
                    <span className={`badge ${lastScan.disease_severity === 'none' ? 'badge-green' : 'badge-yellow'}`}>
                      {lastScan.disease_detected === 'Healthy' ? 'Healthy' : lastScan.disease_detected}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 mb-3 line-clamp-2">{lastScan.disease_description}</p>
                </>
              )}

              <div className="flex flex-wrap gap-2">
                <Link to="/scanner" className="btn-primary text-xs py-2 px-4 no-underline">
                  Re-scan Crop
                </Link>
                <Link to="/weather" className="btn-secondary text-xs py-2 px-4 no-underline">
                  View Irrigation Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-10 text-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-subtle flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-forest-500" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.8 0 3.5-.5 5-1.3" strokeLinecap="round"/>
              <path d="M12 6c-2 2-3 5-2 8M14 4c1 3 1 6 0 9M8.5 7c3-1 6-.5 8 1" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">No crop scanned yet</h3>
          <p className="text-sm text-stone-500 mb-5">
            Scan your first crop to start tracking its health and get personalized care plans.
          </p>
          <Link to="/scanner" className="btn-primary no-underline">
            Scan Your First Crop
          </Link>
        </div>
      )}

      {/* Quick Access Cards */}
      {currentCrop && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {lastScan?.recommended_pesticides?.length > 0 && (
            <div className="glass-card glass-card-hover p-5">
              <p className="text-xs font-medium text-stone-500 mb-2">Recommended Pesticides</p>
              <p className="text-2xl font-bold text-stone-800">{lastScan.recommended_pesticides.length}</p>
              <p className="text-xs text-stone-500 mt-1">
                {lastScan.recommended_pesticides[0]?.name}
                {lastScan.recommended_pesticides.length > 1 && ` +${lastScan.recommended_pesticides.length - 1} more`}
              </p>
            </div>
          )}
          {lastScan?.organic_alternatives?.length > 0 && (
            <div className="glass-card glass-card-hover p-5">
              <p className="text-xs font-medium text-stone-500 mb-2">Organic Options</p>
              <p className="text-2xl font-bold text-stone-800">{lastScan.organic_alternatives.length}</p>
              <p className="text-xs text-stone-500 mt-1 truncate">{lastScan.organic_alternatives[0]}</p>
            </div>
          )}
          {lastScan?.general_crop_tips?.length > 0 && (
            <div className="glass-card glass-card-hover p-5">
              <p className="text-xs font-medium text-stone-500 mb-2">Care Tips Available</p>
              <p className="text-2xl font-bold text-stone-800">{lastScan.general_crop_tips.length}</p>
              <p className="text-xs text-stone-500 mt-1 truncate">{lastScan.general_crop_tips[0]}</p>
            </div>
          )}
        </div>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Scan History</h2>
          <div className="space-y-3">
            {scanHistory.map(scan => (
              <ScanHistoryCard key={scan.id} scan={scan} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
