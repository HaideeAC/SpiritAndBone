/* --Video Controls--
 * Step 1: Mute/unmute only.
 * Detects reveal state via MutationObserver — does not touch video-reveal.js.
 */

function initVideoControls() {
  var video = document.getElementById("video-bg");
  var videoContainer = document.querySelector(".video-container");
  var banner = document.querySelector(".banner");

  if (!video || !videoContainer || !banner) {
    console.warn("video-controls: missing elements, skipping.");
    return;
  }

  // --- Build the controls bar ---
  var controlsBar = document.createElement("div");
  controlsBar.className = "video-controls-bar";

  var muteBtn = document.createElement("button");
  muteBtn.className = "video-control-btn video-mute-btn";
  muteBtn.setAttribute("aria-label", "Unmute video");
  muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';

  controlsBar.appendChild(muteBtn);
  banner.appendChild(controlsBar);

  // --- State ---
  var muted = true; // mirrors video's default muted state

  function applyMute() {
    muted = true;
    video.muted = true;
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    muteBtn.setAttribute("aria-label", "Unmute video");
  }

  function updateIcon() {
    muteBtn.innerHTML = muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    muteBtn.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
  }

  muteBtn.addEventListener("click", function () {
    muted = !muted;
    video.muted = muted;
    updateIcon();
  });

  // --- Show/hide bar via MutationObserver ---
  // Watches .video-container for class changes — never touches video-reveal.js
  var revealObserver = new MutationObserver(function () {
    if (videoContainer.classList.contains("video-revealed")) {
      controlsBar.classList.add("active");
    } else {
      controlsBar.classList.remove("active");
      applyMute(); // reset to muted when video closes
    }
  });

  revealObserver.observe(videoContainer, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // --- Reset triggers ---
  // All just call applyMute() — no interference with existing handlers

  // Menu button opens
  var menuBtn = document.getElementById("menu-circle");
  if (menuBtn) {
    menuBtn.addEventListener("click", applyMute);
  }

  // Nav links (section navigation)
  var navLinks = document.querySelectorAll(".nav-links li a");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", applyMute);
  }

  // Side indicator dots
  var dots = document.querySelectorAll(".indicator-dot");
  for (var j = 0; j < dots.length; j++) {
    dots[j].addEventListener("click", applyMute);
  }

  // Bouncy scroll-down arrow
  var scrollDown = document.querySelector(".scroll-down");
  if (scrollDown) {
    scrollDown.addEventListener("click", applyMute);
  }

  // Scrolling out of #home
  var homeSection = document.getElementById("home");
  if (homeSection) {
    var homeObserver = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) {
          applyMute();
        }
      },
      { threshold: 0.4 },
    );
    homeObserver.observe(homeSection);
  }
}

export { initVideoControls };
