import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { MapPin, AlertCircle, CheckCircle, Loader2, Navigation } from 'lucide-react';

interface AddressStepProps {
  initialAddress: string;
  onNext: (data: { address: string }) => void;
  onBack: () => void;
}

// Service zones - coordinates defining service areas (latitude, longitude, radius in km)
const SERVICE_ZONES = [
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, radius: 50 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, radius: 50 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 50 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, radius: 50 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, radius: 50 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, radius: 40 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 40 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, radius: 40 },
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function AddressStep({ initialAddress, onNext, onBack }: AddressStepProps) {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [serviceZoneName, setServiceZoneName] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [hasAttemptedLocation, setHasAttemptedLocation] = useState(false);
  const [skipLocationCheck, setSkipLocationCheck] = useState(false);

  const checkServiceZoneByCoordinates = (latitude: number, longitude: number) => {
    for (const zone of SERVICE_ZONES) {
      const distance = calculateDistance(latitude, longitude, zone.lat, zone.lng);
      if (distance <= zone.radius) {
        setServiceAvailable(true);
        setServiceZoneName(zone.name);
        return true;
      }
    }
    setServiceAvailable(false);
    setServiceZoneName('');
    return false;
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError('');
    setHasAttemptedLocation(true);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      setServiceAvailable(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Check if location is in service zone
        const isInServiceZone = checkServiceZoneByCoordinates(latitude, longitude);
        
        if (!isInServiceZone) {
          setIsLoadingLocation(false);
          return;
        }

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            setStreet(addr.road || addr.suburb || '');
            setCity(addr.city || addr.town || addr.village || serviceZoneName);
            setState(addr.state || '');
            setZipCode(addr.postcode || '');
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          // Even if reverse geocoding fails, we can still use the zone name
          setCity(serviceZoneName);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
        setServiceAvailable(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Require location check before proceeding
    if (!hasAttemptedLocation && !skipLocationCheck) {
      setLocationError('Please enable location to verify service availability');
      return;
    }

    if (serviceAvailable !== true && !skipLocationCheck) {
      setLocationError('Service is not available in your area');
      return;
    }
    
    const fullAddress = `${street}, ${city}, ${state} ${zipCode}${landmark ? `, Near ${landmark}` : ''}`;
    onNext({ address: fullAddress });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-600 p-3 rounded-full">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Pickup Address</h3>
            <p className="text-gray-600 text-sm">Enable location to verify service availability</p>
          </div>
        </div>

        {/* Location Detection Button */}
        <div className="mb-6">
          <Button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Detecting Location...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 mr-2" />
                Enable Current Location
              </>
            )}
          </Button>
        </div>

        {/* Location Error */}
        {locationError && (
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {locationError}
            </AlertDescription>
          </Alert>
        )}

        {/* Service Zone Status */}
        {serviceAvailable === true && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <span className="font-medium">Great news!</span> We provide service in {serviceZoneName || city}. You can proceed with your pickup request.
            </AlertDescription>
          </Alert>
        )}

        {serviceAvailable === false && hasAttemptedLocation && (
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <span className="font-medium">We are not available in this zone.</span> We currently serve: Bangalore, Hyderabad, Chennai, Mumbai, Delhi, Pune, Kolkata, and Ahmedabad (within 40-50 km radius). We'll notify you when we expand to your area!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Main Street, Apt 4B"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              disabled={!hasAttemptedLocation || serviceAvailable !== true}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!hasAttemptedLocation || serviceAvailable !== true}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                placeholder="Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                disabled={!hasAttemptedLocation || serviceAvailable !== true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="560001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              disabled={!hasAttemptedLocation || serviceAvailable !== true}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input
              id="landmark"
              type="text"
              placeholder="Near Central Park"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              disabled={!hasAttemptedLocation || serviceAvailable !== true}
            />
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          📍 <span className="font-medium">Note:</span> You must enable location access to verify service availability. Make sure the address is accurate for smooth pickup.
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
          type="submit"
          disabled={serviceAvailable !== true && !skipLocationCheck}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Date & Time
        </Button>
      </div>
    </form>
  );
}