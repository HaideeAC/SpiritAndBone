/**
 * Spirit&Bone - Optimized Scroll Effects Module
 */

import { debounce } from "./utils.js";
import { updateActiveIndicator } from "./main.js";

// Initialize scroll effects
function initScrollEffects() {
  // Core elements
  const sections = document.querySelectorAll(".section");
  const footer = document.querySelector("footer");
  const menuCircle = document.getElementById("menu-circle");
  const progressBar = document.getElementById("scroll-progress");

  // Early exit if essential elements are missing
  if (!sections.length) return;

  // Setup
  initScrollIndicators();
  initSmoothScrolling();
  window.scrollTo(0, 0); // Ensure top position on init

  // Section visibility observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");

          // Update indicators and URL when page is loaded
          if (document.readyState === "complete") {
            updateActiveIndicator(sectionId);

            // Update history state
            if (sectionId !== "home") {
              history.replaceState(null, null, `#${sectionId}`);
            } else {
              history.replaceState(null, null, window.location.pathname);
            }
          }

          // Section-specific actions
          if (sectionId === "contact") {
            const contactForm = document.querySelector(
              ".contact-form-container"
            );
            if (contactForm) contactForm.classList.add("visible");
            showFooter();
          }
        }
      });
    },
    {
      root: null,
      rootMargin: "-5% 0px -5% 0px",
      threshold: [0.05, 0.25],
    }
  );

  // Observe all sections
  sections.forEach((section) => observer.observe(section));

  // Core scroll handlers
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("scroll", debounce(handleScrollDebounced, 50));

  // Fast scroll handler for critical UI updates
  function handleScroll() {
    if (!progressBar && !menuCircle) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    // Update progress bar
    if (progressBar) {
      const fullHeight = document.body.scrollHeight - windowHeight;
      const progress = (scrollTop / fullHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Update menu circle size
    if (menuCircle) {
      const circle = menuCircle.querySelector(".circle");
      if (circle) {
        const baseSize = 40;
        const shrinkFactor = 0.9;
        const scrollFactor = Math.min(scrollTop / 300, 1);
        const newSize = baseSize * (1 - scrollFactor * (1 - shrinkFactor));

        circle.style.width = `${newSize}px`;
        circle.style.height = `${newSize}px`;
      }
    }
  }

  // Debounced scroll handler for less frequent updates
  function handleScrollDebounced() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.scrollHeight - windowHeight;

    // Show footer when near bottom
    if (fullHeight - scrollTop < 50 || scrollTop >= fullHeight) {
      showFooter();
    }

    // Apply video container parallax
    applyVideoParallax(scrollTop);

    // Apply team members parallax
    applyTeamParallax(scrollTop, windowHeight);

    // Apply contact info parallax
    applyContactParallax(scrollTop, windowHeight);
  }

  // Video container parallax effect
  function applyVideoParallax(scrolled) {
    const videoContainer = document.querySelector(".video-container");
    if (!videoContainer) return;

    const movement = scrolled * 0.15;
    const scale = 1 + scrolled * 0.0002;
    videoContainer.style.transform = `translateY(${movement}px) translateZ(-1px) scale(${scale})`;
  }

  // Team section parallax effect
  function applyTeamParallax(scrolled, windowHeight) {
    const teamMembers = document.querySelectorAll(".team-member");
    const teamSection = document.getElementById("team");
    if (!teamMembers.length || !teamSection) return;

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

  // Contact section parallax effect
  function applyContactParallax(scrolled, windowHeight) {
    const contactInfoElements = document.querySelectorAll(".contact-info > *");
    const contactSection = document.getElementById("contact");
    if (!contactInfoElements.length || !contactSection) return;

    const contactOffset = scrolled - contactSection.offsetTop;

    if (contactOffset > -windowHeight && contactOffset < windowHeight) {
      contactInfoElements.forEach((element, index) => {
        const movement = contactOffset * 0.05 * (index % 2 === 0 ? 1 : -1);
        element.style.transform = `translateY(${movement}px)`;
      });
    }
  }

  // Show footer with proper positioning
  function showFooter() {
    if (!footer) return;

    footer.style.opacity = "1";
    footer.style.transform = "translateY(0)";
    footer.style.position = "relative";
    footer.style.bottom = "0";
    footer.style.marginBottom = "0";
    footer.classList.add("visible");
  }

  // Initialize smooth scrolling behavior
  function initSmoothScrolling() {
    // Use native smooth scrolling if available
    if ("scrollBehavior" in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = "smooth";

      // Apply to all anchor links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const href = this.getAttribute("href");
          if (href.length > 1) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
              e.preventDefault();
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          }
        });
      });
      return;
    }

    // Fallback for browsers without native support
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href.length > 1) {
          e.preventDefault();

          const targetElement = document.querySelector(href);
          if (targetElement) {
            const targetPosition =
              targetElement.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 2000; // ms
            let startTime = null;

            function animation(currentTime) {
              if (startTime === null) startTime = currentTime;
              const timeElapsed = currentTime - startTime;
              const scrollY = easeInOutQuad(
                timeElapsed,
                startPosition,
                distance,
                duration
              );
              window.scrollTo(0, scrollY);

              if (timeElapsed < duration) {
                requestAnimationFrame(animation);
              }
            }

            // Easing function
            function easeInOutQuad(t, b, c, d) {
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
          }
        }
      });
    });
  }

  // Initialize scroll indicators
  function initScrollIndicators() {
    // Home scroll indicator
    const scrollDownBtn = document.querySelector(".scroll-down");
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener("click", () => {
        const projectSection = document.getElementById("project");
        if (projectSection) {
          projectSection.scrollIntoView({ behavior: "smooth" });
          updateActiveIndicator("project");
        }
      });
    }

    // Handle scroll indicator visibility
    window.addEventListener(
      "scroll",
      debounce(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Handle home scroll indicator
        if (homeSection && scrollDownBtn) {
          const homeSection = document.getElementById("home");
          if (scrollPosition > windowHeight / 2) {
            scrollDownBtn.style.opacity = "0";
            setTimeout(() => {
              scrollDownBtn.style.display = "none";
            }, 500);
          } else {
            scrollDownBtn.style.display = "block";
            setTimeout(() => {
              scrollDownBtn.style.opacity = "1";
            }, 100);
          }
        }
      }, 100)
    );
  }

  // Mobile optimizations
  adjustForMobile();
  fixFooterPosition();

  // Handle window resize
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

  const width = window.innerWidth;
  if (width <= 768) {
    teamSection.style.height = "auto";
    teamSection.style.minHeight = "200vh";
  } else {
    teamSection.style.height = "100vh";
  }
}

// Fix footer positioning
function fixFooterPosition() {
  const contactSection = document.getElementById("contact");
  const footer = document.querySelector("footer");

  if (!contactSection || !footer) return;

  // Ensure proper contact section spacing
  contactSection.style.marginBottom = "0";
  contactSection.style.paddingBottom = "0";

  // Ensure footer visibility
  footer.style.opacity = "1";
  footer.style.transform = "translateY(0)";
  footer.style.position = "relative";
  footer.style.bottom = "0";
  footer.style.marginBottom = "0";

  // Fix body margins if footer is outside contact section
  if (
    footer.parentNode !== contactSection &&
    contactSection.nextElementSibling === footer
  ) {
    document.body.style.marginBottom = "0";
    document.body.style.paddingBottom = "0";
  }
}

// Export functions
export { initScrollEffects, adjustForMobile, fixFooterPosition };
