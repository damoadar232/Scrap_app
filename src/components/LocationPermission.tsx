import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, Loader2, Navigation } from 'lucide-react';

interface LocationPermissionProps {
  onLocationGranted: (location: { lat: number; lng: number }) => void;
  onSkip: () => void;
}

export function LocationPermission({ onLocationGranted, onSkip }: LocationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnableLocation = () => {
    setIsLoading(true);
    setError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setIsLoading(false);
          onLocationGranted(location);
        },
        (error) => {
          setIsLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Location permission denied. You can enable it later in settings.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information unavailable.');
              break;
            case error.TIMEOUT:
              setError('Location request timed out.');
              break;
            default:
              setError('An error occurred while getting your location.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLoading(false);
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50 to-gray-50">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-6 rounded-full">
                <MapPin className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-gray-900">Enable Location Access</CardTitle>
            <CardDescription className="text-base mt-2">
              Allow us to access your location to provide accurate pickup services and better recommendations
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="text-blue-900 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Why we need this:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                <li>Auto-fill your pickup address</li>
                <li>Find nearest collection centers</li>
                <li>Faster service delivery</li>
                <li>Better route optimization</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              onClick={handleEnableLocation}
              disabled={isLoading}
              className="w-full h-12 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onSkip}
              disabled={isLoading}
              className="w-full h-12"
            >
              Skip for Now
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              You can enable location access anytime from your profile settings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
