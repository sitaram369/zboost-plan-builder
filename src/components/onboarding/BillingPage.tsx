import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectedOption } from "@/types/plan";
import { BusinessDetails, SurveyAnswers } from "@/types/onboarding";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BillingPageProps {
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

export function BillingPage({
  selectedOptions,
  discount,
  businessDetails,
  surveyAnswers,
  onBack,
  userEmail,
}: BillingPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);

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
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: advancePayment * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: {
              businessName: businessDetails.businessName,
              email: businessDetails.email,
            },
          },
        }
      );

      if (orderError || !orderData?.orderId) {
        console.error("Order creation error:", orderError);
        toast.error("Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: advancePayment * 100,
        currency: "INR",
        name: "Zboost",
        description: "Advance Payment for Marketing Plan",
        order_id: orderData.orderId,
        prefill: {
          name: businessDetails.businessName,
          email: businessDetails.email,
          contact: businessDetails.phone,
        },
        theme: {
          color: "#22c55e",
        },
        handler: async function (response: any) {
          // Verify payment and send emails
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-payment",
              {
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
              }
            );

            if (verifyError) {
              console.error("Verification error:", verifyError);
              toast.error("Payment verification failed. Please contact support.");
              return;
            }

            toast.success("Payment successful! Check your email for confirmation.");
          } catch (err) {
            console.error("Payment handler error:", err);
            toast.error("Something went wrong. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-secondary transition-smooth"
        disabled={isProcessing}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Plan
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="md:col-span-2 p-6 shadow-strong border-border/50">
          <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>

          <div className="space-y-4">
            {selectedOptions.map((option) => (
              <div
                key={`${option.sectionId}-${option.optionId}`}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium">{option.name}</p>
                    {option.quantity && (
                      <p className="text-sm text-muted-foreground">
                        {option.quantity.toLocaleString("en-IN")} views
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-semibold">₹{option.price.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Discount ({discount}%)</span>
                <span className="font-semibold">-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </Card>

        {/* Payment Card */}
        <Card className="p-6 shadow-strong border-border/50 h-fit">
          <h3 className="text-xl font-display font-bold mb-4">Payment Details</h3>

          <div className="p-4 rounded-lg gradient-accent text-accent-foreground mb-6">
            <p className="text-sm mb-1">Advance Payment (30%)</p>
            <p className="text-3xl font-bold">₹{advancePayment.toLocaleString("en-IN")}</p>
          </div>

          <div className="space-y-3 mb-6 text-sm text-muted-foreground">
            <p>• Pay 30% now to confirm your order</p>
            <p>• Remaining 70% after project completion</p>
            <p>• Secure payment via Razorpay</p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full gradient-accent text-accent-foreground font-semibold py-6 text-lg shadow-elegant hover:shadow-strong transition-smooth hover:scale-[1.02]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ₹{advancePayment.toLocaleString("en-IN")}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By proceeding, you agree to our Terms & Conditions
          </p>
        </Card>
      </div>

      {/* Terms */}
      <Card className="mt-6 p-6 shadow-elegant border-border/50">
        <h4 className="font-semibold mb-3">Terms & Conditions</h4>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            Only THREE changes are accepted in the VIDEO, WEBSITE, APP part within 3 HRS of delivery.
          </li>
          <li>
            NO REFUND in any case and extra money will be charged to make any changes after the time
            period of the work gets completed.
          </li>
          <li>There will be a small watermark on every AD VIDEO made by us.</li>
        </ol>
      </Card>
    </div>
  );
}
