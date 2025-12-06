import { ArrowLeft, Check, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectedOption } from "@/types/plan";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface PlanSummaryProps {
  selectedOptions: SelectedOption[];
  discount: number;
  onBack: () => void;
}

export function PlanSummary({ selectedOptions, discount, onBack }: PlanSummaryProps) {
  const { toast } = useToast();
  const subtotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const advancePayment = total * 0.2;

  const handleDownload = () => {
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Zboost Plan Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #000; }
            h1 { color: #22c55e; text-align: center; font-size: 36px; margin: 10px 0; }
            .header { text-align: center; margin-bottom: 30px; }
            .item { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; }
            .total { font-size: 24px; font-weight: bold; margin-top: 20px; padding: 20px; background: #f9f9f9; }
            .advance { background: #22c55e; color: #ffffff; padding: 30px; text-align: center; margin-top: 30px; border-radius: 8px; }
            .advance h2 { color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: bold; }
            .advance h1 { color: #ffffff; font-size: 48px; margin: 15px 0; font-weight: bold; }
            .advance p { color: #ffffff; font-size: 16px; margin: 15px 0 0 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Zboost</h1>
            <p><strong>WE ARE THE BRAND BUILDING BRAND.</strong></p>
            <p>Custom Plan Receipt</p>
          </div>
          ${selectedOptions.map(opt => `
            <div class="item">
              <div>
                <strong>${opt.name}</strong>
                ${opt.quantity ? `<br><small>${opt.quantity.toLocaleString("en-IN")} views</small>` : ''}
              </div>
              <div><strong>₹${opt.price.toLocaleString("en-IN")}</strong></div>
            </div>
          `).join('')}
          <div class="item" style="margin-top: 20px;">
            <div><strong>Subtotal</strong></div>
            <div><strong>₹${subtotal.toLocaleString("en-IN")}</strong></div>
          </div>
          ${discount > 0 ? `
          <div class="item" style="color: #22c55e;">
            <div><strong>Discount (${discount}%)</strong></div>
            <div><strong>-₹${discountAmount.toLocaleString("en-IN")}</strong></div>
          </div>
          ` : ''}
          <div class="total">
            <div style="display: flex; justify-content: space-between;">
              <span>Total</span>
              <span>₹${total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div class="advance">
            <h2>Advance Payment Required</h2>
            <h1>₹${advancePayment.toLocaleString("en-IN")}</h1>
            <p>Pay 20% of the total amount as advance to get started</p>
          </div>
          <div class="terms" style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #22c55e;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">Terms & Conditions</h3>
            <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Only THREE changes are accepted in the VIDEO, WEBSITE, APP part within 3 HRS of delivery.</li>
              <li>NO REFUND in any case and extra money will be charged to make any changes after the time period of the work gets completed.</li>
              <li>There will be a small watermark on every AD VIDEO made by us.</li>
            </ol>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zboost-plan-receipt-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt Downloaded",
      description: "Your plan receipt has been saved to your device.",
    });
  };

  const handleShare = async () => {
    const shareText = `Zboost Custom Plan\n\nWE ARE THE BRAND BUILDING BRAND.\n\n${selectedOptions.map(opt => 
      `✓ ${opt.name}${opt.quantity ? ` (${opt.quantity.toLocaleString("en-IN")} views)` : ''} - ₹${opt.price.toLocaleString("en-IN")}`
    ).join('\n')}\n\nSubtotal: ₹${subtotal.toLocaleString("en-IN")}${discount > 0 ? `\nDiscount (${discount}%): -₹${discountAmount.toLocaleString("en-IN")}` : ''}\n\nTotal: ₹${total.toLocaleString("en-IN")}\n\nAdvance Payment (20%): ₹${advancePayment.toLocaleString("en-IN")}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Zboost Custom Plan',
          text: shareText,
        });
        toast({
          title: "Plan Shared",
          description: "Your plan has been shared successfully.",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Share link copied! You can now paste it in WhatsApp, email, or anywhere.",
      });
    }
  };

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

          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-2 hover:bg-secondary transition-smooth px-8"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Plan
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
