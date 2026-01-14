import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, SkipForward, Chrome } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BusinessDetails } from "@/types/onboarding";

interface RegistrationStepProps {
  onNext: (data: BusinessDetails, isAuthenticated: boolean) => void;
  onSkip: () => void;
  initialData?: BusinessDetails | null;
}

export function RegistrationStep({ onNext, onSkip, initialData }: RegistrationStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"register" | "signin">("register");
  const [formData, setFormData] = useState<BusinessDetails>({
    businessName: initialData?.businessName || "",
    brandDetails: initialData?.brandDetails || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/?step=survey`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.businessName.trim()) {
      toast.error("Please enter your brand/business name");
      return false;
    }
    if (!formData.brandDetails.trim()) {
      toast.error("Please describe your brand");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: formData.businessName.trim(),
        },
      },
    });

    if (authError) {
      toast.error(authError.message);
      setIsLoading(false);
      return;
    }

    if (authData.user) {
      await supabase.from("profiles").insert({
        user_id: authData.user.id,
        full_name: formData.businessName.trim(),
        phone: formData.phone.trim(),
        company_name: formData.businessName.trim(),
        company_type: "other",
        industry: "other",
      });
    }

    toast.success("Account created successfully!");
    onNext(formData, true);
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back!");
    onNext(formData, true);
    setIsLoading(false);
  };

  const handleSkip = () => {
    if (!validateForm()) return;
    onNext(formData, false);
  };

  return (
    <Card className="p-8 shadow-strong border-border/50 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Let's Get Started</h2>
        <p className="text-muted-foreground">Tell us about your brand to create a personalized plan</p>
      </div>

      {/* Google Sign In - Quick Option */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full mb-6 py-6 border-2 hover:bg-secondary/50"
      >
        <Chrome className="w-5 h-5 mr-2" />
        Continue with Google (Fastest)
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or fill in details</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "register" | "signin")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="register">New User</TabsTrigger>
          <TabsTrigger value="signin">Existing User</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Brand / Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Your Brand Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandDetails">Tell us about your brand *</Label>
              <Textarea
                id="brandDetails"
                value={formData.brandDetails}
                onChange={(e) => setFormData({ ...formData, brandDetails: e.target.value })}
                placeholder="What does your brand do? What makes it unique?"
                rows={3}
                required
              />
            </div>

            <div className="space-y-4">
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full"
                  required
                />
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1 border-2 py-6"
                disabled={isLoading}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip for Now
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-accent text-accent-foreground font-semibold py-6 shadow-elegant hover:shadow-strong transition-smooth hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-accent text-accent-foreground font-semibold py-6 shadow-elegant hover:shadow-strong transition-smooth hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In & Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
