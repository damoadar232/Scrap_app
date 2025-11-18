import { Button } from './ui/button';
import { ArrowLeft, Package, Weight, MapPin, Calendar, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import type { PickupRequest } from './Dashboard';

interface MyRequestsProps {
  requests: PickupRequest[];
  onBack: () => void;
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

export function MyRequests({ requests, onBack }: MyRequestsProps) {
  const getTotalWeight = (request: PickupRequest) => {
    return request.scrapItems.reduce((sum, item) => sum + item.weight, 0);
  };

  const getTotalImages = (request: PickupRequest) => {
    return request.scrapItems.reduce((sum, item) => sum + item.images.length, 0);
  };

  return (
    <div className="min-h-[calc(100vh-72px)]">
      <div className="bg-white border-b sticky top-[72px] z-10 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-gray-900">My Requests</h2>
            <p className="text-gray-600 text-sm">{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No Requests Yet</h3>
            <p className="text-gray-600">Start by creating your first pickup request</p>
          </div>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {request.scrapItems.map((item) => (
                      <Badge key={item.type} variant="outline" className={typeColors[item.type]}>
                        <Package className="w-3 h-3 mr-1" />
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="outline" className={statusColors[request.status]}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>

                <Separator />

                {/* Scrap Items Details */}
                <div className="space-y-2">
                  {request.scrapItems.map((item) => (
                    <div key={item.type} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 capitalize">{item.type}</span>
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          {item.weight} kg
                        </div>
                        {item.images.length > 0 && (
                          <span className="text-xs">({item.images.length} img)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total Weight */}
                <div className="flex items-center gap-2 text-gray-900">
                  <Weight className="w-4 h-4" />
                  <span>Total: {getTotalWeight(request)} kg</span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{request.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(request.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{request.time}</span>
                  </div>
                </div>

                {/* All Images */}
                {getTotalImages(request) > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      {request.scrapItems.map((item) => 
                        item.images.length > 0 && (
                          <div key={item.type} className="space-y-1">
                            <p className="text-xs text-gray-500 capitalize">{item.type} Images</p>
                            <div className="grid grid-cols-4 gap-2">
                              {item.images.slice(0, 4).map((image, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
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
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}