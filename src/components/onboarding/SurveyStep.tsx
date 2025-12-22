import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyAnswers } from "@/types/onboarding";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface SurveyStepProps {
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

const targetAudiences = [
  { id: "b2c-local", label: "Local consumers (B2C)" },
  { id: "b2c-national", label: "National consumers (B2C)" },
  { id: "b2b-small", label: "Small businesses (B2B)" },
  { id: "b2b-enterprise", label: "Enterprise clients (B2B)" },
  { id: "mixed", label: "Mixed audience" },
];

const budgetRanges = [
  { id: "under-10k", label: "Under ₹10,000/month" },
  { id: "10k-25k", label: "₹10,000 - ₹25,000/month" },
  { id: "25k-50k", label: "₹25,000 - ₹50,000/month" },
  { id: "above-50k", label: "Above ₹50,000/month" },
  { id: "flexible", label: "Flexible / Not decided" },
];

const timelines = [
  { id: "asap", label: "ASAP (Within 1 week)" },
  { id: "2-weeks", label: "Within 2 weeks" },
  { id: "1-month", label: "Within 1 month" },
  { id: "flexible", label: "Flexible timeline" },
];

export function SurveyStep({ onNext, onBack, initialData }: SurveyStepProps) {
  const [businessStage, setBusinessStage] = useState(initialData?.businessStage || "");
  const [interestedServices, setInterestedServices] = useState<string[]>(initialData?.interestedServices || []);
  const [hasBrandAssets, setHasBrandAssets] = useState<boolean | null>(initialData?.hasBrandAssets ?? null);
  const [biggestChallenge, setBiggestChallenge] = useState(initialData?.biggestChallenge || "");
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience || "");
  const [monthlyBudget, setMonthlyBudget] = useState(initialData?.monthlyBudget || "");
  const [timeline, setTimeline] = useState(initialData?.timeline || "");

  const handleServiceToggle = (serviceId: string) => {
    setInterestedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessStage) {
      toast.error("Please select your business stage");
      return;
    }
    if (interestedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    if (hasBrandAssets === null) {
      toast.error("Please tell us about your brand assets");
      return;
    }
    if (!biggestChallenge) {
      toast.error("Please select your biggest challenge");
      return;
    }
    if (!targetAudience) {
      toast.error("Please select your target audience");
      return;
    }
    if (!monthlyBudget) {
      toast.error("Please select your budget range");
      return;
    }
    if (!timeline) {
      toast.error("Please select your timeline");
      return;
    }

    onNext({
      businessStage,
      interestedServices,
      hasBrandAssets,
      biggestChallenge,
      targetAudience,
      monthlyBudget,
      timeline,
    });
  };

  return (
    <Card className="p-8 shadow-strong border-border/50 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Quick Survey</h2>
        <p className="text-muted-foreground">Help us understand your needs (7 quick questions)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Q1: Business Stage */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">1. What best describes your current stage?</Label>
          <RadioGroup
            value={businessStage}
            onValueChange={setBusinessStage}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {businessStages.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  businessStage === stage.id ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                }`}
              >
                <RadioGroupItem value={stage.id} id={stage.id} />
                <Label htmlFor={stage.id} className="cursor-pointer flex-1 text-sm">
                  {stage.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Q2: Services */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">2. What services are you interested in? (Select all)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {serviceOptions.map((service) => (
              <div
                key={service.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  interestedServices.includes(service.id)
                    ? "border-accent bg-accent/5"
                    : "border-border/50 hover:border-border"
                }`}
              >
                <Checkbox
                  checked={interestedServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                />
                <Label className="cursor-pointer flex-1 text-sm">{service.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Q3: Brand Assets */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">3. Do you have existing brand assets?</Label>
          <RadioGroup
            value={hasBrandAssets === true ? "yes" : hasBrandAssets === false ? "no" : ""}
            onValueChange={(v) => setHasBrandAssets(v === "yes")}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <label
              htmlFor="brand-yes"
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                hasBrandAssets === true ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
              }`}
            >
              <RadioGroupItem value="yes" id="brand-yes" />
              <span className="cursor-pointer flex-1 text-sm">Yes (logo, website, social pages)</span>
            </label>
            <label
              htmlFor="brand-no"
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                hasBrandAssets === false ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
              }`}
            >
              <RadioGroupItem value="no" id="brand-no" />
              <span className="cursor-pointer flex-1 text-sm">No, starting from scratch</span>
            </label>
          </RadioGroup>
        </div>

        {/* Q4: Challenge */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">4. What's your biggest challenge right now?</Label>
          <RadioGroup
            value={biggestChallenge}
            onValueChange={setBiggestChallenge}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  biggestChallenge === challenge.id
                    ? "border-accent bg-accent/5"
                    : "border-border/50 hover:border-border"
                }`}
              >
                <RadioGroupItem value={challenge.id} id={`ch-${challenge.id}`} />
                <Label htmlFor={`ch-${challenge.id}`} className="cursor-pointer flex-1 text-sm">
                  {challenge.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Q5: Target Audience */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">5. Who is your target audience?</Label>
          <RadioGroup
            value={targetAudience}
            onValueChange={setTargetAudience}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {targetAudiences.map((audience) => (
              <div
                key={audience.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  targetAudience === audience.id ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                }`}
              >
                <RadioGroupItem value={audience.id} id={`ta-${audience.id}`} />
                <Label htmlFor={`ta-${audience.id}`} className="cursor-pointer flex-1 text-sm">
                  {audience.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Q6: Budget */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">6. What's your monthly marketing budget?</Label>
          <RadioGroup
            value={monthlyBudget}
            onValueChange={setMonthlyBudget}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {budgetRanges.map((budget) => (
              <div
                key={budget.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  monthlyBudget === budget.id ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                }`}
              >
                <RadioGroupItem value={budget.id} id={`bg-${budget.id}`} />
                <Label htmlFor={`bg-${budget.id}`} className="cursor-pointer flex-1 text-sm">
                  {budget.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Q7: Timeline */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">7. When do you want to get started?</Label>
          <RadioGroup value={timeline} onValueChange={setTimeline} className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {timelines.map((t) => (
              <div
                key={t.id}
                className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  timeline === t.id ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                }`}
              >
                <RadioGroupItem value={t.id} id={`tl-${t.id}`} />
                <Label htmlFor={`tl-${t.id}`} className="cursor-pointer text-sm">
                  {t.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 border-2 py-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 gradient-accent text-accent-foreground font-semibold py-6 shadow-elegant hover:shadow-strong transition-smooth hover:scale-[1.02]"
          >
            Choose Services
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
