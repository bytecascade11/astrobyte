export const SITE = {
  website: "https://revibyte.blog/", // replace this with your deployed domain
  author: "iSamuel",
  profile: "https://pin.it/1NYS28vrR",
  desc: "ReviByte Technology Opinions delivers the latest tech news, gadget Opinions, Android updates, and in-depth guides to keep you informed and ahead in the digital world..",
  title: "ReviByte Opinions",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
