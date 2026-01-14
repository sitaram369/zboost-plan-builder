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
      { id: "whatsapp-chatbot", name: "WhatsApp Chat Bot for Your Brand", price: 7000, description: "Automated chatbot for WhatsApp to handle customer queries 24/7" },
      { id: "basic-landing", name: "Basic Landing Page", price: 5000, description: "Single page website with contact form, responsive design, and basic SEO" },
      { id: "landing-domain", name: "Landing Page + Domain", price: 7500, excludeFromDiscount: true, description: "Landing page with custom domain registration and 1-year hosting" },
      { id: "advanced-website", name: "Advanced Website", price: 18000, description: "Multi-page website with CMS, blog, SEO optimization, and analytics integration" },
      { id: "domain-hosting", name: "Domain + Hosting", price: 7000, excludeFromDiscount: true, description: "Domain registration and 1-year premium hosting with SSL certificate" },
      { id: "mid-app", name: "Mid-Level App", price: 25000, description: "Mobile app with essential features, user auth, and basic backend integration" },
      { id: "advanced-app", name: "Advanced App", price: 50000, description: "Full-featured mobile app with advanced backend, APIs, and premium features" },
    ],
  },
  {
    id: "content-creation",
    title: "Digital Content Creation",
    options: [
      { id: "ad-pack-4", name: "Pack of 4 Ads (Up to 30 sec each)", price: 10000, description: "1 language included free. Additional language: ₹500 per ad (₹2000 total for pack)", hasLanguageOption: true, languageExtraPrice: 2000 },
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
      { id: "one-week-boost", name: "One-week Boost (1,000 reach)", price: 1000, excludeFromDiscount: true, description: "7-day paid promotion. 50% will be charged for maintenance of the boost campaign." },
      { id: "boost-pack-4", name: "Package of 4 Boosts", price: 4000, excludeFromDiscount: true, description: "4 weekly boosts - reach 4,000+ people. 50% will be charged for maintenance of the boost campaign." },
      { id: "whatsapp-broadcast", name: "WhatsApp Broadcast", price: 5000, description: "Monthly WhatsApp broadcast campaigns to your customer list" },
      { 
        id: "whatsapp-status", 
        name: "WhatsApp Status Marketing Software (U.S.P)", 
        price: 5000, 
        isQuantityBased: true,
        pricePerUnit: 1,
        minQuantity: 1000,
        maxQuantity: 100000,
        quantityLabel: "views",
        description: "₹1 per view (minimum 1000 views) - Automated WhatsApp status marketing. No discount applicable.",
        excludeFromDiscount: true
      },
      { id: "meta-google-boost", name: "Meta & Google Boosting", price: 5000, excludeFromDiscount: true, description: "Paid advertising on Meta & Google. 50% will be charged for maintenance of the campaign." },
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
  category?: string;
  realWorth?: number;
  savingsPercent?: number;
  addOnOptions?: { id: string; name: string; price: number }[];
  targetAudience?: string[];
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
      { name: "Pack of 4 Ad Videos", price: 10000, details: "Full customization. +₹2000 for 2nd language" },
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
      { name: "Pack of 4 Ad Videos", price: 10000, details: "Full customization. +₹2000 for 2nd language" },
      { name: "Meta & Google Boosting", price: 5000, details: "50% charged for campaign maintenance" },
      { name: "5,000 Views (Status Marketing)", price: 5000, details: "WhatsApp status marketing" },
    ],
  },
  // Content Only Plans
  {
    id: "double-discount",
    name: "Double Discount Plan",
    price: 10000,
    badge: "Save 55%",
    description: "Content only - 10 videos + 5 flyers",
    excludeFromDiscount: true,
    realWorth: 22500,
    savingsPercent: 55,
    category: "content",
    services: [
      { name: "10 Content Videos (15 sec each)", price: 20000, details: "No customization" },
      { name: "5 Flyers", price: 2500, details: "Basic design with initial information" },
    ],
  },
  {
    id: "content-boost",
    name: "Content Boost Plan",
    price: 22500,
    badge: "Save 36%",
    description: "Enhanced content package with social media",
    excludeFromDiscount: true,
    realWorth: 35000,
    savingsPercent: 36,
    category: "content",
    services: [
      { name: "10 Content Videos (30 sec each)", price: 30000, details: "No customization" },
      { name: "5 Flyers", price: 2500, details: "Basic design with initial information" },
      { name: "Social Media Management", price: 2500, details: "Monthly management included" },
    ],
  },
  {
    id: "30-days-15sec",
    name: "30 Days 30 Content Plan",
    price: 15000,
    badge: "Save 75%",
    description: "15 sec videos - Daily content for a month",
    excludeFromDiscount: true,
    realWorth: 60000,
    savingsPercent: 75,
    category: "content",
    services: [
      { name: "30 Content Videos (15 sec each)", price: 60000, details: "Daily content with content calendar" },
    ],
    addOnOptions: [
      { id: "social-media-addon", name: "Social Media Management (Add-On)", price: 2500 },
    ],
  },
  {
    id: "30-days-30sec",
    name: "30 Days 30 Content Plan (Part 2)",
    price: 30000,
    badge: "Save 75%",
    description: "30 sec videos - Premium daily content",
    excludeFromDiscount: true,
    realWorth: 120000,
    savingsPercent: 75,
    category: "content",
    services: [
      { name: "30 Content Videos (30 sec each)", price: 120000, details: "Daily content with content calendar" },
    ],
    addOnOptions: [
      { id: "social-media-addon", name: "Social Media Management (Add-On)", price: 2500 },
    ],
  },
  // My Online Store Plan
  {
    id: "online-store",
    name: "My Online Store Plan",
    price: 38000,
    badge: "E-Commerce",
    description: "Complete online business solution",
    excludeFromDiscount: false,
    category: "store",
    services: [
      { name: "Website Development + Management + Hosting + Payment Integration", price: 15000, details: "Full e-commerce setup" },
      { name: "Social Media Setup & Management", price: 3000, details: "All platforms" },
      { name: "Pack of 4 Ad Videos", price: 10000, details: "Full customization" },
      { name: "Meta & Google Ads Boosting", price: 5000, details: "50% charged for campaign management" },
      { name: "5,000 Views (Status Marketing)", price: 5000, details: "₹1 per view" },
    ],
    targetAudience: [
      "Online Store (E-commerce, Fashion)",
      "Online Clothing Shop",
      "Online Coaching Centre",
      "Online Product Selling",
      "Online Service Selling",
    ],
  },
];