<!-- OneSignal Push Notifications -->
<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
<script>
  (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
  (window as any).OneSignalDeferred.push(async function(OneSignal: any) {
    await OneSignal.init({
      appId: "bbd38552-99d1-4cda-96f9-5c0cacfba192",
      notifyButton: { enable: true } // optional bell icon
    });

    // Automatically show browser prompt (keep if you want it)
    OneSignal.showNativePrompt();
  });
</script>
