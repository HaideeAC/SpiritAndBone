/**
 * Spirit&Bone - Main JavaScript Entry Point
 * Initializes all modules and handles main event listeners
 */

// Clear the URL hash if it's #home
if (window.location.hash === "#home") {
  history.replaceState(null, null, window.location.pathname);
}

// Reset scroll position on page load
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Import all modules with fixed paths
import { initVideoReveal } from "/video-reveal.js";
import { initNavigation } from "/navigation.js";
import { initScrollEffects } from "/scroll-effect.js";
import { initTeamSection } from "/team-members.js";
import { initContactForm } from "/contact-form.js";
import { initProjectParallax } from "/project.js"; // Updated import path
import { debounce } from "/utils.js";

// Create page transition element
const pageTransition = document.createElement("div");
pageTransition.className = "page-transition";
document.body.appendChild(pageTransition);

// Add pulse animation style
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(192, 0, 1, 0.7); }
    70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(192, 0, 1, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(192, 0, 1, 0); }
  }
  .circle.pulse { animation: pulse 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
  .contact-section { margin-bottom: 0 !important; padding-bottom: 0 !important; }
  footer { margin-bottom: 0 !important; position: relative !important; bottom: 0 !important; }
  #contact { position: relative; margin-bottom: 0 !important; }
  body { margin-bottom: 0 !important; padding-bottom: 0 !important; overflow-x: hidden; }
  html { margin-bottom: 0 !important; padding-bottom: 0 !important; }
`;
document.head.appendChild(style);

// Reset scroll position to top on page load/reload
window.onload = function () {
  // Force scroll to top
  window.scrollTo(0, 0);

  // Also try with a small delay to ensure it happens after any other scripts
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
};

// Helper function to update active indicator
function updateActiveIndicator(sectionId) {
  const indicatorDots = document.querySelectorAll(".indicator-dot");
  indicatorDots.forEach((dot) => {
    dot.classList.toggle(
      "active",
      dot.getAttribute("data-section") === sectionId
    );
  });
}

// Function to handle smooth scrolling to sections
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
    updateActiveIndicator(sectionId);

    // Update URL hash but prevent jump
    history.replaceState(null, null, `#${sectionId}`);
  }
}

// Function to check which section is currently in viewport
function checkCurrentSection() {
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

    // Update URL hash without scrolling
    if (history.replaceState) {
      history.replaceState(
        null,
        null,
        currentSection !== "home" ? `#${currentSection}` : " "
      );
    }
  }
}

// Initialize loader animation
function initializeLoader() {
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-circle"></div>
      <div class="loader-text">SPIRIT & BONE</div>
    </div>
  `;
  document.body.appendChild(loader);

  // Hide loader after content is loaded
  setTimeout(() => {
    loader.classList.add("loaded");
    setTimeout(() => {
      loader.remove();
    }, 1000);
  }, 1500);
}

// Fix footer space and position
function fixFooterSpace() {
  // Hide any spacer after the contact section
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    const nextElement = contactSection.nextElementSibling;
    if (nextElement && nextElement.classList.contains("section-spacer")) {
      nextElement.style.display = "none";
    }

    // Ensure contact section has no bottom margin/padding
    contactSection.style.marginBottom = "0";
    contactSection.style.paddingBottom = "0";
  }

  // Ensure footer is properly displayed
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.marginBottom = "0";
    footer.classList.add("visible");
  }

  // Global fix for any extra space
  document.body.style.marginBottom = "0";
  document.body.style.paddingBottom = "0";
  document.documentElement.style.marginBottom = "0";
  document.documentElement.style.paddingBottom = "0";
}

// Initialize preloading of assets
function preloadAssets() {
  // Preload critical images
  const criticalImages = ["/images/texture1.jpg", "/images/texture.jpg"];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize all modules when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing modules...");

  // Show loader
  initializeLoader();

  // Preload assets
  preloadAssets();

  // Force scroll to top
  window.scrollTo(0, 0);

  // Add home-page class to body if we're on the home page (no hash or #home)
  if (!window.location.hash || window.location.hash === "#home") {
    document.body.classList.add("home-page");
  }

  // Initialize all modules
  initVideoReveal();
  initNavigation(pageTransition);
  initScrollEffects();
  initTeamSection();
  initContactForm();
  initProjectParallax();

  // Check URL hash for initial scrolling - but only if it's not the home page
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
    // If it's the home page or no hash, ensure we're at the top
    window.scrollTo(0, 0);
    updateActiveIndicator("home");
  }

  // Apply initial fade-in to visible sections
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

  // Initial pulse animation for menu
  setTimeout(() => {
    const circle = document.querySelector(".menu-circle .circle");
    if (circle) {
      circle.classList.add("pulse");
      setTimeout(() => circle.classList.remove("pulse"), 700);
    }
  }, 2500);

  // Force hiding any gap below footer
  fixFooterSpace();

  // Setup scroll event for tracking current section
  window.addEventListener("scroll", debounce(checkCurrentSection, 100));

  // Handle section indicator clicks
  document.querySelectorAll(".indicator-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const sectionId = dot.getAttribute("data-section");
      scrollToSection(sectionId);
    });
  });

  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      fixFooterSpace();
    }, 200)
  );

  // Handle scroll-down button click
  const scrollDownBtn = document.querySelector(".scroll-down");
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", () => {
      scrollToSection("project");
    });
  }
});

// Add loader styles
const loaderStyle = document.createElement("style");
loaderStyle.textContent = `
  .page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.8s ease, visibility 0.8s ease;
  }
  
  .page-loader.loaded {
    opacity: 0;
    visibility: hidden;
  }
  
  .loader-content {
    text-align: center;
  }
  
  .loader-circle {
    width: 80px;
    height: 80px;
    border: 4px solid rgba(192, 0, 1, 0.3);
    border-top: 4px solid var(--main-red);
    border-radius: 50%;
    margin: 0 auto 20px;
    animation: spin 1s linear infinite;
  }
  
  .loader-text {
    color: var(--main-red);
    font-family: "Ultra", serif;
    font-size: 2rem;
    letter-spacing: 3px;
    animation: pulse 1.5s infinite alternate;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(loaderStyle);

// Export shared functions that might be used across modules
export { updateActiveIndicator };
