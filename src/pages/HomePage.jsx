import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWeatherForecast, getWeatherDescription, getCurrentSeason, getLocation } from '../services/weatherApi';
import NewsCarousel from '../components/NewsCarousel';
import { SkeletonCard } from '../components/Skeletons';

const farmingTips = [
  "Water early morning to reduce evaporation losses by up to 25%.",
  "Rotate crops each season to maintain soil health and reduce pest buildup.",
  "Test your soil pH every season — most crops prefer 6.0–7.0.",
  "Mulch around plants to retain moisture and suppress weeds naturally.",
  "Plant companion crops like marigolds to naturally repel harmful insects.",
  "Apply neem oil spray weekly as a preventive organic pest measure.",
  "Prune dead leaves regularly to improve air circulation and prevent fungal diseases.",
  "Add compost to improve soil structure and provide slow-release nutrients.",
];

export default function HomePage() {
  const { farmer } = useAuth();
  const [weather, setWeather] = useState(null);
  const [season, setSeason] = useState('');
  const [tipOfDay, setTipOfDay] = useState('');
  const [loadingWeather, setLoadingWeather] = useState(true);

  const currentCrop = farmer?.currentCrop;

  useEffect(() => {
    const dayIndex = new Date().getDate() % farmingTips.length;
    setTipOfDay(farmingTips[dayIndex]);

    getLocation()
      .then(({ latitude, longitude }) => {
        setSeason(getCurrentSeason(latitude));
        return getWeatherForecast(latitude, longitude);
      })
      .then(data => setWeather(data))
      .catch(() => setSeason(getCurrentSeason(20)))
      .finally(() => setLoadingWeather(false));
  }, []);

  const currentWeather = weather?.current;
  const weatherInfo = currentWeather
    ? getWeatherDescription(currentWeather.weathercode)
    : null;

  return (
    <div className="page-transition pb-24 md:pb-8">
      {/* Personalized Greeting */}
      <section className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
          Welcome back, {farmer?.name?.split(' ')[0] || 'Farmer'}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Here's your farm overview for today
        </p>
      </section>

      {/* News Carousel */}
      <section className="mb-6">
        <NewsCarousel />
      </section>

      {/* My Crop Summary (if crop exists) */}
      {currentCrop && (
        <section className="mb-6">
          <Link to="/my-crop" className="block no-underline">
            <div className="glass-card glass-card-hover p-5 border-l-4 border-l-forest-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 mb-1">Current Crop</p>
                  <h3 className="text-lg font-bold text-stone-800">{currentCrop.name}</h3>
                  {currentCrop.lastScan && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`status-dot ${
                        currentCrop.lastScan.urgency_level?.toLowerCase() === 'act now' ? 'status-dot-red' :
                        currentCrop.lastScan.urgency_level?.toLowerCase() === 'monitor' ? 'status-dot-yellow' : 'status-dot-green'
                      }`} />
                      <span className="text-xs text-stone-500">
                        {currentCrop.lastScan.disease_detected === 'Healthy' ? 'Healthy' : currentCrop.lastScan.disease_detected}
                      </span>
                    </div>
                  )}
                </div>
                <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-stone-400" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Quick Stats Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {/* Weather */}
        <div className="glass-card glass-card-hover p-4 flex items-center gap-3">
          {loadingWeather ? (
            <div className="flex-1">
              <div className="skeleton h-4 w-2/3 mb-2" />
              <div className="skeleton h-6 w-1/2" />
            </div>
          ) : weatherInfo ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-info-50 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-info-500" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Today's Weather</p>
                <p className="text-lg font-bold text-stone-800">
                  {Math.round(currentWeather.temperature_2m)}°C
                </p>
                <p className="text-xs text-stone-400">{weatherInfo.text}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-stone-400" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Weather</p>
                <p className="text-sm text-stone-600">Enable location</p>
              </div>
            </>
          )}
        </div>

        {/* Season */}
        <div className="glass-card glass-card-hover p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-forest-500" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.8 0 3.5-.5 5-1.3" strokeLinecap="round"/>
              <path d="M12 6c-2 2-3 5-2 8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Current Season</p>
            <p className="text-lg font-bold text-stone-800">{season || 'Detecting...'}</p>
          </div>
        </div>

        {/* Tip of Day */}
        <div className="glass-card glass-card-hover p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bronze-50 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-bronze-500" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18h6M12 2v1M21 12h1M3 12H2M18.36 5.64l-.7.7M5.64 5.64l.7.7" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Tip of the Day</p>
            <p className="text-xs text-stone-700 leading-relaxed">{tipOfDay}</p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Crop Scanner',
            desc: 'AI-powered disease detection and treatment plans',
            link: '/scanner',
            color: 'forest',
          },
          {
            title: 'Weather Planner',
            desc: '7-day forecast with irrigation scheduling',
            link: '/weather',
            color: 'info',
          },
          {
            title: 'Encyclopedia',
            desc: 'Complete crop profiles and growing guides',
            link: '/encyclopedia',
            color: 'bronze',
          },
          {
            title: 'My Crop',
            desc: 'Your personalized crop dashboard and history',
            link: '/my-crop',
            color: 'forest',
          },
        ].map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="glass-card glass-card-hover p-5 no-underline text-inherit group"
          >
            <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-${card.color}-500`} />
            </div>
            <h3 className="font-semibold text-stone-800 text-sm mb-1">{card.title}</h3>
            <p className="text-xs text-stone-500">{card.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
