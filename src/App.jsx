import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import WeatherPage from './pages/WeatherPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import MyCropPage from './pages/MyCropPage';
import SplashScreen from './components/SplashScreen';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { isAuthenticated, initialized } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className={`transition-opacity duration-500 delay-300 ${showSplash ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        {!isOnline && <OfflineBanner />}
        <Routes>
          {/* Public */}
        <Route
          path="/landing"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/my-crop" element={<MyCropPage />} />
                  <Route path="/scanner" element={<ScannerPage />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/encyclopedia" element={<EncyclopediaPage />} />
                </Routes>
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
