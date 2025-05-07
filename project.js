/**
 * Spirit&Bone - Project Section Interactions
 */

function initProjectParallax() {
  const projectContainer = document.querySelector(".project-container");
  const scrollDown2 = document.getElementById("scroll-down2");
  const tier1 = document.querySelector(".tier1");
  const tier2 = document.querySelector(".tier2");
  const parallaxBoxes = document.querySelectorAll(".parallax-box");
  const projectText = document.querySelector(".project-text");

  if (!projectContainer) return;

  setTimeout(() => {
    projectContainer.classList.add("visible");
  }, 300);

  if (scrollDown2) {
    scrollDown2.addEventListener("click", () => {
      if (tier2) {
        tier2.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  if (window.innerWidth <= 767) {
    renderMobileProjectLayout(tier2);
  } else {
    initTier2ScrollAnimations(tier2);
  }

  initTier1ScrollEffects(tier1, parallaxBoxes, projectText);
  initSimpleParallax();
  initProjectText();
  initPosterHover();

  window.addEventListener("resize", () => {
    if (
      window.innerWidth <= 767 &&
      !document.body.classList.contains("mobile-layout-applied")
    ) {
      renderMobileProjectLayout(tier2);
      document.body.classList.add("mobile-layout-applied");
      document.body.classList.remove("desktop-layout-applied");
    } else if (
      window.innerWidth > 767 &&
      !document.body.classList.contains("desktop-layout-applied")
    ) {
      resetLayoutForDesktop(tier2);
      initTier2ScrollAnimations(tier2);
      document.body.classList.add("desktop-layout-applied");
      document.body.classList.remove("mobile-layout-applied");
    }
  });
}

/**
 * Renders mobile-specific layout
 */
function renderMobileProjectLayout(tier2) {
  if (!tier2) return;

  document.body.classList.add("mobile-layout-applied");
  document.body.classList.remove("desktop-layout-applied");

  const fadeContainer = document.querySelector(".project-fade-container");
  const introTitle = document.querySelector(".project-intro h2");
  const introParagraph = document.querySelector(".project-intro p");
  const poster = document.querySelector(".project-poster");
  const allToneSections = document.querySelectorAll(".tone-section");

  if (fadeContainer) {
    fadeContainer.style.opacity = "1";
    fadeContainer.style.transition = "none";
  }

  allToneSections.forEach((section) => {
    section.style.opacity = "1";
    section.style.transform = "none";
    section.style.position = "relative";
    section.style.left = "auto";
    section.style.right = "auto";

    section.classList.add("mobile-tone-section");

    section.style.width = "90%";
    section.style.margin = "0 auto 20px auto";
    section.style.backgroundColor = "rgba(30, 0, 0, 0.5)";
    section.style.padding = "15px";
    section.style.borderRadius = "8px";
    section.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";

    section.style.display = "block";
    section.style.visibility = "visible";
  });

  if (introTitle) {
    introTitle.style.opacity = "1";
    introTitle.style.transform = "none";
  }

  if (introParagraph) {
    introParagraph.style.opacity = "1";
    introParagraph.style.transform = "none";
  }

  if (poster) {
    poster.style.opacity = "1";
    poster.style.transform = "scale(1)";
  }

  tier2.style.height = "auto";
  tier2.style.minHeight = "auto";

  const stickyContainer = tier2.querySelector(".project-sticky-container");
  if (stickyContainer) {
    stickyContainer.style.position = "relative";
    stickyContainer.style.height = "auto";
    stickyContainer.style.overflow = "visible";
  }

  const contentGrid = document.querySelector(".project-content-grid");
  if (contentGrid) {
    contentGrid.style.gridTemplateColumns = "1fr";
    contentGrid.style.width = "90%";
    contentGrid.style.margin = "0 auto";

    const leftCol = document.querySelector(".project-left-col");
    const rightCol = document.querySelector(".project-right-col");

    if (leftCol) {
      leftCol.style.gridColumn = "1";
      leftCol.style.gridRow = "2";
      leftCol.style.padding = "0";
    }

    if (rightCol) {
      rightCol.style.gridColumn = "1";
      rightCol.style.gridRow = "3";
      rightCol.style.padding = "0";
    }

    if (poster) {
      poster.style.gridColumn = "1";
      poster.style.gridRow = "1";
      poster.style.marginBottom = "20px";
    }
  }

  const styleElement = document.createElement("style");
  styleElement.id = "mobile-project-styles";
  styleElement.textContent = `
    @media (max-width: 767px) {
      .project-fade-container {
        opacity: 1 !important;
        height: auto !important;
      }
      
      .mobile-tone-section {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
        display: block !important;
      }
      
      .project-sticky-container {
        position: relative !important;
        height: auto !important;
      }
      
      .tier2 {
        height: auto !important;
        min-height: auto !important;
      }
    }
  `;

  if (!document.getElementById("mobile-project-styles")) {
    document.head.appendChild(styleElement);
  }

  tier2.style.background =
    "linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.9) 100%)";

  if (window.projectScrollObserver) {
    window.projectScrollObserver.disconnect();
  }

  const mobileStyleInterval = setInterval(() => {
    if (window.innerWidth <= 767) {
      allToneSections.forEach((section) => {
        if (section.style.opacity !== "1") {
          section.style.opacity = "1";
        }
      });

      if (fadeContainer && fadeContainer.style.opacity !== "1") {
        fadeContainer.style.opacity = "1";
      }
    } else {
      clearInterval(mobileStyleInterval);
    }
  }, 500);

  window.mobileStyleInterval = mobileStyleInterval;
}

/**
 * Reset layout for desktop view
 */
function resetLayoutForDesktop(tier2) {
  if (!tier2) return;

  document.querySelectorAll(".mobile-tone-section").forEach((section) => {
    section.classList.remove("mobile-tone-section");
    section.removeAttribute("style");
  });

  const fadeContainer = document.querySelector(".project-fade-container");
  if (fadeContainer) {
    fadeContainer.removeAttribute("style");
  }

  const stickyContainer = tier2.querySelector(".project-sticky-container");
  if (stickyContainer) {
    stickyContainer.removeAttribute("style");
  }

  const contentGrid = document.querySelector(".project-content-grid");
  if (contentGrid) {
    contentGrid.removeAttribute("style");
  }

  const leftCol = document.querySelector(".project-left-col");
  const rightCol = document.querySelector(".project-right-col");
  const poster = document.querySelector(".project-poster");

  if (leftCol) leftCol.removeAttribute("style");
  if (rightCol) rightCol.removeAttribute("style");
  if (poster) poster.removeAttribute("style");

  if (window.mobileStyleInterval) {
    clearInterval(window.mobileStyleInterval);
  }

  tier2.style.background = "";
}

/**
 * Initialize scroll-based animations for tier2 section
 */
function initTier2ScrollAnimations(tier2) {
  if (!tier2) return;

  ensureStickyContainer(tier2);

  const stickyContainer = tier2.querySelector(".project-sticky-container");
  const fadeContainer = tier2.querySelector(".project-fade-container");

  if (!stickyContainer || !fadeContainer) return;

  const introTitle = fadeContainer.querySelector(".project-intro h2");
  const introParagraph = fadeContainer.querySelector(".project-intro p");
  const leftColSections = fadeContainer.querySelectorAll(
    ".project-left-col .tone-section"
  );
  const rightColSections = fadeContainer.querySelectorAll(
    ".project-right-col .tone-section"
  );
  const poster = fadeContainer.querySelector(".project-poster");

  if (introTitle) {
    introTitle.style.transform = "translateX(100%)";
    introTitle.style.opacity = "0";
  }

  if (introParagraph) {
    introParagraph.style.transform = "translateY(30px)";
    introParagraph.style.opacity = "0";
  }

  leftColSections.forEach((section) => {
    section.style.transform = "translateX(-100%)";
    section.style.opacity = "0";
  });

  rightColSections.forEach((section) => {
    section.style.transform = "translateX(100%)";
    section.style.opacity = "0";
  });

  if (poster) {
    poster.style.transform = "scale(0.9)";
    poster.style.opacity = "0";
  }

  const thresholds = [];
  for (let i = 0; i <= 20; i++) {
    thresholds.push(i / 20);
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const progress = entry.intersectionRatio;
        animateTier2Elements(
          progress,
          introTitle,
          introParagraph,
          leftColSections,
          rightColSections,
          poster,
          fadeContainer
        );
      });
    },
    {
      threshold: thresholds,
      rootMargin: "-5% 0px -5% 0px",
    }
  );

  sectionObserver.observe(tier2);
  window.projectScrollObserver = sectionObserver;

  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 767) return;

    const rect = tier2.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const visibleRatio = Math.min(
        Math.max(visibleHeight / rect.height, 0),
        1
      );

      animateTier2Elements(
        visibleRatio,
        introTitle,
        introParagraph,
        leftColSections,
        rightColSections,
        poster,
        fadeContainer
      );
    }
  });
}

