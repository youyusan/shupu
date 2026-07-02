'use client';

import type { Step } from '@/lib/state/app-context';

interface StepIndicatorProps {
  currentStep: Step;
}

const steps: { key: Step; label: string }[] = [
  { key: 'home', label: '输入想法' },
  { key: 'structured', label: '确认理解' },
  { key: 'map', label: '参考地图' },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isPast = index < currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
              isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''
            }`}>
              {isActive ? (
                <span className="bg-accent text-bg w-full h-full flex items-center justify-center rounded-full">{index + 1}</span>
              ) : isPast ? (
                <span className="bg-accent/20 text-accent w-full h-full flex items-center justify-center rounded-full">{index + 1}</span>
              ) : (
                <span className="bg-surface text-text-muted border border-border-subtle w-full h-full flex items-center justify-center rounded-full">
                  {index + 1}
                </span>
              )}
            </div>
            <span
              className={`ml-2 text-sm transition-colors duration-300 ${
                isActive
                  ? 'text-text font-semibold'
                  : isPast
                  ? 'text-text-secondary'
                  : 'text-text-muted'
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-2 transition-colors duration-300 ${
                  isPast ? 'bg-accent' : 'bg-border-subtle'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}