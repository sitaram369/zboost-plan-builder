import { useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { planSections } from "@/data/planData";
import { SelectedOption } from "@/types/plan";
import { PlanSummary } from "./PlanSummary";

export function PlanCustomizer() {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [showSummary, setShowSummary] = useState(false);

  const handleOptionToggle = (sectionId: string, optionId: string, name: string, price: number) => {
    setSelectedOptions((prev) => {
      const exists = prev.find(
        (opt) => opt.sectionId === sectionId && opt.optionId === optionId
      );

      if (exists) {
        return prev.filter(
          (opt) => !(opt.sectionId === sectionId && opt.optionId === optionId)
        );
      } else {
        return [...prev, { sectionId, optionId, name, price }];
      }
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
              return (
                <div
                  key={option.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-smooth cursor-pointer hover:bg-secondary/30 ${
                    isSelected
                      ? "border-accent bg-accent/5"
                      : "border-border/50 hover:border-border"
                  }`}
                  onClick={() =>
                    handleOptionToggle(section.id, option.id, option.name, option.price)
                  }
                >
                  <div className="flex items-center justify-center mt-0.5">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() =>
                        handleOptionToggle(section.id, option.id, option.name, option.price)
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
                        {option.price > 0 ? `₹${option.price.toLocaleString("en-IN")}` : "Custom"}
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
              );
            })}
          </div>
        </Card>
      ))}

      <Card className="p-6 shadow-elegant sticky bottom-4 border-border/50 backdrop-blur-sm bg-card/95">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="discount" className="text-base font-medium">
              Discount (Max 20%)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="discount"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                className="max-w-[200px]"
                placeholder="0"
              />
              <span className="font-medium">%</span>
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