/**
 * Apply animations to tier2 elements based on scroll progress
 */
function animateTier2Elements(
  progress,
  introTitle,
  introParagraph,
  leftColSections,
  rightColSections,
  poster,
  fadeContainer
) {
  if (window.innerWidth <= 767) return;

  const titleProgress = Math.max(0, Math.min(1, progress * 2.5));
  const paragraphProgress = Math.max(0, Math.min(1, (progress - 0.1) * 2.5));
  const leftColProgress = Math.max(0, Math.min(1, (progress - 0.15) * 2.5));
  const rightColProgress = Math.max(0, Math.min(1, (progress - 0.2) * 2.5));
  const posterProgress = Math.max(0, Math.min(1, (progress - 0.25) * 2.5));
  const fadeOutProgress = progress < 0.95 ? 1 : 1 - (progress - 0.95) * 20;

  if (fadeContainer) {
    fadeContainer.style.opacity =
      progress < 0.2 ? progress * 5 : fadeOutProgress;
  }

  if (introTitle) {
    const titleX = 100 * (1 - titleProgress);
    introTitle.style.transform = `translateX(${titleX}%)`;
    introTitle.style.opacity = titleProgress;
  }

  if (introParagraph) {
    const paragraphY = 30 * (1 - paragraphProgress);
    introParagraph.style.transform = `translateY(${paragraphY}px)`;
    introParagraph.style.opacity = paragraphProgress;
  }

  // Left column animations (left to right)
  leftColSections.forEach((section, index) => {
    const sectionProgress = Math.max(
      0,
      Math.min(1, leftColProgress - index * 0.05)
    );
    const sectionX = -100 * (1 - sectionProgress);
    section.style.transform = `translateX(${sectionX}%)`;
    section.style.opacity = sectionProgress;
  });

  // Right column animations (right to left)
  rightColSections.forEach((section, index) => {
    const sectionProgress = Math.max(
      0,
      Math.min(1, rightColProgress - index * 0.1)
    );
    const sectionX = 100 * (1 - sectionProgress);
    section.style.transform = `translateX(${sectionX}%)`;
    section.style.opacity = sectionProgress;
  });

  // Poster animation (scale up)
  if (poster) {
    const posterScale = 0.9 + 0.1 * posterProgress;
    poster.style.transform = `scale(${posterScale})`;
    poster.style.opacity = posterProgress;
  }
}

