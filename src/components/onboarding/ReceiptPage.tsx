import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Loader2, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectedOption } from "@/types/plan";
import { BusinessDetails, SurveyAnswers } from "@/types/onboarding";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptPageProps {
  selectedOptions: SelectedOption[];
  discount: number;
  businessDetails: BusinessDetails;
  surveyAnswers: SurveyAnswers;
  onBack: () => void;
  userEmail?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Work completion estimates based on service type
const getWorkEstimate = (optionId: string): string => {
  const estimates: Record<string, string> = {
    "instagram": "1-2 days",
    "facebook": "1-2 days",
    "linkedin": "1-2 days",
    "twitter": "1-2 days",
    "youtube": "2-3 days",
    "gmb": "2-3 days",
    "basic-landing": "5-7 days",
    "landing-domain": "5-7 days",
    "advanced-website": "15-20 days",
    "domain-hosting": "1-2 days",
    "mid-app": "30-45 days",
    "advanced-app": "45-60 days",
    "ad-pack-4": "7-10 days",
    "ad-15sec": "3-4 days",
    "ad-30sec": "4-5 days",
    "ad-above-30": "5-7 days",
    "short-movie": "15-20 days",
    "one-week-boost": "Starts within 24hrs",
    "boost-pack-4": "Weekly schedule",
    "whatsapp-broadcast": "Setup: 2-3 days",
    "email-marketing": "Setup: 3-5 days",
  };
  return estimates[optionId] || "3-5 days";
};

export function ReceiptPage({
  selectedOptions,
  discount,
  businessDetails,
  surveyAnswers,
  onBack,
  userEmail,
}: ReceiptPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const subtotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const discountableAmount = selectedOptions
    .filter((opt) => !opt.excludeFromDiscount)
    .reduce((sum, opt) => sum + opt.price, 0);
  const discountAmount = (discountableAmount * discount) / 100;
  const total = subtotal - discountAmount;
  const advancePayment = Math.round(total * 0.3);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        setIsProcessing(false);
        return;
      }

      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: advancePayment * 100,
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: { businessName: businessDetails.businessName, email: businessDetails.email },
          },
        }
      );

      if (orderError || !orderData?.orderId) {
        console.error("Order error:", orderError);
        toast.error("Failed to create order");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: advancePayment * 100,
        currency: "INR",
        name: "AIZBOOSTR",
        description: "Advance Payment for Marketing Plan",
        order_id: orderData.orderId,
        prefill: {
          name: businessDetails.businessName,
          email: businessDetails.email,
          contact: businessDetails.phone,
        },
        theme: { color: "#22c55e" },
        handler: async function (response: any) {
          try {
            const { error: verifyError } = await supabase.functions.invoke("verify-payment", {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  businessDetails,
                  surveyAnswers,
                  selectedOptions,
                  discount,
                  subtotal,
                  discountAmount,
                  total,
                  advancePayment,
                  userEmail: userEmail || businessDetails.email,
                },
              },
            });

            if (verifyError) {
              console.error("Verify error:", verifyError);
              toast.error("Payment verification failed");
              return;
            }

            setPaymentComplete(true);
            toast.success("Payment successful! Check your email for confirmation.");
          } catch (err) {
            console.error("Handler error:", err);
            toast.error("Something went wrong");
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong");
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptHtml = `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>AIZBOOSTR Receipt</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #22c55e; text-align: center; }
        .item { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; }
        .total { font-size: 24px; font-weight: bold; margin-top: 20px; padding: 20px; background: #f9f9f9; }
        .brand-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
      </style></head>
      <body>
        <h1>AIZBOOSTR</h1>
        <p style="text-align:center;"><strong>WE ARE THE BRAND BUILDING BRAND.</strong></p>
        <div class="brand-info">
          <h3>Brand Details</h3>
          <p><strong>Business:</strong> ${businessDetails.businessName}</p>
          <p><strong>Email:</strong> ${businessDetails.email}</p>
          <p><strong>Phone:</strong> ${businessDetails.phone}</p>
          ${businessDetails.website ? `<p><strong>Website:</strong> ${businessDetails.website}</p>` : ''}
          <p><strong>About:</strong> ${businessDetails.brandDetails}</p>
        </div>
        <h3>Services & Timeline</h3>
        ${selectedOptions.map(opt => `
          <div class="item">
            <div><strong>${opt.name}</strong><br><small>Est. completion: ${getWorkEstimate(opt.optionId)}</small></div>
            <div><strong>₹${opt.price.toLocaleString("en-IN")}</strong></div>
          </div>
        `).join('')}
        <div class="total">
          <div style="display:flex;justify-content:space-between;"><span>Total</span><span>₹${total.toLocaleString("en-IN")}</span></div>
          <div style="display:flex;justify-content:space-between;margin-top:10px;color:#22c55e;"><span>Advance Paid (30%)</span><span>₹${advancePayment.toLocaleString("en-IN")}</span></div>
        </div>
      </body></html>
    `;
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aizboostr-receipt-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded!");
  };

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-700">
        <Card className="p-8 shadow-strong border-border/50 text-center">
          <div className="w-20 h-20 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you, {businessDetails.businessName}! We've sent a confirmation email.
          </p>
          <div className="bg-secondary/30 p-4 rounded-lg mb-6">
            <p className="font-semibold">Amount Paid: ₹{advancePayment.toLocaleString("en-IN")}</p>
            <p className="text-sm text-muted-foreground">Remaining: ₹{(total - advancePayment).toLocaleString("en-IN")} after completion</p>
          </div>
          <Button onClick={handleDownloadReceipt} variant="outline" className="border-2">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button variant="ghost" onClick={onBack} className="mb-6" disabled={isProcessing}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Brand Info & Order */}
        <Card className="md:col-span-2 p-6 shadow-strong border-border/50">
          {/* Brand Info */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Brand Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-muted-foreground">Business:</span> {businessDetails.businessName}</p>
              <p><span className="text-muted-foreground">Email:</span> {businessDetails.email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {businessDetails.phone}</p>
              {businessDetails.website && <p><span className="text-muted-foreground">Website:</span> {businessDetails.website}</p>}
            </div>
            <p className="text-sm mt-2"><span className="text-muted-foreground">About:</span> {businessDetails.brandDetails}</p>
          </div>

          <h2 className="text-xl font-display font-bold mb-4">Order Summary</h2>

          <div className="space-y-3">
            {selectedOptions.map((option) => (
              <div key={`${option.sectionId}-${option.optionId}`} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Est: {getWorkEstimate(option.optionId)}</span>
                    </div>
                  </div>
                </div>
                <span className="font-semibold">₹{option.price.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Discount ({discount}%)</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </Card>

        {/* Payment */}
        <Card className="p-6 shadow-strong border-border/50 h-fit">
          <h3 className="text-xl font-display font-bold mb-4">Payment</h3>
          <div className="p-4 rounded-lg gradient-accent text-accent-foreground mb-4">
            <p className="text-sm mb-1">Advance (30%)</p>
            <p className="text-3xl font-bold">₹{advancePayment.toLocaleString("en-IN")}</p>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 mb-6">
            <li>• 30% advance to start work</li>
            <li>• 70% after completion</li>
            <li>• Secure Razorpay payment</li>
          </ul>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full gradient-accent text-accent-foreground font-semibold py-6 text-lg"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</>
            ) : (
              <><CreditCard className="w-5 h-5 mr-2" />Pay ₹{advancePayment.toLocaleString("en-IN")}</>
            )}
          </Button>
        </Card>
      </div>

      {/* Terms */}
      <Card className="mt-6 p-4 shadow-elegant border-border/50">
        <h4 className="font-semibold mb-2 text-sm">Terms & Conditions</h4>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Only 3 revisions within 3 hours of delivery for videos, websites, apps.</li>
          <li>No refunds. Extra charges apply for changes after completion.</li>
          <li>Watermark on all ad videos made by us.</li>
        </ol>
      </Card>
    </div>
  );
}
