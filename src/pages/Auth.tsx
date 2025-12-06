import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back to Zboost!");
    navigate("/");
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("signup-name") as string;
    const phone = formData.get("signup-phone") as string;
    const email = formData.get("signup-email") as string;
    const companyName = formData.get("signup-company") as string;
    const companyType = formData.get("signup-company-type") as string;
    const industry = formData.get("signup-industry") as string;
    const password = formData.get("signup-password") as string;
    const confirmPassword = formData.get("signup-confirm") as string;

    // Validation
    if (!fullName.trim() || !email.trim() || !companyName.trim() || !companyType || !industry) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/`;

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (authError) {
      toast.error(authError.message);
      setIsLoading(false);
      return;
    }

    if (!authData.user) {
      toast.error("Failed to create account");
      setIsLoading(false);
      return;
    }

    // Create the profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authData.user.id,
      full_name: fullName.trim(),
      phone: phone.trim() || null,
      company_name: companyName.trim(),
      company_type: companyType,
      industry: industry,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      toast.error("Account created but failed to save profile. Please contact support.");
      setIsLoading(false);
      return;
    }

    toast.success("Account created successfully!");
    navigate("/");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl font-display">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold tracking-tight">Zboost</h1>
                <p className="text-xs text-muted-foreground">AI Marketing & Automation</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link to="/">
            <Button variant="ghost" className="mb-6 hover:bg-secondary transition-smooth">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Card className="p-8 shadow-strong border-border/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-2">Welcome</h2>
              <p className="text-muted-foreground">
                Sign in to access your custom plans
              </p>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="signin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-accent text-accent-foreground font-semibold shadow-elegant hover:shadow-strong transition-smooth hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        name="signup-name"
                        type="text"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone (Optional)</Label>
                      <Input
                        id="signup-phone"
                        name="signup-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-company">Company Name</Label>
                      <Input
                        id="signup-company"
                        name="signup-company"
                        type="text"
                        placeholder="Your Company"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-company-type">Company Type</Label>
                      <select
                        id="signup-company-type"
                        name="signup-company-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="startup">Startup</option>
                        <option value="small-business">Small Business</option>
                        <option value="medium-enterprise">Medium Enterprise</option>
                        <option value="large-enterprise">Large Enterprise</option>
                        <option value="agency">Agency</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-industry">Industry</Label>
                    <select
                      id="signup-industry"
                      name="signup-industry"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="finance">Finance</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="food">Food & Beverage</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        name="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-accent text-accent-foreground font-semibold shadow-elegant hover:shadow-strong transition-smooth hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Auth;
