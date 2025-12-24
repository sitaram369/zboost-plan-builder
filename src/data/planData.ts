import { PlanSection } from "@/types/plan";

export const planSections: PlanSection[] = [
  {
    id: "digital-footprint",
    title: "Digital Footprint Setup",
    options: [
      { id: "instagram", name: "Instagram Setup", price: 500, description: "Profile optimization, bio setup, highlights, and initial content strategy" },
      { id: "facebook", name: "Facebook Setup", price: 500, description: "Page creation, cover design, about section, and business info setup" },
      { id: "linkedin", name: "LinkedIn Setup", price: 500, description: "Company page creation, banner design, and professional profile optimization" },
      { id: "twitter", name: "Twitter/X Setup", price: 500, description: "Profile setup, header design, bio optimization, and pinned tweet strategy" },
      { id: "youtube", name: "YouTube Setup", price: 500, description: "Channel creation, banner design, about section, and initial video optimization" },
      { id: "gmb", name: "Google My Business Setup", price: 2500, description: "Complete GMB profile setup, photos, categories, and local SEO optimization" },
      { id: "gmb-management", name: "Google My Business Management", price: 5000, description: "Monthly GMB management, review responses, posts, and analytics reporting" },
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
        price: 1000, 
        isQuantityBased: true,
        pricePerUnit: 1,
        minQuantity: 1000,
        maxQuantity: 100000,
        quantityLabel: "views",
        description: "₹1 per view - Automated WhatsApp status marketing to reach local audiences",
        disabled: true
      },
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
