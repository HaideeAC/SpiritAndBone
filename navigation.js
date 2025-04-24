/**
 * Spirit&Bone - Navigation Module
 * Simplified page transition approach with clearly separated up/down directions
 */

import { updateActiveIndicator } from "/main.js";

// Initialize navigation functionality
function initNavigation() {
  // Get DOM references
  const menuCircle = document.getElementById("menu-circle");
  const navLinks = document.getElementById("nav-links");
  const closeMenu = document.getElementById("close-menu");

  // Create both transition elements once during initialization
  createTransitionElements();

  // Exit early if key elements don't exist
  if (!menuCircle || !navLinks) return;

  // Menu toggle functionality
  menuCircle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const circle = menuCircle.querySelector(".circle");
    if (circle) {
      circle.classList.add("pulse");
      setTimeout(() => circle.classList.remove("pulse"), 700);
    }
  });

  // Close menu with X button
  closeMenu?.addEventListener("click", () =>
    navLinks.classList.remove("active")
  );

  // Set up navigation link transitions
  setupNavListeners(navLinks);

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(event.target) &&
      !menuCircle.contains(event.target)
    ) {
      navLinks.classList.remove("active");
    }
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
    }
  });

  // Section indicator dots
  document.querySelectorAll(".indicator-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const sectionId = dot.getAttribute("data-section");
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        executeTransition(sectionElement, sectionId);
      }
    });
  });
}

/**
 * Creates both transition overlay elements (up and down)
 */
function createTransitionElements() {
  // Remove any existing transition elements
  const existingTransitions = document.querySelectorAll(
    ".page-transition-up, .page-transition-down"
  );
  existingTransitions.forEach((el) => el.remove());

  // Create up transition element
  const upTransition = document.createElement("div");
  upTransition.className = "page-transition page-transition-up";
  document.body.appendChild(upTransition);

  // Create down transition element
  const downTransition = document.createElement("div");
  downTransition.className = "page-transition page-transition-down";
  document.body.appendChild(downTransition);
}

/**
 * Set up listeners for nav links
 * @param {HTMLElement} navLinks - Navigation links container
 */
function setupNavListeners(navLinks) {
  document.querySelectorAll(".nav-links li a").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      // Close the menu and execute transition
      navLinks.classList.remove("active");
      executeTransition(targetSection, targetId, this);
    });
  });
}

/**
 * Get the ordered section list and current active section
 * @returns {Object} Object containing sections array and current section index
 */
function getSectionContext() {
  const sections = ["home", "project", "team", "contact"];
  const activeDot = document.querySelector(".indicator-dot.active");
  const currentId = activeDot ? activeDot.getAttribute("data-section") : "";

  return {
    sections,
    currentIndex: sections.indexOf(currentId),
  };
}

/**
 * Execute the transition in the correct direction
 * @param {HTMLElement} targetSection - Section to transition to
 * @param {string} targetId - ID of target section
 * @param {HTMLElement} [clickedLink] - Clicked navigation link (optional)
 */
function executeTransition(targetSection, targetId, clickedLink = null) {
  if (!targetSection) return;

  // Get section context
  const { sections, currentIndex } = getSectionContext();
  const targetIndex = sections.indexOf(targetId);

  // Determine direction - default to down if we can't determine
  const isGoingUp = currentIndex !== -1 && targetIndex < currentIndex;

  // Get the appropriate transition element
  const transitionElement = document.querySelector(
    isGoingUp ? ".page-transition-up" : ".page-transition-down"
  );

  if (!transitionElement) return;

  // Start transition sequence
  document.body.classList.add("is-transitioning");
  if (clickedLink) clickedLink.classList.add("nav-selected");

  // Phase 1: Enter from top or bottom
  transitionElement.classList.add("enter");

  // Phase 2: After transition covers screen, update content
  setTimeout(() => {
    // Update active section
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("transition-in");
    });

    targetSection.classList.add("transition-in");

    // Update active indicator and URL
    updateActiveIndicator(targetId);
    targetSection.scrollIntoView({ behavior: "auto" });
    history.pushState(null, null, `#${targetId}`);

    // Phase 3: Exit in opposite direction
    transitionElement.classList.remove("enter");
    transitionElement.classList.add("exit");

    // Phase 4: Cleanup after exit animation completes
    setTimeout(() => {
      transitionElement.classList.remove("exit");
      document.body.classList.remove("is-transitioning");
      if (clickedLink) clickedLink.classList.remove("nav-selected");
    }, 700);
  }, 700);
}

// Export the initialization function
export { initNavigation };
