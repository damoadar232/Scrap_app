import { useState } from 'react';
import { Button } from './ui/button';
import { LogOut, History, User, MessageCircle, Menu, X, Home, Package, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import { ScrapTypeSelection } from './ScrapTypeSelection';
import { PickupRequestFlow } from './PickupRequestFlow';
import { MyRequests } from './MyRequests';
import { Footer } from './Footer';
import { Profile } from './Profile';
import { ContactSupport } from './ContactSupport';
import { DashboardHome } from './DashboardHome';
import { notifyAdminNewRequest, playNotificationSound } from '../utils/notifications';

export interface ScrapItem {
  type: 'metal' | 'paper' | 'plastic' | 'glass' | 'ewaste';
  weight: number;
  images: string[];
}

export interface PickupRequest {
  id: string;
  userPhone: string;
  scrapItems: ScrapItem[];
  address: string;
  date: string;
  time: string;
  status: 'pending' | 'scheduled' | 'completed' | 'rejected';
  createdAt: string;
}

interface DashboardProps {
  currentUser: string | null;
  onLogout: () => void;
  userLocation: { lat: number; lng: number } | null;
}

type View = 'home' | 'create-request' | 'my-requests' | 'profile' | 'contact-support';

export function Dashboard({ currentUser, onLogout, userLocation }: DashboardProps) {
  const [view, setView] = useState<View>('home');
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<('metal' | 'paper' | 'plastic' | 'glass' | 'ewaste')[]>([]);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load user's requests from localStorage
  const loadUserRequests = (): PickupRequest[] => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');
      return allRequests.filter((r: PickupRequest) => r.userPhone === currentUser);
    } catch (error) {
      return [];
    }
  };

  const handleScrapTypesSelect = (types: ('metal' | 'paper' | 'plastic' | 'glass' | 'ewaste')[]) => {
    setSelectedScrapTypes(types);
    setView('create-request');
    setSidebarOpen(false);
  };

  const handleRequestSubmit = (newRequest: PickupRequest) => {
    // Save to localStorage
    const allRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');
    allRequests.push(newRequest);
    localStorage.setItem('pickupRequests', JSON.stringify(allRequests));
    
    setRequests([...requests, newRequest]);
    setView('home');
    setSelectedScrapTypes([]);
    
    // Notify admin
    const scrapTypes = newRequest.scrapItems.map(item => 
      item.type.charAt(0).toUpperCase() + item.type.slice(1)
    );
    notifyAdminNewRequest(currentUser || 'User', scrapTypes);
    playNotificationSound();
    
    // Store flag for admin notification
    localStorage.setItem('hasNewPickupRequest', 'true');
  };

  const handleCancel = () => {
    setView('home');
    setSelectedScrapTypes([]);
    setSidebarOpen(false);
  };

  const handleViewMyRequests = () => {
    // Reload requests from localStorage to get latest status
    setRequests(loadUserRequests());
    setView('my-requests');
    setSidebarOpen(false);
  };

  const handleNavigate = (destination: View) => {
    setView(destination);
    setSidebarOpen(false);
  };

  // Get user stats
  const userRequests = loadUserRequests();
  const stats = {
    total: userRequests.length,
    pending: userRequests.filter(r => r.status === 'pending').length,
    completed: userRequests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:bg-white/20"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <Logo size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-white">Scrap Square</h1>
                <p className="text-green-100 text-sm">{currentUser}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Logo size={32} className="text-white" />
              </div>
              <h2 className="text-white text-lg">Menu</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* User Info */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-100">Logged in as</p>
                <p className="font-medium text-white">{currentUser}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <div className="p-4 space-y-2">
          {/* Home */}
          <button
            onClick={() => handleNavigate('home')}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
              view === 'home' 
                ? 'bg-green-50 border-2 border-green-600 text-green-700' 
                : 'hover:bg-gray-50 border-2 border-transparent text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* My Profile */}
          <button
            onClick={() => handleNavigate('profile')}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
              view === 'profile' 
                ? 'bg-green-50 border-2 border-green-600 text-green-700' 
                : 'hover:bg-gray-50 border-2 border-transparent text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <span className="font-medium">My Profile</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* My Requests */}
          <button
            onClick={handleViewMyRequests}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
              view === 'my-requests' 
                ? 'bg-green-50 border-2 border-green-600 text-green-700' 
                : 'hover:bg-gray-50 border-2 border-transparent text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <div className="text-left">
                <span className="font-medium block">My Requests</span>
                <span className="text-xs text-gray-500">{stats.total} total</span>
              </div>
            </div>
            {stats.pending > 0 && (
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                {stats.pending}
              </span>
            )}
          </button>

          {/* Contact Support */}
          <button
            onClick={() => handleNavigate('contact-support')}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
              view === 'contact-support' 
                ? 'bg-green-50 border-2 border-green-600 text-green-700' 
                : 'hover:bg-gray-50 border-2 border-transparent text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Contact Support</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="mx-4 my-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <h3 className="text-gray-900 text-sm font-medium mb-3">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-600">Done</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 border-2 border-red-200 text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {view === 'home' && (
          <>
            <DashboardHome stats={stats} />
            <ScrapTypeSelection onSelectTypes={handleScrapTypesSelect} />
          </>
        )}
        
        {view === 'create-request' && selectedScrapTypes.length > 0 && (
          <PickupRequestFlow
            scrapTypes={selectedScrapTypes}
            onComplete={handleRequestSubmit}
            onCancel={handleCancel}
          />
        )}

        {view === 'my-requests' && (
          <MyRequests requests={requests} onBack={() => setView('home')} />
        )}

        {view === 'profile' && (
          <Profile currentUser={currentUser} onBack={() => setView('home')} />
        )}

        {view === 'contact-support' && (
          <ContactSupport currentUser={currentUser} onBack={() => setView('home')} />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}