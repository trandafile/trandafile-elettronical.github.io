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

  // Icona: inietta il tracciato autentico e prepara il "disegno".
  var trace = intro.querySelector(".intro__trace");
  var svg = intro.querySelector(".intro__icon");
  if (trace && window.EC_ICON_PATH) {
    trace.setAttribute("d", window.EC_ICON_PATH);
    if (svg && window.EC_ICON_VIEWBOX) svg.setAttribute("viewBox", window.EC_ICON_VIEWBOX);
  }
  var len = 1200;
  try { len = Math.ceil(trace.getTotalLength()) || 1200; } catch (e) {}
  trace.style.strokeDasharray = len;
  trace.style.strokeDashoffset = len;

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
    trace.style.transition = "none";
    trace.style.strokeDashoffset = 0;
    intro.classList.add("icon-fill", "name-in", "sub-in");
    tgEl.textContent = taglines[0];
    tgEl.classList.add("is-show");
    setTimeout(dismiss, 2400);
    return;
  }

  // Timeline.
  setTimeout(function () { trace.style.strokeDashoffset = 0; }, 150);   // disegna il circuito
  setTimeout(function () { intro.classList.add("icon-fill"); }, 2200);  // riempi + bagliore
  setTimeout(function () { intro.classList.add("name-in"); }, 2550);    // ELETTRONICAL
  setTimeout(function () { intro.classList.add("sub-in"); }, 3250);     // sottotitolo

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
  setTimeout(showTag, 3900);
})();
