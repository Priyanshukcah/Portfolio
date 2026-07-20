// === THEME (must run first) ===
(function initThemeEarly() {
  const STORAGE_KEY = "aanya-theme";
  try {
    let theme = localStorage.getItem(STORAGE_KEY);
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("aanya-theme", theme);
  } catch (error) {
    /* ignore storage errors */
  }
  updateThemeToggleUI();
}

function updateThemeToggleUI() {
  const toggle = document.querySelector(".theme-toggle");
  const icon = document.querySelector(".theme-toggle-icon");
  if (!toggle || !icon) return;

  const isDark = getTheme() === "dark";
  toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  icon.textContent = isDark ? "☀️" : "🌙";
}

document.addEventListener("DOMContentLoaded", () => {
  updateThemeToggleUI();

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }
});

// === SCROLL PROGRESS BAR ===
(function initScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateProgress();
})();

// === REVEAL ON SCROLL ===
(function initRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
})();

// === NAV SHRINK ON SCROLL ===
(function initNavShrink() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  function updateNavScrollState() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  updateNavScrollState();
  window.addEventListener("scroll", updateNavScrollState, { passive: true });
})();

// === ABOUT STATS COUNTERS ===
(function initStatsCounters() {
  const strip = document.querySelector(".stats-strip");
  if (!strip) return;

  const numbers = strip.querySelectorAll(".stat-number");
  if (!numbers.length) return;

  function animateCounter(element) {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          numbers.forEach((number) => animateCounter(number));
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(strip);
})();

// === PAGE-LOAD SPLASH ===
(function initPageSplash() {
  const splash = document.createElement("div");
  splash.className = "page-splash";
  splash.innerHTML = '<p class="page-splash-brand">Priyanshu Baghel</p>';
  document.body.appendChild(splash);

  window.requestAnimationFrame(() => {
    splash.classList.add("is-active");
  });

  window.setTimeout(() => {
    splash.classList.add("is-done");
    window.setTimeout(() => splash.remove(), 320);
  }, 900);
})();

console.log("Portfolio loaded ✅");

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = {
      fullName: contactForm.fullName.value.trim(),
      email: contactForm.email.value.trim(),
      subject: contactForm.subject.value,
      message: contactForm.message.value.trim(),
    };

    console.log(formData);

    contactForm.hidden = true;
    document.getElementById("contact-success").hidden = false;
  });
}

const navbar = document.querySelector(".navbar");
const navbarToggle = document.querySelector(".navbar-toggle");
const navbarIcon = document.querySelector(".navbar-toggle-icon");
const navbarLinks = document.querySelectorAll(".navbar-links a");

if (navbar && navbarToggle && navbarIcon) {
  navbarToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("is-open");
    navbarToggle.setAttribute("aria-expanded", String(isOpen));
    navbarIcon.textContent = isOpen ? "✕" : "☰";
  });

  navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("is-open");
      navbarToggle.setAttribute("aria-expanded", "false");
      navbarIcon.textContent = "☰";
    });
  });
}
