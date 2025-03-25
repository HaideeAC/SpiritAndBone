/**
 * Spirit&Bone - Navigation Module
 * Handles navigation menu, links, and section transitions
 */

// Import from main.js, not main.js
// Fix the import statement - main.js should export updateActiveIndicator
import { updateActiveIndicator } from "/main.js";

// Initialize navigation functionality
function initNavigation(pageTransition) {
  // Get DOM references
  const menuCircle = document.getElementById("menu-circle");
  const navLinks = document.getElementById("nav-links");
  const closeMenu = document.getElementById("close-menu");
  const sections = document.querySelectorAll(".section");
  const indicatorDots = document.querySelectorAll(".indicator-dot");

  // If key elements don't exist, exit early
  if (!menuCircle || !navLinks) {
    return;
  }

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

  // Navigation click handling with transitions
  document.querySelectorAll(".nav-links li a").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      navLinks.classList.remove("active");

      if (pageTransition && pageTransition.parentNode) {
        // Orkenworld-style transition
        link.classList.add("nav-selected");
        pageTransition.classList.add("active");

        setTimeout(() => {
          document.querySelectorAll(".section").forEach((section) => {
            section.classList.remove("transition-in");
          });

          targetSection.classList.add("transition-in");
          updateActiveIndicator(targetId);
          targetSection.scrollIntoView({ behavior: "auto" });
          history.pushState(null, null, `#${targetId}`);
          pageTransition.classList.add("fade-out");

          setTimeout(() => {
            pageTransition.classList.remove("active", "fade-out");
            link.classList.remove("nav-selected");
          }, 700);
        }, 700);
      } else {
        targetSection.scrollIntoView({ behavior: "smooth" });
        updateActiveIndicator(targetId);
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });

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
  indicatorDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const sectionId = dot.getAttribute("data-section");
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
        updateActiveIndicator(sectionId);
      }
    });
  });
}

// Export the initialization function
export { initNavigation };
