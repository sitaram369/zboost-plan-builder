export interface BusinessDetails {
  businessName: string;
  brandDetails: string;
  phone: string;
  email: string;
  website?: string;
}

export interface SurveyAnswers {
  businessStage: string;
  interestedServices: string[];
  hasBrandAssets: boolean;
  biggestChallenge: string;
  targetAudience: string;
  monthlyBudget: string;
  timeline: string;
}

export interface OnboardingData {
  businessDetails: BusinessDetails | null;
  surveyAnswers: SurveyAnswers | null;
}

export type OnboardingStep = 'auth' | 'business' | 'survey' | 'plan' | 'billing';
