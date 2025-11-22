import React from 'react';
import { AppStep } from '../types';

interface Props {
  currentStep: AppStep;
}

export const StepIndicator: React.FC<Props> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.LYRICS_INPUT, label: 'เนื้อเพลง' },
    { id: AppStep.CHARACTER_DESIGN, label: 'ตัวละคร' },
    { id: AppStep.STORYBOARD_REVIEW, label: 'สตอรี่บอร์ด' },
    { id: AppStep.GENERATION_GALLERY, label: 'สร้างภาพ' },
  ];

  return (
    <div className="w-full flex justify-center py-6 mb-4">
      <div className="flex items-center space-x-2 md:space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all duration-300
                  ${
                    currentStep >= step.id
                      ? 'border-cinema-accent bg-cinema-accent text-white'
                      : 'border-cinema-700 bg-transparent text-cinema-dim'
                  }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium hidden md:block ${
                  currentStep >= step.id ? 'text-white' : 'text-cinema-dim'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 md:w-16 h-0.5 transition-all duration-300 ${
                  currentStep > step.id ? 'bg-cinema-accent' : 'bg-cinema-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};