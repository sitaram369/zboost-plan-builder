import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { planSections, fixedPlans } from "@/data/planData";
import { SelectedOption } from "@/types/plan";
import { ArrowLeft, ArrowRight, Check, Plus, Crown, Sparkles, Star, Package, ShoppingCart, Video, Calendar, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  languageExtraPrice?: number;
}

const REDEEM_CODE = "ZEDMEMBER@123";

export function PlanSelectionStep({ onNext, onBack, initialOptions = [], initialDiscount = 0 }: PlanSelectionStepProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(initialOptions);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [discount, setDiscount] = useState<number>(Math.min(initialDiscount, 10));
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [languageSelections, setLanguageSelections] = useState<Record<string, boolean>>({});
  const [selectedFixedPlans, setSelectedFixedPlans] = useState<string[]>([]);
  const [addOnDialogOpen, setAddOnDialogOpen] = useState(false);
  const [currentPlanForAddOn, setCurrentPlanForAddOn] = useState<string | null>(null);
  const [planTab, setPlanTab] = useState<string>("fixed");
  const [fixedPlanViews, setFixedPlanViews] = useState<Record<string, number>>({});
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeemValid, setIsRedeemValid] = useState(false);
  const [showRedeemInput, setShowRedeemInput] = useState(false);
  const [planAddOns, setPlanAddOns] = useState<Record<string, { id: string; name: string; price: number }[]>>({});

  // Initialize views for plans
  const getFixedPlanViews = (planId: string) => fixedPlanViews[planId] ?? 5000;

  const handleOptionToggle = (
    sectionId: string,
    optionId: string,
    name: string,
    price: number,
    isQuantityBased?: boolean,
    quantity?: number,
    excludeFromDiscount?: boolean,
    hasLanguageOption?: boolean,
    languageExtraPrice?: number
  ) => {
    const exists = selectedOptions.find((opt) => opt.sectionId === sectionId && opt.optionId === optionId);
    
    if (exists) {
      setSelectedOptions((prev) => 
        prev.filter((opt) => !(opt.sectionId === sectionId && opt.optionId === optionId))
      );
      setLanguageSelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[`${sectionId}-${optionId}`];
        return newSelections;
      });
    } else if (hasLanguageOption) {
      setPendingSelection({ sectionId, optionId, name, price, excludeFromDiscount, languageExtraPrice: languageExtraPrice || 500 });
      setLanguageDialogOpen(true);
    } else {
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
    const extraPrice = addSecondLanguage ? (pendingSelection.languageExtraPrice || 500) : 0;
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

  const calculateFixedPlanPrice = (planId: string, basePrice: number): number => {
    const currentViews = getFixedPlanViews(planId);
    const extraViews = currentViews - 5000;
    const addOns = planAddOns[planId] || [];
    const addOnTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
    return basePrice + extraViews + addOnTotal;
  };

  const handleFixedPlanViewsChange = (planId: string, views: number) => {
    const newViews = Math.max(5000, views);
    setFixedPlanViews(prev => ({ ...prev, [planId]: newViews }));
    
    if (selectedFixedPlans.includes(planId)) {
      const plan = fixedPlans.find(p => p.id === planId);
      if (plan) {
        const newPrice = calculateFixedPlanPrice(planId, plan.price);
        setSelectedOptions(prev => prev.map(opt => 
          opt.isFixedPlan && opt.fixedPlanId === planId 
            ? { ...opt, price: newPrice }
            : opt
        ));
      }
    }
  };

  const handleFixedPlanSelect = (planId: string) => {
    const plan = fixedPlans.find(p => p.id === planId);
    if (!plan) return;

    if (selectedFixedPlans.includes(planId)) {
      // Deselect
      setSelectedFixedPlans(prev => prev.filter(id => id !== planId));
      setSelectedOptions(prev => prev.filter(opt => !(opt.isFixedPlan && opt.fixedPlanId === planId)));
      setPlanAddOns(prev => {
        const newAddOns = { ...prev };
        delete newAddOns[planId];
        return newAddOns;
      });
    } else {
      // Select (allow multiple)
      setSelectedFixedPlans(prev => [...prev, planId]);
      const currentViews = getFixedPlanViews(planId);
      const extraViews = currentViews - 5000;
      const adjustedPrice = plan.price + extraViews;
      
      const planOption: SelectedOption = {
        sectionId: "fixed-plans",
        optionId: planId,
        name: plan.name,
        price: adjustedPrice,
        isFixedPlan: true,
        fixedPlanId: planId,
        excludeFromDiscount: plan.excludeFromDiscount,
      };
      setSelectedOptions(prev => [...prev, planOption]);
    }
  };

  const openAddOnDialog = (planId: string) => {
    setCurrentPlanForAddOn(planId);
    setAddOnDialogOpen(true);
  };

  const handleAddOnToggle = (planId: string, addon: { id: string; name: string; price: number }) => {
    setPlanAddOns(prev => {
      const currentAddOns = prev[planId] || [];
      const exists = currentAddOns.find(a => a.id === addon.id);
      
      let newAddOns;
      if (exists) {
        newAddOns = currentAddOns.filter(a => a.id !== addon.id);
      } else {
        newAddOns = [...currentAddOns, addon];
      }
      
      // Update selected option price
      const plan = fixedPlans.find(p => p.id === planId);
      if (plan && selectedFixedPlans.includes(planId)) {
        const currentViews = getFixedPlanViews(planId);
        const extraViews = currentViews - 5000;
        const addOnTotal = newAddOns.reduce((sum, a) => sum + a.price, 0);
        const newPrice = plan.price + extraViews + addOnTotal;
        
        setSelectedOptions(prevOpts => prevOpts.map(opt => 
          opt.isFixedPlan && opt.fixedPlanId === planId 
            ? { ...opt, price: newPrice, planAddOns: newAddOns }
            : opt
        ));
      }
      
      return { ...prev, [planId]: newAddOns };
    });
  };

  const isAddOnSelected = (planId: string, addonId: string) => {
    return (planAddOns[planId] || []).some(a => a.id === addonId);
  };

  const handleRedeemCode = () => {
    if (redeemCode === REDEEM_CODE) {
      setIsRedeemValid(true);
      toast.success("Redeem code applied! Discount unlocked.");
    } else {
      toast.error("Invalid redeem code");
    }
  };

  const calculateTotal = () => {
    const subtotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    if (!isRedeemValid) return subtotal;
    
    const discountableAmount = selectedOptions.filter((opt) => !opt.excludeFromDiscount).reduce((sum, opt) => sum + opt.price, 0);
    const discountAmount = (discountableAmount * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleContinue = () => {
    if (selectedOptions.length === 0) {
      toast.error("Please select at least one service or plan");
      return;
    }
    onNext(selectedOptions, isRedeemValid ? discount : 0);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "regular": return <Star className="w-6 h-6" />;
      case "premium": return <Crown className="w-6 h-6" />;
      case "pro-premium": return <Sparkles className="w-6 h-6" />;
      case "double-discount": 
      case "content-boost": 
      case "30-days-15sec":
      case "30-days-30sec": return <Video className="w-6 h-6" />;
      case "online-store": return <ShoppingCart className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  // Filter out already selected fixed plan services from add-on options
  const getAvailableAddOns = (planId: string) => {
    const plan = fixedPlans.find(p => p.id === planId);
    if (!plan) return [];
    
    const planServiceNames = plan.services.map(s => s.name.toLowerCase());
    
    return planSections.flatMap(section => 
      section.options
        .filter(opt => !opt.disabled)
        .filter(opt => !planServiceNames.some(name => opt.name.toLowerCase().includes(name.split(' ')[0])))
    );
  };

  // Separate fixed plans by category
  const mainPlans = fixedPlans.filter(p => !p.category);
  const contentPlans = fixedPlans.filter(p => p.category === 'content');
  const storePlans = fixedPlans.filter(p => p.category === 'store');

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">Select fixed packages or build your custom plan</p>
      </div>

      <Tabs value={planTab} onValueChange={setPlanTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="fixed" className="text-lg py-3">Fixed Plans</TabsTrigger>
          <TabsTrigger value="custom" className="text-lg py-3">Custom Pack</TabsTrigger>
        </TabsList>

        {/* Fixed Plans Tab */}
        <TabsContent value="fixed" className="space-y-8">
          {/* Info Banner */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
            <p className="text-sm font-medium">
              <Calendar className="w-4 h-4 inline-block mr-1" />
              All services completed within <strong>1 month</strong>. Maintenance costs are for <strong>one month only</strong>.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You can select <strong>multiple packages</strong> at once!
            </p>
          </div>

          {/* Main Plans */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Business Plans</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {mainPlans.map((plan) => {
                const currentViews = getFixedPlanViews(plan.id);
                const adjustedPrice = calculateFixedPlanPrice(plan.id, plan.price);
                const isSelected = selectedFixedPlans.includes(plan.id);
                
                return (
                  <Card 
                    key={plan.id}
                    className={`p-6 shadow-elegant border-2 transition-all relative ${
                      isSelected ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant={plan.id === "premium" ? "default" : "secondary"} className="text-xs">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="text-center mb-4 pt-2">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                        isSelected ? "bg-accent text-accent-foreground" : "bg-secondary"
                      }`}>
                        {getPlanIcon(plan.id)}
                      </div>
                      <h3 className="text-xl font-display font-bold">{plan.name}</h3>
                      <p className="text-3xl font-bold mt-2">₹{adjustedPrice.toLocaleString("en-IN")}</p>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      {plan.excludeFromDiscount && (
                        <p className="text-xs text-accent mt-1">No discount applicable</p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-4">
                      {plan.services.map((service, idx) => {
                        const isStatusService = service.name.includes("Views") && service.name.includes("Status");
                        
                        if (isStatusService) {
                          return (
                            <li key={idx} className="text-sm">
                              <div className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <span className="font-medium">{currentViews.toLocaleString("en-IN")} Views (Status Marketing)</span>
                                  <p className="text-xs text-muted-foreground">Adjustable (min 5000) - ₹1/view</p>
                                  <p className="text-xs text-accent">₹{currentViews.toLocaleString("en-IN")}</p>
                                </div>
                              </div>
                              <div className="mt-2 px-2">
                                <Slider
                                  min={5000}
                                  max={100000}
                                  step={1000}
                                  value={[currentViews]}
                                  onValueChange={(v) => handleFixedPlanViewsChange(plan.id, v[0])}
                                  className="cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>5,000</span>
                                  <span>1,00,000</span>
                                </div>
                              </div>
                            </li>
                          );
                        }
                        
                        return (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">{service.name}</span>
                              {service.details && (
                                <p className="text-xs text-muted-foreground">{service.details}</p>
                              )}
                              <p className="text-xs text-accent">₹{service.price.toLocaleString("en-IN")}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="space-y-2">
                      <Button 
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full border-2 ${isSelected ? "gradient-accent text-accent-foreground" : ""}`}
                        onClick={() => handleFixedPlanSelect(plan.id)}
                      >
                        {isSelected ? (
                          <><Check className="w-4 h-4 mr-2" />Selected</>
                        ) : (
                          <>Select Plan</>
                        )}
                      </Button>
                      
                      {isSelected && (
                        <Button 
                          variant="outline" 
                          className="w-full border-2"
                          onClick={() => openAddOnDialog(plan.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add On
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Content Plans */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              Content Only Plans
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentPlans.map((plan) => {
                const isSelected = selectedFixedPlans.includes(plan.id);
                const currentAddOns = planAddOns[plan.id] || [];
                const addOnTotal = currentAddOns.reduce((sum, a) => sum + a.price, 0);
                const adjustedPrice = plan.price + addOnTotal;
                
                return (
                  <Card 
                    key={plan.id}
                    className={`p-4 shadow-elegant border-2 transition-all relative ${
                      isSelected ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                    }`}
                  >
                    {plan.badge && (
                      <Badge variant="secondary" className="absolute -top-2 right-2 text-xs">
                        {plan.badge}
                      </Badge>
                    )}
                    
                    <div className="text-center mb-3">
                      <h4 className="font-display font-bold text-sm">{plan.name}</h4>
                      <p className="text-2xl font-bold mt-1">₹{adjustedPrice.toLocaleString("en-IN")}</p>
                      {plan.realWorth && (
                        <p className="text-xs text-muted-foreground line-through">Worth ₹{plan.realWorth.toLocaleString("en-IN")}</p>
                      )}
                    </div>

                    <ul className="space-y-1.5 mb-3 text-xs">
                      {plan.services.map((service, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <Check className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                          <span>{service.name}</span>
                        </li>
                      ))}
                      {plan.addOnOptions && (
                        <li className="text-accent text-xs mt-2">
                          + Optional: Social Media Management
                        </li>
                      )}
                    </ul>

                    <Button 
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`w-full ${isSelected ? "gradient-accent text-accent-foreground" : ""}`}
                      onClick={() => handleFixedPlanSelect(plan.id)}
                    >
                      {isSelected ? <><Check className="w-3 h-3 mr-1" />Selected</> : "Select"}
                    </Button>
                    
                    {isSelected && plan.addOnOptions && (
                      <div className="mt-2 space-y-1">
                        {plan.addOnOptions.map(addon => (
                          <div 
                            key={addon.id}
                            className={`p-2 rounded border cursor-pointer text-xs ${
                              isAddOnSelected(plan.id, addon.id) ? "border-accent bg-accent/10" : "border-border"
                            }`}
                            onClick={() => handleAddOnToggle(plan.id, addon)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{addon.name}</span>
                              <span className="font-semibold">+₹{addon.price.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Store Plan */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-accent" />
              E-Commerce Solutions
            </h3>
            {storePlans.map((plan) => {
              const currentViews = getFixedPlanViews(plan.id);
              const extraViews = currentViews - 5000;
              const adjustedPrice = plan.price + extraViews;
              const isSelected = selectedFixedPlans.includes(plan.id);
              
              return (
                <Card 
                  key={plan.id}
                  className={`p-6 shadow-elegant border-2 transition-all ${
                    isSelected ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Badge variant="secondary" className="mb-2">{plan.badge}</Badge>
                      <h4 className="text-2xl font-display font-bold">{plan.name}</h4>
                      <p className="text-4xl font-bold mt-2">₹{adjustedPrice.toLocaleString("en-IN")}</p>
                      <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Perfect for:</p>
                        <div className="flex flex-wrap gap-2">
                          {plan.targetAudience?.map((audience, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{audience}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        variant={isSelected ? "default" : "outline"}
                        className={`mt-4 ${isSelected ? "gradient-accent text-accent-foreground" : ""}`}
                        onClick={() => handleFixedPlanSelect(plan.id)}
                      >
                        {isSelected ? <><Check className="w-4 h-4 mr-2" />Selected</> : "Select Plan"}
                      </Button>
                    </div>
                    
                    <div>
                      <ul className="space-y-2">
                        {plan.services.map((service, idx) => {
                          const isStatusService = service.name.includes("Views") || service.name.includes("Status");
                          
                          if (isStatusService) {
                            return (
                              <li key={idx} className="text-sm p-2 bg-secondary/30 rounded">
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <span className="font-medium">{currentViews.toLocaleString("en-IN")} Views</span>
                                    <Slider
                                      min={5000}
                                      max={100000}
                                      step={1000}
                                      value={[currentViews]}
                                      onValueChange={(v) => handleFixedPlanViewsChange(plan.id, v[0])}
                                      className="cursor-pointer mt-2"
                                    />
                                  </div>
                                </div>
                              </li>
                            );
                          }
                          
                          return (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium">{service.name}</span>
                                {service.details && (
                                  <p className="text-xs text-muted-foreground">{service.details}</p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Custom Pack Tab */}
        <TabsContent value="custom" className="space-y-6">
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

                  // Special handling for WhatsApp Status Marketing with slider
                  if (option.isQuantityBased && option.id === "whatsapp-status") {
                    return (
                      <div
                        key={option.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                        }`}
                      >
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => handleOptionToggle(
                            section.id, 
                            option.id, 
                            option.name, 
                            calculatedPrice, 
                            true, 
                            currentQuantity, 
                            option.excludeFromDiscount,
                            false
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox checked={isSelected} />
                            <div>
                              <Label className="cursor-pointer font-medium">{option.name}</Label>
                              {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">₹{calculatedPrice.toLocaleString("en-IN")}</span>
                            <p className="text-xs text-muted-foreground">{currentQuantity.toLocaleString("en-IN")} views</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 px-2">
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-sm">Select Views</Label>
                            <span className="text-sm font-semibold text-accent">{currentQuantity.toLocaleString("en-IN")} views</span>
                          </div>
                          <Slider
                            min={1000}
                            max={100000}
                            step={1000}
                            value={[currentQuantity]}
                            onValueChange={(v) => {
                              handleQuantityChange(section.id, option.id, v[0]);
                              if (!isSelected) {
                                handleOptionToggle(
                                  section.id, 
                                  option.id, 
                                  option.name, 
                                  v[0], 
                                  true, 
                                  v[0], 
                                  option.excludeFromDiscount,
                                  false
                                );
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1,000</span>
                            <span>1,00,000</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

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
                          option.hasLanguageOption,
                          option.languageExtraPrice
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
                          {!option.excludeFromDiscount && isRedeemValid && discount > 0 && calculatedPrice > 0 && (
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
        </TabsContent>
      </Tabs>

      {/* Language Option Dialog */}
      <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Second Language?</DialogTitle>
            <DialogDescription>
              One language is included free. Would you like to add a second language?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>Selected:</strong> {pendingSelection?.name}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Base Price:</strong> ₹{pendingSelection?.price.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-accent mt-2">
              <strong>2nd Language:</strong> +₹{(pendingSelection?.languageExtraPrice || 500).toLocaleString("en-IN")}
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => handleLanguageConfirm(false)}>
              No, 1 Language Only
            </Button>
            <Button onClick={() => handleLanguageConfirm(true)} className="gradient-accent">
              Yes, Add 2nd Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add-On Dialog for Fixed Plans */}
      <Dialog open={addOnDialogOpen} onOpenChange={setAddOnDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Extra Services</DialogTitle>
            <DialogDescription>
              Select additional services to add to your {fixedPlans.find(p => p.id === currentPlanForAddOn)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {planSections.map((section) => {
              const availableOptions = section.options.filter(opt => !opt.disabled);
              if (availableOptions.length === 0) return null;
              
              return (
                <div key={section.id}>
                  <h4 className="font-semibold mb-2">{section.title}</h4>
                  <div className="space-y-2">
                    {availableOptions.map((option) => {
                      const addonId = `${section.id}-${option.id}`;
                      const isSelected = currentPlanForAddOn ? isAddOnSelected(currentPlanForAddOn, addonId) : false;
                      
                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"
                          }`}
                          onClick={() => currentPlanForAddOn && handleAddOnToggle(
                            currentPlanForAddOn,
                            { id: addonId, name: option.name, price: option.price }
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox checked={isSelected} />
                              <span className="text-sm">{option.name}</span>
                            </div>
                            <span className="text-sm font-semibold">₹{option.price.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setAddOnDialogOpen(false)} className="gradient-accent">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky Footer */}
      <Card className="p-6 shadow-elegant sticky bottom-4 border-border/50 backdrop-blur-sm bg-card/95">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Redeem Code Section */}
          <div className="flex-1 space-y-2">
            {!isRedeemValid ? (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRedeemInput(!showRedeemInput)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Ticket className="w-3 h-3 mr-1" />
                  Have a redeem code?
                </Button>
                {showRedeemInput && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Button size="sm" onClick={handleRedeemCode} className="h-8">Apply</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-medium">Discount Unlocked!</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Discount</Label>
                  <span className="text-lg font-semibold text-accent">{discount}%</span>
                </div>
                <Slider min={0} max={10} step={0.5} value={[discount]} onValueChange={(v) => setDiscount(v[0])} />
                <p className="text-xs text-muted-foreground">Note: Not applicable on Regular Plan & certain items</p>
              </div>
            )}
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