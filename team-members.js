/* ---Team section---
 * Known issues: mobile rotation sometimes sticks
 */

// main init for team section
function initTeamSection() {
  // get elements from page
  var teamMembers = document.querySelectorAll(".team-member");
  var teamBox = document.querySelector(".team-container");
  var teamSection = document.getElementById("team");
  var pandeiro = document.getElementById("member10");

  // bail if missing key elements
  if (!teamMembers.length || !teamBox || !teamSection || !pandeiro) {
    console.warn("Missing team elements, skipping...");
    return;
  }

  // setup the audio interaction for pandeiro
  setupPandeiroAudio();

  // setup core member interactions
  setupTeamMembers(teamMembers);

  // fix layout based on screen size
  fixTeamLayout();
  window.addEventListener("resize", fixTeamLayout);

  // add touch handler to close flipped cards
  setupTouchHandler(teamMembers);

  // setup scroll effects that make members emerge from pandeiro
  setupScrollEffect(teamMembers, pandeiro, teamSection);
}

/**
 * Setup scroll effect for team members
 */
function setupScrollEffect(members, pandeiro, section) {
  // initially hide all members behind pandeiro
  var pandeiroPos = getPandeiroPos(pandeiro, section);

  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    if (member.id === "member10") continue; // skip pandeiro

    // hide behind pandeiro
    member.style.top = pandeiroPos.top + "px";
    member.style.left = pandeiroPos.left + "px";
    member.style.opacity = "0";
    member.style.transform = "scale(0.5)";
    member.style.zIndex = "1";
  }

  // create watcher to detect when section visible
  var watcher = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];

        // how much is visible
        var visibleAmount = entry.intersectionRatio;

        // show members as section becomes visible
        if (entry.isIntersecting) {
          animateMembers(members, pandeiro, section, visibleAmount);
        } else {
          // reset when completely hidden
          if (visibleAmount === 0) {
            resetMembers(members, pandeiro, section);
          }
        }
      }
    },
    {
      root: null, // use viewport
      rootMargin: "0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    }
  );

  // start watching
  watcher.observe(section);

  // also handle scroll for smoother animation
  window.addEventListener("scroll", function () {
    // check if section is in view
    var rect = section.getBoundingClientRect();
    var windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      // calculate how much is visible
      var visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      var ratio = Math.min(Math.max(visibleHeight / rect.height, 0), 1);

      // animate members based on visibility
      animateMembers(members, pandeiro, section, ratio);
    }
  });
}

/**
 * Animate team members based on scroll
 */
function animateMembers(members, pandeiro, section, ratio) {
  var pandeiroPos = getPandeiroPos(pandeiro, section);

  // pandeiro on top
  pandeiro.style.zIndex = "10";

  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    if (member.id === "member10") continue; // skip pandeiro

    // get final position
    var finalPos = getFinalPos(member.id, section);

    // make animation more dramatic with curve
    var curvedRatio = Math.pow(ratio, 2.5);

    // calculate current position
    var currentTop =
      pandeiroPos.top + (finalPos.top - pandeiroPos.top) * curvedRatio;
    var currentLeft =
      pandeiroPos.left + (finalPos.left - pandeiroPos.left) * curvedRatio;

    // fade in and scale up
    var opacity = Math.min(ratio * 2, 1);
    var scale = 0.01 + ratio * 0.99;

    // apply styles
    member.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    member.style.top = currentTop + "px";
    member.style.left = currentLeft + "px";
    member.style.opacity = opacity;

    // apply transform with any needed translation
    var posData = getCurrentLayoutPos().find(function (pos) {
      return pos.id === member.id;
    });

    if (posData && posData.transform) {
      member.style.transform = posData.transform + " scale(" + scale + ")";
    } else {
      member.style.transform = "scale(" + scale + ")";
    }
  }
}

/**
 * Reset members to starting position
 */
function resetMembers(members, pandeiro, section) {
  var pandeiroPos = getPandeiroPos(pandeiro, section);

  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    if (member.id === "member10") continue; // skip pandeiro

    member.style.top = pandeiroPos.top + "px";
    member.style.left = pandeiroPos.left + "px";
    member.style.opacity = "0";
    member.style.transform = "translate(-50%, -50%) scale(0.01)";
    member.style.transformOrigin = "center center";
  }
}

/**
 * Get pandeiro position
 */
function getPandeiroPos(pandeiro, section) {
  var pandeiroRect = pandeiro.getBoundingClientRect();
  var sectionRect = section.getBoundingClientRect();

  var centerX = pandeiroRect.left + pandeiroRect.width / 2 - sectionRect.left;
  var centerY = pandeiroRect.top + pandeiroRect.height / 2 - sectionRect.top;

  return {
    top: centerY - 100,
    left: centerX,
  };
}

/**
 * Get final position for member
 */
