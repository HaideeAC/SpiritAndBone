/*Video Reveal*/

function initVideoReveal() {
  const desktopAmp = document.querySelector(".tittleY");
  const mobileAmp = document.querySelector(".vertical-amp");
  const desktopTitle = document.querySelector(".desktop-title");
  const mobileTitle = document.querySelector(".mobile-title");
  const videoContainer = document.querySelector(".video-container");
  const homeBanner = document.querySelector(".banner");

  if (!videoContainer || !homeBanner) {
    console.warn("Video reveal elements not found in the document.");
    return;
  }

  const closeVideoBtn = createCloseButton(homeBanner);

  addFadeAnimationStyles();

  function revealVideo() {
    desktopTitle?.classList.add("video-reveal-active");
    mobileTitle?.classList.add("video-reveal-active");
    videoContainer.classList.add("video-revealed");

    const isDesktop = window.innerWidth > 768;
    const targetAmp = isDesktop ? desktopAmp : mobileAmp;

    if (targetAmp) {
      targetAmp.classList.add("amp-grow-animation");
    }

    setTimeout(() => {
      closeVideoBtn.style.display = "block";
      requestAnimationFrame(() => {
        closeVideoBtn.classList.add("active");
      });
    }, 400);
  }

  function hideVideo() {
    if (desktopTitle) {
      desktopTitle.classList.add("mask-fade-in");
      desktopTitle.classList.remove("video-reveal-active");
    }

    if (mobileTitle) {
      mobileTitle.classList.add("mask-fade-in");
      mobileTitle.classList.remove("video-reveal-active");
    }

    videoContainer.classList.add("video-fade-out");
    videoContainer.classList.remove("video-revealed");

    desktopAmp?.classList.remove("amp-grow-animation");
    mobileAmp?.classList.remove("amp-grow-animation");

    closeVideoBtn.classList.remove("active");
    setTimeout(() => {
      closeVideoBtn.style.display = "none";

      desktopTitle?.classList.remove("mask-fade-in");
      mobileTitle?.classList.remove("mask-fade-in");
      videoContainer.classList.remove("video-fade-out");
    }, 600); // Match this with the animation duration
  }

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

  closeVideoBtn.addEventListener("click", hideVideo);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      videoContainer.classList.contains("video-revealed")
    ) {
      hideVideo();
    }
  });
}

function createCloseButton(parent) {
  const btn = document.createElement("div");
  btn.className = "close-video";
  btn.innerHTML = '<div class="close-icon"></div>';
  btn.style.display = "none";
  btn.setAttribute("aria-label", "Close video");
  btn.setAttribute("role", "button");
  btn.setAttribute("tabindex", "0");
  parent.appendChild(btn);

  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });

  return btn;
}

function addFadeAnimationStyles() {
  let styleElement = document.getElementById("video-reveal-styles");

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "video-reveal-styles";
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = `
    @keyframes fade-out {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    
    .mask-fade-in {
      animation: fade-out 0.6s ease-out;
      animation-direction: reverse;
    }
    
    .video-fade-out {
      animation: fade-out 0.6s ease-out forwards;
    }
  `;
}

export { initVideoReveal };
