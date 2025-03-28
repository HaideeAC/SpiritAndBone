/**
 * Spirit&Bone - Main JavaScript Entry Point
 * Optimized version with streamlined functionality
 */

// Import all modules
import { initVideoReveal } from "/video-reveal.js";
import { initNavigation } from "/navigation.js";
import { initScrollEffects } from "/scroll-effect.js";
import { initTeamSection } from "/team-members.js";
import { initContactForm } from "/contact-form.js";
import { initProjectParallax } from "/project.js";
import { debounce } from "/utils.js";

// Global state
const state = {
  isLoading: true,
  isTransitioning: false,
};

// Core functions
/**
 * Updates the active section indicator
 */
function updateActiveIndicator(sectionId) {
  document.querySelectorAll(".indicator-dot").forEach((dot) => {
    dot.classList.toggle(
      "active",
      dot.getAttribute("data-section") === sectionId
    );
  });
}

/**
 * Handles smooth scrolling to sections
 */
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
    updateActiveIndicator(sectionId);
    history.replaceState(
      null,
      null,
      sectionId !== "home" ? `#${sectionId}` : " "
    );
  }
}

/**
 * Checks which section is currently in viewport
 */
function checkCurrentSection() {
  if (state.isTransitioning) return;

  const sections = document.querySelectorAll(".section");
  const scrollPosition = window.scrollY + window.innerHeight / 3;

  let currentSection = null;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  if (currentSection) {
    updateActiveIndicator(currentSection);
    if (history.replaceState) {
      history.replaceState(
        null,
        null,
        currentSection !== "home" ? `#${currentSection}` : " "
      );
    }
  }
}

/**
 * Preloads critical assets
 */
function preloadAssets() {
  // Critical images to preload
  const criticalAssets = [
    // Core textures
    "/images/texture1.jpg",
    "/images/texture.jpg",
    // Project images (first few for quick display)
    "/images/project1.jpg",
    "/images/project2.jpg",
    // Team images (first few for quick display)
    "/images/ed.jpg",
    "/images/elbaby.jpg",
    // Audio
    { type: "audio", src: "/audio/pandeiro.mp3" },
  ];

  // Preload images
  criticalAssets.forEach((asset) => {
    if (typeof asset === "string") {
      const img = new Image();
      img.src = asset;
    } else if (asset.type === "audio") {
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = asset.src;
    }
  });
}

/**
 * Initializes and shows a simplified loader
 */
function initLoader() {
  // Create loader element
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-circle"></div>
      <div class="loader-text">SPIRIT & BONE</div>
    </div>
  `;
  document.body.appendChild(loader);

  // Start preloading assets
  preloadAssets();

  // Hide loader after content is loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("loaded");
      state.isLoading = false;
      setTimeout(() => loader.remove(), 800);
    }, 1000);
  });

  // Failsafe: remove loader after 5 seconds even if page isn't fully loaded
  setTimeout(() => {
    if (state.isLoading) {
      loader.classList.add("loaded");
      state.isLoading = false;
      setTimeout(() => loader.remove(), 800);
    }
  }, 5000);
}

/**
 * Creates page transition element
 */
function initPageTransition() {
  const pageTransition = document.createElement("div");
  pageTransition.className = "page-transition";
  document.body.appendChild(pageTransition);
  return pageTransition;
}

/**
 * Initial setup of event listeners
 */
function setupEventListeners(pageTransition) {
  // Handle section indicator clicks
  document.querySelectorAll(".indicator-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const sectionId = dot.getAttribute("data-section");
      scrollToSection(sectionId);
    });
  });

  // Scroll event for tracking current section
  window.addEventListener("scroll", debounce(checkCurrentSection, 100));
}

/**
 * Apply initial section visibility
 */
function initSectionVisibility() {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight) {
      section.classList.add("fade-in");

      // Section-specific initializations
      if (section.id === "project") {
        document.querySelector(".project-container")?.classList.add("visible");
      } else if (section.id === "contact") {
        document
          .querySelector(".contact-form-container")
          ?.classList.add("visible");
      }
    }
  });
}

/**
 * Handle initial URL hash for scrolling
 */
function handleInitialHash() {
  // Clear the URL hash if it's #home
  if (window.location.hash === "#home") {
    history.replaceState(null, null, window.location.pathname);
    return;
  }

  const hash = window.location.hash;
  if (hash && hash !== "#home") {
    const targetSection = document.querySelector(hash);
    if (targetSection) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: "smooth" });
        updateActiveIndicator(hash.substring(1));
      }, 2000); // Wait for loader to finish
    }
  } else {
    // If it's home page or no hash, ensure we're at the top
    window.scrollTo(0, 0);
    updateActiveIndicator("home");
  }
}

// Main initialization
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing modules...");

  // Reset scroll position
  window.scrollTo(0, 0);

  // Reset scroll restoration
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Add home-page class to body if we're on the home page
  if (!window.location.hash || window.location.hash === "#home") {
    document.body.classList.add("home-page");
  }

  // Initialize loader and preload assets
  initLoader();

  // Create page transition element
  const pageTransition = initPageTransition();

  // Initialize all modules
  initVideoReveal();
  initNavigation(pageTransition);
  initScrollEffects();
  initTeamSection();
  initContactForm(); // Contact form now handles footer visibility
  initProjectParallax();

  // Setup events and handle initial hash
  setupEventListeners(pageTransition);
  initSectionVisibility();
  handleInitialHash();

  // Add initial pulse animation for menu
  setTimeout(() => {
    const circle = document.querySelector(".menu-circle .circle");
    if (circle) {
      circle.classList.add("pulse");
      setTimeout(() => circle.classList.remove("pulse"), 700);
    }
  }, 2500);
});

// Export shared functions
export { updateActiveIndicator, scrollToSection };
