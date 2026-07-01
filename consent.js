/* ===========================================================================
   ELETTRONICAL — consenso cookie (vanilla JS, zero dipendenze).
   Google Analytics viene caricato SOLO dopo il consenso esplicito dell'utente.
   Scelta memorizzata in localStorage ('granted' | 'denied').
   Per riaprire il banner: window.ecResetCookieConsent()
   =========================================================================== */
(function () {
  "use strict";

  var GA_ID = "G-0E2P9BF1VJ";
  var KEY = "ec_cookie_consent";

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.__ecGaLoaded) return;
    window.__ecGaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  // Permette di revocare/riaprire il consenso (usato dalla pagina Privacy).
  window.ecResetCookieConsent = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  var decision = get();
  if (decision === "granted") { loadGA(); return; }
  if (decision === "denied") { return; }

  // Nessuna scelta ancora: mostra il banner.
  var shown = false;
  function showBanner() {
    if (shown || !document.body) return;
    shown = true;
    var b = document.createElement("div");
    b.className = "cookie-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Preferenze cookie");
    b.innerHTML =
      '<div class="cookie-banner__text">Usiamo cookie di statistica (Google Analytics) per capire come viene usato il sito. ' +
      'Sono attivati solo con il tuo consenso. <a href="privacy.html">Informativa cookie</a>.</div>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="btn btn-outline cookie-reject">Rifiuta</button>' +
        '<button type="button" class="btn cookie-accept">Accetta</button>' +
      '</div>';
    document.body.appendChild(b);
    b.querySelector(".cookie-accept").addEventListener("click", function () {
      set("granted"); loadGA(); b.remove();
    });
    b.querySelector(".cookie-reject").addEventListener("click", function () {
      set("denied"); b.remove();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
})();
