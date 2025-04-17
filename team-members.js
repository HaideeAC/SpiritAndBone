/**
 * Spirit&Bone - Team Members Module (Optimized)
 */

// Initialize team section
function initTeamSection() {
  // Get references to all team members
  const teamMembers = document.querySelectorAll(".team-member");
  const teamContainer = document.querySelector(".team-container");
  const teamSection = document.getElementById("team");
  const pandeiro = document.getElementById("member10");

  // If no team members or container are found, exit early
  if (!teamMembers.length || !teamContainer || !teamSection || !pandeiro) {
    console.warn("Team section elements not found in the document.");
    return;
  }

  // Set up the pandeiro audio interaction
  initPandeiroAudio();

  // Set up interactions for regular team members
  initTeamMemberInteractions(teamMembers);

  // Initialize responsive layout and add resize listener
  adjustTeamLayout();
  window.addEventListener("resize", adjustTeamLayout);

  // Add document-level touch handler for closing flipped cards
  addDocumentTouchHandler(teamMembers);

  // Initialize the scroll effects for the team members
  initScrollEffect(teamMembers, pandeiro, teamSection);
}

/**
 * Initialize scroll effect for team members emerging/hiding from pandeiro
 * @param {NodeList} teamMembers - Collection of team member elements
 * @param {HTMLElement} pandeiro - The pandeiro element
 * @param {HTMLElement} teamSection - The team section element
 */
function initScrollEffect(teamMembers, pandeiro, teamSection) {
  // Set initial state - all team members behind pandeiro
  const pandeiroPos = getPandeiroPosition(pandeiro, teamSection);

  teamMembers.forEach((member) => {
    if (member.id === "member10") return; // Skip pandeiro

    // Initially hide all team members behind pandeiro
    member.style.top = `${pandeiroPos.top}px`;
    member.style.left = `${pandeiroPos.left}px`;
    member.style.opacity = "0";
    member.style.transform = "scale(0.5)";
    member.style.zIndex = "1";
  });

  // Create Intersection Observer to detect when section is in viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Calculate how much of the section is visible (0 to 1)
        let ratio = entry.intersectionRatio;

        // If section is entering viewport
        if (entry.isIntersecting) {
          animateTeamMembers(teamMembers, pandeiro, teamSection, ratio);
        } else {
          // If section is completely out of view, reset positions
          if (ratio === 0) {
            resetTeamMembers(teamMembers, pandeiro, teamSection);
          }
        }
      });
    },
    {
      root: null, // Use viewport as root
      rootMargin: "0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    }
  );

  // Start observing team section
  observer.observe(teamSection);

  // Also handle scroll events for smoother animation between thresholds
  window.addEventListener("scroll", () => {
    // Check if team section is in viewport
    const rect = teamSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      // Calculate visibility ratio
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const ratio = Math.min(Math.max(visibleHeight / rect.height, 0), 1);

      // Apply animation based on visibility ratio
      animateTeamMembers(teamMembers, pandeiro, teamSection, ratio);
    }
  });
}

/**
 * Animate team members based on section visibility ratio
 * @param {NodeList} teamMembers - Collection of team member elements
 * @param {HTMLElement} pandeiro - The pandeiro element
 * @param {HTMLElement} teamSection - The team section element
 * @param {number} ratio - Visibility ratio (0-1)
 */
function animateTeamMembers(teamMembers, pandeiro, teamSection, ratio) {
  const pandeiroPos = getPandeiroPosition(pandeiro, teamSection);

  // Ensure pandeiro is on top
  pandeiro.style.zIndex = "10";

  teamMembers.forEach((member) => {
    if (member.id === "member10") return; // Skip pandeiro

    // Get the final position for this member
    const finalPos = getFinalPosition(member.id, teamSection);

    // Calculate current position based on ratio
    const curvedRatio = Math.pow(ratio, 2.5);
    let currentTop =
      pandeiroPos.top + (finalPos.top - pandeiroPos.top) * curvedRatio;
    let currentLeft =
      pandeiroPos.left + (finalPos.left - pandeiroPos.left) * curvedRatio;

    // Calculate opacity and scale based on ratio
    let opacity = Math.min(ratio * 2, 1);
    let scale = 0.01 + ratio * 0.99;

    // Apply calculated styles
    member.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    member.style.top = `${currentTop}px`;
    member.style.left = `${currentLeft}px`;
    member.style.opacity = opacity;

    // Apply transformation including any needed translateX
    const posData = getCurrentLayoutPositions().find(
      (pos) => pos.id === member.id
    );
    if (posData && posData.transform) {
      member.style.transform = `${posData.transform} scale(${scale})`;
    } else {
      member.style.transform = `scale(${scale})`;
    }
  });
}

/**
 * Reset team members to initial position (behind pandeiro)
 * @param {NodeList} teamMembers - Collection of team member elements
 * @param {HTMLElement} pandeiro - The pandeiro element
 * @param {HTMLElement} teamSection - The team section element
 */
