import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWeatherForecast, getLocation } from '../services/weatherApi';
import { generateIrrigationPlan } from '../services/geminiApi';
import WeatherCard from '../components/WeatherCard';
import IrrigationDay from '../components/IrrigationDay';
import { SkeletonWeather } from '../components/Skeletons';

export default function WeatherPage() {
  const { farmer } = useAuth();
  const [weather, setWeather] = useState(null);
  const [irrigationPlan, setIrrigationPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [cropName, setCropName] = useState('');
  const [location, setLocationData] = useState(null);

  useEffect(() => {
    // Auto-populate from farmer's profile
    const profileCrop = farmer?.currentCrop?.name;
    if (profileCrop) {
      setCropName(profileCrop);
    }
    loadWeather();
  }, [farmer]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await getLocation();
      setLocationData(loc);
      const data = await getWeatherForecast(loc.latitude, loc.longitude);
      setWeather(data);
    } catch (err) {
      setError(
        err.code === 1
          ? 'Location access denied. Please enable location services to get weather data.'
          : 'Failed to fetch weather data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!cropName.trim()) {
      alert('Please enter a crop name to generate an irrigation plan.');
      return;
    }
    if (!weather) {
      alert('Weather data is required. Please wait for it to load.');
      return;
    }

    setPlanLoading(true);
    setPlanError(null);
    setIrrigationPlan(null);

    const weatherData = {
      location: {
        latitude: location?.latitude,
        longitude: location?.longitude,
        timezone: weather.timezone,
      },
      daily: weather.daily?.time?.map((date, i) => ({
        date,
        temperature_max: weather.daily.temperature_2m_max?.[i],
        temperature_min: weather.daily.temperature_2m_min?.[i],
        precipitation: weather.daily.precipitation_sum?.[i],
        wind_speed_max: weather.daily.windspeed_10m_max?.[i],
        uv_index_max: weather.daily.uv_index_max?.[i],
        humidity_mean: weather.daily.relative_humidity_2m_mean?.[i],
      }))
    };

    try {
      const plan = await generateIrrigationPlan(cropName, weatherData);
      setIrrigationPlan(plan);
    } catch (err) {
      setPlanError('Failed to generate irrigation plan. Please check your API key and try again.');
    } finally {
      setPlanLoading(false);
    }
  };

  const days = weather?.daily?.time?.map((date, i) => ({
    date,
    temp_max: weather.daily.temperature_2m_max?.[i],
    temp_min: weather.daily.temperature_2m_min?.[i],
    precipitation: weather.daily.precipitation_sum?.[i] || 0,
    wind_speed: weather.daily.windspeed_10m_max?.[i],
    uv_index: weather.daily.uv_index_max?.[i],
    humidity: weather.daily.relative_humidity_2m_mean?.[i],
  })) || [];

  return (
    <div className="page-transition pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Weather & Irrigation Planner</h1>
        <p className="text-sm text-stone-500 mt-1">
          7-day forecast with AI-powered irrigation scheduling
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-card p-6 border border-bronze-200 bg-bronze-50/50 mb-6">
          <div className="flex items-start gap-3">
            <span className="status-dot status-dot-yellow mt-1.5" />
            <div>
              <h3 className="font-semibold text-bronze-800 mb-1">Location Required</h3>
              <p className="text-sm text-bronze-700">{error}</p>
              <button onClick={loadWeather} className="mt-3 btn-primary text-sm py-2 px-4">
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <SkeletonWeather />}

      {!loading && weather && (
        <>
          {/* Current Weather Summary */}
          {weather.current && (
            <div className="glass-card p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-info-50 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-info-500" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-stone-800">
                      {Math.round(weather.current.temperature_2m)}°C
                    </p>
                    <p className="text-sm text-stone-500">
                      Humidity: {weather.current.relative_humidity_2m}%
                    </p>
                  </div>
                </div>
                <div className="text-sm text-stone-500">
                  <p>{location?.latitude?.toFixed(2)}°, {location?.longitude?.toFixed(2)}°</p>
                  <p className="text-xs text-stone-400">{weather.timezone}</p>
                </div>
              </div>
            </div>
          )}

          {/* 7-Day Forecast */}
          <div className="mb-8">
            <h2 className="section-title mb-4">7-Day Forecast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {days.map((day, i) => (
                <WeatherCard key={day.date} day={day} isToday={i === 0} />
              ))}
            </div>
          </div>

          {/* Irrigation Planner */}
          <div className="glass-card p-6 mb-6">
            <h2 className="section-title mb-4">Generate Irrigation Plan</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="crop-name-input" className="block text-xs text-stone-500 mb-1.5 font-medium">
                  Crop Name
                </label>
                <input
                  id="crop-name-input"
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g., Tomato, Rice, Wheat..."
                  className="input-field"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGeneratePlan}
                  disabled={planLoading}
                  className="btn-primary text-sm py-3 px-6 whitespace-nowrap"
                >
                  {planLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Plan'
                  )}
                </button>
              </div>
            </div>
          </div>

          {planError && (
            <div className="glass-card p-4 border border-danger-200 bg-danger-50/50 mb-6">
              <p className="text-sm text-danger-700 flex items-center gap-2">
                <span className="status-dot status-dot-red" /> {planError}
              </p>
            </div>
          )}

          {planLoading && (
            <div className="glass-card p-8 mb-6">
              <div className="text-center">
                <div className="inline-block w-10 h-10 border-3 border-forest-200 border-t-forest-600 rounded-full animate-spin mb-3" />
                <p className="text-sm text-stone-600">Generating your irrigation schedule...</p>
              </div>
            </div>
          )}

          {irrigationPlan && (
            <div className="page-transition">
              {irrigationPlan.weekly_summary && (
                <div className="glass-card p-6 mb-6 gradient-subtle border border-forest-200">
                  <h3 className="font-semibold text-stone-800 mb-2">Weekly Summary</h3>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {irrigationPlan.weekly_summary}
                  </p>
                </div>
              )}

              <h3 className="section-title mb-4">Daily Irrigation Schedule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {irrigationPlan.daily_plan?.map((day, i) => (
                  <IrrigationDay key={i} plan={day} index={i} />
                ))}
              </div>

              {irrigationPlan.recommended_pesticides?.length > 0 && (
                <div className="glass-card p-6 mb-6">
                  <h3 className="font-semibold text-stone-800 mb-4">Recommended Pesticides for this Weather</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {irrigationPlan.recommended_pesticides.map((pest, i) => (
                      <div key={i} className="bg-white/60 rounded-xl p-4 border border-stone-200">
                        <h4 className="font-semibold text-forest-700 text-sm mb-1">{pest.name}</h4>
                        <div className="text-xs text-stone-600 space-y-1">
                          <p><span className="font-medium">Why needed:</span> {pest.purpose}</p>
                          <p><span className="font-medium">Dosage:</span> <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">{pest.dosage}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {irrigationPlan.general_irrigation_tips?.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-stone-800 mb-3">Irrigation Tips</h3>
                  <div className="space-y-2">
                    {irrigationPlan.general_irrigation_tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-stone-700">
                        <span className="text-forest-500 mt-0.5 font-bold">›</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
