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

  /* ---------- 3) Scroll reveal ----------
     ui-ux-pro-max "Scroll Reveal / Subtle": viewport girişinde tetikle,
     küçük y offset, tek seferlik. Elemanlar CSS'te yalnızca .js altında
     gizlendiği için JS çalışmazsa içerik olduğu gibi görünür. */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function showAll() {
    Array.prototype.forEach.call(revealTargets, function (el) {
      el.classList.add("is-visible");
    });
  }

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    showAll();
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );

    Array.prototype.forEach.call(revealTargets, function (el) {
      // aynı grup içindeki elemanlar kademeli (stagger) girsin
      var group = el.parentNode;
      var position = Array.prototype.indexOf.call(group.children, el);
      el.style.setProperty("--reveal-delay", Math.min(position, 5) * 70 + "ms");
      observer.observe(el);
    });

    // rootMargin sayfanın alt %10'unu gözlem alanının dışında bırakıyor;
    // sayfa sonuna gelindiğinde daha fazla kaydırma olmayacağı için
    // kalan öğeleri burada açıyoruz (aksi halde son kart hiç görünmez).
    var atBottom = function () {
      if (window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 32) {
        showAll();
      }
    };
    window.addEventListener("scroll", atBottom, { passive: true });
    window.addEventListener("resize", atBottom);
    // Font/görsel geç yüklenince sayfa uzayabilir; o anda "en alt" konumu
    // değiştiği için yeniden değerlendiriyoruz.
    window.addEventListener("load", atBottom);
    if ("ResizeObserver" in window) {
      new ResizeObserver(atBottom).observe(document.body);
    }
    atBottom();
  }

  /* ---------- 4) Opsiyonel görseller ----------
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
