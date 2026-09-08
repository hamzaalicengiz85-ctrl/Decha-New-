/* =========================================================================
   DECHA — Adım 1: Header etkileşimleri + opsiyonel görsel yükleme
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- 1) Sticky header'ın kaydırma durumu ---------- */
  var header = document.getElementById("header");
  var SCROLL_THRESHOLD = 12;
  var ticking = false;

  function syncHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(syncHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
  syncHeader();

  /* ---------- 2) Mobil menü ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Bir linke tıklanınca menü kapansın (yumuşak kaydırma CSS ile yapılıyor)
  nav.addEventListener("click", function (event) {
    if (event.target.closest(".nav__link")) setMenu(false);
  });

  // Escape ile kapat, odağı butona geri ver
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Menü dışına tıklanınca kapat
  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open")) return;
    if (!event.target.closest("#nav") && !event.target.closest("#navToggle")) {
      setMenu(false);
    }
  });

  // Masaüstüne genişleyince mobil menü durumunu sıfırla
  var desktop = window.matchMedia("(min-width: 769px)");
  var onBreakpoint = function (event) {
    if (event.matches) setMenu(false);
  };
  if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
  else desktop.addListener(onBreakpoint); // eski Safari

  /* ---------- 3) Opsiyonel görseller ----------
     decha-logo.jpg / decha-ember-orb.jpg repoya eklenirse otomatik
     kullanılır; yoksa CSS ile üretilen logo ve küre görünür kalır. */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-optional-image]"),
    function (img) {
      function reveal() {
        if (img.naturalWidth > 0) img.style.display = "block";
      }
      function drop() {
        if (img.parentNode) img.parentNode.removeChild(img);
      }
      if (img.complete) {
        img.naturalWidth > 0 ? reveal() : drop();
      } else {
        img.addEventListener("load", reveal);
        img.addEventListener("error", drop);
      }
    }
  );
})();