/**
 * Ensure tier2 has a sticky container for animations
 */
function ensureStickyContainer(tier2) {
  if (tier2.querySelector(".project-sticky-container")) return;

  const children = Array.from(tier2.children);
  const stickyContainer = document.createElement("div");
  stickyContainer.className = "project-sticky-container";
  const fadeContainer = document.createElement("div");
  fadeContainer.className = "project-fade-container";

  children.forEach((child) => {
    fadeContainer.appendChild(child);
  });

  stickyContainer.appendChild(fadeContainer);
  tier2.appendChild(stickyContainer);
}

/**
 * Initialize scroll effects for tier1 section elements
 */
function initTier1ScrollEffects(tier1, parallaxBoxes, projectText) {
  if (!tier1) return;

  const sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";
  sentinel.style.cssText =
    "height: 1px; width: 100%; position: absolute; top: 0; left: 0; visibility: hidden;";
  tier1.appendChild(sentinel);

  const thresholds = [];
  for (let i = 0; i <= 20; i++) {
    thresholds.push(i / 20);
  }

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      const tier1Entry = entries.find((entry) => entry.target === tier1);

      if (tier1Entry) {
        const progress = Math.max(0, Math.min(1, tier1Entry.intersectionRatio));
        applyTier1ScrollEffects(progress, parallaxBoxes, projectText);
      }
    },
    {
      threshold: thresholds,
      rootMargin: "-5% 0px -5% 0px",
    }
  );

  scrollObserver.observe(tier1);

  window.addEventListener("scroll", () => {
    const rect = tier1.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const progress = Math.min(Math.max(visibleHeight / rect.height, 0), 1);
      applyTier1ScrollEffects(progress, parallaxBoxes, projectText);
    }
  });
}

