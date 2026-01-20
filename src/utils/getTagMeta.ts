// src/utils/getTagMeta.ts (Create this new file)

/**
 * Custom meta descriptions for tag pages
 * These will appear under sitelinks in Google search results
 */

export const TAG_DESCRIPTIONS: Record<string, string> = {
  // Main navigation tags with compelling descriptions
  news: "Stay updated with the latest tech news, product launches, industry updates, and breaking stories from the world of technology.",
  
  games: "Discover the best mobile games, offline game reviews, gaming tips, and performance guides for Android and iOS devices.",
  
  ai: "Explore AI tools, artificial intelligence news, ChatGPT guides, and how AI is transforming technology and creativity.",
  
  android: "Android news, tips, device reviews, and guides to help you get the most from your Android smartphone and tablet.",
  
  samsung: "Samsung Galaxy reviews, One UI updates, flagship comparisons, and the latest news from Samsung's mobile division.",
  
  apple: "iPhone reviews, iOS updates, Apple product comparisons, and insights into Apple's latest devices and ecosystem.",
  
  opinions: "Tech opinions, industry analysis, hot takes on smartphones, AI, and trends shaping the future of technology.",
  
  // Additional useful tags
  reviews: "In-depth product reviews, hands-on testing, and honest assessments of smartphones, gadgets, and tech products.",
  
  technology: "Technology news, innovations, industry trends, and how emerging tech is changing our digital world.",
  
  "mobile-gaming": "Mobile gaming guides, performance optimization, game recommendations, and tips for the best mobile gaming experience.",
};

/**
 * Get meta description for a tag page
 * Falls back to generic description if tag not found
 */
export function getTagDescription(tag: string): string {
  return TAG_DESCRIPTIONS[tag] || `Browse all posts tagged with "${tag}" on ReviByte Technology Opinions.`;
}

/**
 * Get meta title for a tag page
 */
export function getTagTitle(tag: string): string {
  const formatted = tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return `${formatted} - ReviByte Opinions`;
}
