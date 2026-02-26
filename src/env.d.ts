/// <reference types="astro/client" />

interface Window {
  OneSignalDeferred: Array<(OneSignal: any) => void | Promise<void>>;
}
