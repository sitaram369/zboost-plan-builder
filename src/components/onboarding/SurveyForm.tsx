import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyAnswers } from "@/types/onboarding";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface SurveyFormProps {
  onNext: (data: SurveyAnswers) => void;
  onBack: () => void;
  initialData?: SurveyAnswers | null;
}

const businessStages = [
  { id: "idea", label: "Just starting (idea / pre-launch)" },
  { id: "early", label: "Early startup (0–1 year)" },
  { id: "growing", label: "Growing business (1–3 years)" },
  { id: "established", label: "Established brand (3+ years)" },
];

const serviceOptions = [
  { id: "logo", label: "Logo & Visual Identity" },
  { id: "strategy", label: "Brand Strategy & Positioning" },
  { id: "website", label: "Website / Landing Page" },
  { id: "social", label: "Social Media Branding" },
  { id: "marketing", label: "Marketing & Growth Automation" },
  { id: "unsure", label: "Not sure – need guidance" },
];

const challenges = [
  { id: "visibility", label: "Low visibility / awareness" },
  { id: "design", label: "Poor brand design" },
  { id: "conversions", label: "Low conversions or sales" },
  { id: "inconsistent", label: "Inconsistent branding" },
  { id: "start", label: "Don't know where to start" },
];

export function SurveyForm({ onNext, onBack, initialData }: SurveyFormProps) {
  const [businessStage, setBusinessStage] = useState(initialData?.businessStage || "");
  const [interestedServices, setInterestedServices] = useState<string[]>(initialData?.interestedServices || []);
  const [hasBrandAssets, setHasBrandAssets] = useState<boolean | null>(initialData?.hasBrandAssets ?? null);
  const [biggestChallenge, setBiggestChallenge] = useState(initialData?.biggestChallenge || "");

  const handleServiceToggle = (serviceId: string) => {
    setInterestedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessStage) {
      toast.error("Please select your business stage");
      return;
    }

    if (interestedServices.length === 0) {
      toast.error("Please select at least one service you're interested in");
      return;
    }

    if (hasBrandAssets === null) {
      toast.error("Please tell us if you have brand assets");
      return;
    }

    if (!biggestChallenge) {
      toast.error("Please select your biggest challenge");
      return;
    }

    onNext({
      businessStage,
      interestedServices,
      hasBrandAssets,
      biggestChallenge,
    });
  };

  return (
    <Card className="p-8 shadow-strong border-border/50 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Quick Survey</h2>
        <p className="text-muted-foreground">Help us understand your needs better</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business Stage */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">What best describes your current stage?</Label>
          <RadioGroup value={businessStage} onValueChange={setBusinessStage} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {businessStages.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  businessStage === stage.id
                    ? "border-accent bg-accent/5"
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => setBusinessStage(stage.id)}
              >
                <RadioGroupItem value={stage.id} id={stage.id} />
                <Label htmlFor={stage.id} className="cursor-pointer flex-1">
                  {stage.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">What services are you most interested in? (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <div
                key={service.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  interestedServices.includes(service.id)
                    ? "border-accent bg-accent/5"
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <Checkbox
                  checked={interestedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                />
                <Label className="cursor-pointer flex-1">{service.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Assets */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Do you currently have any brand assets?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                hasBrandAssets === true ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
              }`}
              onClick={() => setHasBrandAssets(true)}
            >
              <RadioGroupItem checked={hasBrandAssets === true} value="yes" />
              <Label className="cursor-pointer flex-1">Yes (logo, website, social pages)</Label>
            </div>
            <div
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                hasBrandAssets === false ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
              }`}
              onClick={() => setHasBrandAssets(false)}
            >
              <RadioGroupItem checked={hasBrandAssets === false} value="no" />
              <Label className="cursor-pointer flex-1">No, I need everything from scratch</Label>
            </div>
          </div>
        </div>

        {/* Biggest Challenge */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">What is your biggest challenge right now?</Label>
          <RadioGroup value={biggestChallenge} onValueChange={setBiggestChallenge} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  biggestChallenge === challenge.id
                    ? "border-accent bg-accent/5"
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => setBiggestChallenge(challenge.id)}
              >
                <RadioGroupItem value={challenge.id} id={`challenge-${challenge.id}`} />
                <Label htmlFor={`challenge-${challenge.id}`} className="cursor-pointer flex-1">
                  {challenge.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-2 py-6 text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 gradient-accent text-accent-foreground font-semibold py-6 text-lg shadow-elegant hover:shadow-strong transition-smooth hover:scale-[1.02]"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
