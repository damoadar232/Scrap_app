import { useState, useEffect } from 'react';
import { LoginRegister } from './components/LoginRegister';
import { Dashboard } from './components/Dashboard';
import { AdminDashboardNew } from './components/AdminDashboardNew';
import { AdminResetPassword } from './components/AdminResetPassword';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminResetPassword, setShowAdminResetPassword] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = 'Scrap Square - Smart Recycling Solutions';
  }, []);

  const handleLogin = (phoneNumber: string, userIsAdmin: boolean) => {
    setCurrentUser(phoneNumber);
    setIsAdmin(userIsAdmin);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  const handleShowAdminReset = () => {
    setShowAdminResetPassword(true);
  };

  const handleAdminResetComplete = () => {
    setShowAdminResetPassword(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showAdminResetPassword) {
    return (
      <>
        <AdminResetPassword 
          onBack={() => setShowAdminResetPassword(false)}
          onResetComplete={handleAdminResetComplete}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated ? (
          <LoginRegister onLogin={handleLogin} onAdminResetPassword={handleShowAdminReset} />
        ) : isAdmin ? (
          <AdminDashboardNew 
            currentUser={currentUser} 
            onLogout={handleLogout}
          />
        ) : (
          <Dashboard 
            currentUser={currentUser} 
            onLogout={handleLogout}
            userLocation={null}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}