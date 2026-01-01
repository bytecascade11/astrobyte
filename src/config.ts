export const SITE = {
  website: "https://www.revibyte.blog/", 
  author: "iSamuel",
  profile: "https://pin.it/1NYS28vrR",
  desc: "ReviByte Technology Opinions delivers the latest tech news, gadget reviews, Android updates, and in-depth guides to keep you informed and ahead in the digital world.",
  title: "ReviByte Opinions",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, 
  showArchives: true,
  showBackButton: true,
    // --- EDIT PAGE SECTION START ---
  editPost: {
    enabled: false, // Set this to false to hide the "Edit page" link
    text: "Edit page",
    url: "https://github.com/bytecascade11/astrobyte/edit/main/",
  },
  // --- EDIT PAGE SECTION END ---
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Africa/Lagos", 

  analytics: {
    googleAnalyticsId: "G-2MH0T4DFR3",
  },
} as const;
