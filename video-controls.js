/* --Video Controls--
 * Step 3: Mute + Play/Pause + Seek Bar.
 * Order: [mute] [play/pause] [seek bar]
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

  // --- Build controls bar ---
  var controlsBar = document.createElement("div");
  controlsBar.className = "video-controls-bar";

  // Mute button (leftmost)
  var muteBtn = document.createElement("button");
  muteBtn.className = "video-control-btn video-mute-btn";
  muteBtn.setAttribute("aria-label", "Unmute video");
  muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';

  // Play/pause button (middle)
  var playBtn = document.createElement("button");
  playBtn.className = "video-control-btn video-play-btn";
  playBtn.setAttribute("aria-label", "Pause video");
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';

  // Seek bar (rightmost)
  var seekBar = document.createElement("div");
  seekBar.className = "video-seek-bar";

  var seekTrack = document.createElement("div");
  seekTrack.className = "video-seek-track";

  var seekFill = document.createElement("div");
  seekFill.className = "video-seek-fill";

  var seekThumb = document.createElement("div");
  seekThumb.className = "video-seek-thumb";

  seekFill.appendChild(seekThumb);
  seekTrack.appendChild(seekFill);
  seekBar.appendChild(seekTrack);

  controlsBar.appendChild(muteBtn);
  controlsBar.appendChild(playBtn);
  controlsBar.appendChild(seekBar);
  banner.appendChild(controlsBar);

  // --- State ---
  var muted = true;
  var paused = false;
  var dragging = false;
  var wasPlayingBeforeDrag = false;
  var rafId = null;

  // --- Mute ---
  function applyMute() {
    muted = true;
    video.muted = true;
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    muteBtn.setAttribute("aria-label", "Unmute video");
  }

  function updateMuteIcon() {
    muteBtn.innerHTML = muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    muteBtn.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
  }

  muteBtn.addEventListener("click", function () {
    muted = !muted;
    video.muted = muted;
    updateMuteIcon();
  });

  // --- Play/Pause ---
  function applyPlayback() {
    paused = false;
    video.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.setAttribute("aria-label", "Pause video");
  }

  function updatePlayIcon() {
    playBtn.innerHTML = paused
      ? '<i class="fas fa-play"></i>'
      : '<i class="fas fa-pause"></i>';
    playBtn.setAttribute("aria-label", paused ? "Play video" : "Pause video");
  }

  playBtn.addEventListener("click", function () {
    paused = !paused;
    if (paused) {
      video.pause();
    } else {
      video.play();
    }
    updatePlayIcon();
  });

  // --- Seek bar: progress loop ---
  function updateSeekBar() {
    if (!dragging && video.duration) {
      var pct = (video.currentTime / video.duration) * 100;
      seekFill.style.width = pct + "%";
    }
    rafId = requestAnimationFrame(updateSeekBar);
  }

  // --- Seek bar: resolve position from pointer/mouse event ---
  function getPct(e) {
    var rect = seekTrack.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var pct = (clientX - rect.left) / rect.width;
    return Math.min(Math.max(pct, 0), 1);
  }

  function seekTo(pct) {
    if (video.duration) {
      video.currentTime = pct * video.duration;
      seekFill.style.width = pct * 100 + "%";
    }
  }

  // --- Seek bar: mouse events ---
  seekTrack.addEventListener("mousedown", function (e) {
    dragging = true;
    wasPlayingBeforeDrag = !paused;
    video.pause();
    seekTo(getPct(e));

    function onMouseMove(e) {
      if (dragging) seekTo(getPct(e));
    }

    function onMouseUp(e) {
      seekTo(getPct(e));
      dragging = false;
      if (wasPlayingBeforeDrag) {
        video.play();
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // --- Seek bar: touch events ---
  seekTrack.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      dragging = true;
      wasPlayingBeforeDrag = !paused;
      video.pause();
      seekTo(getPct(e));

      function onTouchMove(e) {
        e.preventDefault();
        if (dragging) seekTo(getPct(e));
      }

      function onTouchEnd(e) {
        dragging = false;
        if (wasPlayingBeforeDrag) {
          video.play();
        }
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
      }

      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd);
    },
    { passive: false },
  );

  // --- Full reset ---
  function resetControls() {
    applyMute();
    applyPlayback();
    dragging = false;
    video.currentTime = 0;
    seekFill.style.width = "0%";
  }

  // --- Show/hide via MutationObserver ---
  var revealObserver = new MutationObserver(function () {
    if (videoContainer.classList.contains("video-revealed")) {
      controlsBar.classList.add("active");
      rafId = requestAnimationFrame(updateSeekBar);
    } else {
      controlsBar.classList.remove("active");
      resetControls();
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  });

  revealObserver.observe(videoContainer, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // --- Reset triggers ---
  var menuBtn = document.getElementById("menu-circle");
  if (menuBtn) menuBtn.addEventListener("click", resetControls);

  var navLinks = document.querySelectorAll(".nav-links li a");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", resetControls);
  }

  var dots = document.querySelectorAll(".indicator-dot");
  for (var j = 0; j < dots.length; j++) {
    dots[j].addEventListener("click", resetControls);
  }

  var scrollDown = document.querySelector(".scroll-down");
  if (scrollDown) scrollDown.addEventListener("click", resetControls);

  var homeSection = document.getElementById("home");
  if (homeSection) {
    var homeObserver = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) resetControls();
      },
      { threshold: 0.4 },
    );
    homeObserver.observe(homeSection);
  }
}

export { initVideoControls };
