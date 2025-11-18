import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LogOut, Package, MessageCircle, Bell, Settings, TrendingUp, Users, CheckCircle, XCircle, Clock, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { PickupRequest } from './Dashboard';
import type { SupportMessage } from './ContactSupport';
import { toast } from 'sonner@2.0.3';
import { initializeAdminNotifications, requestNotificationPermission } from '../utils/notifications';

interface AdminDashboardProps {
  currentUser: string | null;
  onLogout: () => void;
}

const statusColors = {
  pending: 'bg-orange-100 text-orange-700 border-orange-300',
  scheduled: 'bg-blue-100 text-blue-700 border-blue-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
  rejected: 'bg-red-100 text-red-700 border-red-300'
};

const typeColors = {
  metal: 'bg-gray-100 text-gray-700 border-gray-300',
  paper: 'bg-amber-100 text-amber-700 border-amber-300',
  plastic: 'bg-blue-100 text-blue-700 border-blue-300',
  glass: 'bg-green-100 text-green-700 border-green-300',
  ewaste: 'bg-purple-100 text-purple-700 border-purple-300'
};

export function AdminDashboardNew({ currentUser, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'scheduled' | 'completed' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Load data
  const loadRequests = (): PickupRequest[] => {
    try {
      const stored = localStorage.getItem('pickupRequests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const loadSupportMessages = (): SupportMessage[] => {
    try {
      const stored = localStorage.getItem('supportMessages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const allRequests = loadRequests();
    setRequests(allRequests);
    
    const messages = loadSupportMessages();
    setSupportMessages(messages);
    
    // Initialize notifications
    initializeAdminNotifications().then(() => {
      setNotificationsEnabled(Notification.permission === 'granted');
    });
    
    // Check for new items
    const hasNewRequest = localStorage.getItem('hasNewPickupRequest');
    const hasNewMessage = localStorage.getItem('hasNewSupportMessage');
    
    if (hasNewRequest === 'true') {
      const pendingCount = allRequests.filter(r => r.status === 'pending').length;
      if (pendingCount > 0) {
        toast.success(`${pendingCount} new pickup request${pendingCount !== 1 ? 's' : ''}!`, {
          duration: 5000,
        });
      }
      localStorage.removeItem('hasNewPickupRequest');
    }
    
    if (hasNewMessage === 'true') {
      const openCount = messages.filter(m => m.status === 'open').length;
      if (openCount > 0) {
        toast.info(`${openCount} new support message${openCount !== 1 ? 's' : ''}!`, {
          duration: 5000,
        });
      }
      localStorage.removeItem('hasNewSupportMessage');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      toast.success('Notifications enabled!');
    } else {
      toast.error('Please enable notifications in browser settings');
    }
  };

  // Quick Actions
  const handleAccept = (requestId: string) => {
    const allRequests = loadRequests();
    const updatedRequests = allRequests.map(req =>
      req.id === requestId ? { ...req, status: 'scheduled' as const } : req
    );
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    toast.success('Request accepted & scheduled!');
  };

  const handleReject = (requestId: string) => {
    const allRequests = loadRequests();
    const updatedRequests = allRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    );
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    toast.error('Request rejected');
  };

  const handleComplete = (requestId: string) => {
    const allRequests = loadRequests();
    const updatedRequests = allRequests.map(req =>
      req.id === requestId ? { ...req, status: 'completed' as const } : req
    );
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    toast.success('Request marked as completed!');
  };

  const handleResolveMessage = (messageId: string) => {
    const messages = loadSupportMessages();
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, status: 'resolved' as const } : msg
    );
    localStorage.setItem('supportMessages', JSON.stringify(updatedMessages));
    setSupportMessages(updatedMessages);
    toast.success('Message resolved!');
  };

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    scheduled: requests.filter(r => r.status === 'scheduled').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    openMessages: supportMessages.filter(m => m.status === 'open').length,
    totalUsers: new Set(requests.map(r => r.userPhone)).size
  };

  // Filtered requests
  const filteredRequests = requests
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r =>
      searchQuery === '' ||
      r.userPhone.includes(searchQuery) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.includes(searchQuery)
    );

  const getTotalWeight = (request: PickupRequest) => {
    return request.scrapItems.reduce((sum, item) => sum + item.weight, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Logo size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl">Admin Dashboard</h1>
                <p className="text-green-100 text-sm">Scrap Square Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                onClick={handleEnableNotifications}
                className="relative p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {(stats.pending > 0 || stats.openMessages > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {stats.pending + stats.openMessages}
                  </span>
                )}
              </button>
              
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Notification Banner */}
        {!notificationsEnabled && (
          <Alert className="border-blue-200 bg-blue-50">
            <Bell className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <span>Enable notifications for real-time alerts</span>
              <Button
                onClick={handleEnableNotifications}
                size="sm"
                className="ml-4 bg-blue-600 hover:bg-blue-700"
              >
                Enable
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('requests')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Requests</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500" onClick={() => {
            setActiveTab('requests');
            setStatusFilter('pending');
          }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                {stats.pending > 0 && <Badge className="bg-orange-600">New</Badge>}
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500" onClick={() => {
            setActiveTab('requests');
            setStatusFilter('scheduled');
          }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
              <div className="text-xs text-gray-600">Scheduled</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500" onClick={() => {
            setActiveTab('requests');
            setStatusFilter('completed');
          }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-red-500" onClick={() => {
            setActiveTab('requests');
            setStatusFilter('rejected');
          }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-gray-600">Rejected</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500" onClick={() => setActiveTab('support')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                {stats.openMessages > 0 && <Badge className="bg-purple-600">New</Badge>}
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.openMessages}</div>
              <div className="text-xs text-gray-600">Support</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-indigo-600">{stats.totalUsers}</div>
              <div className="text-xs text-gray-600">Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <Package className="w-4 h-4" />
              Requests
              {stats.pending > 0 && (
                <Badge className="ml-1 bg-orange-600">{stats.pending}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Support
              {stats.openMessages > 0 && (
                <Badge className="ml-1 bg-purple-600">{stats.openMessages}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Recent Pending Requests */}
              <Card>
                <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Pending Requests ({stats.pending})
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Requires immediate action</p>
                </div>
                <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {requests.filter(r => r.status === 'pending').slice(0, 5).map((request) => (
                    <div key={request.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">#{request.id.slice(-6)}</div>
                          <div className="text-sm text-gray-600">{request.userPhone}</div>
                        </div>
                        <Badge variant="outline" className={statusColors.pending}>
                          Pending
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {request.scrapItems.map((item) => (
                          <Badge key={item.type} variant="outline" className={`${typeColors[item.type]} text-xs`}>
                            {item.type} {item.weight}kg
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 h-8"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="flex-1 border-red-300 text-red-700 hover:bg-red-50 h-8"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {stats.pending === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No pending requests</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Support Messages */}
              <Card>
                <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-purple-100">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    Support Messages ({stats.openMessages})
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Customer support requests</p>
                </div>
                <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {supportMessages.filter(m => m.status === 'open').slice(0, 5).map((message) => (
                    <div key={message.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{message.userName}</div>
                          <div className="text-sm text-gray-600">{message.userPhone}</div>
                        </div>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700">
                          Open
                        </Badge>
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-1">{message.subject}</div>
                      <div className="text-sm text-gray-600 line-clamp-2 mb-2">{message.message}</div>
                      <Button
                        size="sm"
                        onClick={() => handleResolveMessage(message.id)}
                        variant="outline"
                        className="w-full h-8"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark as Resolved
                      </Button>
                    </div>
                  ))}
                  {stats.openMessages === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No open messages</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by phone, address, or request ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'pending', 'scheduled', 'completed', 'rejected'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-900 mb-2">No requests found</h3>
                    <p className="text-gray-600 text-sm">
                      {searchQuery ? 'Try different search terms' : 'No requests match the selected filter'}
                    </p>
                  </div>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Request Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">Request #{request.id.slice(-6)}</span>
                                <Badge variant="outline" className={statusColors[request.status]}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                {request.userPhone} • {new Date(request.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                            >
                              {selectedRequest === request.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {request.scrapItems.map((item) => (
                              <Badge key={item.type} variant="outline" className={typeColors[item.type]}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.weight}kg
                              </Badge>
                            ))}
                            <Badge variant="outline" className="border-gray-300">
                              Total: {getTotalWeight(request)}kg
                            </Badge>
                          </div>

                          {selectedRequest === request.id && (
                            <div className="space-y-2 pt-2 border-t">
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Address:</span>
                                <p className="text-gray-600 mt-1">{request.address}</p>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Scheduled:</span>
                                <p className="text-gray-600 mt-1">
                                  {new Date(request.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })} at {request.time}
                                </p>
                              </div>
                              {request.scrapItems.some(item => item.images.length > 0) && (
                                <div className="text-sm">
                                  <span className="font-medium text-gray-700">Images:</span>
                                  <div className="grid grid-cols-4 gap-2 mt-2">
                                    {request.scrapItems.flatMap(item => item.images).map((img, idx) => (
                                      <img
                                        key={idx}
                                        src={img}
                                        alt={`Scrap ${idx + 1}`}
                                        className="w-full aspect-square object-cover rounded border"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex md:flex-col gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAccept(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(request.id)}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => handleComplete(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="space-y-3">
              {supportMessages.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-900 mb-2">No support messages</h3>
                    <p className="text-gray-600 text-sm">Support messages from users will appear here</p>
                  </div>
                </Card>
              ) : (
                supportMessages.map((message) => (
                  <Card key={message.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{message.userName}</span>
                            <Badge variant="outline" className={message.status === 'open' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {message.userPhone} • {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-900 mb-2">{message.subject}</div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {message.message}
                        </div>
                      </div>

                      {message.status === 'open' && (
                        <Button
                          size="sm"
                          onClick={() => handleResolveMessage(message.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Resolved
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
