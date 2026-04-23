/* ============================================================
   main.js — interactions de base
   - Header scroll state
   - Mobile nav toggle
   - Reveal on scroll (IntersectionObserver)
   - Cursor reticle (desktop pointer only)
   - Status bar dynamic date
   - Form tabs (contact page)
   ============================================================ */

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- HEADER SCROLL STATE ----------
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => {
      header.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- MOBILE NAV ----------
  const toggle = document.querySelector(".nav-toggle");
  const mobile = document.querySelector(".nav-mobile");
  if (toggle && mobile) {
    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      mobile.dataset.open = "false";
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) return close();
      toggle.setAttribute("aria-expanded", "true");
      mobile.dataset.open = "true";
      document.body.style.overflow = "hidden";
    });
    mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // ---------- REVEAL ON SCROLL ----------
  if (!reducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = "true";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => (el.dataset.visible = "true"));
  }

  // ---------- CURSOR RETICLE ----------
  const canUseCursor =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion;

  if (canUseCursor) {
    const reticle = document.createElement("div");
    reticle.className = "cursor-reticle";
    reticle.setAttribute("aria-hidden", "true");
    document.body.appendChild(reticle);
    document.body.dataset.cursor = "on";

    let rx = window.innerWidth / 2,
      ry = window.innerHeight / 2;
    let tx = rx,
      ty = ry;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    const tick = () => {
      rx += (tx - rx) * 0.35;
      ry += (ty - ry) * 0.35;
      reticle.style.transform = `translate(${rx - 9}px, ${ry - 9}px)`;
      requestAnimationFrame(tick);
    };
    tick();

    const interactive = "a, button, [role='button'], input, textarea, select, label, summary";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactive)) reticle.dataset.hover = "true";
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactive)) reticle.dataset.hover = "false";
    });
  }

  // ---------- STATUS BAR ----------
  const statusNext = document.querySelector("[data-status-next]");
  if (statusNext) {
    // Prochaine ouverture affichée : 10 jours en avant, premier lundi
    const now = new Date();
    const target = new Date(now);
    target.setDate(now.getDate() + 10);
    while (target.getDay() !== 1) target.setDate(target.getDate() + 1);
    const months = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEP", "OCT", "NOV", "DÉC"];
    statusNext.textContent = `${target.getDate()} ${months[target.getMonth()]}`;
  }

  // ---------- YEAR ----------
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ---------- FORM TABS ----------
  const tabsContainer = document.querySelector(".form-tabs");
  if (tabsContainer) {
    const tabs = tabsContainer.querySelectorAll("[role='tab']");
    const panels = document.querySelectorAll("[role='tabpanel']");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.setAttribute("aria-selected", "false");
          t.setAttribute("tabindex", "-1");
        });
        panels.forEach((p) => (p.hidden = true));
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("tabindex", "0");
        const target = document.getElementById(tab.getAttribute("aria-controls"));
        if (target) target.hidden = false;
      });
    });
  }

  // ---------- CURRENT PAGE NAV HIGHLIGHT ----------
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .nav-mobile a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const file = href.split("/").pop();
    if (file === path || (path === "" && file === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });
})();
