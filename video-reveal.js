/**
 * Spirit&Bone - Video Reveal Module
 * Handles the video reveal functionality when clicking the ampersand symbol
 */

// Initialize video reveal functionality
function initVideoReveal() {
  // Get references to elements
  const ampSymbol = document.querySelector(".tittleY");
  const mobileAmpSymbol = document.querySelector(".vertical-amp");
  const desktopTitle = document.querySelector(".desktop-title");
  const mobileTitle = document.querySelector(".mobile-title");
  const videoContainer = document.querySelector(".video-container");
  const homeBanner = document.querySelector(".banner");

  // If key elements don't exist, exit early
  if (!videoContainer || !homeBanner) {
    return;
  }

  // Create close button element (will be hidden initially)
  const closeVideoBtn = document.createElement("div");
  closeVideoBtn.className = "close-video";
  closeVideoBtn.innerHTML = '<div class="close-icon"></div>';
  closeVideoBtn.style.display = "none";
  homeBanner.appendChild(closeVideoBtn);

  // Function to get the target ampersand based on screen size
  function getTargetAmp() {
    return window.innerWidth > 768 ? ampSymbol : mobileAmpSymbol;
  }

  // Function to reveal video
  function revealVideo() {
    // Add classes to transform the masks
    if (desktopTitle) desktopTitle.classList.add("video-reveal-active");
    if (mobileTitle) mobileTitle.classList.add("video-reveal-active");
    videoContainer.classList.add("video-revealed");

    // Get the correct ampersand and animate it
    const targetAmp = getTargetAmp();
    if (targetAmp) {
      // Add the animation class
      targetAmp.classList.add("amp-grow-animation");
    }

    // Show the close button after a short delay
    setTimeout(() => {
      closeVideoBtn.style.display = "block";
      setTimeout(() => {
        closeVideoBtn.classList.add("active");
      }, 50);
    }, 700);
  }

  // Function to hide video and return to title
  function hideVideo() {
    // Remove transform classes
    if (desktopTitle) desktopTitle.classList.remove("video-reveal-active");
    if (mobileTitle) mobileTitle.classList.remove("video-reveal-active");
    videoContainer.classList.remove("video-revealed");

    // Get the correct ampersand
    const targetAmp = getTargetAmp();
    if (targetAmp) {
      // Reset CSS animation class
      targetAmp.classList.remove("amp-grow-animation");
    }

    // Hide the close button
    closeVideoBtn.classList.remove("active");
    setTimeout(() => {
      closeVideoBtn.style.display = "none";
    }, 500);
  }

  // Add click events to both ampersand symbols
  if (ampSymbol) {
    ampSymbol.style.cursor = "pointer";
    ampSymbol.addEventListener("click", revealVideo);
  }

  if (mobileAmpSymbol) {
    mobileAmpSymbol.style.cursor = "pointer";
    mobileAmpSymbol.addEventListener("click", revealVideo);
  }

  // Add click event to close button
  closeVideoBtn.addEventListener("click", hideVideo);
}

// Export the initialization function
export { initVideoReveal };
