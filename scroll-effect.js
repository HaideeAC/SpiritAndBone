/**
 * Spirit&Bone - Scroll Effects Module
 * Handles scroll detection, parallax effects, and section transitions
 */

// Import from utils to get smoother animations
import { debounce } from "./utils.js";
import { updateActiveIndicator } from "./main.js";

// Initialize scroll effects
function initScrollEffects() {
  const sections = document.querySelectorAll(".section");
  const footer = document.querySelector("footer");
  const menuCircle = document.getElementById("menu-circle");
  const fixedBackground = document.querySelector(".fixed-background");
  const windowHeight = window.innerHeight;

  // Track the last scroll position for direction detection
  let lastScrollTop = 0;
  let scrollDirection = "down";

  // If key elements don't exist, exit early
  if (!sections.length) {
    return;
  }

  // Ensure we're at the top of the page on init
  window.scrollTo(0, 0);

  // Enhanced Intersection Observer with more precise thresholds
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          entry.target.classList.add("fade-in");

          // Only update URL and indicators if we're not in the initial load sequence
          if (document.readyState === "complete") {
            updateActiveIndicator(sectionId);

            // Only update history if user has scrolled past home
            if (sectionId !== "home") {
              history.replaceState(null, null, `#${sectionId}`);
            } else {
              history.replaceState(null, null, window.location.pathname);
            }
          }

          handleScrollDownIndicator(sectionId);

          if (sectionId === "project") {
            document
              .querySelector(".project-container")
              ?.classList.add("visible");
          } else if (sectionId === "contact") {
            document
              .querySelector(".contact-form-container")
              ?.classList.add("visible");
            showFooter();
          }
        }
      });
    },
    { root: null, rootMargin: "-10% 0px -10% 0px", threshold: [0.1, 0.5, 0.8] }
  );

  // Observe all sections
  sections.forEach((section) => observer.observe(section));

  // Enhanced scroll event handling with smoother effects
  window.addEventListener(
    "scroll",
    debounce(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight - windowHeight;

      // Detect scroll direction
      scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
      lastScrollTop = scrollTop;

      // Update progress bar
      const progress = (scrollTop / fullHeight) * 100;
      const progressBar = document.getElementById("scroll-progress");
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      // Show footer when at or near bottom
      if (fullHeight - scrollTop < 50 || scrollTop >= fullHeight) {
        showFooter();
      }

      // Dynamic circle size
      updateCircleSize(scrollTop);

      // Enhanced parallax effects for multiple elements
      applyParallaxEffects(scrollTop, windowHeight);
    }, 10)
  );

  // Handle scroll down indicator visibility
  function handleScrollDownIndicator(sectionId) {
    const scrollDown = document.querySelector(".scroll-down");
    if (!scrollDown) return;

    if (sectionId !== "home") {
      scrollDown.style.opacity = "0";
      setTimeout(() => {
        scrollDown.style.display = "none";
      }, 500);
    } else {
      scrollDown.style.display = "block";
      setTimeout(() => {
        scrollDown.style.opacity = "1";
      }, 100);
    }
    const scrollDown2 = document.querySelector(".scroll-down2");
    if (!scrollDown2) return;

    if (sectionId !== "home") {
      scrollDown2.style.opacity = "0";
      setTimeout(() => {
        scrollDown2.style.display = "none";
      }, 500);
    } else {
      scrollDown2.style.display = "block";
      setTimeout(() => {
        scrollDown2.style.opacity = "1";
      }, 100);
    }
  }

  // Simple function to ensure footer is visible and correctly positioned
  function showFooter() {
    if (footer) {
      footer.style.opacity = "1";
      footer.style.transform = "translateY(0)";
      footer.style.position = "relative";
      footer.style.bottom = "0";
      footer.style.marginBottom = "0";
      footer.classList.add("visible");
    }
  }

  // Update circle size based on scroll position
  function updateCircleSize(scrolled) {
    if (!menuCircle) return;

    const circle = menuCircle.querySelector(".circle");
    if (!circle) return;

    const baseSize = 40;
    const shrinkFactor = 0.9;
    const scrollFactor = Math.min(scrolled / 300, 1);
    const newSize = baseSize * (1 - scrollFactor * (1 - shrinkFactor));
    circle.style.width = `${newSize}px`;
    circle.style.height = `${newSize}px`;
  }

  // Apply parallax effects to various elements
  function applyParallaxEffects(scrolled, windowHeight) {
    // Parallax for home video
    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      const movement = scrolled * 0.15;
      videoContainer.style.transform = `translateY(${movement}px) translateZ(-1px) scale(${
        1 + scrolled * 0.0002
      })`;
    }

    // Fixed background parallax
    if (fixedBackground) {
      // Gradually increase opacity and zoom as user scrolls
      const opacity = Math.min(
        Math.max((scrolled - windowHeight * 0.3) / (windowHeight * 0.7), 0),
        0.5
      );
      // More aggressive zoom factor to create a more noticeable effect
      const zoomFactor = 1 + Math.min(scrolled * 0.0005, 0.3);

      fixedBackground.style.opacity = opacity.toString();
      fixedBackground.style.transform = `scale(${zoomFactor}) translateZ(0)`;
      fixedBackground.style.transition =
        "transform 0.3s linear, opacity 0.5s ease";
    }

    // Team section parallax
    const teamMembers = document.querySelectorAll(".team-member");
    const teamSection = document.getElementById("team");
    if (teamMembers.length && teamSection) {
      const teamOffset = scrolled - teamSection.offsetTop;

      if (teamOffset > -windowHeight && teamOffset < windowHeight) {
        teamMembers.forEach((member, index) => {
          const depth = 0.05 + (index % 3) * 0.02;
          const xDirection = index % 2 === 0 ? 1 : -1;
          const yMovement = teamOffset * depth * 0.5;
          const xMovement = teamOffset * depth * 0.2 * xDirection;

          member.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
        });
      }
    }

    // Project section parallax
    const projectHeadings = document.querySelectorAll(
      "#project h1, #project h2"
    );
    const projectSection = document.getElementById("project");
    if (projectHeadings.length && projectSection) {
      const projectOffset = scrolled - projectSection.offsetTop;

      if (projectOffset > -windowHeight && projectOffset < windowHeight) {
        projectHeadings.forEach((heading, index) => {
          const movement = projectOffset * 0.1 * (index % 2 === 0 ? 1 : -1);
          heading.style.transform = `translateY(${movement}px)`;
        });
      }
    }

    // Contact section parallax
    const contactInfoElements = document.querySelectorAll(".contact-info > *");
    const contactSection = document.getElementById("contact");
    if (contactInfoElements.length && contactSection) {
      const contactOffset = scrolled - contactSection.offsetTop;

      if (contactOffset > -windowHeight && contactOffset < windowHeight) {
        contactInfoElements.forEach((element, index) => {
          const movement = contactOffset * 0.05 * (index % 2 === 0 ? 1 : -1);
          element.style.transform = `translateY(${movement}px)`;
        });
      }
    }
  }

  // Mobile optimization for team section
  adjustForMobile();

  // Fix footer position in contact section
  fixFooterPosition();

  // Window resize event handlers
  window.addEventListener(
    "resize",
    debounce(() => {
      adjustForMobile();
      fixFooterPosition();
    }, 200)
  );
}

// Mobile optimization for team section
function adjustForMobile() {
  const teamSection = document.getElementById("team");
  if (!teamSection) return;

  if (window.innerWidth <= 768) {
    teamSection.style.height = "auto";
    teamSection.style.minHeight = "200vh";
  } else {
    teamSection.style.height = "100vh";
  }
}

// Fix footer positioning in contact section
function fixFooterPosition() {
  const contactSection = document.getElementById("contact");
  const footer = document.querySelector("footer");

  if (contactSection && footer) {
    // Ensure the contact section doesn't have margin or padding at the bottom
    contactSection.style.marginBottom = "0";
    contactSection.style.paddingBottom = "0";

    // Make sure footer is visible and positioned correctly
    footer.style.opacity = "1";
    footer.style.transform = "translateY(0)";
    footer.style.position = "relative";
    footer.style.bottom = "0";
    footer.style.marginBottom = "0";

    // If the footer isn't inside the contact section, move it there
    if (
      footer.parentNode !== contactSection &&
      contactSection.nextElementSibling === footer
    ) {
      document.body.style.marginBottom = "0";
      document.body.style.paddingBottom = "0";
    }
  }
}

// Export the initialization function and any needed helper functions
export { initScrollEffects, adjustForMobile, fixFooterPosition };
