import { Check } from "lucide-react";
import { OnboardingStep } from "@/types/onboarding";

interface StepIndicatorProps {
  currentStep: OnboardingStep;
  steps: { id: OnboardingStep; label: string }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isCurrent
                    ? "bg-accent text-accent-foreground ring-4 ring-accent/20"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-xs mt-1 hidden md:block ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 md:w-20 h-1 mx-2 rounded-full transition-all duration-300 ${
                  isCompleted ? "bg-accent" : "bg-secondary"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