/**
 * Apply scroll effects to tier1 elements based on scroll progress
 */
function applyTier1ScrollEffects(progress, parallaxBoxes, projectText) {
  if (!parallaxBoxes.length) return;

  const inCurve = progress * progress;
  const outCurve = progress * (2 - progress);
  const inOutCurve =
    progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

  const opacityBase = Math.min(1, progress * 2);
  const scaleBase = 0.8 + progress * 0.2;

  parallaxBoxes.forEach((box) => {
    if (!box) return;

    const boxIndex = parseInt(box.id.replace("project-img", ""));

    if (boxIndex <= 3) {
      const xOffset =
        boxIndex % 2 === 0 ? (1 - inOutCurve) * -50 : (1 - inOutCurve) * 50;

      box.style.transform = `translateX(${xOffset}px) scale(${scaleBase})`;
      box.style.opacity = opacityBase;
    } else if (boxIndex <= 5) {
      const delayedProgress = Math.max(0, (progress - 0.3) * 1.4);
      const delayedCurve = delayedProgress * delayedProgress;

      box.style.opacity = delayedCurve;
      box.style.transform = `scale(${0.7 + delayedCurve * 0.3})`;
    } else {
      const lateProgress = Math.max(0, (progress - 0.5) * 2);
      const lateOpacity = lateProgress * 1;
      const yOffset = (1 - lateProgress) * 40;

      box.style.opacity = lateOpacity;
      box.style.transform = `translateY(${yOffset}px) scale(${
        0.9 + lateProgress * 0.1
      })`;
    }
  });

  if (projectText) {
    const textProgress = Math.max(0, (progress - 0.2) * 1.25);
    const textOpacity = textProgress;
    const textScale = 0.9 + textProgress * 0.1;
    const floatY = Math.sin(progress * Math.PI) * 10;

    projectText.style.opacity = textOpacity;
    projectText.style.transform = `translateY(${floatY}px) scale(${textScale})`;

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

  const scrollDown2 = document.getElementById("scroll-down2");
  if (scrollDown2) {
    const scrollIndicatorOpacity = progress > 0.7 ? (progress - 0.7) * 3 : 0;
    scrollDown2.style.opacity = scrollIndicatorOpacity;
  }
}

/**
 * Initialize simple parallax effect for project images
 */
function initSimpleParallax() {
  const parallaxBoxes = document.querySelectorAll(".parallax-box");

  parallaxBoxes.forEach((box, index) => {
    box.setAttribute("data-parallax-index", index % 3);

    box.addEventListener("mouseenter", () => {
      box.classList.add("hover");
    });

    box.addEventListener("mouseleave", () => {
      box.classList.remove("hover");
    });

    const image = box.querySelector(".parallax-image");
    if (image) {
      box.addEventListener("mousemove", (e) => {
        if (box.classList.contains("hover")) {
          const rect = box.getBoundingClientRect();
          const xPos = (e.clientX - rect.left) / rect.width - 0.5;
          const yPos = (e.clientY - rect.top) / rect.height - 0.5;
          image.style.transform = `translate(${xPos * 10}px, ${yPos * 10}px)`;
        }
      });
    }
  });
}

/**
 * Initialize project text reveal with animation
 */
function initProjectText() {
  const projectText = document.querySelector(".project-text");

  if (!projectText) return;

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
