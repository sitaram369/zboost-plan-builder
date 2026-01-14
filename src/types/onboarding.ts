export interface BusinessDetails {
  businessName: string;
  brandDetails: string;
  phone: string;
  email: string;
  website?: string;
}

export interface OnboardingData {
  businessDetails: BusinessDetails | null;
}

export type OnboardingStep = "auth" | "plan" | "billing";