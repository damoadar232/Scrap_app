import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronRight, Check, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface ScrapTypeSelectionProps {
  onSelectTypes: (types: ('metal' | 'paper' | 'plastic' | 'glass' | 'ewaste')[]) => void;
}

const scrapTypes = [
  {
    id: 'metal' as const,
    name: 'Metal',
    description: 'Iron, steel, aluminum, copper',
    image: 'https://images.unsplash.com/photo-1625662276901-4a7ec44fbeed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMHNjcmFwJTIwcmVjeWNsaW5nfGVufDF8fHx8MTc2MTA1ODUwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-gray-500 to-gray-700'
  },
  {
    id: 'paper' as const,
    name: 'Paper',
    description: 'Cardboard, newspapers, magazines',
    image: 'https://images.unsplash.com/photo-1757078059269-0ccbd674b1e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGNhcmRib2FyZCUyMHJlY3ljbGluZ3xlbnwxfHx8fDE3NjEwNTg1MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-amber-500 to-amber-700'
  },
  {
    id: 'plastic' as const,
    name: 'Plastic',
    description: 'Bottles, containers, packaging',
    image: 'https://images.unsplash.com/photo-1557344252-4d5c9909579c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYm90dGxlcyUyMHJlY3ljbGluZ3xlbnwxfHx8fDE3NjEwMTA4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'glass' as const,
    name: 'Glass',
    description: 'Bottles, jars, containers',
    image: 'https://images.unsplash.com/photo-1554208873-4292cf6c952d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGJvdHRsZXMlMjByZWN5Y2xpbmd8ZW58MXx8fHwxNzYxMDQwMzg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'ewaste' as const,
    name: 'E-Waste',
    description: 'Electronics & appliances',
    image: 'https://images.unsplash.com/photo-1740803292349-c7e53f7125b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwd2FzdGUlMjBhcHBsaWFuY2VzJTIwcmVmcmlnZXJhdG9yfGVufDF8fHx8MTc2MTQ2NjU1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-purple-500 to-purple-700',
    items: ['Refrigerators', 'Air Conditioners', 'Washing Machines', 'Stitching Machines', 'Batteries', 'Laptops', 'Mobile Phones', 'TVs', 'Microwaves']
  }
];

export function ScrapTypeSelection({ onSelectTypes }: ScrapTypeSelectionProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const toggleType = (typeId: string) => {
    const newSelected = new Set(selectedTypes);
    if (newSelected.has(typeId)) {
      newSelected.delete(typeId);
    } else {
      newSelected.add(typeId);
    }
    setSelectedTypes(newSelected);
  };

  const handleContinue = () => {
    if (selectedTypes.size > 0) {
      onSelectTypes(Array.from(selectedTypes) as ('metal' | 'paper' | 'plastic' | 'glass' | 'ewaste')[]);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-gray-900">Select Scrap Types</h2>
        <p className="text-gray-600">Choose all types of scrap you want to schedule for pickup</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {scrapTypes.map((scrap) => {
          const isSelected = selectedTypes.has(scrap.id);
          return (
            <Card
              key={scrap.id}
              className={`overflow-hidden cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
                isSelected ? 'ring-2 ring-green-600 shadow-lg' : 'hover:shadow-lg'
              }`}
              onClick={() => toggleType(scrap.id)}
            >
              <div className="relative h-32">
                <ImageWithFallback
                  src={scrap.image}
                  alt={scrap.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${scrap.color} opacity-60`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white">{scrap.name}</h3>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <p className="text-gray-600 text-sm">{scrap.description}</p>
                {'items' in scrap && scrap.items && (
                  <>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {scrap.items.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                          {item}
                        </span>
                      ))}
                      {scrap.items.length > 3 && (
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                          +{scrap.items.length - 3} more
                        </span>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-purple-600 hover:text-purple-700 mt-2 flex items-center gap-1"
                        >
                          <Info className="w-3 h-3" />
                          View all items
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${scrap.color} flex items-center justify-center`}>
                              <span className="text-white text-sm">♻️</span>
                            </div>
                            {scrap.name} Items We Accept
                          </DialogTitle>
                          <DialogDescription>
                            We accept the following {scrap.name.toLowerCase()} items for recycling
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {scrap.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                              <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span className="text-sm text-gray-900">{item}</span>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                <div className="flex items-center justify-end mt-2 text-green-600">
                  <span className="text-sm">{isSelected ? 'Selected' : 'Select'}</span>
                  {!isSelected && <ChevronRight className="w-4 h-4 ml-1" />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedTypes.size > 0 && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-900">
              ✓ {selectedTypes.size} scrap type{selectedTypes.size !== 1 ? 's' : ''} selected
            </p>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full h-12 bg-green-600 hover:bg-green-700"
          >
            Continue to Enter Weights
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}