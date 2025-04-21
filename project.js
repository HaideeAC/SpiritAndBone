/**
 * Spirit&Bone - Project Section Interactions
 * Enhanced with scroll-triggered animations
 */

function initProjectParallax() {
  // Get references to main elements
  const projectContainer = document.querySelector(".project-container");
  const scrollDown2 = document.getElementById("scroll-down2");
  const tier1 = document.querySelector(".tier1");
  const tier2 = document.querySelector(".tier2");
  const parallaxBoxes = document.querySelectorAll(".parallax-box");
  const projectText = document.querySelector(".project-text");

  // Exit if no project container
  if (!projectContainer) return;

  // Make the container visible with a subtle animation
  setTimeout(() => {
    projectContainer.classList.add("visible");
  }, 300);

  // Handle scroll down button
  if (scrollDown2) {
    scrollDown2.addEventListener("click", () => {
      if (tier2) {
        tier2.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Add intersection observer for tier2
  if (tier2) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tier2.classList.add("tier2-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(tier2);
  }

  // Initialize tier1 scroll effects with IntersectionObserver
  initTier1ScrollEffects(tier1, parallaxBoxes, projectText);

  // Initialize other interactions
  initSimpleParallax();
  initProjectText();
  initPosterHover();
}

/**
 * Initialize scroll effects for tier1 section elements
 * @param {HTMLElement} tier1 - The tier1 container element
 * @param {NodeList} parallaxBoxes - Collection of parallax box elements
 * @param {HTMLElement} projectText - The project text element
 */
function initTier1ScrollEffects(tier1, parallaxBoxes, projectText) {
  if (!tier1) return;

  // Create a sticky sentinel element to help detect scroll direction and position
  const sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";
  sentinel.style.cssText =
    "height: 1px; width: 100%; position: absolute; top: 0; left: 0; visibility: hidden;";
  tier1.appendChild(sentinel);

  // Set up IntersectionObserver with multiple thresholds for granular control
  const thresholds = [];
  for (let i = 0; i <= 20; i++) {
    thresholds.push(i / 20);
  }

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      // Get the main entry for the tier1 section
      const tier1Entry = entries.find((entry) => entry.target === tier1);

      if (tier1Entry) {
        // Calculate scroll progress as a percentage (0 to 1)
        const progress = Math.max(0, Math.min(1, tier1Entry.intersectionRatio));

        // Apply scroll progress to elements
        applyTier1ScrollEffects(progress, parallaxBoxes, projectText);
      }
    },
    {
      threshold: thresholds,
      rootMargin: "-5% 0px -5% 0px",
    }
  );

  // Observe the tier1 section
  scrollObserver.observe(tier1);

  // Also set up scroll event for smoother animation between thresholds
  window.addEventListener("scroll", () => {
    // Only proceed if tier1 is in the viewport
    const rect = tier1.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      // Calculate visibility ratio
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const progress = Math.min(Math.max(visibleHeight / rect.height, 0), 1);

      // Apply scroll effects based on visibility progress
      applyTier1ScrollEffects(progress, parallaxBoxes, projectText);
    }
  });
}

/**
 * Apply scroll effects to tier1 elements based on scroll progress
 * @param {number} progress - Scroll progress (0-1)
 * @param {NodeList} parallaxBoxes - Collection of parallax boxes
 * @param {HTMLElement} projectText - The project text element
 */
function applyTier1ScrollEffects(progress, parallaxBoxes, projectText) {
  if (!parallaxBoxes.length) return;

  // Define animation curves for different effects
  // Use cubic-bezier-like curves for more natural animation
  const inCurve = progress * progress; // Ease-in effect
  const outCurve = progress * (2 - progress); // Ease-out effect
  const inOutCurve =
    progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress; // Ease-in-out

  // Base animation values
  const opacityBase = Math.min(1, progress * 2); // 0 to 1 in first half
  const scaleBase = 0.8 + progress * 0.2; // 0.8 to 1.0

  // Apply different animations to each parallax box
  parallaxBoxes.forEach((box, index) => {
    // Skip if box doesn't exist
    if (!box) return;

    // Get the index position to determine animation style
    const boxIndex = parseInt(box.id.replace("project-img", ""));

    // Different animation based on box position
    if (boxIndex <= 3) {
      // Top row - slide in from sides
      const xOffset =
        boxIndex % 2 === 0
          ? (1 - inOutCurve) * -50 // Even - from left
          : (1 - inOutCurve) * 50; // Odd - from right

      box.style.transform = `translateX(${xOffset}px) scale(${scaleBase})`;
      box.style.opacity = opacityBase;
    } else if (boxIndex <= 5) {
      // Middle row - fade in with delay
      // Delayed progress - starts halfway through scroll
      const delayedProgress = Math.max(0, (progress - 0.3) * 1.4);
      const delayedCurve = delayedProgress * delayedProgress;

      box.style.opacity = delayedCurve;
      box.style.transform = `scale(${0.7 + delayedCurve * 0.3})`;
    } else {
      // Bottom/background images - subtle fade and movement
      // Even more delayed to appear last
      const lateProgress = Math.max(0, (progress - 0.5) * 2);
      const lateOpacity = lateProgress * 0.4; // Keep partially transparent

      // Calculate vertical movement - starts below and moves up
      const yOffset = (1 - lateProgress) * 40;

      box.style.opacity = lateOpacity;
      box.style.transform = `translateY(${yOffset}px) scale(${
        0.9 + lateProgress * 0.1
      })`;
    }
  });

  // Project text animation
  if (projectText) {
    // Text appears after the first few images
    const textProgress = Math.max(0, (progress - 0.2) * 1.25);
    const textOpacity = textProgress;
    const textScale = 0.9 + textProgress * 0.1;

    // Calculate a subtle floating effect based on scroll position
    const floatY = Math.sin(progress * Math.PI) * 10;

    projectText.style.opacity = textOpacity;
    projectText.style.transform = `translateY(${floatY}px) scale(${textScale})`;

    // Trigger the text-revealed class based on progress
    if (
      textProgress > 0.6 &&
      !projectText.classList.contains("text-revealed")
    ) {
      projectText.classList.add("text-revealed");
    } else if (
      textProgress < 0.4 &&
      projectText.classList.contains("text-revealed")
    ) {
      projectText.classList.remove("text-revealed");
    }
  }

  // Adjust scroll down indicator based on progress
  const scrollDown2 = document.getElementById("scroll-down2");
  if (scrollDown2) {
    // Show the indicator as user reaches the end of the section
    const scrollIndicatorOpacity = progress > 0.7 ? (progress - 0.7) * 3 : 0;
    scrollDown2.style.opacity = scrollIndicatorOpacity;
  }
}

/**
 * Initialize simple parallax effect for project images
 * Uses CSS-driven approach with hover effects
 */
function initSimpleParallax() {
  const parallaxBoxes = document.querySelectorAll(".parallax-box");

  parallaxBoxes.forEach((box, index) => {
    // Add data attribute for CSS-based parallax
    box.setAttribute("data-parallax-index", index % 3);

    // Add hover state listeners with simpler transforms
    box.addEventListener("mouseenter", () => {
      box.classList.add("hover");
    });

    box.addEventListener("mouseleave", () => {
      box.classList.remove("hover");
    });

    // Add basic mouse move effect for images only (much simpler)
    const image = box.querySelector(".parallax-image");
    if (image) {
      box.addEventListener("mousemove", (e) => {
        // Only do this calculation when hovered, to save performance
        if (box.classList.contains("hover")) {
          const rect = box.getBoundingClientRect();
          const xPos = (e.clientX - rect.left) / rect.width - 0.5;
          const yPos = (e.clientY - rect.top) / rect.height - 0.5;

          // Apply light transform with reduced calculations
          image.style.transform = `translate(${xPos * 10}px, ${yPos * 10}px)`;
        }
      });
    }
  });
}

/**
 * Initialize project text reveal with simpler animation
 */
function initProjectText() {
  const projectText = document.querySelector(".project-text");

  if (!projectText) return;

  // Use IntersectionObserver for performant reveal
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        projectText.classList.add("text-revealed");
        observer.unobserve(projectText);
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(projectText);
}

/**
 * Initialize a simple hover effect for the poster
 */
function initPosterHover() {
  const poster = document.querySelector(".project-poster img");

  if (!poster) return;

  poster.addEventListener("mouseenter", () => {
    poster.classList.add("hover");
  });

  poster.addEventListener("mouseleave", () => {
    poster.classList.remove("hover");
  });
}

// Export the initialization function
export { initProjectParallax };
