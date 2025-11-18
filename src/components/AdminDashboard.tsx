import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LogOut, Package, Weight, MapPin, Calendar, Clock, Bell, Phone, Check, X, ChevronDown, ChevronUp, Image as ImageIcon, BellRing, MessageCircle, User as UserIcon } from 'lucide-react';
import { Logo } from './Logo';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import type { PickupRequest } from './Dashboard';
import type { SupportMessage } from './ContactSupport';
import { toast } from 'sonner@2.0.3';
import { Footer } from './Footer';
import { initializeAdminNotifications, requestNotificationPermission } from '../utils/notifications';

interface AdminDashboardProps {
  currentUser: string | null;
  onLogout: () => void;
}

const typeColors = {
  metal: 'bg-gray-100 text-gray-700 border-gray-300',
  paper: 'bg-amber-100 text-amber-700 border-amber-300',
  plastic: 'bg-blue-100 text-blue-700 border-blue-300',
  glass: 'bg-green-100 text-green-700 border-green-300',
  ewaste: 'bg-purple-100 text-purple-700 border-purple-300'
};

const statusColors = {
  pending: 'bg-orange-100 text-orange-700 border-orange-300',
  scheduled: 'bg-blue-100 text-blue-700 border-blue-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
  rejected: 'bg-red-100 text-red-700 border-red-300'
};

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'scheduled' | 'completed' | 'rejected'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'support'>('requests');

  // Load all requests from localStorage
  const loadRequests = (): PickupRequest[] => {
    try {
      const stored = localStorage.getItem('pickupRequests');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  // Load support messages
  const loadSupportMessages = (): SupportMessage[] => {
    try {
      const stored = localStorage.getItem('supportMessages');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const allRequests = loadRequests();
    setRequests(allRequests);
    
    const messages = loadSupportMessages();
    setSupportMessages(messages);
    
    // Initialize admin notifications
    initializeAdminNotifications().then(() => {
      setNotificationsEnabled(Notification.permission === 'granted');
    });
    
    // Check for new pending requests flag
    const hasNewRequest = localStorage.getItem('hasNewPickupRequest');
    if (hasNewRequest === 'true') {
      const pendingCount = allRequests.filter(r => r.status === 'pending').length;
      if (pendingCount > 0) {
        toast.info(`You have ${pendingCount} new pending pickup request${pendingCount !== 1 ? 's' : ''}`, {
          duration: 5000,
        });
      }
      // Clear the flag
      localStorage.removeItem('hasNewPickupRequest');
    }
    
    // Check for new support messages
    const hasNewMessage = localStorage.getItem('hasNewSupportMessage');
    if (hasNewMessage === 'true') {
      const openMessages = messages.filter(m => m.status === 'open').length;
      if (openMessages > 0) {
        toast.info(`You have ${openMessages} new support message${openMessages !== 1 ? 's' : ''}`, {
          duration: 5000,
        });
      }
      // Clear the flag
      localStorage.removeItem('hasNewSupportMessage');
    }
    
    // Check for new pending requests and show notification
    const pendingCount = allRequests.filter(r => r.status === 'pending').length;
    if (pendingCount > 0) {
      toast.info(`You have ${pendingCount} pending pickup request${pendingCount !== 1 ? 's' : ''}`);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      toast.success('Browser notifications enabled!');
    } else {
      toast.error('Please enable notifications in your browser settings');
    }
  };

  const handleAccept = (requestId: string) => {
    const allRequests = loadRequests();
    const updatedRequests = allRequests.map(req => 
      req.id === requestId ? { ...req, status: 'scheduled' as const } : req
    );
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    toast.success('Pickup request accepted!');
  };

  const handleReject = (requestId: string) => {
    const allRequests = loadRequests();
    const updatedRequests = allRequests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    );
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    toast.error('Pickup request rejected');
  };

  const handleResolveMessage = (messageId: string) => {
    const messages = loadSupportMessages();
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, status: 'resolved' as const } : msg
    );
    localStorage.setItem('supportMessages', JSON.stringify(updatedMessages));
    setSupportMessages(updatedMessages);
    toast.success('Support message marked as resolved!');
  };

  const getTotalWeight = (request: PickupRequest) => {
    return request.scrapItems.reduce((sum, item) => sum + item.weight, 0);
  };

  const getTotalImages = (request: PickupRequest) => {
    return request.scrapItems.reduce((sum, item) => sum + item.images.length, 0);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const toggleExpand = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const toggleMessageExpand = (messageId: string) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Logo size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-white">Admin Dashboard</h1>
              <p className="text-green-100 text-sm">Scrap Square</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Notification Banner */}
        {!notificationsEnabled && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <BellRing className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <span>Enable browser notifications to get instant alerts when users raise pickup requests</span>
              <Button 
                onClick={handleEnableNotifications} 
                size="sm" 
                className="ml-4 bg-blue-600 hover:bg-blue-700"
              >
                Enable Notifications
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card 
            className={`cursor-pointer transition-colors ${filter === 'all' ? 'ring-2 ring-green-600' : ''}`}
            onClick={() => setFilter('all')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1">{requests.length}</div>
              <div className="text-gray-600 text-sm">Total</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-colors ${filter === 'pending' ? 'ring-2 ring-orange-600' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1 text-orange-600">{requests.filter(r => r.status === 'pending').length}</div>
              <div className="text-gray-600 text-sm">Pending</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-colors ${filter === 'scheduled' ? 'ring-2 ring-blue-600' : ''}`}
            onClick={() => setFilter('scheduled')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1 text-blue-600">{requests.filter(r => r.status === 'scheduled').length}</div>
              <div className="text-gray-600 text-sm">Scheduled</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-colors ${filter === 'completed' ? 'ring-2 ring-green-600' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1 text-green-600">{requests.filter(r => r.status === 'completed').length}</div>
              <div className="text-gray-600 text-sm">Completed</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-colors ${filter === 'rejected' ? 'ring-2 ring-red-600' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1 text-red-600">{requests.filter(r => r.status === 'rejected').length}</div>
              <div className="text-gray-600 text-sm">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            className={activeTab === 'requests' ? 'bg-green-600 text-white' : ''}
            onClick={() => setActiveTab('requests')}
          >
            Pickup Requests
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={activeTab === 'support' ? 'bg-green-600 text-white' : ''}
            onClick={() => setActiveTab('support')}
          >
            Support Messages
          </Button>
        </div>

        {/* Requests List */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No Requests</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'No pickup requests yet' 
                    : `No ${filter} requests`}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => {
                const isExpanded = expandedRequest === request.id;
                return (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-3 cursor-pointer" onClick={() => toggleExpand(request.id)}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">Request #{request.id.slice(-6)}</CardTitle>
                            <Badge variant="outline" className={statusColors[request.status]}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Phone className="w-4 h-4" />
                            <span>{request.userPhone}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="p-4 pt-0 space-y-3">
                        <Separator />

                        {/* Scrap Types */}
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Scrap Types</p>
                          <div className="flex flex-wrap gap-2">
                            {request.scrapItems.map((item) => (
                              <Badge key={item.type} variant="outline" className={typeColors[item.type]}>
                                <Package className="w-3 h-3 mr-1" />
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Scrap Items Details */}
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Weight Details</p>
                          <div className="space-y-2">
                            {request.scrapItems.map((item) => (
                              <div key={item.type} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                <span className="text-gray-700 capitalize">{item.type}</span>
                                <div className="flex items-center gap-3 text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Weight className="w-3 h-3" />
                                    {item.weight} kg
                                  </div>
                                  {item.images.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3" />
                                      {item.images.length}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total Weight */}
                        <Alert>
                          <Weight className="w-4 h-4" />
                          <AlertDescription>
                            <span className="font-medium">Total Weight: {getTotalWeight(request)} kg</span>
                          </AlertDescription>
                        </Alert>

                        {/* Address */}
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Pickup Address</p>
                          <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-3 rounded">
                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{request.address}</span>
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Scheduled Pickup</p>
                          <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-3 rounded">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(request.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{request.time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Images */}
                        {getTotalImages(request) > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Uploaded Images</p>
                            <div className="space-y-3">
                              {request.scrapItems.map((item) => 
                                item.images.length > 0 && (
                                  <div key={item.type} className="space-y-1">
                                    <p className="text-xs text-gray-500 capitalize">{item.type} Images</p>
                                    <div className="grid grid-cols-4 gap-2">
                                      {item.images.map((image, index) => (
                                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                                          <img
                                            src={image}
                                            alt={`${item.type} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {request.status === 'pending' && (
                          <>
                            <Separator />
                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleReject(request.id)}
                                variant="outline"
                                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleAccept(request.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Accept
                              </Button>
                            </div>
                          </>
                        )}

                        {request.status === 'scheduled' && (
                          <>
                            <Separator />
                            <Alert className="border-blue-200 bg-blue-50">
                              <AlertDescription className="text-blue-700">
                                This pickup has been scheduled and accepted
                              </AlertDescription>
                            </Alert>
                          </>
                        )}

                        {request.status === 'rejected' && (
                          <>
                            <Separator />
                            <Alert className="border-red-200 bg-red-50">
                              <AlertDescription className="text-red-700">
                                This pickup request was rejected
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Support Messages List */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            {supportMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No Support Messages</h3>
                <p className="text-gray-600">
                  No support messages yet
                </p>
              </div>
            ) : (
              supportMessages.map((message) => {
                const isExpanded = expandedMessage === message.id;
                return (
                  <Card key={message.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-3 cursor-pointer" onClick={() => toggleMessageExpand(message.id)}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">Message #{message.id.slice(-6)}</CardTitle>
                            <Badge variant="outline" className={message.status === 'open' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-green-100 text-green-700 border-green-300'}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <UserIcon className="w-4 h-4" />
                            <span>{message.userName}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="p-4 pt-0 space-y-3">
                        <Separator />

                        {/* Message Details */}
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Message Details</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                              <span className="text-gray-700 capitalize">Subject</span>
                              <div className="flex items-center gap-3 text-gray-600">
                                <span className="font-medium">{message.subject}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                              <span className="text-gray-700 capitalize">Message</span>
                              <div className="flex items-center gap-3 text-gray-600">
                                <span className="font-medium">{message.message}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {message.status === 'open' && (
                          <>
                            <Separator />
                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleResolveMessage(message.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Resolve
                              </Button>
                            </div>
                          </>
                        )}

                        {message.status === 'resolved' && (
                          <>
                            <Separator />
                            <Alert className="border-green-200 bg-green-50">
                              <AlertDescription className="text-green-700">
                                This support message has been resolved
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}