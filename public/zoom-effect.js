/**
 * zoom-effect.js
 * Handles the cinematic 3D scroll-zoom transition into the dashboard.
 * Manages body overflow: unlocks scrolling for the hero, re-locks for dashboard.
 */

const heroWrapper = document.getElementById("hero-wrapper");
const dashboard = document.getElementById("dashboard");
let dashboardEntered = false;
let targetHeroProgress = 0;
let currentHeroProgress = 0;
let heroAnimationFrame = null;

/**
 * Initializes the scroll-based zoom logic
 */
function initZoomEffect() {
    // Unlock scrolling so the hero section can be scrolled through
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.overflow = "visible";
    document.body.style.height = "auto";

    window.addEventListener("scroll", handleHeroScroll, { passive: true });
    requestAnimationFrame(updateHeroParallax);
}

/**
 * Maps vertical scroll to a normalized 0-1 progress value
 */
function handleHeroScroll() {
    if (dashboardEntered) return;

    const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    const wrapperHeight = heroWrapper.scrollHeight || heroWrapper.offsetHeight || 0;
    const windowHeight = window.innerHeight || 1;
    const maxScroll = wrapperHeight - windowHeight;

    if (maxScroll <= 0) return;

    // Normalize progress (0 to 1)
    targetHeroProgress = Math.max(0, Math.min(1, scrollY / maxScroll));

    // Lock and Transition at 99% scroll
    if (targetHeroProgress >= 0.99 && !dashboardEntered) {
        enterDashboard();
    }
}

/**
 * Smoothly interpolates the zoom for a "heavy camera" feel
 */
function updateHeroParallax() {
    if (!dashboardEntered) {
        // Smoothing (Lerp)
        currentHeroProgress += (targetHeroProgress - currentHeroProgress) * 0.1;
        document.documentElement.style.setProperty("--hero-progress", currentHeroProgress.toFixed(4));

        heroAnimationFrame = requestAnimationFrame(updateHeroParallax);
    }
}

/**
 * Transitions from the 3D office into the live analytics dashboard
 */
function enterDashboard() {
    dashboardEntered = true;
    cancelAnimationFrame(heroAnimationFrame);

    // Visual Handoff
    heroWrapper.classList.add("hero-exit");

    setTimeout(() => {
        heroWrapper.style.display = "none";
        dashboard.classList.remove("hidden");

        // Re-lock body scrolling for the fixed dashboard layout
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.height = "100%";
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";

        // Hide custom cursor to allow dashboard interaction
        const cursor = document.getElementById("custom-cursor");
        const cursorGlow = document.getElementById("cursor-glow");
        if (cursor) cursor.style.display = "none";
        if (cursorGlow) cursorGlow.style.display = "none";

        // trigger resize so canvas elements get right dimensions
        window.dispatchEvent(new Event('resize'));
        window.scrollTo(0, 0);
    }, 600);
}

/**
 * Helper to jump the scroll (used by the CTA button)
 */
function scrollHeroDown() {
    const scrollTarget = heroWrapper.offsetHeight * 0.5;
    window.scrollTo({
        top: scrollTarget,
        behavior: "smooth"
    });
}

// Global exposure for the HTML button
window.scrollHeroDown = scrollHeroDown;

// Start the effect
initZoomEffect();
