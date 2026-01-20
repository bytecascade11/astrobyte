// src/data/tagMetadata.ts

import { SITE } from "@/config";

/**
 * Tag metadata for SEO
 * These descriptions appear:
 * 1. In Google search results under tag pages
 * 2. As sitelink descriptions (the text under each link in Google)
 * 3. In social media shares
 */

interface TagMeta {
  title: string;
  description: string;
}

export const tagMetadata: Record<string, TagMeta> = {
  // ─────────────────────────────────────────────────────────────
  // MAIN NAVIGATION TAGS (appear as sitelinks in Google)
  // ─────────────────────────────────────────────────────────────
  
  news: {
    title: `Tech News | ${SITE.title}`,
    description: "Stay updated with the latest tech news, product launches, industry updates, and breaking stories from the world of technology.",
  },

  games: {
    title: `Mobile Games | ${SITE.title}`,
    description: "Discover the best mobile games, offline game reviews, gaming tips, and performance guides for Android and iOS devices.",
  },

  ai: {
    title: `AI & Artificial Intelligence | ${SITE.title}`,
    description: "Explore AI tools, artificial intelligence news, ChatGPT guides, and how AI is transforming technology and creativity.",
  },

  android: {
    title: `Android News & Reviews | ${SITE.title}`,
    description: "Android news, tips, device reviews, and guides to help you get the most from your Android smartphone and tablet.",
  },

  samsung: {
    title: `Samsung Galaxy Reviews | ${SITE.title}`,
    description: "Samsung Galaxy reviews, One UI updates, flagship comparisons, and the latest news from Samsung's mobile division.",
  },

  apple: {
    title: `iPhone & Apple Reviews | ${SITE.title}`,
    description: "iPhone reviews, iOS updates, Apple product comparisons, and insights into Apple's latest devices and ecosystem.",
  },

  opinions: {
    title: `Tech Opinions & Analysis | ${SITE.title}`,
    description: "Tech opinions, industry analysis, hot takes on smartphones, AI, and trends shaping the future of technology.",
  },

  // ─────────────────────────────────────────────────────────────
  // ADDITIONAL IMPORTANT TAGS
  // ─────────────────────────────────────────────────────────────

  reviews: {
    title: `Product Reviews | ${SITE.title}`,
    description: "In-depth product reviews, hands-on testing, and honest assessments of smartphones, gadgets, and tech products.",
  },

  technology: {
    title: `Technology News | ${SITE.title}`,
    description: "Technology news, innovations, industry trends, and how emerging tech is changing our digital world.",
  },

  "mobile-gaming": {
    title: `Mobile Gaming | ${SITE.title}`,
    description: "Mobile gaming guides, performance optimization, game recommendations, and tips for the best mobile gaming experience.",
  },

  battery: {
    title: `Battery & Charging | ${SITE.title}`,
    description: "Battery technology, fast charging guides, battery life tips, and power management for your smartphone.",
  },

  iphone: {
    title: `iPhone Reviews & News | ${SITE.title}`,
    description: "Latest iPhone news, model comparisons, iOS tips, and everything you need to know about Apple's smartphones.",
  },

  rumors: {
    title: `Tech Rumors & Leaks | ${SITE.title}`,
    description: "Upcoming tech rumors, product leaks, industry insider news, and what to expect from future device launches.",
  },

  productivity: {
    title: `Productivity Tools | ${SITE.title}`,
    description: "Productivity apps, workflow tips, tech tools to boost efficiency, and guides to work smarter with technology.",
  },

  sustainability: {
    title: `Sustainable Tech | ${SITE.title}`,
    description: "Environmental impact of technology, sustainable gadgets, e-waste solutions, and eco-friendly tech practices.",
  },

  consumerism: {
    title: `Tech Consumerism | ${SITE.title}`,
    description: "Analysis of tech consumption trends, upgrade cycles, planned obsolescence, and mindful technology purchasing.",
  },

  launch: {
    title: `Product Launches | ${SITE.title}`,
    description: "Latest product launches, device announcements, release dates, and first impressions of new tech products.",
  },

  breaking: {
    title: `Breaking Tech News | ${SITE.title}`,
    description: "Breaking technology news, urgent updates, major announcements, and developing stories in the tech industry.",
  },

  update: {
    title: `Software Updates | ${SITE.title}`,
    description: "OS updates, software patches, new features, and everything about the latest updates for your devices.",
  },

  // ─────────────────────────────────────────────────────────────
  // BRAND/DEVICE SPECIFIC
  // ─────────────────────────────────────────────────────────────

  infinix: {
    title: `Infinix Reviews | ${SITE.title}`,
    description: "Infinix smartphone reviews, budget device comparisons, and value-focused mobile technology insights.",
  },

  redmi: {
    title: `Redmi Reviews | ${SITE.title}`,
    description: "Redmi smartphone reviews, Xiaomi sub-brand news, and budget flagship device comparisons.",
  },

  tecno: {
    title: `Tecno Reviews | ${SITE.title}`,
    description: "Tecno smartphone reviews, budget device analysis, and emerging market mobile technology coverage.",
  },

  "gaming-guide-2026": {
    title: `Gaming Guide 2026 | ${SITE.title}`,
    description: "Ultimate 2026 mobile gaming guide covering devices, optimization, game recommendations, and performance tips.",
  },
};

/**
 * Get metadata for a tag with fallback
 */
export function getTagMeta(tag: string): TagMeta {
  const lowerTag = tag.toLowerCase();
  
  if (tagMetadata[lowerTag]) {
    return tagMetadata[lowerTag];
  }
  
  // Fallback for tags not in the list
  const displayTag = tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${displayTag} | ${SITE.title}`,
    description: `Browse all posts about ${displayTag}. Get insights, reviews, and analysis on ${displayTag} at ReviByte Technology Opinions.`,
  };
      }
