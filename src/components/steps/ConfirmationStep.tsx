import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Package, Weight, MapPin, Calendar, Clock, Image as ImageIcon, CheckCircle } from 'lucide-react';
import type { ScrapItem } from '../Dashboard';

interface ConfirmationStepProps {
  scrapItems: ScrapItem[];
  address: string;
  date: string;
  time: string;
  onConfirm: () => void;
  onBack: () => void;
}

const typeColors = {
  metal: 'bg-gray-100 text-gray-700 border-gray-300',
  paper: 'bg-amber-100 text-amber-700 border-amber-300',
  plastic: 'bg-blue-100 text-blue-700 border-blue-300',
  glass: 'bg-green-100 text-green-700 border-green-300',
  ewaste: 'bg-purple-100 text-purple-700 border-purple-300'
};

export function ConfirmationStep({
  scrapItems,
  address,
  date,
  time,
  onConfirm,
  onBack
}: ConfirmationStepProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalWeight = scrapItems.reduce((sum, item) => sum + item.weight, 0);
  const totalImages = scrapItems.reduce((sum, item) => sum + item.images.length, 0);

  return (
    <div className="space-y-6 pb-6">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-gray-900">Review Your Request</CardTitle>
          </div>
          <p className="text-gray-600 text-sm">Please verify all details before confirming</p>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Scrap Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-gray-400" />
              <p className="text-gray-600 text-sm">Scrap Types ({scrapItems.length})</p>
            </div>
            <div className="space-y-2 pl-7">
              {scrapItems.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <Badge variant="outline" className={typeColors[item.type]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Weight className="w-4 h-4" />
                      {item.weight} kg
                    </div>
                    {item.images.length > 0 && (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        {item.images.length}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total Weight */}
          <div className="flex items-start gap-3">
            <Weight className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-600 text-sm">Total Weight</p>
              <p className="text-gray-900">{totalWeight} kg</p>
            </div>
          </div>

          <Separator />

          {/* All Images */}
          {totalImages > 0 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-600 text-sm">All Images ({totalImages})</p>
                </div>
                {scrapItems.map((item) => 
                  item.images.length > 0 && (
                    <div key={item.type} className="pl-7 space-y-2">
                      <Badge variant="outline" className={`${typeColors[item.type]} text-xs`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                      <div className="grid grid-cols-4 gap-2">
                        {item.images.map((image, index) => (
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
              <Separator />
            </>
          )}

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-600 text-sm">Pickup Address</p>
              <p className="text-gray-900">{address}</p>
            </div>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-600 text-sm">Scheduled Pickup</p>
              <p className="text-gray-900">{formattedDate}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-gray-700 text-sm">{time}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          ✅ By confirming, you agree to have our team visit the specified address at the scheduled time. You'll receive a confirmation and can track your pickup status.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700"
        >
          Confirm & Schedule Pickup
        </Button>
      </div>
    </div>
  );
}