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
    quantity?: number
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
          quantity: isQuantityBased ? quantity : undefined
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
    const discountAmount = (subtotal * discount) / 100;
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
                  className={`p-4 rounded-lg border-2 transition-smooth ${
                    isSelected
                      ? "border-accent bg-accent/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <div
                    className="flex items-start space-x-4 cursor-pointer"
                    onClick={() =>
                      handleOptionToggle(
                        section.id, 
                        option.id, 
                        option.name, 
                        calculatedPrice,
                        option.isQuantityBased,
                        currentQuantity
                      )
                    }
                  >
                    <div className="flex items-center justify-center mt-0.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() =>
                          handleOptionToggle(
                            section.id, 
                            option.id, 
                            option.name, 
                            calculatedPrice,
                            option.isQuantityBased,
                            currentQuantity
                          )
                        }
                        className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
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
                        <span className="font-semibold whitespace-nowrap">
                          {option.price > 0 || option.isQuantityBased 
                            ? `₹${calculatedPrice.toLocaleString("en-IN")}` 
                            : "Custom"}
                        </span>
                      </div>
                      {option.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {option.isQuantityBased && (
                    <div className="mt-4 pl-10 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-sm">
                        <Label className="font-medium">
                          Number of {option.quantityLabel || "units"}
                        </Label>
                        <span className="font-semibold text-accent">
                          {currentQuantity.toLocaleString("en-IN")} {option.quantityLabel}
                        </span>
                      </div>
                      <Slider
                        value={[currentQuantity]}
                        onValueChange={(value) => handleQuantityChange(section.id, option.id, value[0])}
                        min={option.minQuantity || 1000}
                        max={option.maxQuantity || 100000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{(option.minQuantity || 1000).toLocaleString("en-IN")}</span>
                        <span>{(option.maxQuantity || 100000).toLocaleString("en-IN")}</span>
                      </div>
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
