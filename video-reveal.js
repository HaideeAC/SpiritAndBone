/*
Video reveal effects for Spirit&Bone
May need work on mobile - TODO: test on iPhone
*/

function initVideoReveal() {
  // grab elements
  var ampDesktop = document.querySelector(".tittleY");
  var ampMobile = document.querySelector(".vertical-amp");
  var titleDesktop = document.querySelector(".desktop-title");
  var titleMobile = document.querySelector(".mobile-title");
  var videoBox = document.querySelector(".video-container");
  var bannerArea = document.querySelector(".banner");

  if (!videoBox || !bannerArea) {
    console.warn("Missing video elements - skipping video reveal setup");
    return;
  }

  // make close button
  var closeBtn = makeCloseButton(bannerArea);

  // add animation styles
  addAnimationStyles();

  // show video and animate
  function showVideo() {
    // animate SVG masks
    if (titleDesktop) titleDesktop.classList.add("video-reveal-active");
    if (titleMobile) titleMobile.classList.add("video-reveal-active");

    // show video
    videoBox.classList.add("video-revealed");

    // figure out which ampersand to animate based on screen size
    var isDesktopSize = window.innerWidth > 768;
    var targetAmp = isDesktopSize ? ampDesktop : ampMobile;

    // grow ampersand
    if (targetAmp) {
      targetAmp.classList.add("amp-grow-animation");
    }

    // show close button
    setTimeout(function () {
      closeBtn.style.display = "block";
      requestAnimationFrame(function () {
        closeBtn.classList.add("active");
      });
    }, 400);
  }

  // hide video and reset animations
  function hideVideo() {
    // add fade-in class to masks
    if (titleDesktop) {
      titleDesktop.classList.add("mask-fade-in");
      titleDesktop.classList.remove("video-reveal-active");
    }

    if (titleMobile) {
      titleMobile.classList.add("mask-fade-in");
      titleMobile.classList.remove("video-reveal-active");
    }

    // fade out video
    videoBox.classList.add("video-fade-out");
    videoBox.classList.remove("video-revealed");

    // reset ampersand animations
    if (ampDesktop) ampDesktop.classList.remove("amp-grow-animation");
    if (ampMobile) ampMobile.classList.remove("amp-grow-animation");

    // hide close button
    closeBtn.classList.remove("active");

    // cleanup classes after animation finishes
    setTimeout(function () {
      closeBtn.style.display = "none";

      // remove fade classes
      if (titleDesktop) titleDesktop.classList.remove("mask-fade-in");
      if (titleMobile) titleMobile.classList.remove("mask-fade-in");
      videoBox.classList.remove("video-fade-out");
    }, 600); // roughly match animation timing
  }

  // click handlers for ampersands
  if (ampDesktop) {
    ampDesktop.style.cursor = "pointer";
    ampDesktop.setAttribute("aria-label", "Reveal video");
    ampDesktop.addEventListener("click", showVideo);
  }

  if (ampMobile) {
    ampMobile.style.cursor = "pointer";
    ampMobile.setAttribute("aria-label", "Reveal video");
    ampMobile.addEventListener("click", showVideo);
  }

  // close button click
  closeBtn.addEventListener("click", hideVideo);

  // escape key closes video
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && videoBox.classList.contains("video-revealed")) {
      hideVideo();
    }
  });
}

// makes the close button
function makeCloseButton(parent) {
  var btn = document.createElement("div");
  btn.className = "close-video";
  btn.innerHTML = '<div class="close-icon"></div>';
  btn.style.display = "none";

  // accessibility
  btn.setAttribute("aria-label", "Close video");
  btn.setAttribute("role", "button");
  btn.setAttribute("tabindex", "0");

  // add to parent element
  parent.appendChild(btn);

  // keyboard handler
  btn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });

  return btn;
}

// add fade animation styles to page
function addAnimationStyles() {
  // check if styles already exist
  var styleTag = document.getElementById("video-reveal-styles");

  // create if needed
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "video-reveal-styles";
    document.head.appendChild(styleTag);
  }

  // add animation rules
  styleTag.textContent = `
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
