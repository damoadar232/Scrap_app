import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Weight, Package } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { ScrapItem } from '../Dashboard';

interface WeightStepProps {
  scrapTypes: ('metal' | 'paper' | 'plastic' | 'glass' | 'ewaste')[];
  initialScrapItems: ScrapItem[];
  onNext: (data: { scrapItems: ScrapItem[] }) => void;
}

const quickWeights = [5, 10, 25, 50, 100];

const typeColors = {
  metal: 'bg-gray-100 text-gray-700 border-gray-300',
  paper: 'bg-amber-100 text-amber-700 border-amber-300',
  plastic: 'bg-blue-100 text-blue-700 border-blue-300',
  glass: 'bg-green-100 text-green-700 border-green-300',
  ewaste: 'bg-purple-100 text-purple-700 border-purple-300'
};

export function WeightStep({ scrapTypes, initialScrapItems, onNext }: WeightStepProps) {
  const [weights, setWeights] = useState<Record<string, string>>(
    scrapTypes.reduce((acc, type) => {
      const existing = initialScrapItems.find(item => item.type === type);
      acc[type] = existing?.weight ? existing.weight.toString() : '';
      return acc;
    }, {} as Record<string, string>)
  );

  const handleWeightChange = (type: string, value: string) => {
    setWeights({ ...weights, [type]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allFilled = scrapTypes.every(type => {
      const weight = parseFloat(weights[type]);
      return !isNaN(weight) && weight > 0;
    });

    if (allFilled) {
      const scrapItems: ScrapItem[] = scrapTypes.map(type => {
        const existing = initialScrapItems.find(item => item.type === type);
        return {
          type,
          weight: parseFloat(weights[type]),
          images: existing?.images || []
        };
      });
      onNext({ scrapItems });
    }
  };

  const allFilled = scrapTypes.every(type => {
    const weight = parseFloat(weights[type]);
    return !isNaN(weight) && weight > 0;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-600 p-3 rounded-full">
            <Weight className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Approximate Weights</h3>
            <p className="text-gray-600 text-sm">Enter weight for each scrap type</p>
          </div>
        </div>
      </Card>

      {scrapTypes.map((type, index) => (
        <Card key={type} className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-400" />
            <Badge variant="outline" className={typeColors[type]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`weight-${type}`}>Weight (kg)</Label>
            <Input
              id={`weight-${type}`}
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Enter weight in kilograms"
              value={weights[type]}
              onChange={(e) => handleWeightChange(type, e.target.value)}
              required
              className="text-lg h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Quick Select</Label>
            <div className="flex flex-wrap gap-2">
              {quickWeights.map((w) => (
                <Button
                  key={w}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleWeightChange(type, w.toString())}
                  className={weights[type] === w.toString() ? 'bg-green-100 border-green-600' : ''}
                >
                  {w} kg
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          💡 <span className="font-medium">Tip:</span> You can provide approximate weights. Our team will verify the exact weight during pickup.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-green-600 hover:bg-green-700"
        disabled={!allFilled}
      >
        Continue to Image Upload
      </Button>
    </form>
  );
}