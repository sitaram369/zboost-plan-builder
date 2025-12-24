import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { planSections } from "@/data/planData";
import { SelectedOption } from "@/types/plan";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PlanSelectionStepProps {
  onNext: (selectedOptions: SelectedOption[], discount: number) => void;
  onBack: () => void;
  initialOptions?: SelectedOption[];
  initialDiscount?: number;
}

interface PendingSelection {
  sectionId: string;
  optionId: string;
  name: string;
  price: number;
  excludeFromDiscount?: boolean;
}

export function PlanSelectionStep({ onNext, onBack, initialOptions = [], initialDiscount = 0 }: PlanSelectionStepProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(initialOptions);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [discount, setDiscount] = useState<number>(Math.min(initialDiscount, 10));
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [languageSelections, setLanguageSelections] = useState<Record<string, boolean>>({});

  const handleOptionToggle = (
    sectionId: string,
    optionId: string,
    name: string,
    price: number,
    isQuantityBased?: boolean,
    quantity?: number,
    excludeFromDiscount?: boolean,
    hasLanguageOption?: boolean
  ) => {
    const exists = selectedOptions.find((opt) => opt.sectionId === sectionId && opt.optionId === optionId);
    
    if (exists) {
      // Deselecting - remove the option
      setSelectedOptions((prev) => 
        prev.filter((opt) => !(opt.sectionId === sectionId && opt.optionId === optionId))
      );
      // Clean up language selection
      setLanguageSelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[`${sectionId}-${optionId}`];
        return newSelections;
      });
    } else if (hasLanguageOption) {
      // Show language option dialog for ads
      setPendingSelection({ sectionId, optionId, name, price, excludeFromDiscount });
      setLanguageDialogOpen(true);
    } else {
      // Normal selection
      setSelectedOptions((prev) => [...prev, {
        sectionId,
        optionId,
        name,
        price: isQuantityBased && quantity ? quantity : price,
        quantity: isQuantityBased ? quantity : undefined,
        excludeFromDiscount,
      }]);
    }
  };

  const handleLanguageConfirm = (addSecondLanguage: boolean) => {
    if (!pendingSelection) return;

    const key = `${pendingSelection.sectionId}-${pendingSelection.optionId}`;
    const extraPrice = addSecondLanguage ? 500 : 0;
    const finalName = addSecondLanguage 
      ? `${pendingSelection.name} (+ 2nd Language)` 
      : pendingSelection.name;

    setLanguageSelections((prev) => ({ ...prev, [key]: addSecondLanguage }));
    setSelectedOptions((prev) => [...prev, {
      sectionId: pendingSelection.sectionId,
      optionId: pendingSelection.optionId,
      name: finalName,
      price: pendingSelection.price + extraPrice,
      excludeFromDiscount: pendingSelection.excludeFromDiscount,
    }]);

    setLanguageDialogOpen(false);
    setPendingSelection(null);
  };

  const handleQuantityChange = (sectionId: string, optionId: string, quantity: number) => {
    const key = `${sectionId}-${optionId}`;
    setQuantities((prev) => ({ ...prev, [key]: quantity }));
    setSelectedOptions((prev) => {
      const exists = prev.find((opt) => opt.sectionId === sectionId && opt.optionId === optionId);
      if (exists) {
        return prev.map((opt) =>
          opt.sectionId === sectionId && opt.optionId === optionId ? { ...opt, price: quantity, quantity } : opt
        );
      }
      return prev;
    });
  };

  const isOptionSelected = (sectionId: string, optionId: string) => {
    return selectedOptions.some((opt) => opt.sectionId === sectionId && opt.optionId === optionId);
  };

  const calculateTotal = () => {
    const subtotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const discountableAmount = selectedOptions.filter((opt) => !opt.excludeFromDiscount).reduce((sum, opt) => sum + opt.price, 0);
    const discountAmount = (discountableAmount * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleContinue = () => {
    if (selectedOptions.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    onNext(selectedOptions, discount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Choose Your Services</h2>
        <p className="text-muted-foreground">Select the services you need for your marketing plan</p>
      </div>

      {planSections.map((section) => (
        <Card key={section.id} className="p-6 shadow-elegant border-border/50">
          <h3 className="text-xl font-display font-bold mb-4">{section.title}</h3>
          <div className="space-y-3">
            {section.options.map((option) => {
              const isSelected = isOptionSelected(section.id, option.id);
              const quantityKey = `${section.id}-${option.id}`;
              const currentQuantity = quantities[quantityKey] || (option.minQuantity || 1000);
              const calculatedPrice = option.isQuantityBased && option.pricePerUnit
                ? currentQuantity * option.pricePerUnit
                : option.price;

              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    option.disabled
                      ? "border-border/30 opacity-60"
                      : isSelected
                      ? "border-accent bg-accent/5"
                      : "border-border/50 hover:border-border"
                  } ${!option.disabled && "cursor-pointer"}`}
                  onClick={() =>
                    !option.disabled &&
                    handleOptionToggle(
                      section.id, 
                      option.id, 
                      option.name, 
                      calculatedPrice, 
                      option.isQuantityBased, 
                      currentQuantity, 
                      option.excludeFromDiscount,
                      option.hasLanguageOption
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} disabled={option.disabled} />
                      <div>
                        <Label className="cursor-pointer font-medium">{option.name}</Label>
                        {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                        {option.disabled && <span className="text-xs text-muted-foreground italic">Coming Soon</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {option.price > 0 || option.isQuantityBased ? `₹${calculatedPrice.toLocaleString("en-IN")}` : "Custom"}
                      </span>
                      {!option.excludeFromDiscount && discount > 0 && calculatedPrice > 0 && (
                        <div className="text-xs text-accent">Save ₹{((calculatedPrice * discount) / 100).toLocaleString("en-IN")}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Language Option Dialog */}
      <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Second Language?</DialogTitle>
            <DialogDescription>
              One language is included free with your ad. Would you like to add a second language for ₹500?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>Selected:</strong> {pendingSelection?.name}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Base Price:</strong> ₹{pendingSelection?.price.toLocaleString("en-IN")}
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => handleLanguageConfirm(false)}>
              No, 1 Language Only
            </Button>
            <Button onClick={() => handleLanguageConfirm(true)} className="gradient-accent">
              Yes, Add 2nd Language (+₹500)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky Footer */}
      <Card className="p-6 shadow-elegant sticky bottom-4 border-border/50 backdrop-blur-sm bg-card/95">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <Label className="font-medium">Discount</Label>
              <span className="text-lg font-semibold text-accent">{discount}%</span>
            </div>
            <Slider min={0} max={10} step={0.5} value={[discount]} onValueChange={(v) => setDiscount(v[0])} />
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-3xl font-bold font-display">₹{calculateTotal().toLocaleString("en-IN")}</div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="border-2 py-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={selectedOptions.length === 0}
              className="gradient-accent text-accent-foreground font-semibold px-8 py-6 text-lg"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
