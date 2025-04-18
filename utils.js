/**
 * Spirit&Bone - Utility Functions
 */

/**
 * Debounce function to limit how often a function can run
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @param {boolean} immediate - Whether to run immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 20, immediate = false) {
  let timeout;

  return function () {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds between allowed executions
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
  let lastRan = 0;
  let timeout;

  return function () {
    const context = this;
    const args = arguments;
    const now = Date.now();

    if (now - lastRan >= limit) {
      // If enough time has passed, run the function immediately
      func.apply(context, args);
      lastRan = now;
    } else {
      // Otherwise, schedule to run once enough time has passed
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        lastRan = Date.now();
        func.apply(context, args);
      }, limit - (now - lastRan));
    }
  };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @param {number} offset - Optional offset to consider element in view before it actually is
 * @returns {boolean} Whether element is in viewport
 */
function isElementInViewport(el, offset = 0) {
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top - offset <= windowHeight &&
    rect.left - offset <= windowWidth &&
    rect.bottom + offset >= 0 &&
    rect.right + offset >= 0
  );
}

// Export only the functions that are actually used
export { debounce, throttle, isElementInViewport };
