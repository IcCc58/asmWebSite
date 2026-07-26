/* ==========================================================================
   Yenişehir Aile Sağlığı Merkezi — Etkileşimler
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Mobil menü ---------- */
  var nav = document.querySelector(".main-nav");
  var toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("main-nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Menüdeki bir bağlantıya tıklanınca mobil menüyü kapat
    nav.querySelectorAll(".main-nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("main-nav--open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // ESC ile kapat
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("main-nav--open")) {
        nav.classList.remove("main-nav--open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll'da görünme animasyonu (reveal) ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Yukarı çık butonu ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 480) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Duyuru akordiyonu ---------- */
  document.querySelectorAll(".ann-item__head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.closest(".ann-item");
      var body = item.querySelector(".ann-item__body");
      var isOpen = item.classList.contains("ann-item--open");

      // Diğer açık duyuruları kapat
      document.querySelectorAll(".ann-item--open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("ann-item--open");
          other.querySelector(".ann-item__body").style.maxHeight = null;
          other.querySelector(".ann-item__head").setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.classList.remove("ann-item--open");
        body.style.maxHeight = null;
        head.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("ann-item--open");
        body.style.maxHeight = body.scrollHeight + "px";
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Sayaç animasyonu (istatistikler) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1400;
          var start = null;

          var step = function (ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString("tr-TR") + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- URL'de duyuru id'si varsa otomatik aç ---------- */
  if (location.hash) {
    var target = document.querySelector(location.hash + ".ann-item");
    if (target) {
      var head = target.querySelector(".ann-item__head");
      var body = target.querySelector(".ann-item__body");
      target.classList.add("ann-item--open");
      body.style.maxHeight = body.scrollHeight + "px";
      head.setAttribute("aria-expanded", "true");
      setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }
  }

  /* ---------- Footer yıl bilgisi ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
