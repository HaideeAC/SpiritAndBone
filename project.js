/**
 * Spirit&Bone - Project Section
 * Simplified implementation with cleaner parallax effect
 */

import { debounce } from "./utils.js";

function initProjectParallax() {
  console.log(
    "Initializing simplified project section with clean parallax effect"
  );

  // Key elements
  const projectSection = document.getElementById("project");
  const projectImages = document.querySelectorAll(
    ".project-image:not(.image-poster) img"
  );
  const projectContainer = document.querySelector(".project-container");
  const scrollDownBtn = document.querySelector(".scroll-down2");

  // Early exit if project section doesn't exist
  if (!projectSection) return;

  // Make all elements visible by default without resetting image transforms
  document
    .querySelectorAll(".text1, .text2, .image-poster")
    .forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.classList.add("appear");
    });

  // Set only opacity for project images (don't reset transform)
  document
    .querySelectorAll(".project-image:not(.image-poster)")
    .forEach((element) => {
      element.style.opacity = "1";
      element.classList.add("appear");
    });

  // Get responsive settings based on screen size
  function getParallaxSettings() {
    // Base settings
    const settings = {
      intensity: 2.0, // Base intensity
      initialOffset: -80, // Starting position percentage
      rangeOfMotion: 65, // Total range the image can move
      viewportThreshold: 1.5, // How far beyond viewport to calculate effect
    };

    // Get viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    // Extra small/thin devices
    if (width <= 360 || aspectRatio <= 0.5) {
      return {
        ...settings,
        intensity: 2.0, // Lower intensity for very small screens
        initialOffset: -101, // Starting position percentage
        rangeOfMotion: 40, // Reduced range for small screens
        viewportThreshold: 1.0, // Minimal threshold for performance
      };
    }
    // Small mobile devices
    else if (width <= 480) {
      return {
        ...settings,
        intensity: 2.3, // Base intensity
        initialOffset: -102, // Starting position percentage
        rangeOfMotion: 43, // Total range the image can move
        viewportThreshold: 1.05, // Reduced threshold for performance
      };
    }
    // Medium/tablets portrait
    else if (width <= 768) {
      return {
        ...settings,
        intensity: 2.5, // Base intensity
        initialOffset: -103, // Starting position percentage
        rangeOfMotion: 38, // Total range the image can move
        viewportThreshold: 1.1,
      };
    }
    // Tablets landscape
    else if (width <= 1024) {
      return {
        ...settings,
        intensity: 2.8, // Base intensity
        initialOffset: -102, // Starting position percentage
        rangeOfMotion: 37, // Total range the image can move
      };
    }
    // Standard desktops
    else if (width <= 1440) {
      return {
        ...settings,
        intensity: 3.0, // Standard intensity
        initialOffset: -100, // Standard positioning
        rangeOfMotion: 35, // Standard range
      };
    }
    // Extra wide screens
    else if (width > 1440 || aspectRatio >= 2.0) {
      return {
        ...settings,
        intensity: 3.5, // Enhanced intensity for large screens
        initialOffset: -100, // Standard positioning
        rangeOfMotion: 40, // Larger range for wide screens
        viewportThreshold: 1.3, // Extended threshold for wide screens
      };
    }

    // Default fallback
    return settings;
  }

  // Simple parallax effect for project images
  function updateParallax() {
    // Log to confirm function is running
    console.log("Updating parallax effect");

    // Get current settings based on screen size
    const settings = getParallaxSettings();

    projectImages.forEach((img, index) => {
      // Get image container
      const imgContainer = img.closest(".project-image");
      if (!imgContainer) return;

      // Get section position relative to viewport
      const rect = imgContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only process when image is visible (using dynamic threshold)
      if (
        rect.bottom < 0 ||
        rect.top > viewportHeight * settings.viewportThreshold
      )
        return;

      // Calculate how far into the viewport the image has scrolled (0 to 1)
      const visibleRatio = Math.min(
        Math.max(
          0,
          (viewportHeight - rect.top) / (viewportHeight + rect.height)
        ),
        1
      );

      // Calculate direction based on image position (alternate)
      const direction = index % 2 === 0 ? 1 : -1;

      // Then calculate movement based on scroll position
      const moveAmount = settings.rangeOfMotion * direction;
      const dynamicOffset =
        settings.initialOffset +
        (visibleRatio * moveAmount * settings.intensity) / 3;

      // Apply transform directly to image element with !important
      img.style.transform = `translateY(${dynamicOffset}px)`;
    });
  }

  // Performance optimization - debounce function for resize event
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateParallax, 100);
  }

  // Performance optimization for scroll events
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Check if reduced motion is preferred by the user
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    // Add event listeners only if reduced motion is not preferred
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Run immediately to set initial positions
    setTimeout(updateParallax, 100);

    // Also run when images load
    window.addEventListener("load", () => {
      setTimeout(updateParallax, 500);
    });
  }

  // Setup scroll-down button in tier1 (keep this functionality)
  function setupScrollDownButton() {
    if (!scrollDownBtn) return;

    // Ensure it's visible initially
    scrollDownBtn.style.display = "block";
    scrollDownBtn.style.opacity = "1";

    // Handle click to scroll to tier2
    scrollDownBtn.addEventListener("click", () => {
      const tier2 = document.querySelector(".tier2");
      if (tier2) {
        tier2.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Handle visibility based on scroll position
    window.addEventListener(
      "scroll",
      debounce(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const projectTop = projectSection.offsetTop;
        const tier1 = document.querySelector(".tier1");

        if (tier1) {
          const tier1Height = tier1.offsetHeight;
          const tier1Bottom = projectTop + tier1Height;

          // Show when in tier1, hide when scrolled to tier2
          if (
            scrollPosition >= projectTop &&
            scrollPosition < tier1Bottom - windowHeight / 2
          ) {
            scrollDownBtn.style.display = "block";
            setTimeout(() => {
              scrollDownBtn.style.opacity = "1";
            }, 100);
          } else {
            scrollDownBtn.style.opacity = "0";
            setTimeout(() => {
              scrollDownBtn.style.display = "none";
            }, 500);
          }
        }
      }, 100)
    );
  }

  // Initialize
  function init() {
    // Make sure the project container is visible
    if (projectContainer) {
      projectContainer.classList.add("visible");
    }

    // Initialize scroll button
    setupScrollDownButton();

    // Set image styles for parallax
    projectImages.forEach((img) => {
      img.style.transition = "transform 0.2s ease-out";
      img.style.willChange = "transform";
    });

    // Force an initial parallax calculation
    updateParallax();
  }

  // Initialize when DOM is ready
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }

  // Force update after a slight delay to ensure everything is loaded
  setTimeout(updateParallax, 1000);
}

export { initProjectParallax };
