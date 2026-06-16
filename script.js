/* ===========================================================================
   ELETTRONICAL — JavaScript (vanilla, zero dipendenze)
   - Carosello home (auto-play, frecce, pallini)
   - Caricamento dinamico di members.json e news.json
   =========================================================================== */
(function () {
  "use strict";

  /* ----- Carosello --------------------------------------------------------- */
  function initCarousel() {
    var carousel = document.querySelector(".carousel");
    if (!carousel) return;

    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".carousel__slide"));
    if (slides.length === 0) return;

    var dotsWrap = carousel.querySelector(".carousel__dots");
    var prevBtn = carousel.querySelector(".carousel__btn--prev");
    var nextBtn = carousel.querySelector(".carousel__btn--next");
    var index = 0;
    var timer = null;
    var DELAY = 5000;

    // costruisci i pallini
    var dots = [];
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Vai alla slide " + (i + 1));
      dot.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function go(n) {
      slides[index].classList.remove("is-active");
      dots[index].classList.remove("is-active");
      index = (n + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      dots[index].classList.add("is-active");
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function start() { timer = setInterval(next, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    // pausa al passaggio del mouse
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);

    // rispetta chi preferisce ridurre il movimento
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) start();
  }

  /* ----- Utilità ----------------------------------------------------------- */
  var MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
              "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

  function formatDate(iso) {
    var parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10), d = parseInt(parts[2], 10);
    if (!m || !d) return iso;
    return d + " " + MESI[m - 1] + " " + y;
  }

  function byDateDesc(a, b) { return String(b.data).localeCompare(String(a.data)); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fetchJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  /* ----- Afferenti --------------------------------------------------------- */
  function loadMembers() {
    var grid = document.getElementById("members-grid");
    if (!grid) return;
    fetchJSON("members.json").then(function (members) {
      if (!members.length) { grid.innerHTML = '<p class="empty">Nessun afferente disponibile.</p>'; return; }
      grid.innerHTML = members.map(function (m) {
        var sito = m.sito ? esc(m.sito) : "";
        var host = sito.replace(/^https?:\/\//, "").replace(/\/$/, "");
        var link = sito
          ? '<a class="member-link" href="' + sito + '" target="_blank" rel="noopener">' + esc(host) + "</a>"
          : "";
        return '' +
          '<article class="member-card">' +
            '<div class="member-card__logo">' +
              '<img src="' + esc(m.logo) + '" alt="Logo ' + esc(m.nome) + '" loading="lazy">' +
            "</div>" +
            "<h3>" + esc(m.nome) + "</h3>" +
            "<p>" + esc(m.descrizione) + "</p>" +
            link +
          "</article>";
      }).join("");
    }).catch(function (e) {
      grid.innerHTML = '<p class="empty">Impossibile caricare gli afferenti.</p>';
      console.error(e);
    });
  }

  /* ----- News -------------------------------------------------------------- */
  function loadNews() {
    var homeWrap = document.getElementById("home-news");
    var listWrap = document.getElementById("news-list");
    if (!homeWrap && !listWrap) return;

    fetchJSON("news.json").then(function (items) {
      items = items.slice().sort(byDateDesc);

      // Home: ultime 3 in card sintetiche
      if (homeWrap) {
        if (!items.length) {
          homeWrap.innerHTML = '<p class="empty">Nessuna notizia al momento.</p>';
        } else {
          homeWrap.innerHTML = items.slice(0, 3).map(function (n) {
            return '' +
              '<article class="news-card">' +
                '<div class="news-card__date">' + esc(formatDate(n.data)) + "</div>" +
                "<h3>" + esc(n.titolo) + "</h3>" +
                "<p>" + esc(n.estratto) + "</p>" +
                '<a class="read-more" href="news.html#' + esc(n.id) + '">Leggi tutto &rarr;</a>' +
              "</article>";
          }).join("");
        }
      }

      // news.html: elenco cronologico completo
      if (listWrap) {
        if (!items.length) {
          listWrap.innerHTML = '<p class="empty">Nessuna notizia pubblicata.</p>';
        } else {
          listWrap.innerHTML = items.map(function (n) {
            var body = String(n.testo || n.estratto || "")
              .split(/\n\n+/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
            return '' +
              '<article class="news-article" id="' + esc(n.id) + '">' +
                '<div class="news-date">' + esc(formatDate(n.data)) + "</div>" +
                "<h2>" + esc(n.titolo) + "</h2>" +
                '<div class="news-body">' + body + "</div>" +
              "</article>";
          }).join("");
          // se la pagina è stata aperta con un'ancora, vai alla notizia
          if (location.hash) {
            var el = document.getElementById(location.hash.slice(1));
            if (el) el.scrollIntoView();
          }
        }
      }
    }).catch(function (e) {
      var msg = '<p class="empty">Impossibile caricare le notizie.</p>';
      if (homeWrap) homeWrap.innerHTML = msg;
      if (listWrap) listWrap.innerHTML = msg;
      console.error(e);
    });
  }

  /* ----- Avvio ------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initCarousel();
    loadMembers();
    loadNews();
  });
})();
