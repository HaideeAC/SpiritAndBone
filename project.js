/**
 * Spirit&Bone - Project Section Interactions (Optimized)
 * Reduced animation complexity and improved performance
 */

function initProjectParallax() {
  // Get references to main elements
  const projectContainer = document.querySelector(".project-container");
  const scrollDown2 = document.getElementById("scroll-down2");
  const tier2 = document.querySelector(".tier2");

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

  // Initialize optimized interactions
  initSimpleParallax();
  initProjectText();
  initPosterHover();
}

/**
 * Initialize simple parallax effect for project images
 * Uses CSS-driven approach instead of JavaScript animation frames
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
