/**
 * script.js
 * Handles Preloader, Interactive Cursor, and Core UI Initialization.
 */

const cursor = document.getElementById("custom-cursor");
const cursorGlow = document.getElementById("cursor-glow");

/**
 * Initializes the mechanical preloader and custom cursor
 */
window.addEventListener("load", () => {
    // 1. Trigger Precision Aperture Opening (allowing boot-up animation)
    setTimeout(() => {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            preloader.classList.add("opened");
            // Allow clicking through once opened
            setTimeout(() => {
                preloader.style.pointerEvents = "none";
            }, 800);
        }
    }, 1000);

    // 2. Reset Scroll Position
    window.scrollTo(0, 0);

    // 3. Init Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 4. Initialize Magnetic Cursor
    initInteractiveCursor();
});

/**
 * High-performance magnetic cursor logic
 */
function initInteractiveCursor() {
    if (!cursor || !cursorGlow) return;

    window.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        
        // Immediate position for center dot
        cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        
        // Lagged position for outer glow (magnetic feel)
        cursorGlow.animate({
            transform: `translate3d(${clientX - 22}px, ${clientY - 22}px, 0)`
        }, {
            duration: 500,
            fill: "forwards"
        });
    });

    // Cursor interactions for buttons
    document.querySelectorAll("button, a, .shutter-icon").forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursor.style.transform += " scale(2.5)";
            cursorGlow.style.background = "rgba(87, 242, 135, 0.4)";
        });
        el.addEventListener("mouseleave", () => {
            cursor.style.transform = cursor.style.transform.replace(" scale(2.5)", "");
            cursorGlow.style.background = "rgba(131, 215, 255, 0.32)";
        });
    });
}
