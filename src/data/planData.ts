import { PlanSection } from "@/types/plan";

export const planSections: PlanSection[] = [
  {
    id: "digital-footprint",
    title: "Digital Footprint Setup",
    options: [
      { id: "instagram", name: "Instagram Setup & Management (Monthly)", price: 1000, description: "Profile optimization, bio setup, highlights, content strategy, and monthly management" },
      { id: "facebook", name: "Facebook Setup & Management (Monthly)", price: 1000, description: "Page creation, cover design, about section, business info setup, and monthly management" },
      { id: "linkedin", name: "LinkedIn Setup & Management (Monthly)", price: 1000, description: "Company page creation, banner design, professional profile optimization, and monthly management" },
      { id: "twitter", name: "Twitter/X Setup & Management (Monthly)", price: 1000, description: "Profile setup, header design, bio optimization, pinned tweet strategy, and monthly management" },
      { id: "youtube", name: "YouTube Setup & Management (Monthly)", price: 1000, description: "Channel creation, banner design, about section, video optimization, and monthly management" },
      { id: "gmb", name: "Google My Business Setup", price: 2500, description: "Complete GMB profile setup, photos, categories, and local SEO optimization" },
      { id: "gmb-management", name: "Google My Business Management", price: 7000, description: "Monthly GMB management with updates, local SEO, rating management, and review responses" },
      { id: "basic-landing", name: "Basic Landing Page", price: 5000, description: "Single page website with contact form, responsive design, and basic SEO" },
      { id: "landing-domain", name: "Landing Page + Domain", price: 7500, excludeFromDiscount: true, description: "Landing page with custom domain registration and 1-year hosting" },
      { id: "advanced-website", name: "Advanced Website", price: 18000, description: "Multi-page website with CMS, blog, SEO optimization, and analytics integration" },
      { id: "domain-hosting", name: "Domain + Hosting", price: 7000, excludeFromDiscount: true, description: "Domain registration and 1-year premium hosting with SSL certificate" },
      { id: "mid-app", name: "Mid-Level App", price: 20000, description: "Mobile app with essential features, user auth, and basic backend integration" },
      { id: "advanced-app", name: "Advanced App", price: 25000, description: "Full-featured mobile app with advanced backend, APIs, and premium features" },
    ],
  },
  {
    id: "content-creation",
    title: "Digital Content Creation",
    options: [
      { id: "ad-pack-4", name: "Pack of 4 Ads (Up to 30 sec each)", price: 10000, description: "1 language included free. Additional language: ₹500 per ad", hasLanguageOption: true },
      { id: "ad-15sec", name: "Single Ad Video (15 sec)", price: 3000, description: "1 language included free. Additional language: ₹500", hasLanguageOption: true },
      { id: "ad-30sec", name: "Single Ad Video (30 sec)", price: 3500, description: "1 language included free. Additional language: ₹500", hasLanguageOption: true },
      { id: "ad-above-30", name: "Single Ad Video (Above 30 sec)", price: 5000, description: "1 language included free. Additional language: ₹500", hasLanguageOption: true },
      { id: "short-movie", name: "Short Movie (Up to 5 minutes)", price: 25000, description: "Professional short movie with script, shooting, editing, and color grading" },
    ],
  },
  {
    id: "digital-reach",
    title: "Digital Reach",
    options: [
      { id: "one-week-boost", name: "One-week Boost (1,000 reach)", price: 1000, excludeFromDiscount: true, description: "7-day paid promotion on social media to reach 1,000+ people" },
      { id: "boost-pack-4", name: "Package of 4 Boosts", price: 3200, excludeFromDiscount: true, description: "4 weekly boosts at discounted price - reach 4,000+ people over a month" },
      { id: "whatsapp-broadcast", name: "WhatsApp Broadcast", price: 5000, description: "Monthly WhatsApp broadcast campaigns to your customer list" },
      { id: "email-marketing", name: "Email Marketing", price: 7000, description: "Monthly email campaigns with design, automation, and analytics" },
      { 
        id: "whatsapp-status", 
        name: "WhatsApp Status Marketing Software (U.S.P)", 
        price: 5000, 
        isQuantityBased: true,
        pricePerUnit: 1,
        minQuantity: 5000,
        maxQuantity: 100000,
        quantityLabel: "views",
        description: "₹1 per view (minimum 5000 views) - Automated WhatsApp status marketing. No discount applicable.",
        excludeFromDiscount: true
      },
      { id: "whatsapp-chatbot", name: "WhatsApp Chat Bot for Your Brand", price: 7000, description: "Automated chatbot for WhatsApp to handle customer queries 24/7" },
      { id: "meta-google-boost", name: "Meta & Google Boosting", price: 5000, description: "Paid advertising on Meta (Facebook/Instagram) and Google for brand visibility" },
    ],
  },
  {
    id: "automation",
    title: "AI Automation Services",
    options: [
      { id: "lead-automation", name: "Lead Automation (Auto follow-up, WhatsApp Flow, Email)", price: 0, description: "Custom pricing - Automated lead nurturing with multi-channel follow-ups", disabled: true },
      { id: "crm-setup", name: "CRM Setup (Pipeline, Tagging, Automation)", price: 0, description: "Custom pricing - Complete CRM setup with sales pipeline and automation", disabled: true },
      { id: "workflow-automation", name: "Workflow Automation (Chatbot, Appointments, Payments)", price: 0, description: "Custom pricing - End-to-end workflow automation for your business", disabled: true },
      { id: "maintenance", name: "Monthly Automation Maintenance", price: 0, description: "Custom pricing - Ongoing support and optimization of automation systems", disabled: true },
    ],
  },
];

