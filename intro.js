/* ===========================================================================
   ELETTRONICAL — intro animata (vanilla JS, zero dipendenze)
   Sequenza: 1) il circuito si disegna dentro la Calabria, 2) appare la scritta
   ELETTRONICAL, 3) scorrono in sequenza i testi dei banner.
   Si riproduce una sola volta per sessione; saltabile (bottone, clic, scroll, Esc).
   =========================================================================== */
(function () {
  "use strict";

  var intro = document.getElementById("intro");
  if (!intro) return;

  // Già vista in questa sessione → non riprodurre.
  var seen = false;
  try { seen = !!sessionStorage.getItem("ec_intro"); } catch (e) {}
  if (seen) { intro.style.display = "none"; return; }

  var dismissed = false;
  function cleanup() {
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("wheel", onScroll);
    window.removeEventListener("touchmove", onScroll);
  }
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    intro.classList.add("intro--done");
    document.body.classList.remove("intro-lock");
    try { sessionStorage.setItem("ec_intro", "1"); } catch (e) {}
    setTimeout(function () { intro.style.display = "none"; }, 850);
    cleanup();
  }
  function onKey(e) { if (e.key === "Escape") dismiss(); }
  function onScroll() { dismiss(); }

  document.body.classList.add("intro-lock");
  var skipBtn = intro.querySelector(".intro__skip");
  if (skipBtn) skipBtn.addEventListener("click", dismiss);
  intro.addEventListener("click", function (e) { if (e.target === intro) dismiss(); });
  document.addEventListener("keydown", onKey);
  window.addEventListener("wheel", onScroll, { passive: true });
  window.addEventListener("touchmove", onScroll, { passive: true });

  // Wordmark lettera per lettera.
  var nameEl = intro.querySelector(".intro__name");
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

  // Icona: inietta i 3 strati (regione, circuito, nodi) e prepara il "disegno".
  var svg = intro.querySelector(".intro__icon");
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

  var taglines = [
    "La rete delle aziende calabresi in Ingegneria Elettronica",
    "Dalla Calabria, le soluzioni hardware del domani",
    "Connessi per competere",
    "Una rete strategica che unisce le competenze hardware e firmware della Calabria",
    "Il nuovo polo dell’Ingegneria Elettronica"
  ];
  var tgWrap = intro.querySelector(".intro__taglines");
  var tgEl = document.createElement("div");
  tgEl.className = "intro__tagline";
  if (tgWrap) tgWrap.appendChild(tgEl);

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    strokes.forEach(function (el) { el.style.transition = "none"; el.style.strokeDashoffset = 0; });
    intro.classList.add("nodes-in", "name-in", "sub-in");
    tgEl.textContent = taglines[0];
    tgEl.classList.add("is-show");
    setTimeout(dismiss, 2400);
    return;
  }

  // Timeline.
  setTimeout(function () { draw(region); }, 150);                        // disegna la Calabria
  setTimeout(function () { inners.forEach(draw); }, 850);                // disegna il circuito
  setTimeout(function () { intro.classList.add("nodes-in"); }, 2500);    // nodi + bagliore
  setTimeout(function () { intro.classList.add("name-in"); }, 2800);     // ELETTRONICAL
  setTimeout(function () { intro.classList.add("sub-in"); }, 3500);      // sottotitolo

  var idx = 0, step = 1850;
  function showTag() {
    if (dismissed) return;
    tgEl.classList.remove("is-show");
    setTimeout(function () {
      tgEl.textContent = taglines[idx];
      tgEl.classList.add("is-show");
      idx++;
      if (idx < taglines.length) setTimeout(showTag, step);
      else setTimeout(dismiss, step);     // dopo l'ultimo banner, rivela il sito
    }, 220);
  }
  setTimeout(showTag, 4200);
})();
