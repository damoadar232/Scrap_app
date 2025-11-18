import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeStepProps {
  initialDate: string;
  initialTime: string;
  onNext: (data: { date: string; time: string }) => void;
  onBack: () => void;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function DateTimeStep({ initialDate, initialTime, onNext, onBack }: DateTimeStepProps) {
  const [date, setDate] = useState(initialDate || '');
  const [time, setTime] = useState(initialTime || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      onNext({ date, time });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-600 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Schedule Pickup</h3>
            <p className="text-gray-600 text-sm">Choose your preferred date and time</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Pickup Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              required
              className="h-12"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Pickup Time *</Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant="outline"
                  onClick={() => setTime(slot)}
                  className={`h-12 ${
                    time === slot
                      ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700 hover:text-white'
                      : 'hover:bg-orange-50'
                  }`}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {date && time && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="bg-green-600 p-2 rounded-full flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-green-900">Pickup scheduled for:</p>
              <p className="text-green-700">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} at {time}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          ⏰ <span className="font-medium">Pickup Window:</span> Our team will arrive within 1 hour of your selected time slot.
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
          className="flex-1 h-12 bg-green-600 hover:bg-green-700"
          disabled={!date || !time}
        >
          Review Request
        </Button>
      </div>
    </form>
  );
}
