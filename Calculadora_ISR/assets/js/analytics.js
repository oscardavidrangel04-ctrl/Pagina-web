
(() => {
  "use strict";

  const config = window.CM_CONFIG || {};
  const consentConfig = config.consent || {};
  const storageKey = consentConfig.storageKey || "cm-consent-v1";
  const consentVersion = consentConfig.version || "1.0";
  const defaultConsent = {
    analytics: false,
    ads: false,
    necessary: true,
    version: consentVersion,
    updatedAt: null
  };

  const readConsent = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey));
      if (!parsed || parsed.version !== consentVersion) return null;
      return {...defaultConsent, ...parsed};
    } catch {
      return null;
    }
  };

  const saveConsent = consent => {
    const value = {
      ...defaultConsent,
      ...consent,
      necessary: true,
      version: consentVersion,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("cm:consent-changed", {detail: value}));
    return value;
  };

  const getPageType = () => {
    const path = location.pathname;
    if (path.includes("/calculadoras/")) return "calculator";
    if (path.includes("/articulos/")) return "article";
    if (path.includes("/categorias/")) return "category";
    if (path.endsWith("/calculadoras.html")) return "calculator_index";
    if (path.endsWith("/articulos.html")) return "article_index";
    if (path === "/" || path.endsWith("/index.html")) return "home";
    return "static";
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

  const updateGoogleConsent = consent => {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.ads ? "granted" : "denied",
      ad_user_data: consent.ads ? "granted" : "denied",
      ad_personalization: consent.ads ? "granted" : "denied"
    });
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });

  let analyticsLoaded = false;

  const loadAnalytics = consent => {
    const analytics = config.analytics || {};
    if (!analytics.enabled || !consent?.analytics || analyticsLoaded) return;
    if (!/^G-[A-Z0-9]+$/i.test(analytics.measurementId || "")) return;

    analyticsLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.measurementId)}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", analytics.measurementId, {
      anonymize_ip: true,
      page_title: document.title,
      page_location: location.href,
      content_group: getPageType()
    });
  };

  const track = (eventName, params = {}) => {
    const consent = readConsent();
    if (!config.analytics?.enabled || !consent?.analytics) return;
    window.gtag("event", eventName, {
      page_type: getPageType(),
      page_path: location.pathname,
      ...params
    });
  };

  window.CMAnalytics = Object.freeze({
    track,
    getConsent: readConsent,
    saveConsent,
    openPreferences: () => window.dispatchEvent(new CustomEvent("cm:open-consent"))
  });

  const injectConsentUI = () => {
    if (document.querySelector(".consent-banner")) return;

    const banner = document.createElement("section");
    banner.className = "consent-banner";
    banner.hidden = true;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "true");
    banner.setAttribute("aria-labelledby", "consent-title");
    banner.innerHTML = `
      <div class="consent-card">
        <div class="consent-copy">
          <span class="consent-icon" aria-hidden="true">🍪</span>
          <div>
            <h2 id="consent-title">Tu privacidad importa</h2>
            <p>Usamos almacenamiento necesario para que el sitio funcione. Con tu permiso, también podremos medir el uso del portal y mostrar publicidad.</p>
          </div>
        </div>
        <div class="consent-actions">
          <button type="button" class="consent-secondary" data-consent="necessary">Solo necesarias</button>
          <button type="button" class="consent-secondary" data-consent="customize">Configurar</button>
          <button type="button" class="consent-primary" data-consent="accept">Aceptar todo</button>
        </div>
      </div>`;

    const modal = document.createElement("section");
    modal.className = "consent-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "consent-settings-title");
    modal.innerHTML = `
      <div class="consent-settings-card">
        <div class="consent-settings-head">
          <div>
            <small>Centro de privacidad</small>
            <h2 id="consent-settings-title">Preferencias de cookies</h2>
          </div>
          <button type="button" class="consent-close" data-consent-close aria-label="Cerrar preferencias">×</button>
        </div>

        <div class="consent-option">
          <div><strong>Necesarias</strong><p>Permiten funciones básicas, preferencias y seguridad.</p></div>
          <span class="consent-required">Siempre activas</span>
        </div>

        <label class="consent-option">
          <div><strong>Analítica</strong><p>Ayuda a entender qué calculadoras y contenidos resultan más útiles.</p></div>
          <input type="checkbox" data-consent-analytics>
          <span class="consent-switch" aria-hidden="true"></span>
        </label>

        <label class="consent-option">
          <div><strong>Publicidad</strong><p>Permite cargar espacios publicitarios cuando estén configurados.</p></div>
          <input type="checkbox" data-consent-ads>
          <span class="consent-switch" aria-hidden="true"></span>
        </label>

        <div class="consent-settings-actions">
          <a href="${location.pathname.includes("/") && location.pathname.split("/").filter(Boolean).length > 1 ? "../" : ""}cookies.html">Leer política de cookies</a>
          <button type="button" class="consent-primary" data-consent-save>Guardar preferencias</button>
        </div>
      </div>`;

    document.body.append(banner, modal);

    const showBanner = () => {
      banner.hidden = false;
      requestAnimationFrame(() => banner.classList.add("show"));
    };

    const hideBanner = () => {
      banner.classList.remove("show");
      setTimeout(() => banner.hidden = true, 220);
    };

    const openModal = () => {
      const current = readConsent() || defaultConsent;
      modal.querySelector("[data-consent-analytics]").checked = !!current.analytics;
      modal.querySelector("[data-consent-ads]").checked = !!current.ads;
      modal.hidden = false;
      requestAnimationFrame(() => {
        modal.classList.add("show");
        modal.querySelector("[data-consent-analytics]").focus();
      });
    };

    const closeModal = () => {
      modal.classList.remove("show");
      setTimeout(() => modal.hidden = true, 220);
    };

    banner.addEventListener("click", event => {
      const action = event.target.closest("[data-consent]")?.dataset.consent;
      if (!action) return;

      if (action === "accept") {
        const consent = saveConsent({analytics: true, ads: true});
        updateGoogleConsent(consent);
        loadAnalytics(consent);
        hideBanner();
      }
      if (action === "necessary") {
        const consent = saveConsent({analytics: false, ads: false});
        updateGoogleConsent(consent);
        hideBanner();
      }
      if (action === "customize") openModal();
    });

    modal.querySelector("[data-consent-close]").addEventListener("click", closeModal);
    modal.querySelector("[data-consent-save]").addEventListener("click", () => {
      const consent = saveConsent({
        analytics: modal.querySelector("[data-consent-analytics]").checked,
        ads: modal.querySelector("[data-consent-ads]").checked
      });
      updateGoogleConsent(consent);
      loadAnalytics(consent);
      closeModal();
      hideBanner();
    });

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });

    window.addEventListener("cm:open-consent", openModal);

    const current = readConsent();
    if (!current) {
      showBanner();
    } else {
      updateGoogleConsent(current);
      loadAnalytics(current);
    }
  };

  const installTracking = () => {
    document.addEventListener("click", event => {
      const target = event.target.closest("a, button");
      if (!target) return;

      if (target.matches(".premium-action, .calc-button, button[type='submit']")) {
        track("calculator_start", {
          calculator_name: document.body.dataset.calc || document.querySelector("h1")?.textContent?.trim() || "unknown"
        });
      }

      const resultAction = target.dataset.resultAction;
      if (resultAction) {
        track(`result_${resultAction}`, {
          calculator_name: document.body.dataset.calc || "unknown"
        });
      }

      if (target.matches("[data-favorite-calculator]")) {
        track("favorite_toggle", {
          calculator_name: document.body.dataset.calc || "unknown"
        });
      }

      if (target.matches("[data-search-open]")) track("search_open");
      if (target.matches("[data-history-open]")) track("history_open");

      if (target.tagName === "A") {
        const href = target.getAttribute("href") || "";
        if (/^https?:\/\//.test(href) && !href.includes(location.hostname)) {
          track("outbound_click", {link_url: href});
        }
      }
    });

    document.addEventListener("submit", event => {
      if (event.target.matches("form")) {
        track("form_submit", {
          form_name: event.target.id || event.target.getAttribute("aria-label") || "form"
        });
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectConsentUI();
    installTracking();
  });
})();
