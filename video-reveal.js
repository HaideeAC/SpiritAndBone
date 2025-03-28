/**
 * Spirit&Bone - Video Reveal Module
 * Optimized version with direct element references and improved transitions
 */

// Initialize video reveal functionality
function initVideoReveal() {
  // Get direct references to essential elements
  const desktopAmp = document.querySelector(".tittleY");
  const mobileAmp = document.querySelector(".vertical-amp");
  const desktopTitle = document.querySelector(".desktop-title");
  const mobileTitle = document.querySelector(".mobile-title");
  const videoContainer = document.querySelector(".video-container");
  const homeBanner = document.querySelector(".banner");

  // Exit early if essential elements don't exist
  if (!videoContainer || !homeBanner) {
    console.warn("Video reveal elements not found in the document.");
    return;
  }

  // Create close button element and append to banner
  const closeVideoBtn = createCloseButton(homeBanner);

  // Function to reveal video when ampersand is clicked
  function revealVideo() {
    // Apply transformations to reveal video
    desktopTitle?.classList.add("video-reveal-active");
    mobileTitle?.classList.add("video-reveal-active");
    videoContainer.classList.add("video-revealed");

    // Apply animation to the ampersand that was clicked
    // Using responsive layout detection directly in the event
    const isDesktop = window.innerWidth > 768;
    const targetAmp = isDesktop ? desktopAmp : mobileAmp;

    if (targetAmp) {
      targetAmp.classList.add("amp-grow-animation");
    }

    // Show close button with short delay for better UX
    setTimeout(() => {
      closeVideoBtn.style.display = "block";
      requestAnimationFrame(() => {
        closeVideoBtn.classList.add("active");
      });
    }, 400);
  }

  // Function to hide video and return to title
  function hideVideo() {
    // Remove transformations
    desktopTitle?.classList.remove("video-reveal-active");
    mobileTitle?.classList.remove("video-reveal-active");
    videoContainer.classList.remove("video-revealed");

    // Reset animations on both ampersands to ensure proper state
    desktopAmp?.classList.remove("amp-grow-animation");
    mobileAmp?.classList.remove("amp-grow-animation");

    // Hide close button with transition
    closeVideoBtn.classList.remove("active");
    setTimeout(() => {
      closeVideoBtn.style.display = "none";
    }, 300);
  }

  // Set up event listeners
  if (desktopAmp) {
    desktopAmp.style.cursor = "pointer";
    desktopAmp.setAttribute("aria-label", "Reveal video");
    desktopAmp.addEventListener("click", revealVideo);
  }

  if (mobileAmp) {
    mobileAmp.style.cursor = "pointer";
    mobileAmp.setAttribute("aria-label", "Reveal video");
    mobileAmp.addEventListener("click", revealVideo);
  }

  // Add click event to close button
  closeVideoBtn.addEventListener("click", hideVideo);

  // Add keyboard support for accessibility
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      videoContainer.classList.contains("video-revealed")
    ) {
      hideVideo();
    }
  });
}

/**
 * Creates the close button element
 * @param {HTMLElement} parent - Parent element to append button to
 * @returns {HTMLElement} The created close button
 */
function createCloseButton(parent) {
  const btn = document.createElement("div");
  btn.className = "close-video";
  btn.innerHTML = '<div class="close-icon"></div>';
  btn.style.display = "none";
  btn.setAttribute("aria-label", "Close video");
  btn.setAttribute("role", "button");
  btn.setAttribute("tabindex", "0");
  parent.appendChild(btn);

  // Add keyboard support
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });

  return btn;
}

// Export the initialization function
export { initVideoReveal };
