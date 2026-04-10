export default function WeatherCard({ day, isToday = false }) {
  const date = new Date(day.date);
  const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const precipLevel =
    day.precipitation > 10 ? 'heavy' :
    day.precipitation > 2 ? 'moderate' :
    day.precipitation > 0 ? 'light' : 'none';

  const precipColors = {
    heavy: 'text-info-600 bg-info-50',
    moderate: 'text-info-500 bg-info-50',
    light: 'text-info-400 bg-info-50/50',
    none: 'text-stone-400 bg-stone-50',
  };

  // SVG weather icons instead of emojis
  const getWeatherIcon = () => {
    if (day.precipitation > 5) return (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-info-500" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" strokeLinecap="round"/>
        <path d="M8 19v2M12 19v2M16 19v2" strokeLinecap="round"/>
      </svg>
    );
    if (day.precipitation > 0) return (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-info-400" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" strokeLinecap="round"/>
        <path d="M12 19v2" strokeLinecap="round"/>
      </svg>
    );
    if (day.temp_max > 35) return (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-danger-400" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round"/>
      </svg>
    );
    if (day.temp_max > 28) return (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-bronze-400" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" strokeLinecap="round"/>
      </svg>
    );
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-stone-400" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 10h-1.26A8 8 0 104 16.25" strokeLinecap="round"/>
        <circle cx="12" cy="8" r="3"/>
        <path d="M12 2v1M17 4l-.7.7M20 8h-1" strokeLinecap="round"/>
      </svg>
    );
  };

  return (
    <div className={`glass-card glass-card-hover p-4 text-center ${
      isToday ? 'ring-2 ring-forest-400 ring-offset-2' : ''
    }`}>
      <p className={`font-semibold text-sm ${isToday ? 'text-forest-600' : 'text-stone-700'}`}>
        {dayName}
      </p>
      <p className="text-xs text-stone-400 mb-2">{dateStr}</p>
      
      <div className="flex justify-center mb-2">
        {getWeatherIcon()}
      </div>

      <p className="text-lg font-bold text-stone-800">
        {Math.round(day.temp_max)}°
      </p>
      <p className="text-xs text-stone-400 mb-2">
        {day.temp_min !== undefined ? `${Math.round(day.temp_min)}°` : ''}
      </p>

      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${precipColors[precipLevel]}`}>
        {day.precipitation.toFixed(1)}mm
      </div>

      {day.wind_speed && (
        <p className="text-xs text-stone-400 mt-1">
          {Math.round(day.wind_speed)} km/h
        </p>
      )}
    </div>
  );
}
