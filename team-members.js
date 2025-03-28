/**
 * Spirit&Bone - Team Members Module (Optimized)
 */

// Initialize team section
function initTeamSection() {
  // Get references to all team members
  const teamMembers = document.querySelectorAll(".team-member");
  const teamContainer = document.querySelector(".team-container");

  // If no team members or container are found, exit early
  if (!teamMembers.length || !teamContainer) {
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

  if (viewportWidth <= 480) {
    applyLayout(mobilePositions);
  } else if (viewportWidth <= 768) {
    applyLayout(tabletPositions);
  } else {
    applyLayout(desktopPositions);
  }
}


function applyLayout(positions) {
  positions.forEach((pos) => {
    const member = document.getElementById(pos.id);
    if (member) {
      member.style.top = pos.top;
      member.style.left = pos.left;
    }
  });
}

// Predefined layouts to avoid repetitive calculations
const desktopPositions = [
  { id: "member1", top: "15%", left: "23%" },
  { id: "member2", top: "10%", left: "45%" },
  { id: "member3", top: "15%", left: "67%" },
  { id: "member4", top: "40%", left: "5%" },
  { id: "member5", top: "40%", left: "35%" },
  { id: "member6", top: "40%", left: "55%" },
  { id: "member7", top: "40%", left: "83%" },
  { id: "member8", top: "65%", left: "20%" },
  { id: "member9", top: "65%", left: "70%" },
  { id: "member10", top: "70%", left: "45%" },
];

const tabletPositions = [
  { id: "member1", top: "5%", left: "10%" },
  { id: "member2", top: "5%", left: "50%" },
  { id: "member3", top: "25%", left: "10%" },
  { id: "member4", top: "25%", left: "50%" },
  { id: "member5", top: "45%", left: "10%" },
  { id: "member6", top: "45%", left: "50%" },
  { id: "member7", top: "65%", left: "10%" },
  { id: "member8", top: "65%", left: "50%" },
  { id: "member9", top: "85%", left: "10%" },
  { id: "member10", top: "85%", left: "50%" },
];

const mobilePositions = [
  { id: "member1", top: "5%", left: "5%" },
  { id: "member2", top: "5%", left: "55%" },
  { id: "member3", top: "25%", left: "5%" },
  { id: "member4", top: "25%", left: "55%" },
  { id: "member5", top: "45%", left: "5%" },
  { id: "member6", top: "45%", left: "55%" },
  { id: "member7", top: "65%", left: "5%" },
  { id: "member8", top: "65%", left: "55%" },
  { id: "member9", top: "85%", left: "5%" },
  { id: "member10", top: "85%", left: "55%" },
];

// Export initialization function
export { initTeamSection };
