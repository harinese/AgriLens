export default function IrrigationDay({ plan, index }) {
  if (!plan) return null;

  const bgClass = plan.irrigation_needed
    ? plan.heat_stress_alert
      ? 'bg-gradient-to-br from-bronze-50 to-danger-50 border-bronze-300'
      : 'bg-gradient-to-br from-info-50 to-forest-50 border-info-200'
    : 'bg-gradient-to-br from-stone-50 to-white border-stone-200';

  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-stone-800 text-sm">
          Day {index + 1}
        </h4>
        <div className="flex items-center gap-1.5">
          {plan.heat_stress_alert && (
            <span className="badge badge-red text-[10px]">
              <span className="status-dot status-dot-red" /> Heat
            </span>
          )}
          {plan.irrigation_needed ? (
            <span className="badge badge-blue text-[10px]">
              <span className="status-dot" style={{ background: '#3B82F6' }} /> Water
            </span>
          ) : (
            <span className="badge bg-stone-100 text-stone-600 text-[10px]">Skip</span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-medium">Temp:</span>
          <span>{plan.temperature_max}°C max</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-medium">Rain:</span>
          <span>{plan.precipitation}mm</span>
        </div>

        {plan.irrigation_needed && (
          <>
            <div className="flex items-center gap-2 text-info-700 font-medium">
              <span>Water:</span>
              <span>{plan.water_amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium">When:</span>
              <span className="capitalize">{plan.best_time}</span>
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <span className={`status-dot ${plan.pesticide_spray_ok ? 'status-dot-green' : 'status-dot-red'}`} />
          <span className={plan.pesticide_spray_ok ? 'text-forest-700' : 'text-danger-600'}>
            {plan.pesticide_spray_ok ? 'Spray OK' : 'No spray'}
          </span>
        </div>
        {plan.spray_note && (
          <p className="text-[11px] text-stone-500 italic pl-3">{plan.spray_note}</p>
        )}
      </div>

      {plan.warnings?.length > 0 && (
        <div className="mt-3 space-y-1">
          {plan.warnings.map((w, i) => (
            <div key={i} className="bg-bronze-100/80 text-bronze-800 text-[11px] px-2 py-1 rounded-lg">
              {w}
            </div>
          ))}
        </div>
      )}

      {plan.heat_stress_note && (
        <div className="mt-2 bg-danger-50 text-danger-700 text-[11px] px-2 py-1 rounded-lg">
          {plan.heat_stress_note}
        </div>
      )}
    </div>
  );
}