// Fixed Plans Data
export interface FixedPlan {
  id: string;
  name: string;
  price: number;
  badge?: string;
  description: string;
  services: {
    name: string;
    price: number;
    details?: string;
  }[];
  excludeFromDiscount: boolean;
}

export const fixedPlans: FixedPlan[] = [
  {
    id: "regular",
    name: "Regular Plan",
    price: 14000,
    badge: "Monthly",
    description: "Perfect for businesses starting their digital journey",
    excludeFromDiscount: true,
    services: [
      { name: "3 Social Media Setup & Management", price: 3000, details: "Instagram, Facebook, YouTube" },
      { name: "Google My Business Setup & Management", price: 2500, details: "Normal level setup" },
      { name: "1 Ad Video (30 sec)", price: 3500, details: "Full customization included" },
      { name: "5,000 Views (Status Marketing)", price: 5000, details: "One-time - ₹1 per view" },
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 25000,
    badge: "Popular",
    description: "Complete package for growing brands",
    excludeFromDiscount: false,
    services: [
      { name: "Social Media Management", price: 3000, details: "All platforms managed" },
      { name: "Google My Business Setup & Management", price: 7000, details: "Updates, Local SEO, Rating management" },
      { name: "Pack of 4 Ad Videos", price: 10000, details: "Full customization included" },
      { name: "5,000 Views (Status Marketing)", price: 5000, details: "Customizable (min 5000 views) - ₹1/view" },
    ],
  },
  {
    id: "pro-premium",
    name: "Pro Premium Plan",
    price: 37000,
    badge: "Best Value",
    description: "Ultimate solution for serious growth",
    excludeFromDiscount: false,
    services: [
      { name: "3 Social Media Management", price: 3000, details: "All major platforms" },
      { name: "Google My Business Setup & Management", price: 7000, details: "Full suite management" },
      { name: "WhatsApp Chat Bot", price: 7000, details: "24/7 automated customer support" },
      { name: "Pack of 4 Ad Videos", price: 10000, details: "Full customization" },
      { name: "Meta & Google Boosting", price: 5000, details: "Paid ads management" },
      { name: "5,000 Views (Status Marketing)", price: 5000, details: "WhatsApp status marketing" },
    ],
  },
];
