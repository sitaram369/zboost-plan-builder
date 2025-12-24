import { PlanSection } from "@/types/plan";

export const planSections: PlanSection[] = [
  {
    id: "digital-footprint",
    title: "Digital Footprint Setup",
    options: [
      { id: "instagram", name: "Instagram Setup", price: 500 },
      { id: "facebook", name: "Facebook Setup", price: 500 },
      { id: "linkedin", name: "LinkedIn Setup", price: 500 },
      { id: "twitter", name: "Twitter/X Setup", price: 500 },
      { id: "youtube", name: "YouTube Setup", price: 500 },
      { id: "gmb", name: "Google My Business Setup", price: 1000 },
      { id: "basic-landing", name: "Basic Landing Page", price: 5000 },
      { id: "landing-domain", name: "Landing Page + Domain", price: 7500, excludeFromDiscount: true },
      { id: "advanced-website", name: "Advanced Website", price: 18000 },
      { id: "domain-hosting", name: "Domain + Hosting", price: 7000, excludeFromDiscount: true },
      { id: "mid-app", name: "Mid-Level App", price: 20000 },
      { id: "advanced-app", name: "Advanced App", price: 25000 },
    ],
  },
  {
    id: "content-creation",
    title: "Digital Content Creation",
    options: [
      { id: "ad-pack-4", name: "Pack of 4 Ads (Up to 30 sec each)", price: 10000 },
      { id: "ad-15sec", name: "Single Ad Video (15 sec)", price: 3000 },
      { id: "ad-30sec", name: "Single Ad Video (30 sec)", price: 3500 },
      { id: "ad-above-30", name: "Single Ad Video (Above 30 sec)", price: 5000 },
      { id: "short-movie", name: "Short Movie (Up to 5 minutes)", price: 25000 },
    ],
  },
  {
    id: "digital-reach",
    title: "Digital Reach",
    options: [
      { id: "one-week-boost", name: "One-week Boost (1,000 reach)", price: 1000, excludeFromDiscount: true },
      { id: "boost-pack-4", name: "Package of 4 Boosts", price: 3200, excludeFromDiscount: true },
      { id: "whatsapp-broadcast", name: "WhatsApp Broadcast", price: 5000, description: "per month" },
      { id: "email-marketing", name: "Email Marketing", price: 7000, description: "per month" },
      { 
        id: "whatsapp-status", 
        name: "WhatsApp Status Marketing Software (U.S.P)", 
        price: 1000, 
        isQuantityBased: true,
        pricePerUnit: 1,
        minQuantity: 1000,
        maxQuantity: 100000,
        quantityLabel: "views",
        description: "₹1 per view",
        disabled: true
      },
    ],
  },
  {
    id: "automation",
    title: "AI Automation Services",
    options: [
      { id: "lead-automation", name: "Lead Automation (Auto follow-up, WhatsApp Flow, Email)", price: 0, description: "Custom pricing", disabled: true },
      { id: "crm-setup", name: "CRM Setup (Pipeline, Tagging, Automation)", price: 0, description: "Custom pricing", disabled: true },
      { id: "workflow-automation", name: "Workflow Automation (Chatbot, Appointments, Payments)", price: 0, description: "Custom pricing", disabled: true },
      { id: "maintenance", name: "Monthly Automation Maintenance", price: 0, description: "Custom pricing", disabled: true },
    ],
  },
];
