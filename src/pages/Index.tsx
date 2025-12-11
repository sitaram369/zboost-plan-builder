import { ThemeToggle } from "@/components/ThemeToggle";
import { PlanCustomizer } from "@/components/PlanCustomizer";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleSignOut = async () => {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-md z-50 shadow-elegant">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl font-display">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold tracking-tight">AIZboostr</h1>
                <p className="text-xs text-muted-foreground">AI Marketing & Automation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user ? <Button variant="outline" className="border-2 hover:bg-secondary transition-smooth" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button> : <Link to="/auth">
                  <Button variant="outline" className="border-2 hover:bg-secondary transition-smooth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border/50 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-accent font-semibold text-sm">We are the brand building brand.</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">Build Your Custom
marketing plan</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose from our comprehensive services and create a tailored plan that fits your business needs perfectly.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Customizer */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <PlanCustomizer />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Zboost. All rights reserved.</p>
            <p className="mt-2">AI Marketing & Automation Agency</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;