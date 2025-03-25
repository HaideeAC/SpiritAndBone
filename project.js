/**
 * Spirit&Bone - Project Section
 * Optimized animation and scroll effects
 */

import { debounce } from "./utils.js";

function initProjectParallax() {
  console.log("Initializing optimized project section effects");

  // Key elements
  const projectSection = document.getElementById("project");
  const elementsToAnimate = document.querySelectorAll(
    ".project-image, .text1, .text2, .image-poster"
  );
  const projectContainer = document.querySelector(".project-container");
  const scrollDownBtn = document.querySelector(".scroll-down2");

  // Early exit if project section doesn't exist
  if (!projectSection) return;

  // Make the project container visible when section is active
  if (projectContainer) {
    projectSection.addEventListener(
      "animationstart",
      () => {
        projectContainer.classList.add("visible");
      },
      { once: true }
    );
  }

  // Create optimized intersection observer for elements
  const elementObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add appear class with slight delay for smoother effect
          setTimeout(() => {
            entry.target.classList.add("appear");
          }, 300);
          // Stop observing once element appears
          elementObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -15% 0px",
    }
  );

  // Section observer to trigger animations when project section enters viewport
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section is visible, start observing elements
          observeAllElements();

          if (projectContainer) {
            projectContainer.classList.add("visible");
          }
        } else {
          // Section is no longer visible, reset elements
          elementsToAnimate.forEach((element) => {
            element.classList.remove("appear");
            elementObserver.unobserve(element);
          });
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "-10% 0px",
    }
  );

  // Start observing all elements
  function observeAllElements() {
    elementsToAnimate.forEach((element) => {
      // Reset animation state
      element.classList.remove("appear");
      // Force reflow to ensure transition works properly
      void element.offsetWidth;
      // Start observing
      elementObserver.observe(element);
    });
  }

  // Handle menu navigation with staggered animation
  function handleMenuNavigation() {
    // Stop all ongoing observations
    elementsToAnimate.forEach((element) => {
      elementObserver.unobserve(element);
      element.classList.remove("appear");
      // Force reflow
      void element.offsetWidth;
    });

    // Apply staggered reveal
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("appear");
      }, 400 + index * 80); // Slightly faster animation sequence
    });
  }

  // Project headings parallax effect
  function initProjectHeadingsParallax() {
    const projectHeadings = document.querySelectorAll(
      "#project h1, #project h2"
    );
    if (!projectHeadings.length) return;

    window.addEventListener(
      "scroll",
      debounce(() => {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        const projectOffset = scrolled - projectSection.offsetTop;

        if (projectOffset > -windowHeight && projectOffset < windowHeight) {
          projectHeadings.forEach((heading, index) => {
            const movement = projectOffset * 0.1 * (index % 2 === 0 ? 1 : -1);
            heading.style.transform = `translateY(${movement}px)`;
          });
        }
      }, 50)
    );
  }

  // Setup scroll-down button in tier1
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

        // Ensure tier2 elements are visible
        const tier2Elements = document.querySelectorAll(
          ".tier2 .image-poster, .tier2 .text2"
        );
        tier2Elements.forEach((element) => {
          element.classList.add("appear");
        });
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

  // Handle direct URL navigation to #project
  function handleDirectNavigation() {
    if (window.location.hash === "#project") {
      setTimeout(handleMenuNavigation, 800);
    }
  }

  // Setup menu navigation
  function setupMenuNavigation() {
    document.querySelectorAll('a[href="#project"]').forEach((link) => {
      link.addEventListener("click", () => {
        setTimeout(handleMenuNavigation, 500);
      });
    });
  }

  // Initialize all functionality
  function init() {
    // Hide all elements initially
    elementsToAnimate.forEach((element) => {
      element.classList.remove("appear");
    });

    // Start observing the project section
    sectionObserver.observe(projectSection);

    // Initialize individual components
    setupScrollDownButton();
    setupMenuNavigation();
    initProjectHeadingsParallax();
    handleDirectNavigation();
  }

  // Initialize when DOM is ready
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
}

export { initProjectParallax };