function getFinalPos(memberId, section) {
  var sectionWidth = section.offsetWidth;
  var sectionHeight = section.offsetHeight;

  // get layout data based on screen size
  var posData = getCurrentLayoutPos().find(function (pos) {
    return pos.id === memberId;
  });

  if (!posData) {
    return { top: 0, left: 0 };
  }

  // convert % to pixels
  var top = (parseFloat(posData.top) / 100) * sectionHeight;
  var left = (parseFloat(posData.left) / 100) * sectionWidth;

  return { top: top, left: left };
}

/**
 * Get current layout positions based on screen width
 */
function getCurrentLayoutPos() {
  var width = window.innerWidth;

  if (width <= 480) {
    return mobilePos;
  } else if (width <= 768) {
    return tabletPos;
  } else {
    return desktopPos;
  }
}

/**
 * Setup pandeiro audio
 */
function setupPandeiroAudio() {
  var pandeiroEl = document.getElementById("member10");
  if (!pandeiroEl) return;

  // create audio element
  var audio = new Audio("audio/pandeiro.mp3");
  audio.preload = "auto";

  // track state
  var playing = false;

  // toggle audio playback
  function toggleAudio(e) {
    // prevent defaults
    if (e.type === "touchend") e.preventDefault();

    if (playing) {
      // stop playback
      audio.pause();
      audio.currentTime = 0;
      playing = false;
      pandeiroEl
        .querySelector(".member-image-container1")
        ?.classList.remove("audio-playing");
    } else {
      // start playback - catch errors
      audio.play().catch(function (err) {
        console.error("Audio error:", err);
      });
      playing = true;
      pandeiroEl
        .querySelector(".member-image-container1")
        ?.classList.add("audio-playing");
    }

    // prevent bubbling
    e.stopPropagation();

    // don't flip
    pandeiroEl.classList.remove("flipped");
  }

  // add event handlers
  pandeiroEl.addEventListener("click", toggleAudio);

  // touch handlers
  pandeiroEl.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
    },
    {
      passive: false,
    }
  );

  pandeiroEl.addEventListener("touchend", toggleAudio, {
    passive: false,
  });

  // reset when audio ends
  audio.addEventListener("ended", function () {
    playing = false;
    pandeiroEl
      .querySelector(".member-image-container1")
      ?.classList.remove("audio-playing");
  });
}

/**
 * Setup team member interactions
 */
function setupTeamMembers(members) {
  for (var i = 0; i < members.length; i++) {
    var member = members[i];

    // skip pandeiro
    if (member.id === "member10") continue;

    var container = member.querySelector(".member-image-container");
    if (!container) continue;

    // mouse hover (desktop)
    member.addEventListener("mouseenter", function () {
      var imgContainer = this.querySelector(".member-image-container");
      if (imgContainer) {
        imgContainer.style.animationPlayState = "paused";
      }
      this.classList.add("flipped");
    });

    member.addEventListener("mouseleave", function () {
      var imgContainer = this.querySelector(".member-image-container");
      if (imgContainer) {
        imgContainer.style.animationPlayState = "running";
      }
      this.classList.remove("flipped");
    });

    // touch handlers (mobile)
    member.addEventListener(
      "touchstart",
      function (e) {
        // prevent scrolling when tapping cards
        e.preventDefault();

        // toggle flipped state
        this.classList.toggle("flipped");

        // toggle animation state
        var imgContainer = this.querySelector(".member-image-container");
        if (imgContainer) {
          var currentState = imgContainer.style.animationPlayState;
          imgContainer.style.animationPlayState =
            currentState === "paused" ? "running" : "paused";
        }
      },
      {
        passive: false,
      }
    );
  }
}

/**
 * Handle document touch to reset cards
 */
function setupTouchHandler(members) {
  document.addEventListener("touchend", function (e) {
    // if touch ends outside a member, reset all
    var touched = e.target.closest(".team-member");
    if (!touched) {
      for (var i = 0; i < members.length; i++) {
        var member = members[i];
        // skip pandeiro
        if (member.id === "member10") continue;

        member.classList.remove("flipped");
        var container = member.querySelector(".member-image-container");
        if (container) {
          container.style.animationPlayState = "running";
        }
      }
    }
  });
}

/**
 * Fix layout based on screen size
 */
function fixTeamLayout() {
  var width = window.innerWidth;
  var positions;

  if (width <= 480) {
    positions = mobilePos;
  } else if (width <= 768) {
    positions = tabletPos;
  } else {
    positions = desktopPos;
  }

  // apply pandeiro position
  var pandeiro = document.getElementById("member10");
  if (pandeiro) {
    var pandeiroPos = positions.find(function (pos) {
      return pos.id === "member10";
    });

    if (pandeiroPos) {
      pandeiro.style.top = pandeiroPos.top;
      pandeiro.style.left = pandeiroPos.left;

      if (pandeiroPos.transform) {
        pandeiro.style.transform = pandeiroPos.transform;
      }
    }
  }

  // update member positions based on current scroll
  updateMemberPositions();
}

