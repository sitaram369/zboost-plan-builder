import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { BusinessDetails, SurveyAnswers, OnboardingStep } from "@/types/onboarding";
import { SelectedOption } from "@/types/plan";
import { StepIndicator } from "./StepIndicator";
import { RegistrationStep } from "./RegistrationStep";
import { SurveyStep } from "./SurveyStep";
import { PlanSelectionStep } from "./PlanSelectionStep";
import { ReceiptPage } from "./ReceiptPage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const STEPS: { id: OnboardingStep; label: string }[] = [
  { id: "auth", label: "Register" },
  { id: "survey", label: "Survey" },
  { id: "plan", label: "Services" },
  { id: "billing", label: "Payment" },
];

export function OnboardingFlow({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("auth");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthenticated(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthenticated(true);
      }
    });

    // Check URL for step param (for Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    if (stepParam === "survey") {
      setCurrentStep("survey");
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleRegistrationNext = (data: BusinessDetails, authenticated: boolean) => {
    setBusinessDetails(data);
    setIsAuthenticated(authenticated);
    setCurrentStep("survey");
  };

  const handleSurveyNext = (data: SurveyAnswers) => {
    setSurveyAnswers(data);
    setCurrentStep("plan");
  };

  const handlePlanNext = (options: SelectedOption[], discountValue: number) => {
    setSelectedOptions(options);
    setDiscount(discountValue);
    setCurrentStep("billing");
  };

  const handleBack = () => {
    if (currentStep === "survey") setCurrentStep("auth");
    else if (currentStep === "plan") setCurrentStep("survey");
    else if (currentStep === "billing") setCurrentStep("plan");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold font-display">Z</span>
            </div>
            <span className="font-display font-bold">Zboost</span>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        {/* Steps */}
        {currentStep === "auth" && (
          <RegistrationStep
            onNext={handleRegistrationNext}
            onSkip={() => {
              // Still need business details even if skipping auth
            }}
            initialData={businessDetails}
          />
        )}

        {currentStep === "survey" && (
          <SurveyStep
            onNext={handleSurveyNext}
            onBack={handleBack}
            initialData={surveyAnswers}
          />
        )}

        {currentStep === "plan" && (
          <PlanSelectionStep
            onNext={handlePlanNext}
            onBack={handleBack}
            initialOptions={selectedOptions}
            initialDiscount={discount}
          />
        )}

        {currentStep === "billing" && businessDetails && surveyAnswers && (
          <ReceiptPage
            selectedOptions={selectedOptions}
            discount={discount}
            businessDetails={businessDetails}
            surveyAnswers={surveyAnswers}
            onBack={handleBack}
            userEmail={user?.email || businessDetails.email}
          />
        )}
      </div>
    </div>
  );
}
