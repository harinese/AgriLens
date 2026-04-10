import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/my-crop', label: 'My Crop' },
  { path: '/scanner', label: 'Scanner' },
  { path: '/weather', label: 'Weather' },
  { path: '/encyclopedia', label: 'Encyclopedia' },
];

export default function Navbar() {
  const { farmer, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = farmer?.name
    ? farmer.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block" style={{
        background: 'rgba(250, 250, 249, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.8 0 3.5-.5 5-1.3" strokeLinecap="round"/>
                <path d="M12 6c-2 2-3 5-2 8M14 4c1 3 1 6 0 9" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-base font-bold text-stone-800 tracking-tight">
              Agri<span className="text-forest-600">Lens</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-0.5">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-[13px] font-medium no-underline transition-all duration-200 ${
                    isActive
                      ? 'bg-forest-700 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-8 h-8 rounded-full gradient-primary text-white text-xs font-bold flex items-center justify-center border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              {initials}
            </button>

            {showProfile && (
              <div className="absolute right-0 top-11 w-56 glass-card p-1 shadow-lg border border-stone-200 z-50">
                <div className="px-3 py-2.5 border-b border-stone-100">
                  <p className="text-sm font-semibold text-stone-800">{farmer?.name}</p>
                  {farmer?.location && (
                    <p className="text-xs text-stone-500">{farmer.location}</p>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer mt-1"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{
        background: 'rgba(250, 250, 249, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div className="flex items-center justify-around py-1.5 px-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] no-underline transition-all duration-200 min-w-[52px] ${
                  isActive
                    ? 'text-forest-700 font-semibold'
                    : 'text-stone-400 hover:text-stone-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-1 h-1 rounded-full mb-0.5 transition-all ${isActive ? 'bg-forest-600' : 'bg-transparent'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Spacer for fixed navbars */}
      <div className="h-[52px] hidden md:block" />
    </>
  );
}
