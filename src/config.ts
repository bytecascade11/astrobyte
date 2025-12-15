export const SITE = {
  website: "https://www.revibyte.blog/", // Your live domain – perfect
  author: "iSamuel",
  profile: "https://pin.it/1NYS28vrR", // Your Pinterest (already in socials too)
  desc: "ReviByte Technology Opinions delivers the latest tech news, gadget reviews, Android updates, and in-depth guides to keep you informed and ahead in the digital world.",
  title: "ReviByte Opinions", // This shows in header and browser tabs
  ogImage: "astropaper-og.jpg", // Optional: replace with your own image later (upload to public/)
  lightAndDarkMode: true,
  postPerIndex: 4, // Posts shown on homepage
  postPerPage: 4,  // Posts per category page
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/bytecascade11/astrobyte/edit/main/", // Update to YOUR repo path
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Asia/Bangkok",

  // ← ADD THIS NEW SECTION FOR ANALYTICS
  analytics: {
    googleAnalyticsId: "G-2MH0T4DFR3", // Your GA4 ID – tracking starts immediately
  },
} as const;
