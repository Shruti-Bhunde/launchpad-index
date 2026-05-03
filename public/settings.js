/**
 * settings.js
 * Fully self-contained Settings page functionality.
 * Injects its own theme CSS and wires up all toggles, dark/light mode,
 * and accent color picker — without modifying the original HTML structure.
 */

(function () {
  "use strict";

  // ============================================================
  // 1. INJECT THEME CSS
  //    We inject a <style> block so index (6).html stays untouched.
  // ============================================================
  const themeCSS = document.createElement("style");
  themeCSS.id = "settings-theme-css";
  themeCSS.textContent = `
    /* ===== Smooth theme transitions ===== */
    body,
    .app-wrapper,
    .sidebar,
    .topbar,
    .card,
    .chart-tooltip,
    .market-table thead th,
    .search-input,
    .trade-input,
    .nav-item::after {
      transition: background-color 0.4s ease,
                  color 0.4s ease,
                  border-color 0.4s ease,
                  box-shadow 0.4s ease;
    }

    /* ===== LIGHT THEME variable overrides ===== */
    body.light-theme {
      --black: #ffffff;
      --white: #111111;
      --gray-100: #141414;
      --gray-200: #212121;
      --gray-300: #424242;
      --gray-400: #757575;
      --gray-500: #9e9e9e;
      --gray-600: #bdbdbd;
      --gray-700: #e0e0e0;
      --gray-800: #f5f5f5;
      --gray-900: #ffffff;
      --accent: #000000;
      --glow: rgba(0,0,0,0.08);

      --bg-hero: #f5f6f8;
      --bg-primary: #ffffff;
      --bg-secondary: #f0f5fd;
      --bg-surface: #e4ebf6;
      --bg-surface-2: #d4dce6;
      --text-primary: #0a0d12;
      --text-secondary: #4a5768;
    }

    /* ===== LIGHT THEME element overrides ===== */
    body.light-theme .topbar          { background: rgba(255,255,255,0.92); border-bottom-color: rgba(0,0,0,0.1); }
    body.light-theme .sidebar         { background: rgba(255,255,255,0.85); border-right-color: rgba(0,0,0,0.08); }
    body.light-theme .nav-item::after { background: rgba(245,245,245,0.96); color: var(--white); border-color: rgba(0,0,0,0.1); }
    body.light-theme .chart-tooltip   { background: rgba(250,250,250,0.97); border-color: rgba(0,0,0,0.1); color: var(--white); }
    body.light-theme .market-table thead th { background: rgba(255,255,255,0.9); }
    body.light-theme .card            { background: rgba(0,0,0,0.02); border-color: rgba(0,0,0,0.1); }
    body.light-theme .card:hover      { box-shadow: 0 8px 32px rgba(0,230,118,0.15), 0 2px 8px rgba(0,0,0,0.1); }
    body.light-theme .search-input,
    body.light-theme .trade-input     { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1); color: var(--white); }
    body.light-theme .time-btn,
    body.light-theme .ctype-btn,
    body.light-theme .filter-btn      { border-color: rgba(0,0,0,0.15); color: var(--gray-500); }
    body.light-theme .time-btn:hover,
    body.light-theme .ctype-btn:hover,
    body.light-theme .filter-btn:hover { color: var(--white); border-color: rgba(0,0,0,0.3); }
    body.light-theme .pnl-row:hover,
    body.light-theme .tx-row:hover,
    body.light-theme .market-table tbody tr:hover,
    body.light-theme .watchlist-item:hover { background: rgba(0,0,0,0.04); }
    body.light-theme .stat-bar        { background: rgba(0,0,0,0.08); }
    body.light-theme .trade-tabs      { background: rgba(0,0,0,0.04); }
    body.light-theme .toggle.off      { background: rgba(0,0,0,0.12); }
    body.light-theme .toggle-knob     { background: var(--gray-800); }
    body.light-theme .btn-icon        { border-color: rgba(0,0,0,0.15); color: var(--white); }
    body.light-theme .btn-icon:hover  { background: rgba(0,230,118,0.08); border-color: rgba(0,230,118,0.3); }

    /* ===== Accent color picker row styling ===== */
    .settings-color-picker {
      display: flex;
      gap: 8px;
    }
    .settings-color-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .settings-color-btn:hover {
      transform: scale(1.2);
    }
    .settings-color-btn.active {
      border-color: var(--white);
      box-shadow: 0 0 10px currentColor;
    }
  `;
  document.head.appendChild(themeCSS);

  // ============================================================
  // 2. WAIT FOR DOM, THEN WIRE UP EVERYTHING
  // ============================================================
  document.addEventListener("DOMContentLoaded", initSettings);

  function initSettings() {
    const settingsPage = document.getElementById("page-settings");
    if (!settingsPage) return;

    // --- Wire up ALL toggle switches ---
    settingsPage.querySelectorAll(".toggle").forEach((toggle) => {
      toggle.style.cursor = "pointer";
      toggle.addEventListener("click", function () {
        const label = this.closest(".toggle-row")
          ?.querySelector(".toggle-label")
          ?.textContent.trim();

        if (label === "Dark Mode") {
          handleThemeToggle(this);
        } else {
          flipToggle(this);
        }
      });
    });

    // --- Inject Accent Color row into the DISPLAY card ---
    injectAccentColorRow(settingsPage);
  }

  // ============================================================
  // 3. TOGGLE HELPERS
  // ============================================================
  function flipToggle(el) {
    if (el.classList.contains("on")) {
      el.classList.remove("on");
      el.classList.add("off");
    } else {
      el.classList.remove("off");
      el.classList.add("on");
    }
  }

  // ============================================================
  // 4. DARK / LIGHT THEME
  // ============================================================
  function handleThemeToggle(toggleEl) {
    const body = document.body;

    if (body.classList.contains("light-theme")) {
      // Switch to dark
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      toggleEl.classList.remove("off");
      toggleEl.classList.add("on");
    } else {
      // Switch to light
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      toggleEl.classList.remove("on");
      toggleEl.classList.add("off");
    }
  }

  // ============================================================
  // 5. ACCENT COLOR PICKER
  // ============================================================
  const ACCENT_COLORS = [
    { hex: "#00e676", name: "Emerald" },
    { hex: "#57f287", name: "Mint" },
    { hex: "#83d7ff", name: "Cyan" },
    { hex: "#ff875f", name: "Coral" },
    { hex: "#e040fb", name: "Purple" },
  ];

  function injectAccentColorRow(settingsPage) {
    // Find the DISPLAY card (the one that has "Dark Mode" toggle)
    const displayCard = findCardByHeading(settingsPage, "DISPLAY");
    if (!displayCard) return;

    // Find the Dark Mode toggle-row to insert after it
    const darkModeRow = findToggleRowByLabel(displayCard, "Dark Mode");
    if (!darkModeRow) return;

    // Build accent color row
    const row = document.createElement("div");
    row.className = "toggle-row";

    const label = document.createElement("span");
    label.className = "toggle-label";
    label.textContent = "Accent Color";

    const picker = document.createElement("div");
    picker.className = "settings-color-picker";

    ACCENT_COLORS.forEach((c, i) => {
      const btn = document.createElement("div");
      btn.className = "settings-color-btn" + (i === 0 ? " active" : "");
      btn.style.background = c.hex;
      btn.title = c.name;
      btn.addEventListener("click", () => setAccentColor(c.hex, btn));
      picker.appendChild(btn);
    });

    row.appendChild(label);
    row.appendChild(picker);

    // Insert after the Dark Mode row
    darkModeRow.insertAdjacentElement("afterend", row);
  }

  function setAccentColor(hex, activeBtn) {
    const root = document.documentElement;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    root.style.setProperty("--bull", hex);
    root.style.setProperty("--accent-primary", hex);
    root.style.setProperty("--bull-dim", `rgba(${r},${g},${b},0.15)`);
    root.style.setProperty("--bull-glow", `rgba(${r},${g},${b},0.4)`);

    // Update active state on buttons
    document.querySelectorAll(".settings-color-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    if (activeBtn) activeBtn.classList.add("active");
  }

  // ============================================================
  // 6. DOM QUERY HELPERS
  // ============================================================
  function findCardByHeading(container, headingText) {
    const cards = container.querySelectorAll(".card");
    for (const card of cards) {
      // Check first child div for the heading text
      const headings = card.querySelectorAll("div");
      for (const h of headings) {
        if (h.textContent.trim() === headingText && h.children.length === 0) {
          return card;
        }
      }
    }
    return null;
  }

  function findToggleRowByLabel(container, labelText) {
    const rows = container.querySelectorAll(".toggle-row");
    for (const row of rows) {
      const lbl = row.querySelector(".toggle-label");
      if (lbl && lbl.textContent.trim() === labelText) return row;
    }
    return null;
  }
})();
