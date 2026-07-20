/* ==========================================================
   CV.BLACKARS.COM — Script
   ========================================================== */

(function () {
  "use strict";

  const root = document.documentElement;

  /* ==========================================================
     Language toggle (ES / EN)
     Must run BEFORE theme toggle so currentLang is available.
     ========================================================== */

  const langToggle = document.getElementById("langToggle");
  const savedLang = localStorage.getItem("blackars-cv-lang");
  const browserLang = (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
  let currentLang = savedLang || browserLang;

  function updateThemeButtonLabel() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;
    const theme = root.getAttribute("data-theme");
    themeToggle.textContent = currentLang === "es"
      ? (theme === "dark" ? "Modo claro" : "Modo oscuro")
      : (theme === "dark" ? "Light mode" : "Dark mode");
  }

  function applyLang(lang) {
    currentLang = lang;
    root.setAttribute("lang", lang === "es" ? "es" : "en");
    localStorage.setItem("blackars-cv-lang", lang);

    document.querySelectorAll("[data-es][data-en]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });

    langToggle.textContent = lang === "es" ? "EN" : "ES";
    updateThemeButtonLabel();
  }

  applyLang(currentLang);

  langToggle.addEventListener("click", function () {
    applyLang(currentLang === "es" ? "en" : "es");
  });

  /* ==========================================================
     Theme toggle
     ========================================================== */

  var themeToggle = document.getElementById("themeToggle");
  var savedTheme = localStorage.getItem("blackars-cv-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("blackars-cv-theme", theme);
    updateThemeButtonLabel();
  }

  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  /* ==========================================================
     Tabs
     ========================================================== */

  var tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
  var panels = Array.from(document.querySelectorAll("[data-panel]"));

  function activateTab(tabName, updateHash) {
    tabButtons.forEach(function (button) {
      var isActive = button.dataset.tab === tabName;
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach(function (panel) {
      panel.classList.toggle("is-active", panel.dataset.panel === tabName);
    });

    if (updateHash !== false) {
      history.replaceState(null, "", "#" + tabName);
    }
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activateTab(button.dataset.tab);
    });
  });

  var initialHash = window.location.hash.replace("#", "");
  if (["projects", "experience", "certificates"].indexOf(initialHash) !== -1) {
    activateTab(initialHash, false);
  }

  /* ==========================================================
     Lazy video loading
     ========================================================== */

  var videos = Array.from(document.querySelectorAll("video"));

  function loadVideo(video) {
    var source = video.querySelector("source[data-src]");
    var placeholder = video.parentElement.querySelector(".media-placeholder");

    if (!source || source.src) return;

    source.src = source.getAttribute("data-src");
    video.load();

    video.addEventListener("canplay", function () {
      if (placeholder) placeholder.remove();
      video.play().catch(function () {});
    }, { once: true });
  }

  if ("IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          videoObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "200px 0px" });

    videos.forEach(function (video) { videoObserver.observe(video); });
  } else {
    videos.forEach(loadVideo);
  }

  /* ==========================================================
     Footer year
     ========================================================== */

  document.getElementById("year").textContent = new Date().getFullYear();
})();
