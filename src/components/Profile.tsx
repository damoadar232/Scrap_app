import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { User, Camera, Phone, Mail, MapPin, Calendar, Package, ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { PickupRequest } from './Dashboard';

interface ProfileProps {
  currentUser: string | null;
  onBack: () => void;
}

interface UserProfile {
  phone: string;
  name: string;
  email: string;
  address: string;
  profileImage: string;
}

const statusColors = {
  pending: 'bg-orange-100 text-orange-700 border-orange-300',
  scheduled: 'bg-blue-100 text-blue-700 border-blue-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
  rejected: 'bg-red-100 text-red-700 border-red-300'
};

export function Profile({ currentUser, onBack }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'requests'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user profile
  const loadProfile = (): UserProfile => {
    try {
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      return profiles[currentUser || ''] || {
        phone: currentUser || '',
        name: '',
        email: '',
        address: '',
        profileImage: ''
      };
    } catch {
      return {
        phone: currentUser || '',
        name: '',
        email: '',
        address: '',
        profileImage: ''
      };
    }
  };

  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [isEditing, setIsEditing] = useState(false);

  // Load user requests
  const loadUserRequests = (): PickupRequest[] => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');
      return allRequests.filter((r: PickupRequest) => r.userPhone === currentUser);
    } catch {
      return [];
    }
  };

  const [requests] = useState<PickupRequest[]>(loadUserRequests());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfile({ ...profile, profileImage: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    try {
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      profiles[currentUser || ''] = profile;
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to save profile');
    }
  };

  const getTotalWeight = (request: PickupRequest) => {
    return request.scrapItems.reduce((sum, item) => sum + item.weight, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-white">My Profile</h1>
            <p className="text-green-100 text-sm">Manage your account</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('profile')}
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            className={activeTab === 'profile' ? 'flex-1 bg-green-600 hover:bg-green-700' : 'flex-1'}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            onClick={() => setActiveTab('requests')}
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            className={activeTab === 'requests' ? 'flex-1 bg-green-600 hover:bg-green-700' : 'flex-1'}
          >
            <Package className="w-4 h-4 mr-2" />
            My Requests ({requests.length})
          </Button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Profile Image */}
            <Card className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-green-100">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-gray-900">{profile.name || 'User'}</h3>
                  <p className="text-gray-600 text-sm">{profile.phone}</p>
                </div>
              </div>
            </Card>

            {/* Profile Details */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setProfile(loadProfile());
                        setIsEditing(false);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Default Address</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your default address"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl text-green-600 mb-1">{requests.length}</div>
                  <div className="text-gray-600 text-sm">Total Requests</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl text-blue-600 mb-1">
                    {requests.filter(r => r.status === 'completed').length}
                  </div>
                  <div className="text-gray-600 text-sm">Completed</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No Pickup Requests</h3>
                  <p className="text-gray-600 text-sm">
                    You haven't created any pickup requests yet
                  </p>
                </div>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-900">Request #{request.id.slice(-6)}</h3>
                        <Badge variant="outline" className={statusColors[request.status]}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {request.scrapItems.map((item) => (
                          <Badge key={item.type} variant="outline" className="text-xs">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.weight}kg
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>Total Weight: {getTotalWeight(request)} kg</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{request.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(request.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at {request.time}
                      </span>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertDescription className="text-orange-800 text-sm">
                        Your request is pending approval from admin
                      </AlertDescription>
                    </Alert>
                  )}

                  {request.status === 'scheduled' && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertDescription className="text-blue-800 text-sm">
                        Your pickup has been scheduled! Our team will contact you.
                      </AlertDescription>
                    </Alert>
                  )}

                  {request.status === 'completed' && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800 text-sm">
                        ✓ Pickup completed successfully
                      </AlertDescription>
                    </Alert>
                  )}

                  {request.status === 'rejected' && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800 text-sm">
                        This request was rejected. Please contact support.
                      </AlertDescription>
                    </Alert>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
