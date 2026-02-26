<script is:inline src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
<script is:inline>
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async function(OneSignal) {
    await OneSignal.init({
      appId: "bbd38552-99d1-4cda-96f9-5c0cacfba192",
      notifyButton: { enable: true }
    });
    OneSignal.showNativePrompt();
  });
</script>
