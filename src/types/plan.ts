export interface PlanOption {
  id: string;
  name: string;
  price: number;
  description?: string;
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
}

export interface CustomInput {
  id: string;
  value: number;
}
