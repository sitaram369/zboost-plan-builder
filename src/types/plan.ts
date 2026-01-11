export interface PlanOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  isQuantityBased?: boolean;
  pricePerUnit?: number;
  minQuantity?: number;
  maxQuantity?: number;
  quantityLabel?: string;
  disabled?: boolean;
  excludeFromDiscount?: boolean;
  hasLanguageOption?: boolean;
}

export interface PlanSection {
  id: string;
  title: string;
  options: PlanOption[];
}

export interface SelectedOption {
  sectionId: string;
  optionId: string;
  name: string;
  price: number;
  quantity?: number;
  excludeFromDiscount?: boolean;
  isFixedPlan?: boolean;
  fixedPlanId?: string;
}

export interface CustomInput {
  id: string;
  value: number;
}

export interface FixedPlanAddOn {
  planId: string;
  addOns: SelectedOption[];
}