/**
 * Update member positions based on scroll
 */
function updateMemberPositions() {
  var teamSection = document.getElementById("team");
  var members = document.querySelectorAll(".team-member");
  var pandeiro = document.getElementById("member10");

  if (!teamSection || !members.length || !pandeiro) return;

  // check if section is visible
  var rect = teamSection.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    // calculate visibility ratio
    var visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    var ratio = Math.min(Math.max(visibleHeight / rect.height, 0), 1);

    // get pandeiro position
    var pandeiroPos = getPandeiroPos(pandeiro, teamSection);

    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      if (member.id === "member10") continue; // skip pandeiro

      // get final position
      var finalPos = getFinalPos(member.id, teamSection);

      // calculate current position
      var top = pandeiroPos.top + (finalPos.top - pandeiroPos.top) * ratio;
      var left = pandeiroPos.left + (finalPos.left - pandeiroPos.left) * ratio;

      // apply immediately without transition
      member.style.transition = "none";
      member.style.top = top + "px";
      member.style.left = left + "px";
      member.style.opacity = Math.min(ratio * 2, 1);

      // apply transform and scale
      var posData = getCurrentLayoutPos().find(function (pos) {
        return pos.id === member.id;
      });

      if (posData && posData.transform) {
        member.style.transform =
          posData.transform + " scale(" + (0.01 + ratio * 0.99) + ")";
      } else {
        member.style.transform = "scale(" + (0.01 + ratio * 0.99) + ")";
      }

      // re-enable transitions with delay
      setTimeout(function () {
        for (var j = 0; j < members.length; j++) {
          if (members[j].id !== "member10") {
            members[j].style.transition =
              "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
          }
        }
      }, 50);
    }
  }
}

// Layout position data
var desktopPos = [
  { id: "member1", top: "10%", left: "25%", transform: "translateX(-50%)" }, // Ed
  { id: "member2", top: "5%", left: "50%", transform: "translateX(-50%)" }, // Alex
  { id: "member3", top: "10%", left: "75%", transform: "translateX(-50%)" }, // Dar
  { id: "member4", top: "35%", left: "10%", transform: "translateX(-50%)" }, // Ben
  { id: "member5", top: "35%", left: "40%", transform: "translateX(-50%)" }, // Mandem
  { id: "member6", top: "35%", left: "60%", transform: "translateX(-50%)" }, // Mestre
  { id: "member7", top: "35%", left: "90%", transform: "translateX(-50%)" }, // Susy
  { id: "member8", top: "60%", left: "25%", transform: "translateX(-50%)" }, // Yune
  { id: "member9", top: "60%", left: "75%", transform: "translateX(-50%)" }, // Haidee
  { id: "member10", top: "70%", left: "50%", transform: "translateX(-50%)" }, // Pandeiro
];

var tabletPos = [
  { id: "member1", top: "20%", left: "15%", transform: "translateX(-50%)" }, // Ed
  { id: "member2", top: "2%", left: "50%", transform: "translateX(-50%)" }, // Alex
  { id: "member3", top: "20%", left: "85%", transform: "translateX(-50%)" }, // Dar
  { id: "member4", top: "50%", left: "10%", transform: "translateX(-50%)" }, // Ben
  { id: "member5", top: "31%", left: "40%", transform: "translateX(-50%)" }, // Mandem
  { id: "member6", top: "31%", left: "60%", transform: "translateX(-50%)" }, // Mestre
  { id: "member7", top: "50%", left: "90%", transform: "translateX(-50%)" }, // Susy
  { id: "member8", top: "70%", left: "70%", transform: "translateX(-50%)" }, // Yune
  { id: "member9", top: "70%", left: "30%", transform: "translateX(-50%)" }, // Haidee
  { id: "member10", top: "65%", left: "50%", transform: "translateX(-50%)" }, // Pandeiro
];

var mobilePos = [
  { id: "member1", top: "30%", left: "20%", transform: "translateX(-50%)" }, // Ed
  { id: "member2", top: "15%", left: "50%", transform: "translateX(-50%)" }, // Alex
  { id: "member3", top: "30%", left: "80%", transform: "translateX(-50%)" }, // Dar
  { id: "member4", top: "60%", left: "80%", transform: "translateX(-50%)" }, // Ben
  { id: "member5", top: "0%", left: "30%", transform: "translateX(-50%)" }, // Mandem
  { id: "member6", top: "0%", left: "70%", transform: "translateX(-50%)" }, // Mestre
  { id: "member7", top: "60%", left: "20%", transform: "translateX(-50%)" }, // Suzy
  { id: "member8", top: "80%", left: "70%", transform: "translateX(-50%)" }, // Yune
  { id: "member9", top: "80%", left: "30%", transform: "translateX(-50%)" }, // Haidee
  { id: "member10", top: "55%", left: "50%", transform: "translateX(-50%)" }, // Pandeiro
];

// Export the init function
export { initTeamSection };
