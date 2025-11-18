import { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ArrowLeft } from 'lucide-react';
import { WeightStep } from './steps/WeightStep';
import { ImageUploadStep } from './steps/ImageUploadStep';
import { AddressStep } from './steps/AddressStep';
import { DateTimeStep } from './steps/DateTimeStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import type { PickupRequest, ScrapItem } from './Dashboard';

interface PickupRequestFlowProps {
  scrapTypes: ('metal' | 'paper' | 'plastic' | 'glass' | 'ewaste')[];
  onComplete: (request: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>) => void;
  onCancel: () => void;
}

type Step = 'weights' | 'images' | 'address' | 'datetime' | 'confirmation';

const stepTitles: Record<Step, string> = {
  weights: 'Enter Weights',
  images: 'Upload Images',
  address: 'Enter Address',
  datetime: 'Schedule Pickup',
  confirmation: 'Confirm Request'
};

export function PickupRequestFlow({ scrapTypes, onComplete, onCancel }: PickupRequestFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('weights');
  const [formData, setFormData] = useState({
    scrapItems: scrapTypes.map(type => ({ type, weight: 0, images: [] as string[] })) as ScrapItem[],
    address: '',
    date: '',
    time: ''
  });

  const steps: Step[] = ['weights', 'images', 'address', 'datetime', 'confirmation'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    } else {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onComplete({
      scrapItems: formData.scrapItems,
      address: formData.address,
      date: formData.date,
      time: formData.time
    });
  };

  return (
    <div className="min-h-[calc(100vh-72px)]">
      {/* Progress Header */}
      <div className="bg-white border-b sticky top-[72px] z-10">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-gray-900">{stepTitles[currentStep]}</h2>
              <p className="text-gray-600 text-sm">
                {scrapTypes.length} type{scrapTypes.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4">
        {currentStep === 'weights' && (
          <WeightStep
            scrapTypes={scrapTypes}
            initialScrapItems={formData.scrapItems}
            onNext={handleNext}
          />
        )}

        {currentStep === 'images' && (
          <ImageUploadStep
            scrapItems={formData.scrapItems}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'address' && (
          <AddressStep
            initialAddress={formData.address}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'datetime' && (
          <DateTimeStep
            initialDate={formData.date}
            initialTime={formData.time}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'confirmation' && (
          <ConfirmationStep
            scrapItems={formData.scrapItems}
            address={formData.address}
            date={formData.date}
            time={formData.time}
            onConfirm={handleConfirm}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}