function resetTeamMembers(teamMembers, pandeiro, teamSection) {
  const pandeiroPos = getPandeiroPosition(pandeiro, teamSection);

  teamMembers.forEach((member) => {
    if (member.id === "member10") return; // Skip pandeiro

    member.style.top = `${pandeiroPos.top}px`;
    member.style.left = `${pandeiroPos.left}px`;
    member.style.opacity = "0";
    member.style.transform = "translate(-50%, -50%) scale(0.01)"; // Center the member and make it tiny
    member.style.transformOrigin = "center center"; // Ensure scaling from center
  });
}

/**
 * Get pandeiro position relative to team section
 * @param {HTMLElement} pandeiro - The pandeiro element
 * @param {HTMLElement} teamSection - The team section element
 * @returns {Object} Position with top and left in pixels
 */
function getPandeiroPosition(pandeiro, teamSection) {
  const pandeiroRect = pandeiro.getBoundingClientRect();
  const sectionRect = teamSection.getBoundingClientRect();

  const centerX = pandeiroRect.left + pandeiroRect.width / 2 - sectionRect.left;
  const centerY = pandeiroRect.top + pandeiroRect.height / 2 - sectionRect.top;

  // Return coordinates of the pandeiro
  return {
    top: centerY - 100,
    left: centerX,
  };
}

/**
 * Get final position for a team member based on current layout
 * @param {string} memberId - ID of the team member
 * @param {HTMLElement} teamSection - The team section element
 * @returns {Object} Position with top and left in pixels
 */
function getFinalPosition(memberId, teamSection) {
  const sectionWidth = teamSection.offsetWidth;
  const sectionHeight = teamSection.offsetHeight;

  // Get position data based on screen size
  const positionData = getCurrentLayoutPositions().find(
    (pos) => pos.id === memberId
  );

  if (!positionData) {
    return { top: 0, left: 0 };
  }

  // Convert percentage to pixels
  const top = (parseFloat(positionData.top) / 100) * sectionHeight;
  const left = (parseFloat(positionData.left) / 100) * sectionWidth;

  return { top, left };
}

/**
 * Get current layout positions based on screen width
 * @returns {Array} Array of position objects
 */
function getCurrentLayoutPositions() {
  const viewportWidth = window.innerWidth;

  if (viewportWidth <= 480) {
    return mobilePositions;
  } else if (viewportWidth <= 768) {
    return tabletPositions;
  } else {
    return desktopPositions;
  }
}

/**
 * Initialize pandeiro audio element and interactions
 */
function initPandeiroAudio() {
  const pandeiroMember = document.getElementById("member10");
  if (!pandeiroMember) return;

  // Create and configure audio element
  const pandeiro = new Audio("audio/pandeiro.mp3");
  pandeiro.preload = "auto";

  // Track playing state to avoid multiple plays
  let isPlaying = false;

  // Toggle function for audio play/pause
  function togglePandeiro(e) {
    // Prevent default behavior for touch events
    if (e.type === "touchend") e.preventDefault();

    if (isPlaying) {
      // Stop audio
      pandeiro.pause();
      pandeiro.currentTime = 0;
      isPlaying = false;
      pandeiroMember
        .querySelector(".member-image-container1")
        ?.classList.remove("audio-playing");
    } else {
      // Start audio
      pandeiro
        .play()
        .catch((err) => console.error("Error playing audio:", err));
      isPlaying = true;
      pandeiroMember
        .querySelector(".member-image-container1")
        ?.classList.add("audio-playing");
    }

    // Prevent propagation to avoid unwanted effects
    e.stopPropagation();

    // Make sure the element doesn't flip like regular team members
    pandeiroMember.classList.remove("flipped");
  }

  // Add event listeners
  pandeiroMember.addEventListener("click", togglePandeiro);

  // Touch event handlers with proper event prevention for mobile
  pandeiroMember.addEventListener("touchstart", (e) => e.preventDefault(), {
    passive: false,
  });
  pandeiroMember.addEventListener("touchend", togglePandeiro, {
    passive: false,
  });

  // Reset when audio finishes playing
  pandeiro.addEventListener("ended", () => {
    isPlaying = false;
    pandeiroMember
      .querySelector(".member-image-container1")
      ?.classList.remove("audio-playing");
  });
}

/**
 * Set up flip interactions for team members
 * @param {NodeList} teamMembers - Collection of team member elements
 */
function initTeamMemberInteractions(teamMembers) {
  teamMembers.forEach((member) => {
    // Skip the pandeiro member as it has special handling
    if (member.id === "member10") return;

    const memberImageContainer = member.querySelector(
      ".member-image-container"
    );
    if (!memberImageContainer) return;

    // Handle mouse interactions (desktop)
    member.addEventListener("mouseenter", () => {
      memberImageContainer.style.animationPlayState = "paused";
      member.classList.add("flipped");
    });

    member.addEventListener("mouseleave", () => {
      memberImageContainer.style.animationPlayState = "running";
      member.classList.remove("flipped");
    });

    // Handle touch interactions (mobile & tablet)
    member.addEventListener(
      "touchstart",
      (e) => {
        // Necessary to prevent scrolling when tapping on cards
        e.preventDefault();

        // Toggle flipped state and animation
        member.classList.toggle("flipped");
        const currentState = memberImageContainer.style.animationPlayState;
        memberImageContainer.style.animationPlayState =
          currentState === "paused" ? "running" : "paused";
      },
      { passive: false }
    );
  });
}

