/* ===========================================================================
   ELETTRONICAL — hero animato della home (vanilla JS, zero dipendenze).
   1) il circuito si disegna dentro la Calabria, 2) appare la scritta ELETTRONICAL,
   3) scorrono in CICLO CONTINUO tutti i testi dei banner.
   Niente overlay, niente splash: è l'area "banner" della pagina.
   =========================================================================== */
(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  if (!hero) return;

  var svg = hero.querySelector(".hero__icon");
  var nameEl = hero.querySelector(".hero__name");
  var tgEl = hero.querySelector(".hero__tagline");

  // Inietta l'icona (regione + circuito + nodi).
  if (svg && window.EC_ICON_SVG) {
    if (window.EC_ICON_VIEWBOX) svg.setAttribute("viewBox", window.EC_ICON_VIEWBOX);
    svg.innerHTML = window.EC_ICON_SVG;
  }
  var region = svg ? svg.querySelector(".ec-region") : null;
  var inners = svg ? Array.prototype.slice.call(svg.querySelectorAll(".ec-inner")) : [];
  var nodes  = svg ? Array.prototype.slice.call(svg.querySelectorAll(".ec-node")) : [];
  var strokes = (region ? [region] : []).concat(inners);

  function prep(el, dur) {
    var len = 1000;
    try { len = Math.ceil(el.getTotalLength()) || 1000; } catch (e) {}
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.style.transition = "stroke-dashoffset " + dur + "ms ease";
  }
  if (region) prep(region, 1700);
  inners.forEach(function (el) { prep(el, 1300); });
  nodes.forEach(function (el, i) { el.style.animationDelay = (i * 0.14) + "s"; });
  function draw(el) { if (el) el.style.strokeDashoffset = 0; }

  // Wordmark lettera per lettera.
  if (nameEl) {
    var word = "ELETTRONICAL";
    nameEl.textContent = "";
    for (var i = 0; i < word.length; i++) {
      var sp = document.createElement("span");
      sp.textContent = word.charAt(i);
      sp.style.animationDelay = (i * 0.06) + "s";
      nameEl.appendChild(sp);
    }
  }

  // Tutti i testi dei banner.
  var taglines = [
    "La rete delle aziende calabresi in Ingegneria Elettronica",
    "Il Circuito dell’Innovazione Calabrese in Ingegneria Elettronica",
    "Dalla Calabria, le soluzioni hardware del domani",
    "Il nuovo polo dell’Ingegneria Elettronica",
    "Una rete strategica che unisce le migliori competenze hardware e firmware della Calabria",
    "Connessi per competere",
    "Mettiamo a sistema il know-how locale per affrontare le sfide dei mercati internazionali"
  ];

  var idx = 0;
  function cycle() {
    if (!tgEl) return;
    tgEl.classList.remove("is-show");
    setTimeout(function () {
      tgEl.textContent = taglines[idx];
      tgEl.classList.add("is-show");
      idx = (idx + 1) % taglines.length;
    }, 300);
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    strokes.forEach(function (el) { el.style.transition = "none"; el.style.strokeDashoffset = 0; });
    hero.classList.add("is-nodes", "is-name");
    if (tgEl) { tgEl.textContent = taglines[0]; tgEl.classList.add("is-show"); idx = 1; }
    setInterval(cycle, 5000);
    return;
  }

  // Disegno (una volta), poi i banner in ciclo continuo.
  setTimeout(function () { draw(region); }, 250);                 // disegna la Calabria
  setTimeout(function () { inners.forEach(draw); }, 950);         // disegna il circuito
  setTimeout(function () { hero.classList.add("is-nodes"); }, 2600);  // nodi + bagliore
  setTimeout(function () { hero.classList.add("is-name"); }, 2900);   // ELETTRONICAL
  setTimeout(function () { cycle(); setInterval(cycle, 3600); }, 3700); // banner in loop
})();
