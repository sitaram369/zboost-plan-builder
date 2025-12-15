import { useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { planSections } from "@/data/planData";
import { SelectedOption } from "@/types/plan";
import { PlanSummary } from "./PlanSummary";

export function PlanCustomizer() {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [discount, setDiscount] = useState<number>(0);
  const [showSummary, setShowSummary] = useState(false);

  const handleOptionToggle = (
    sectionId: string, 
    optionId: string, 
    name: string, 
    price: number, 
    isQuantityBased?: boolean,
    quantity?: number,
    excludeFromDiscount?: boolean
  ) => {
    setSelectedOptions((prev) => {
      const exists = prev.find(
        (opt) => opt.sectionId === sectionId && opt.optionId === optionId
      );

      if (exists) {
        return prev.filter(
          (opt) => !(opt.sectionId === sectionId && opt.optionId === optionId)
        );
      } else {
        return [...prev, { 
          sectionId, 
          optionId, 
          name, 
          price: isQuantityBased && quantity ? quantity : price,
          quantity: isQuantityBased ? quantity : undefined,
          excludeFromDiscount
        }];
      }
    });
  };

  const handleQuantityChange = (sectionId: string, optionId: string, quantity: number) => {
    const key = `${sectionId}-${optionId}`;
    setQuantities(prev => ({ ...prev, [key]: quantity }));
    
    // Update the price in selectedOptions if the option is already selected
    setSelectedOptions((prev) => {
      const exists = prev.find(
        (opt) => opt.sectionId === sectionId && opt.optionId === optionId
      );
      
      if (exists) {
        return prev.map(opt => 
          opt.sectionId === sectionId && opt.optionId === optionId
            ? { ...opt, price: quantity, quantity }
            : opt
        );
      }
      return prev;
    });
  };

  const isOptionSelected = (sectionId: string, optionId: string) => {
    return selectedOptions.some(
      (opt) => opt.sectionId === sectionId && opt.optionId === optionId
    );
  };

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue >= 0 && numValue <= 20) {
      setDiscount(numValue);
    }
  };

  const calculateTotal = () => {
    const subtotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const discountableAmount = selectedOptions
      .filter(opt => !opt.excludeFromDiscount)
      .reduce((sum, opt) => sum + opt.price, 0);
    const discountAmount = (discountableAmount * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleGeneratePlan = () => {
    if (selectedOptions.length === 0) {
      return;
    }
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <PlanSummary
        selectedOptions={selectedOptions}
        discount={discount}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {planSections.map((section) => (
        <Card
          key={section.id}
          className="p-6 shadow-elegant hover:shadow-strong transition-smooth border-border/50"
        >
          <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">
            {section.title}
          </h2>
          <div className="space-y-4">
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
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ease-out ${
                    option.disabled
                      ? "border-border/30 opacity-60"
                      : isSelected
                        ? "border-accent bg-accent/5 scale-[1.01] shadow-md"
                        : "border-border/50 hover:border-border hover:scale-[1.005]"
                  } ${!option.disabled && "active:scale-[0.99]"}`}
                >
                  <div
                    className={`flex items-start space-x-4 ${option.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() =>
                      !option.disabled && handleOptionToggle(
                        section.id, 
                        option.id, 
                        option.name, 
                        calculatedPrice,
                        option.isQuantityBased,
                        currentQuantity,
                        option.excludeFromDiscount
                      )
                    }
                  >
                    <div className="flex items-center justify-center mt-0.5">
                      <Checkbox
                        checked={isSelected}
                        disabled={option.disabled}
                        onCheckedChange={() =>
                          !option.disabled && handleOptionToggle(
                            section.id, 
                            option.id, 
                            option.name, 
                            calculatedPrice,
                            option.isQuantityBased,
                            currentQuantity,
                            option.excludeFromDiscount
                          )
                        }
                        className="data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <Label
                          htmlFor={option.id}
                          className="text-base font-medium cursor-pointer"
                        >
                          {option.name}
                        </Label>
                        <div className="text-right">
                          <span className="font-semibold whitespace-nowrap">
                            {option.price > 0 || option.isQuantityBased 
                              ? `₹${calculatedPrice.toLocaleString("en-IN")}` 
                              : "Custom"}
                          </span>
                          {!option.excludeFromDiscount && discount > 0 && calculatedPrice > 0 && (
                            <div className="text-xs text-accent">
                              Save ₹{((calculatedPrice * discount) / 100).toLocaleString("en-IN")}
                            </div>
                          )}
                        </div>
                      </div>
                      {option.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      )}
                      {option.excludeFromDiscount && (
                        <span className="inline-flex items-center text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded mt-1">
                          No discount applies
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isSelected 
                          ? "bg-accent text-accent-foreground scale-100" 
                          : "border-2 border-border hover:border-accent/50 scale-90"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 animate-scale-in" />}
                      </div>
                    </div>
                  </div>
                  
                  {option.disabled && (
                    <div className="mt-4 pl-10" onClick={(e) => e.stopPropagation()}>
                      <span className="text-sm font-medium text-muted-foreground italic">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      <Card className="p-6 shadow-elegant sticky bottom-4 border-border/50 backdrop-blur-sm bg-card/95">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="discount" className="text-base font-medium">
                Discount
              </Label>
              <span className="text-lg font-semibold text-accent">{discount}%</span>
            </div>
            <Slider
              id="discount"
              min={0}
              max={20}
              step={0.5}
              value={[discount]}
              onValueChange={(value) => handleDiscountChange(value[0].toString())}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm text-muted-foreground mb-1">Estimated Total</div>
            <div className="text-3xl font-bold font-display">
              ₹{calculateTotal().toLocaleString("en-IN")}
            </div>
          </div>
          <Button
            onClick={handleGeneratePlan}
            disabled={selectedOptions.length === 0}
            className="gradient-accent text-accent-foreground font-semibold px-8 py-6 text-lg shadow-strong hover:shadow-elegant transition-smooth hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate My Plan
          </Button>
        </div>
      </Card>
    </div>
  );
}