/**
 * Add document-level touch handler to reset cards
 * @param {NodeList} teamMembers - Collection of team member elements
 */
function addDocumentTouchHandler(teamMembers) {
  document.addEventListener("touchend", (e) => {
    // If touch ends outside any team member, reset all flipped states
    const touchedMember = e.target.closest(".team-member");
    if (!touchedMember) {
      teamMembers.forEach((member) => {
        // Skip the pandeiro member
        if (member.id === "member10") return;

        member.classList.remove("flipped");
        const container = member.querySelector(".member-image-container");
        if (container) {
          container.style.animationPlayState = "running";
        }
      });
    }
  });
}

/**
 * Adjust team layout based on screen size
 */
function adjustTeamLayout() {
  const viewportWidth = window.innerWidth;
  let positions;

  if (viewportWidth <= 480) {
    positions = mobilePositions;
  } else if (viewportWidth <= 768) {
    positions = tabletPositions;
  } else {
    positions = desktopPositions;
  }

  // Apply layout for pandeiro - team members will be positioned by scroll effect
  const pandeiro = document.getElementById("member10");
  if (pandeiro) {
    const pandeiroPosition = positions.find((pos) => pos.id === "member10");
    if (pandeiroPosition) {
      pandeiro.style.top = pandeiroPosition.top;
      pandeiro.style.left = pandeiroPosition.left;

      // Apply transform property if it exists
      if (pandeiroPosition.transform) {
        pandeiro.style.transform = pandeiroPosition.transform;
      }
    }
  }

  // Update positions of all members based on current scroll position
  updateTeamMembersPositions();
}

/**
 * Update team members positions based on current scroll position
 */
function updateTeamMembersPositions() {
  const teamSection = document.getElementById("team");
  const teamMembers = document.querySelectorAll(".team-member");
  const pandeiro = document.getElementById("member10");

  if (!teamSection || !teamMembers.length || !pandeiro) return;

  // Check if team section is in viewport
  const rect = teamSection.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    // Calculate visibility ratio
    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const ratio = Math.min(Math.max(visibleHeight / rect.height, 0), 1);

    // Skip animation and apply position immediately
    const pandeiroPos = getPandeiroPosition(pandeiro, teamSection);

    teamMembers.forEach((member) => {
      if (member.id === "member10") return; // Skip pandeiro

      // Get final position for this member
      const finalPos = getFinalPosition(member.id, teamSection);

      // Calculate current position
      const top = pandeiroPos.top + (finalPos.top - pandeiroPos.top) * ratio;
      const left =
        pandeiroPos.left + (finalPos.left - pandeiroPos.left) * ratio;

      // Apply styles without transition for immediate effect
      member.style.transition = "none";
      member.style.top = `${top}px`;
      member.style.left = `${left}px`;
      member.style.opacity = Math.min(ratio * 2, 1);

      // Apply transformation including any needed translateX
      const posData = getCurrentLayoutPositions().find(
        (pos) => pos.id === member.id
      );
      if (posData && posData.transform) {
        member.style.transform = `${posData.transform} scale(${
          0.01 + ratio * 0.99
        })`;
      } else {
        member.style.transform = `scale(${0.01 + ratio * 0.99})`;
      }

      // Re-enable transitions after a small delay
      setTimeout(() => {
        member.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }, 5000);
    });
  }
}

const desktopPositions = [
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

const tabletPositions = [
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

const mobilePositions = [
  { id: "member1", top: "30%", left: "8%", transform: "translateX(-50%)" }, // Ed
  { id: "member2", top: "15%", left: "50%", transform: "translateX(-50%)" }, // Alex
  { id: "member3", top: "30%", left: "67%", transform: "translateX(-50%)" }, // Dar
  { id: "member4", top: "60%", left: "67%", transform: "translateX(-50%)" }, // Ben
  { id: "member5", top: "0%", left: "8%", transform: "translateX(-50%)" }, // Mandem
  { id: "member6", top: "0%", left: "67%", transform: "translateX(-50%)" }, // Mestre
  { id: "member7", top: "60%", left: "8%", transform: "translateX(-50%)" }, // Suzy
  { id: "member8", top: "80%", left: "67%", transform: "translateX(-50%)" }, // Yune
  { id: "member9", top: "80%", left: "8%", transform: "translateX(-50%)" }, // Haidee
  { id: "member10", top: "55%", left: "50%", transform: "translateX(-50%)" }, // Pandeiro
];

// Export initialization function
export { initTeamSection };
