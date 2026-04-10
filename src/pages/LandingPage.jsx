import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' });
  const [isSignup, setIsSignup] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    login(formData);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.8 0 3.5-.5 5-1.3" strokeLinecap="round"/>
              <path d="M12 6c-2 2-3 5-2 8M14 4c1 3 1 6 0 9M8.5 7c3-1 6-.5 8 1" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-stone-800 tracking-tight">
            Agri<span className="text-forest-600">Lens</span>
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-20 md:pt-16 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-medium mb-6">
              <span className="status-dot status-dot-green" />
              AI-Powered Crop Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.1] tracking-tight mb-5">
              Smarter farming
              <br />
              <span className="text-forest-600">starts here.</span>
            </h1>
            <p className="text-base md:text-lg text-stone-500 leading-relaxed mb-8 max-w-lg">
              Scan your crops, detect diseases instantly, get precise treatment
              plans, and plan irrigation with AI — all from your phone.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {[
                { title: 'Instant Disease Detection', desc: 'Upload a photo and get AI analysis in seconds' },
                { title: 'Personalized Crop Plans', desc: 'Irrigation, pesticide, and care schedules for your crop' },
                { title: 'Weather Intelligence', desc: '7-day forecast with smart farming recommendations' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-forest-600">
                      <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{f.title}</p>
                    <p className="text-xs text-stone-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="glass-card p-8 md:p-10 max-w-md mx-auto w-full">
            <h2 className="text-xl font-bold text-stone-800 mb-1">
              {isSignup ? 'Get Started' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-stone-500 mb-6">
              {isSignup ? 'Create your farmer profile to begin' : 'Enter your name to continue'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="farmer-name" className="block text-xs font-medium text-stone-600 mb-1.5">
                  Full Name *
                </label>
                <input
                  id="farmer-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="input-field"
                />
              </div>

              {isSignup && (
                <>
                  <div>
                    <label htmlFor="farmer-phone" className="block text-xs font-medium text-stone-600 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="farmer-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Optional"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="farmer-location" className="block text-xs font-medium text-stone-600 mb-1.5">
                      Village / Town
                    </label>
                    <input
                      id="farmer-location"
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                      placeholder="Optional"
                      className="input-field"
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn-primary w-full justify-center py-3 mt-2">
                {isSignup ? 'Create Profile' : 'Continue'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="mt-4 text-xs text-stone-500 hover:text-forest-600 transition-colors w-full text-center"
            >
              {isSignup ? 'Already have a profile? Quick login' : 'New here? Create a profile'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-t border-stone-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50+', label: 'Crop varieties supported' },
            { value: '95%', label: 'Disease detection accuracy' },
            { value: 'Free', label: 'Weather & irrigation data' },
            { value: 'Instant', label: 'AI-generated reports' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-extrabold text-forest-700">{s.value}</p>
              <p className="text-xs text-stone-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
