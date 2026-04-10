import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [animationState, setAnimationState] = useState('start'); // start, drawing, text, exit

  useEffect(() => {
    // Sequence the animations
    const t1 = setTimeout(() => setAnimationState('drawing'), 100);
    const t2 = setTimeout(() => setAnimationState('text'), 1000);
    const t3 = setTimeout(() => setAnimationState('exit'), 2200);
    const t4 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-forest-900 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
      animationState === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="relative flex flex-col items-center">
        {/* Logo Icon Animation */}
        <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center transition-all duration-700 ease-out ${
          animationState === 'start' ? 'scale-50 opacity-0 bg-transparent' : 
          animationState === 'drawing' ? 'scale-100 opacity-100 bg-white/10' :
          'scale-100 opacity-100 bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" className={`w-10 h-10 text-white transition-all duration-700 ${
            animationState === 'start' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
          }`} stroke="currentColor" strokeWidth="1.5">
            <path 
              strokeDasharray="100" 
              strokeDashoffset={animationState === 'start' ? '100' : '0'} 
              className="transition-all duration-1000 ease-out" 
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.8 0 3.5-.5 5-1.3" 
              strokeLinecap="round"
            />
            <path 
              strokeDasharray="50" 
              strokeDashoffset={animationState === 'start' ? '50' : '0'} 
              className="transition-all duration-700 delay-300 ease-out" 
              d="M12 6c-2 2-3 5-2 8M14 4c1 3 1 6 0 9M8.5 7c3-1 6-.5 8 1" 
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text Animation */}
        <div className="overflow-hidden">
          <h1 className={`text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-center transform transition-transform duration-700 ease-out ${
            animationState === 'start' || animationState === 'drawing' ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            Agri<span className="text-forest-300">Lens</span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <p className={`mt-3 text-forest-200 text-sm font-medium tracking-wide transition-all duration-700 delay-200 ${
          animationState === 'start' || animationState === 'drawing' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          Smarter farming starts here
        </p>
      </div>

      {/* Loading Bar at bottom */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-forest-400 rounded-full transition-all ease-out duration-[2000ms] ${
          animationState === 'start' ? 'w-0' : 'w-full'
        }`} />
      </div>
    </div>
  );
}
