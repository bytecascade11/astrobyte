export const tagMetadata: Record<string, { title: string; description: string }> = {
  news: {
    title: "Tech News – ReviByte Opinions",
    description:
      "Latest technology news, smartphone updates, gaming industry headlines, and AI developments with honest ReviByte takes.",
  },
  samsung: {
    title: "Samsung – ReviByte Opinions",
    description:
      "In-depth Samsung Galaxy reviews, One UI features, Exynos vs Snapdragon debates, foldables, and battery/camera opinions.",
  },
  apple: {
    title: "Apple & iPhone – ReviByte Opinions",
    description:
      "Apple news, iPhone camera showdowns, iOS tips, ecosystem comparisons vs Android, and no-nonsense opinions on premium tech.",
  },
  android: {
    title: "Android – ReviByte Opinions",
    description:
      "Android ecosystem deep dives, OS updates, budget/mid-range devices (Tecno, Infinix, Redmi), custom features, and real-user opinions.",
  },
  games: {
    title: "Games & Mobile Gaming – ReviByte Opinions",
    description:
      "Mobile game recommendations, offline titles, genre breakdowns, best games for low-end phones, and 2026 gaming guides.",
  },
  ai: {
    title: "AI & Artificial Intelligence – ReviByte Opinions",
    description:
      "AI in smartphones, generative tools, on-device processing, future impact on gaming/tech, and practical opinions on 2026 trends.",
  },
  opinions: {
    title: "Opinions & Editorials – ReviByte",
    description:
      "Unfiltered opinions on smartphones, batteries, RAM, displays, charging tech, gaming performance, and why certain features matter (or don't).",
  },

  // Bonus: Highly relevant from your actual posts (add these to sidebar/categories as they fit perfectly)
  smartphones: {
    title: "Smartphones – ReviByte Opinions",
    description:
      "Real-world smartphone opinions: RAM minimums, removable batteries, 120Hz displays, fast charging, and value picks in 2026.",
  },
  battery: {
    title: "Battery & Charging – ReviByte Opinions",
    description:
      "Battery life tests, fast charging deep dives, heat management, health tips, and why removable batteries deserve a comeback.",
  },
  camera: {
    title: "Camera & Photography – ReviByte Opinions",
    description:
      "Smartphone camera comparisons (Pixel vs iPhone, Samsung vs others), low-light performance, zoom, and editing opinions.",
  },
  offlinegames: {
    title: "Offline Games – ReviByte Opinions",
    description:
      "Top offline mobile games in 2026, no-internet recommendations, showdowns like Balatro vs Luck be a Landlord, and classics.",
  },

} as const;
