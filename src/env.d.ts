<!-- OneSignal Push Notifications -->
    <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
    <script>
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.init({
          appId: "bbd38552-99d1-4cda-96f9-5c0cacfba192",
          notifyButton: { enable: true } // optional bell icon
        });

        // Automatically show browser prompt
        OneSignal.showNativePrompt();
      });
    </script>
