// App Configuration and Integrations
(function() {
  // Fetch config once and use for all integrations
  fetch('/get-config')
    .then(response => response.json())
    .then(config => {
      // Google Analytics (gtag)
      initializeGoogleAnalytics(config);

      // Intercom integration
      initializeIntercom(config);
    })
    .catch(error => {
      console.warn('Failed to load app config:', error);
    });

  // Google Analytics initialization
  function initializeGoogleAnalytics(config) {
    const gtagId = config.gtagId;

    if (!gtagId) {
      console.warn('GTAG_ID not available');
      return;
    }

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gtagId);

    // Make gtag globally available
    window.gtag = gtag;
  }

  // Intercom initialization
  function initializeIntercom(config) {
    const appId = config.intercomAppId;

    if (!appId) {
      console.warn('Intercom app_id not available');
      return;
    }

    window.intercomSettings = {
      api_base: "https://api-iam.intercom.io",
      app_id: appId,
    };

    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      var d = document;
      var i = function() { i.c(arguments); };
      i.q = [];
      i.c = function(args) { i.q.push(args); };
      w.Intercom = i;
      var l = function() {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/' + appId;
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === 'complete') {
        l();
      } else if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    }
  }
})();
