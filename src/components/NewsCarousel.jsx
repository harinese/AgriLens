import { useState, useEffect, useCallback } from 'react';
import { getAgricultureNews } from '../services/newsApi';

const trendingStories = [
  {
    title: 'Dragon Fruit Farmer Earns ₹2 Crore Annually Using Precision Agriculture',
    description: 'A Karnataka farmer transformed a barren 5-acre plot into a high-yield dragon fruit farm using drip irrigation and AI-based soil monitoring.',
    source: { name: 'AgriTrends' },
    tag: 'Success Story',
    image: 'https://images.unsplash.com/photo-1592982537447-6f2ae8c1c5bb?w=1200&q=80',
  },
  {
    title: 'New Drone Spraying Technology Reduces Pesticide Usage by 30%',
    description: 'Agricultural drones equipped with AI vision can now precisely target affected areas, reducing chemical usage while improving crop protection.',
    source: { name: 'TechFarm' },
    tag: 'Innovation',
    image: 'https://images.unsplash.com/photo-1563968743333-044cef8528f8?w=1200&q=80',
  },
  {
    title: 'Government Announces ₹10,000 Crore Package for Climate-Resilient Farming',
    description: 'The new initiative provides subsidized seeds, crop insurance, and training for farmers affected by unpredictable weather patterns.',
    source: { name: 'PolicyWatch' },
    tag: 'Policy',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80',
  },
  {
    title: 'Organic Farming Movement Grows: Premium Prices for Chemical-Free Produce',
    description: 'Urban demand for organic vegetables has doubled, creating an opportunity for farmers to earn 40-60% more through certified organic practices.',
    source: { name: 'MarketPulse' },
    tag: 'Market',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80',
  },
  {
    title: 'AI Soil Sensors Help Farmers Save 50% on Fertilizer Costs',
    description: 'Smart sensors that analyze soil nutrition in real-time are helping farmers apply the exact amount of fertilizer needed, reducing waste and costs.',
    source: { name: 'AgriTech' },
    tag: 'Technology',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad849?w=1200&q=80',
  },
];

const tagColors = {
  'Success Story': 'bg-forest-100 text-forest-700',
  'Innovation': 'bg-info-100 text-info-600',
  'Policy': 'bg-bronze-100 text-bronze-700',
  'Market': 'bg-forest-50 text-forest-600',
  'Technology': 'bg-info-50 text-info-600',
};

export default function NewsCarousel() {
  const [stories, setStories] = useState(trendingStories);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch live news and merge with trending
  useEffect(() => {
    getAgricultureNews().then(articles => {
      if (articles?.length > 0) {
        const liveStories = articles.slice(0, 5).map(a => ({
          title: a.title,
          description: a.description,
          source: a.source,
          url: a.url,
          image: a.image,
          tag: 'Live News',
        }));
        setStories([...trendingStories, ...liveStories]);
      }
    }).catch(() => {});
  }, []);

  // Auto-play
  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % stories.length);
  }, [stories.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const story = stories[current];
  if (!story) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-forest-900 text-white min-h-[220px] md:min-h-[260px] shadow-lg"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image / Pattern */}
      <div className="carousel-enter absolute inset-0 transition-opacity duration-1000 ease-in-out" key={`bg-${current}`}>
        {story.image ? (
          <>
            <img src={story.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332] via-[#1B4332]/80 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900" />
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }} />
          </>
        )}
      </div>

      <div className="relative z-10 px-6 md:px-10 py-8 md:py-10 h-full flex flex-col justify-between">
        {/* Content */}
        <div className="carousel-enter" key={current}>
          <div className="flex items-center gap-3 mb-3">
            {story.tag && (
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                tagColors[story.tag] || 'bg-white/10 text-white/80'
              }`}>
                {story.tag}
              </span>
            )}
            {story.source?.name && (
              <span className="text-[11px] text-white/40">{story.source.name}</span>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-bold leading-snug mb-2 max-w-2xl">
            {story.url ? (
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-white no-underline hover:text-forest-200 transition-colors">
                {story.title}
              </a>
            ) : story.title}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed max-w-xl line-clamp-2">
            {story.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-5">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {stories.slice(0, 10).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`rounded-full transition-all duration-300 border-none cursor-pointer ${
                  i === current
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
            {stories.length > 10 && (
              <span className="text-[10px] text-white/30 ml-1">+{stories.length - 10}</span>
            )}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border-none cursor-pointer text-white"
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M10 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border-none cursor-pointer text-white"
              aria-label="Next slide"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
