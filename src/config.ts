export const SITE = {
  website: "https://www.revibyte.blog/",
  author: "iSamuel",
  profile: "https://pin.it/1NYS28vrR", // Pinterest link – this is fine if you want it as your main profile link
  desc: "ReviByte Technology Opinions delivers the latest tech news, gadget reviews, Android updates, and in-depth guides to keep you informed and ahead in the digital world.",
  title: "ReviByte Opinions",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: true,

  // --- NEW: Hero background image for homepage ---
  // Place your image in /public/images/hero-bg.jpg (or .png, .webp)
  // Example values:
  // heroImage: "/images/hero-bg.jpg",
  // heroImage: "/images/tech-background.webp",
  heroImage: "/images/hero-bg.jpg", // ← Change this to your actual file name/path

  // Optional: Greeting text shown above your name in the hero
  greeting: "Hey there! 👋",

  // --- EDIT PAGE SECTION ---
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/bytecascade11/astrobyte/edit/main/",
  },

  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Africa/Lagos",

  analytics: {
    googleAnalyticsId: "G-2MH0T4DFR3",
  },
} as const;
