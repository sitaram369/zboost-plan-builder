export interface BusinessDetails {
  businessName: string;
  phone: string;
  email: string;
  website?: string;
}

export interface SurveyAnswers {
  businessStage: string;
  interestedServices: string[];
  hasBrandAssets: boolean;
  biggestChallenge: string;
}

export interface OnboardingData {
  businessDetails: BusinessDetails | null;
  surveyAnswers: SurveyAnswers | null;
}

export type OnboardingStep = 'auth' | 'business' | 'survey' | 'plan' | 'billing';
