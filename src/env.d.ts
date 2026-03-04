/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
  OneSignalDeferred: Array<(OneSignal: any) => void | Promise<void>>;
  installApp: () => Promise<void>;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
