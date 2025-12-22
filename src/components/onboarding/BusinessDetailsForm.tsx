import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusinessDetails } from "@/types/onboarding";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface BusinessDetailsFormProps {
  onNext: (data: BusinessDetails) => void;
  initialData?: BusinessDetails | null;
}

export function BusinessDetailsForm({ onNext, initialData }: BusinessDetailsFormProps) {
  const [formData, setFormData] = useState<BusinessDetails>({
    businessName: initialData?.businessName || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName.trim()) {
      toast.error("Please enter your business name");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    onNext(formData);
  };

  return (
    <Card className="p-8 shadow-strong border-border/50 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Tell us about your business</h2>
        <p className="text-muted-foreground">We'll use this to personalize your marketing plan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="Your Company Name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <Button
          type="submit"
          className="w-full gradient-accent text-accent-foreground font-semibold py-6 text-lg shadow-elegant hover:shadow-strong transition-smooth hover:scale-[1.02]"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </Card>
  );
}
