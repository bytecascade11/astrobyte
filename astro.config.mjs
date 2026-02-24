// astro.config.mjs (create this file if missing)
import { defineConfig } from 'astro/config';

// Optional: Enable Sharp for better image processing (even if you use public/ images)
export default defineConfig({
  // ... your other config (if any)

  // This enables the built-in Sharp service globally
  // It helps if you later switch to <Image /> or src/assets/
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',  // default Sharp service
      config: {
        // Optional: allow very large images if needed
        limitInputPixels: false,
      },
    },
  },
});
