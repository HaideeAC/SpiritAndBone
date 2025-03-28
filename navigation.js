/**
 * Spirit&Bone - Navigation Module
 */

import { updateActiveIndicator } from "/main.js";

// Initialize navigation functionality
function initNavigation(pageTransition) {
  // Get DOM references
  const menuCircle = document.getElementById("menu-circle");
  const navLinks = document.getElementById("nav-links");
  const closeMenu = document.getElementById("close-menu");

  // Ensure pageTransition element exists
  if (!pageTransition || !pageTransition.parentNode) {
    // Create pageTransition if it doesn't exist
    pageTransition = document.querySelector(".page-transition");
    if (!pageTransition) {
      pageTransition = document.createElement("div");
      pageTransition.className = "page-transition";
      document.body.appendChild(pageTransition);
    }
  }

  // If key elements don't exist, exit early
  if (!menuCircle || !navLinks) return;

  // Menu functionality
  menuCircle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const circle = menuCircle.querySelector(".circle");
    if (circle) {
      circle.classList.add("pulse");
      setTimeout(() => circle.classList.remove("pulse"), 700);
    }
  });

  // Close menu with X button
  if (closeMenu) {
    closeMenu.addEventListener("click", () =>
      navLinks.classList.remove("active")
    );
  }

  // Set up page transition listeners
  setupTransitionListeners(pageTransition);

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
        performTransition(sectionElement, sectionId, pageTransition);
      }
    });
  });
}

/**
 * Set up transition listeners for navigation links
 * @param {HTMLElement} pageTransition - The page transition element
 */
function setupTransitionListeners(pageTransition) {
  document.querySelectorAll(".nav-links li a").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      // Close the navigation menu
      const navLinks = document.getElementById("nav-links");
      if (navLinks) navLinks.classList.remove("active");

      // Execute the transition
      performTransition(targetSection, targetId, pageTransition, this);
    });
  });
}

/**
 * Perform transition animation between sections
 * @param {HTMLElement} targetSection - The section to transition to
 * @param {string} targetId - The ID of the target section
 * @param {HTMLElement} pageTransition - The transition element
 * @param {HTMLElement} [clickedLink] - The clicked link (optional)
 */
function performTransition(
  targetSection,
  targetId,
  pageTransition,
  clickedLink = null
) {
  if (!targetSection || !pageTransition) return;

  // Add transition classes
  document.body.classList.add("is-transitioning");

  // If a link was clicked, add the selected class
  if (clickedLink) {
    clickedLink.classList.add("nav-selected");
  }

  // Add active class to the transition element
  pageTransition.classList.add("active");

  // After a delay, change the view
  setTimeout(() => {
    // Remove transition-in class from all sections
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("transition-in");
    });

    // Add transition-in to target
    targetSection.classList.add("transition-in");

    // Update active indicator
    updateActiveIndicator(targetId);

    // Scroll to the section
    targetSection.scrollIntoView({ behavior: "auto" });

    // Update browser history
    history.pushState(null, null, `#${targetId}`);

    // Start fade-out animation
    pageTransition.classList.add("fade-out");

    // Clean up after transition completes
    setTimeout(() => {
      pageTransition.classList.remove("active", "fade-out");
      document.body.classList.remove("is-transitioning");

      // Remove selected class from link if it exists
      if (clickedLink) {
        clickedLink.classList.remove("nav-selected");
      }
    }, 700);
  }, 700);
}

// Export the initialization function
export { initNavigation };
