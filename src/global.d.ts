/// <reference types="astro/client" />

interface OneSignal {
  init(options: { appId: string; [key: string]: any }): Promise<void>;
  showNativePrompt(): void;
  // add more methods if you use them later
}

declare global {
  interface Window {
    OneSignalDeferred: Array<(OneSignal: OneSignal) => Promise<void> | void>;
  }
}
