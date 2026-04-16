/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
  OneSignalDeferred: Array<(OneSignal: any) => void | Promise<void>>;
  installApp: () => Promise<void>;

  // ✅ Fix for Google AdSense
  adsbygoogle: any[];
}

// This allows using `adsbygoogle` directly in <script> tags without TS errors
declare var adsbygoogle: any[];
