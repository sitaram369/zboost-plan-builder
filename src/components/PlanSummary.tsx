import { ArrowLeft, Check, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectedOption } from "@/types/plan";
import { Separator } from "@/components/ui/separator";

interface PlanSummaryProps {
  selectedOptions: SelectedOption[];
  discount: number;
  onBack: () => void;
}

export function PlanSummary({ selectedOptions, discount, onBack }: PlanSummaryProps) {
  const subtotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const advancePayment = total * 0.2;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-secondary transition-smooth"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Customization
      </Button>

      <Card className="p-8 shadow-strong border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Your Custom Plan</h1>
          <p className="text-muted-foreground text-lg">
            We are the brand building brand.
          </p>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          {selectedOptions.map((option) => (
            <div
              key={`${option.sectionId}-${option.optionId}`}
              className="flex items-start justify-between gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{option.name}</h3>
                  {option.quantity && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.quantity.toLocaleString("en-IN")} views
                    </p>
                  )}
                </div>
              </div>
              <div className="font-semibold whitespace-nowrap">
                {option.price > 0 ? `₹${option.price.toLocaleString("en-IN")}` : "Custom"}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="space-y-4">
          <div className="flex justify-between text-lg">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-lg text-accent">
              <span>Discount ({discount}%)</span>
              <span className="font-semibold">-₹{discountAmount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-2xl font-bold font-display">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="p-6 rounded-lg gradient-accent text-accent-foreground mt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Advance Payment Required</h3>
              <div className="text-4xl font-display font-bold mb-2">
                ₹{advancePayment.toLocaleString("en-IN")}
              </div>
              <p className="text-accent-foreground/90">
                Pay 20% of the total amount as advance to get started
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              variant="outline"
              className="flex-1 border-2 hover:bg-secondary transition-smooth"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Plan
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-2 hover:bg-secondary transition-smooth"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Plan
            </Button>
            <Button className="flex-1 gradient-accent text-accent-foreground font-semibold shadow-elegant hover:shadow-strong transition-smooth hover:scale-105">
              Proceed to Payment
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
