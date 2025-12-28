'use strict';

/* ==========================================================================
   CONFIGURATION
   ========================================================================== */
const HEADER_SELECTOR = '.cover__header-content-action-link-text';
const HEADER_TEXT = 'Explore My Projects';

const PREVIOUS_BTN_SELECTOR = '.lesson-nav__link-text';
const PREVIOUS_BTN_TEXT = 'Previous';

/* ==========================================================================
   MAIN LOGIC
   ========================================================================== */
function updateTextLabels() {
    // 1. Update Cover Button
    const headerEl = document.querySelector(HEADER_SELECTOR);
    if (headerEl && headerEl.textContent !== HEADER_TEXT) {
        headerEl.textContent = HEADER_TEXT;
    }

    // 2. Update Previous Button (Always "Previous")
    const prevEl = document.querySelector(PREVIOUS_BTN_SELECTOR);
    if (prevEl && prevEl.textContent !== PREVIOUS_BTN_TEXT) {
        prevEl.textContent = PREVIOUS_BTN_TEXT;
    }
}

// Create a permanent observer to watch for navigation changes
const observer = new MutationObserver(() => {
    updateTextLabels();
});

// Start watching the body
observer.observe(document.body, { childList: true, subtree: true });

// Run immediately on load
updateTextLabels();