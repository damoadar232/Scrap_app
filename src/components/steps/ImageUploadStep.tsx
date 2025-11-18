import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, X, Camera, Package, AlertCircle } from 'lucide-react';
import type { ScrapItem } from '../Dashboard';

interface ImageUploadStepProps {
  scrapItems: ScrapItem[];
  onNext: (data: { scrapItems: ScrapItem[] }) => void;
  onBack: () => void;
}

const typeColors = {
  metal: 'bg-gray-100 text-gray-700 border-gray-300',
  paper: 'bg-amber-100 text-amber-700 border-amber-300',
  plastic: 'bg-blue-100 text-blue-700 border-blue-300',
  glass: 'bg-green-100 text-green-700 border-green-300',
  ewaste: 'bg-purple-100 text-purple-700 border-purple-300'
};

export function ImageUploadStep({ scrapItems, onNext, onBack }: ImageUploadStepProps) {
  const [items, setItems] = useState<ScrapItem[]>(scrapItems);
  const [isCameraOpen, setIsCameraOpen] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          setItems(items.map(item => {
            if (item.type === type) {
              return { ...item, images: [...item.images, ...newImages] };
            }
            return item;
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const openCamera = async (type: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setIsCameraOpen(type);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(null);
  };

  const capturePhoto = (type: string) => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        
        setItems(items.map(item => {
          if (item.type === type) {
            return { ...item, images: [...item.images, imageData] };
          }
          return item;
        }));
        
        closeCamera();
      }
    }
  };

  const handleRemoveImage = (type: string, imageIndex: number) => {
    setItems(items.map(item => {
      if (item.type === type) {
        return { ...item, images: item.images.filter((_, i) => i !== imageIndex) };
      }
      return item;
    }));
  };

  const handleContinue = () => {
    // Validate that each scrap type has at least one image
    const itemsWithoutImages = items.filter(item => item.images.length === 0);
    
    if (itemsWithoutImages.length > 0) {
      alert(`Please upload at least one image for each scrap type: ${itemsWithoutImages.map(i => i.type).join(', ')}`);
      return;
    }
    
    onNext({ scrapItems: items });
  };

  const totalImages = items.reduce((sum, item) => sum + item.images.length, 0);
  const itemsWithoutImages = items.filter(item => item.images.length === 0);
  const allItemsHaveImages = itemsWithoutImages.length === 0;

  return (
    <div className="space-y-6">
      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => capturePhoto(isCameraOpen)}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>
              <Button
                type="button"
                onClick={closeCamera}
                variant="outline"
                className="flex-1 h-12 bg-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-full">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Upload Images</h3>
            <p className="text-gray-600 text-sm">At least 1 photo required for each scrap type</p>
          </div>
        </div>
      </Card>

      {/* Validation Alert */}
      {itemsWithoutImages.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <span className="font-medium">Required:</span> Please upload at least one image for: {itemsWithoutImages.map(item => item.type.charAt(0).toUpperCase() + item.type.slice(1)).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {items.map((item) => (
        <Card key={item.type} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-400" />
              <Badge variant="outline" className={typeColors[item.type]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.weight}kg
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {item.images.length === 0 ? (
                <span className="text-sm text-red-600 font-medium">No images</span>
              ) : (
                <span className="text-sm text-green-600 font-medium">{item.images.length} image{item.images.length !== 1 ? 's' : ''} ✓</span>
              )}
            </div>
          </div>

          {/* Upload and Camera Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <label
              htmlFor={`image-upload-${item.type}`}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-gray-700 text-sm">Upload</p>
              <input
                id={`image-upload-${item.type}`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(item.type, e)}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => openCamera(item.type)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 hover:bg-green-50/50 transition-colors flex flex-col items-center justify-center"
            >
              <Camera className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-gray-700 text-sm">Take Photo</p>
            </button>
          </div>

          {/* Image Grid */}
          {item.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {item.images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`${item.type} ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(item.type, index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}

      {allItemsHaveImages && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-900 text-sm">
            ✓ All scrap types have images! Total: {totalImages} image{totalImages !== 1 ? 's' : ''}
          </p>
        </div>
      )}

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
          onClick={handleContinue}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          disabled={!allItemsHaveImages}
        >
          Continue to Address
        </Button>
      </div>
    </div>
  );
}