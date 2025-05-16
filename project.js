/* ---project section--- */

function initProjectParallax() {
  var container = document.querySelector(".project-container");
  var scrollIndicator = document.getElementById("scroll-down2");
  var sectionTier1 = document.querySelector(".tier1");
  var sectionTier2 = document.querySelector(".tier2");
  var imageBoxes = document.querySelectorAll(".parallax-box");
  var projectDesc = document.querySelector(".project-text");

  if (!container) return;

  // Fade in container
  setTimeout(function () {
    container.classList.add("visible");
  }, 300);

  // Scroll down to tier2 when clicking arrow
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", function () {
      if (sectionTier2) {
        sectionTier2.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Mobile or desktop layout?
  if (window.innerWidth <= 767) {
    makeMobileLayout(sectionTier2);
  } else {
    setupDesktopEffects(sectionTier2);
  }

  // Setup various effects
  setupTier1Effects(sectionTier1, imageBoxes, projectDesc);
  setupSimpleParallax();
  setupTextReveal();
  addPosterHoverEffect();

  // Handle resize between mobile/desktop
  window.addEventListener("resize", function () {
    if (
      window.innerWidth <= 767 &&
      !document.body.classList.contains("mobile-layout-applied")
    ) {
      makeMobileLayout(sectionTier2);
      document.body.classList.add("mobile-layout-applied");
      document.body.classList.remove("desktop-layout-applied");
    } else if (
      window.innerWidth > 767 &&
      !document.body.classList.contains("desktop-layout-applied")
    ) {
      resetToDesktop(sectionTier2);
      setupDesktopEffects(sectionTier2);
      document.body.classList.add("desktop-layout-applied");
      document.body.classList.remove("mobile-layout-applied");
    }
  });
}

/**
 * Mobile layout for project section
 */
function makeMobileLayout(tier2) {
  if (!tier2) return;

  // Mark as mobile
  document.body.classList.add("mobile-layout-applied");
  document.body.classList.remove("desktop-layout-applied");

  var fadeContainer = document.querySelector(".project-fade-container");
  var title = document.querySelector(".project-intro h2");
  var paragraph = document.querySelector(".project-intro p");
  var poster = document.querySelector(".project-poster");
  var toneSections = document.querySelectorAll(".tone-section");

  // Ensure fade container is visible
  if (fadeContainer) {
    fadeContainer.style.opacity = "1";
    fadeContainer.style.transition = "none";
  }

  // Style all tone sections
  for (var i = 0; i < toneSections.length; i++) {
    var section = toneSections[i];
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
  }

  // Title and paragraph visible
  if (title) {
    title.style.opacity = "1";
    title.style.transform = "none";
  }

  if (paragraph) {
    paragraph.style.opacity = "1";
    paragraph.style.transform = "none";
  }

  // Show poster
  if (poster) {
    poster.style.opacity = "1";
    poster.style.transform = "scale(1)";
  }

  // Make tier2 regular flow not sticky
  tier2.style.height = "auto";
  tier2.style.minHeight = "auto";

  var stickyContainer = tier2.querySelector(".project-sticky-container");
  if (stickyContainer) {
    stickyContainer.style.position = "relative";
    stickyContainer.style.height = "auto";
    stickyContainer.style.overflow = "visible";
  }

  // Layout grid for mobile
  var contentGrid = document.querySelector(".project-content-grid");
  if (contentGrid) {
    contentGrid.style.gridTemplateColumns = "1fr";
    contentGrid.style.width = "90%";
    contentGrid.style.margin = "0 auto";

    var leftCol = document.querySelector(".project-left-col");
    var rightCol = document.querySelector(".project-right-col");

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

  // Add mobile styles for small screens
  var styleTag = document.createElement("style");
  styleTag.id = "mobile-project-styles";
  styleTag.textContent = `
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
    document.head.appendChild(styleTag);
  }

  // Add dark gradient background
  tier2.style.background =
    "linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.9) 100%)";

  // Disconnect any scroll observers
  if (window.projectScrollObserver) {
    window.projectScrollObserver.disconnect();
  }

  // Force mobile styles with interval
  var styleFixInterval = setInterval(function () {
    if (window.innerWidth <= 767) {
      for (var i = 0; i < toneSections.length; i++) {
        if (toneSections[i].style.opacity !== "1") {
          toneSections[i].style.opacity = "1";
        }
      }

      if (fadeContainer && fadeContainer.style.opacity !== "1") {
        fadeContainer.style.opacity = "1";
      }
    } else {
      clearInterval(styleFixInterval);
    }
  }, 500);

  window.mobileStyleInterval = styleFixInterval;
}

// Reset to desktop layout
function resetToDesktop(tier2) {
  if (!tier2) return;

  // Remove mobile styles from sections
  var mobileStyled = document.querySelectorAll(".mobile-tone-section");
  for (var i = 0; i < mobileStyled.length; i++) {
    mobileStyled[i].classList.remove("mobile-tone-section");
    mobileStyled[i].removeAttribute("style");
  }

  // Reset containers
  var fadeContainer = document.querySelector(".project-fade-container");
  if (fadeContainer) {
    fadeContainer.removeAttribute("style");
  }

  var stickyContainer = tier2.querySelector(".project-sticky-container");
  if (stickyContainer) {
    stickyContainer.removeAttribute("style");
  }

  var contentGrid = document.querySelector(".project-content-grid");
  if (contentGrid) {
    contentGrid.removeAttribute("style");
  }

  // Clear columns and poster
  var leftCol = document.querySelector(".project-left-col");
  var rightCol = document.querySelector(".project-right-col");
  var poster = document.querySelector(".project-poster");

  if (leftCol) leftCol.removeAttribute("style");
  if (rightCol) rightCol.removeAttribute("style");
  if (poster) poster.removeAttribute("style");

  // Clear style interval
  if (window.mobileStyleInterval) {
    clearInterval(window.mobileStyleInterval);
  }

  // Clear background
  tier2.style.background = "";
}

// Setup scroll animations for tier2
function setupDesktopEffects(tier2) {
  if (!tier2) return;

  // Make sure container exists
  ensureStickySetup(tier2);

  var stickyContainer = tier2.querySelector(".project-sticky-container");
  var fadeContainer = tier2.querySelector(".project-fade-container");

  if (!stickyContainer || !fadeContainer) return;

  // Get elements to animate
  var introTitle = fadeContainer.querySelector(".project-intro h2");
  var introParagraph = fadeContainer.querySelector(".project-intro p");
  var leftSections = fadeContainer.querySelectorAll(
    ".project-left-col .tone-section"
  );
  var rightSections = fadeContainer.querySelectorAll(
    ".project-right-col .tone-section"
  );
  var poster = fadeContainer.querySelector(".project-poster");

  // Set initial state
  if (introTitle) {
    introTitle.style.transform = "translateX(100%)";
    introTitle.style.opacity = "0";
  }

  if (introParagraph) {
    introParagraph.style.transform = "translateY(30px)";
    introParagraph.style.opacity = "0";
  }

  // Hide sections offscreen
  for (var i = 0; i < leftSections.length; i++) {
    leftSections[i].style.transform = "translateX(-100%)";
    leftSections[i].style.opacity = "0";
  }

  for (var j = 0; j < rightSections.length; j++) {
    rightSections[j].style.transform = "translateX(100%)";
    rightSections[j].style.opacity = "0";
  }

  if (poster) {
    poster.style.transform = "scale(0.9)";
    poster.style.opacity = "0";
  }

  // Create detailed thresholds
  var thresholds = [];
  for (var t = 0; t <= 20; t++) {
    thresholds.push(t / 20);
  }

  // Set up scroll watcher
  var watchScroll = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var progress = entry.intersectionRatio;
        animateTier2Stuff(
          progress,
          introTitle,
          introParagraph,
          leftSections,
          rightSections,
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

  watchScroll.observe(tier2);
  window.projectScrollObserver = watchScroll;

  // Also watch scroll directly for smoother animations
  window.addEventListener("scroll", function () {
    if (window.innerWidth <= 767) return;

    var rect = tier2.getBoundingClientRect();
    var windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      var visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      var visibleRatio = Math.min(Math.max(visibleHeight / rect.height, 0), 1);

      animateTier2Stuff(
        visibleRatio,
        introTitle,
        introParagraph,
        leftSections,
        rightSections,
        poster,
        fadeContainer
      );
    }
  });
}

// Animate tier2 elements based on scroll
function animateTier2Stuff(
  progress,
  introTitle,
  introParagraph,
  leftSections,
  rightSections,
  poster,
  fadeContainer
) {
  // Skip if mobile
  if (window.innerWidth <= 767) return;

  // Calculate progress values for different elements with offsets
  var titleProgress = Math.max(0, Math.min(1, progress * 2.5));
  var paragraphProgress = Math.max(0, Math.min(1, (progress - 0.1) * 2.5));
  var leftColProgress = Math.max(0, Math.min(1, (progress - 0.15) * 2.5));
  var rightColProgress = Math.max(0, Math.min(1, (progress - 0.2) * 2.5));
  var posterProgress = Math.max(0, Math.min(1, (progress - 0.25) * 2.5));

  // Fade out at end
  var fadeOutProgress = progress < 0.95 ? 1 : 1 - (progress - 0.95) * 20;

  // Apply fade to container
  if (fadeContainer) {
    fadeContainer.style.opacity =
      progress < 0.2 ? progress * 5 : fadeOutProgress;
  }

  // Title animation
  if (introTitle) {
    var titleX = 100 * (1 - titleProgress);
    introTitle.style.transform = "translateX(" + titleX + "%)";
    introTitle.style.opacity = titleProgress;
  }

  // Paragraph animation
  if (introParagraph) {
    var paragraphY = 30 * (1 - paragraphProgress);
    introParagraph.style.transform = "translateY(" + paragraphY + "px)";
    introParagraph.style.opacity = paragraphProgress;
  }

  // Left sections animation
  for (var i = 0; i < leftSections.length; i++) {
    var sectionProgress = Math.max(0, Math.min(1, leftColProgress - i * 0.05));
    var sectionX = -100 * (1 - sectionProgress);
    leftSections[i].style.transform = "translateX(" + sectionX + "%)";
    leftSections[i].style.opacity = sectionProgress;
  }

  // Right sections animation
  for (var j = 0; j < rightSections.length; j++) {
    var rightSectionProgress = Math.max(
      0,
      Math.min(1, rightColProgress - j * 0.1)
    );
    var rightSectionX = 100 * (1 - rightSectionProgress);
    rightSections[j].style.transform = "translateX(" + rightSectionX + "%)";
    rightSections[j].style.opacity = rightSectionProgress;
  }

  // Poster animation
  if (poster) {
    var posterScale = 0.9 + 0.1 * posterProgress;
    poster.style.transform = "scale(" + posterScale + ")";
    poster.style.opacity = posterProgress;
  }
}

// Make sure tier2 has needed container structure
function ensureStickySetup(tier2) {
  // Skip if already has container
  if (tier2.querySelector(".project-sticky-container")) return;

  // Collect children
  var kids = Array.from(tier2.children);

  // Create containers
  var stickyBox = document.createElement("div");
  stickyBox.className = "project-sticky-container";

  var fadeBox = document.createElement("div");
  fadeBox.className = "project-fade-container";

  // Move all children inside fade container
  kids.forEach(function (kid) {
    fadeBox.appendChild(kid);
  });

  // Nest containers and add to tier2
  stickyBox.appendChild(fadeBox);
  tier2.appendChild(stickyBox);
}

// Setup effects for tier1 section
function setupTier1Effects(tier1, parallaxBoxes, projectText) {
  if (!tier1) return;

  // Create sentinel for visibility detection
  var sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";
  sentinel.style.cssText =
    "height: 1px; width: 100%; position: absolute; top: 0; left: 0; visibility: hidden;";
  tier1.appendChild(sentinel);

  // Create thresholds for smoother animation
  var thresholds = [];
  for (var i = 0; i <= 20; i++) {
    thresholds.push(i / 20);
  }

  // Watch for tier1 scrolling
  var scrollWatcher = new IntersectionObserver(
    function (entries) {
      var tier1Entry = entries.find(function (entry) {
        return entry.target === tier1;
      });

      if (tier1Entry) {
        var progress = Math.max(0, Math.min(1, tier1Entry.intersectionRatio));
        applyTier1ScrollEffects(progress, parallaxBoxes, projectText);
      }
    },
    {
      threshold: thresholds,
      rootMargin: "-5% 0px -5% 0px",
    }
  );

  scrollWatcher.observe(tier1);

  // Direct scroll listener for smoother animation
  window.addEventListener("scroll", function () {
    var rect = tier1.getBoundingClientRect();
    var windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      var visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      var progress = Math.min(Math.max(visibleHeight / rect.height, 0), 1);
      applyTier1ScrollEffects(progress, parallaxBoxes, projectText);
    }
  });
}

// Apply scroll effects to tier1
function applyTier1ScrollEffects(progress, parallaxBoxes, projectText) {
  if (!parallaxBoxes.length) return;

  // Different easing curves
  var inCurve = progress * progress;
  var outCurve = progress * (2 - progress);
  var inOutCurve =
    progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

  // Base values
  var opacityBase = Math.min(1, progress * 2);
  var scaleBase = 0.8 + progress * 0.2;

  // Apply to each box
  for (var i = 0; i < parallaxBoxes.length; i++) {
    var box = parallaxBoxes[i];
    if (!box) continue;

    // Get index from ID
    var boxId = box.id;
    var boxIndex = parseInt(boxId.replace("project-img", ""));

    // Different animation based on box position
    if (boxIndex <= 3) {
      // First group of images
      var xOffset =
        boxIndex % 2 === 0 ? (1 - inOutCurve) * -50 : (1 - inOutCurve) * 50;

      box.style.transform =
        "translateX(" + xOffset + "px) scale(" + scaleBase + ")";
      box.style.opacity = opacityBase;
    } else if (boxIndex <= 5) {
      // Second group of images
      var delayedProgress = Math.max(0, (progress - 0.3) * 1.4);
      var delayedCurve = delayedProgress * delayedProgress;

      box.style.opacity = delayedCurve;
      box.style.transform = "scale(" + (0.7 + delayedCurve * 0.3) + ")";
    } else {
      // Last group of images
      var lateProgress = Math.max(0, (progress - 0.5) * 2);
      var lateOpacity = lateProgress * 1;
      var yOffset = (1 - lateProgress) * 40;

      box.style.opacity = lateOpacity;
      box.style.transform =
        "translateY(" +
        yOffset +
        "px) scale(" +
        (0.9 + lateProgress * 0.1) +
        ")";
    }
  }

  // Project text animation
  if (projectText) {
    var textProgress = Math.max(0, (progress - 0.2) * 1.25);
    var textOpacity = textProgress;
    var textScale = 0.9 + textProgress * 0.1;
    var floatY = Math.sin(progress * Math.PI) * 10;

    projectText.style.opacity = textOpacity;
    projectText.style.transform =
      "translateY(" + floatY + "px) scale(" + textScale + ")";

    // Add/remove revealed class
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

  // Scroll indicator opacity
  var scrollIndicator = document.getElementById("scroll-down2");
  if (scrollIndicator) {
    var indicatorOpacity = progress > 0.7 ? (progress - 0.7) * 3 : 0;
    scrollIndicator.style.opacity = indicatorOpacity;
  }
}

// Setup simple mouse-based parallax
function setupSimpleParallax() {
  var boxes = document.querySelectorAll(".parallax-box");

  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    box.setAttribute("data-parallax-index", i % 3);

    // Hover state
    box.addEventListener("mouseenter", function () {
      this.classList.add("hover");
    });

    box.addEventListener("mouseleave", function () {
      this.classList.remove("hover");
    });

    // Mouse move parallax
    var image = box.querySelector(".parallax-image");
    if (image) {
      box.addEventListener("mousemove", function (e) {
        if (this.classList.contains("hover")) {
          var rect = this.getBoundingClientRect();
          var xPos = (e.clientX - rect.left) / rect.width - 0.5;
          var yPos = (e.clientY - rect.top) / rect.height - 0.5;

          var img = this.querySelector(".parallax-image");
          if (img) {
            img.style.transform =
              "translate(" + xPos * 10 + "px, " + yPos * 10 + "px)";
          }
        }
      });
    }
  }
}

// Setup project text reveal animation
function setupTextReveal() {
  var projectText = document.querySelector(".project-text");

  if (!projectText) return;

  // Watch for text becoming visible
  var watcher = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        projectText.classList.add("text-revealed");
        watcher.unobserve(projectText);
      }
    },
    { threshold: 0.3 }
  );

  watcher.observe(projectText);
}

// Add hover effect to poster
function addPosterHoverEffect() {
  var poster = document.querySelector(".project-poster img");

  if (!poster) return;

  poster.addEventListener("mouseenter", function () {
    this.classList.add("hover");
  });

  poster.addEventListener("mouseleave", function () {
    this.classList.remove("hover");
  });
}

// Export init function
export { initProjectParallax };
