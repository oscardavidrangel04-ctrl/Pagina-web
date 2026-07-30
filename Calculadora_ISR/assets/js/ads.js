
(() => {
  "use strict";

  const config = window.CM_CONFIG?.adsense || {};
  let adsenseLoaded = false;

  const getConsent = () => {
    try {
      const key = window.CM_CONFIG?.consent?.storageKey || "cm-consent-v1";
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  };

  const loadAdsense = () => {
    const consent = getConsent();
    if (!config.enabled || !consent?.ads || adsenseLoaded) return;
    if (!/^ca-pub-\d+$/i.test(config.clientId || "")) return;

    adsenseLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.clientId)}`;
    document.head.appendChild(script);

    script.addEventListener("load", renderAds);
  };

  const renderAds = () => {
    document.querySelectorAll("[data-ad-slot]").forEach(container => {
      if (container.dataset.adRendered === "true") return;
      const slotKey = container.dataset.adSlot;
      const slotId = config.slots?.[slotKey];
      if (!slotId) return;

      container.innerHTML = `
        <span class="ad-label">Publicidad</span>
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="${config.clientId}"
          data-ad-slot="${slotId}"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>`;
      container.dataset.adRendered = "true";

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    });
  };

  const showPlaceholders = () => {
    document.querySelectorAll("[data-ad-slot]").forEach(container => {
      if (container.children.length) return;
      container.innerHTML = `
        <span class="ad-label">Espacio publicitario</span>
        <div class="ad-placeholder">
          <strong>Publicidad discreta</strong>
          <small>Se activará cuando AdSense esté configurado y autorizado.</small>
        </div>`;
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    showPlaceholders();
    loadAdsense();
  });

  window.addEventListener("cm:consent-changed", event => {
    if (event.detail?.ads) loadAdsense();
  });
})();
