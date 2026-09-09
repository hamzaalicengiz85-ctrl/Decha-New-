/* =========================================================================
   DECHA — Adım 1: Header etkileşimleri + opsiyonel görsel yükleme
   ========================================================================= */
(function () {
  "use strict";

  /* =======================================================================
     AYAR: Formun nereye gönderileceği.
     - Boş bırakılırsa form, ziyaretçinin e-posta uygulamasını hazır bir
       mesajla açar (ek kurulum gerekmez).
     - Formspree / Basin / Netlify Forms gibi bir servisin POST adresini
       yazarsanız form arka planda oraya gönderilir.
     ======================================================================= */
  var CONTACT_ENDPOINT = "";
  var CONTACT_EMAIL = "merhaba@decha.com";

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

  /* ---------- 4) İletişim formu ----------
     ui-ux-pro-max ux-guidelines: "Focusable Error Summary", "Error Messages",
     "Submit Feedback", "Form Labels" (hepsi severity: High) */
  var form = document.getElementById("contactForm");

  if (form) {
    var summary = document.getElementById("formSummary");
    var summaryList = document.getElementById("formSummaryList");
    var statusEl = document.getElementById("formStatus");
    var submitBtn = document.getElementById("formSubmit");
    var submitLabel = submitBtn.querySelector(".form__submit-label");

    var RULES = [
      {
        id: "name",
        test: function (v) { return v.trim().length >= 2; },
        message: "Adınızı yazın (en az 2 karakter)."
      },
      {
        id: "email",
        test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
        message: "Geçerli bir e-posta adresi yazın."
      },
      {
        id: "service",
        test: function (v) { return v !== ""; },
        message: "İlgilendiğiniz hizmeti seçin."
      }
    ];

    function setFieldError(id, message) {
      var input = document.getElementById(id);
      var errorBox = document.getElementById(id + "-error");
      var errorText = errorBox.querySelector(".field__error-text");
      if (message) {
        input.setAttribute("aria-invalid", "true");
        errorText.textContent = message;
        errorBox.hidden = false;
      } else {
        input.removeAttribute("aria-invalid");
        errorText.textContent = "";
        errorBox.hidden = true;
      }
    }

    function setStatus(text, kind) {
      statusEl.textContent = text;
      statusEl.className = "form__status" + (kind ? " form__status--" + kind : "");
    }

    // Kullanıcı düzeltmeye başlayınca o alanın hatası kalksın
    RULES.forEach(function (rule) {
      var input = document.getElementById(rule.id);
      var clear = function () {
        if (input.getAttribute("aria-invalid") === "true" && rule.test(input.value)) {
          setFieldError(rule.id, "");
        }
      };
      input.addEventListener("input", clear);
      input.addEventListener("change", clear);
    });

    function validate() {
      var failures = [];
      RULES.forEach(function (rule) {
        var input = document.getElementById(rule.id);
        var ok = rule.test(input.value);
        setFieldError(rule.id, ok ? "" : rule.message);
        if (!ok) failures.push(rule);
      });
      return failures;
    }

    function showSummary(failures) {
      summaryList.innerHTML = "";
      failures.forEach(function (rule) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + rule.id;
        link.textContent = rule.message;
        link.addEventListener("click", function (event) {
          event.preventDefault();
          document.getElementById(rule.id).focus();
        });
        li.appendChild(link);
        summaryList.appendChild(li);
      });
      summary.hidden = false;
      summary.focus();
    }

    function setBusy(busy) {
      submitBtn.disabled = busy;
      submitLabel.textContent = busy ? "Gönderiliyor…" : "Gönder";
    }

    function payload() {
      return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        service: document.getElementById("service").value
      };
    }

    function sendByMail(data) {
      var subject = "DECHA - Yeni proje talebi (" + data.service + ")";
      var body =
        "Ad: " + data.name + "\n" +
        "E-posta: " + data.email + "\n" +
        "İlgilenilen hizmet: " + data.service + "\n\n" +
        "Projenizden kısaca bahsedin:\n";
      setStatus(
        "E-posta uygulamanız hazır bir mesajla açılıyor. Açılmazsa doğrudan " +
        CONTACT_EMAIL + " adresine yazabilirsiniz.",
        "ok"
      );
      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      setBusy(false);
    }

    function sendToEndpoint(data) {
      fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          form.reset();
          setStatus("Teşekkürler! Mesajınız bize ulaştı, 48 saat içinde dönüş yapacağız.", "ok");
        })
        .catch(function () {
          setStatus(
            "Mesaj gönderilemedi. Lütfen tekrar deneyin veya " + CONTACT_EMAIL +
            " adresine yazın.",
            "error"
          );
        })
        .then(function () { setBusy(false); });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var failures = validate();
      if (failures.length) {
        setStatus("", "");
        showSummary(failures);
        return;
      }

      summary.hidden = true;
      setBusy(true);
      setStatus("Gönderiliyor…", "");

      var data = payload();
      if (CONTACT_ENDPOINT) {
        sendToEndpoint(data);
      } else {
        sendByMail(data);
      }
    });
  }

  /* ---------- 5) Yukarı çık butonu ----------
     Hash değiştirmiyoruz; tarayıcı geçmişi bozulmasın
     (ux-guidelines.csv "Back Button", severity: High). */
  var toTop = document.getElementById("toTop");

  if (toTop) {
    var showAfter = function () {
      return Math.max(320, window.innerHeight * 0.8);
    };
    var toTopTicking = false;

    var syncToTop = function () {
      toTop.classList.toggle("is-visible", window.scrollY > showAfter());
      toTopTicking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!toTopTicking) {
          window.requestAnimationFrame(syncToTop);
          toTopTicking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", syncToTop);
    syncToTop();

    toTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });
      // Klavye kullanıcısı sayfanın başından devam edebilsin;
      // preventScroll ile yumuşak kaydırma bölünmüyor.
      var logo = document.querySelector(".header .logo");
      if (logo) logo.focus({ preventScroll: true });
    });
  }

  /* ---------- 5) Footer yılı ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- 6) Opsiyonel görseller ----------
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
