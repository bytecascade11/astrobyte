typescript
/// <reference types="astro/client" />

interface Window {
  OneSignalDeferred: Array<(OneSignal: any) => void | Promise<void>>;
  installApp: () => Promise<void>;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
