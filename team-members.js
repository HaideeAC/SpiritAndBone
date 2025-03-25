/**
 * Spirit&Bone - Team Members Module
 */

// Create audio element for pandeiro sound
let pandeiro = null;

// Initialize team section
function initTeamSection() {
  // Get references to all team members
  const teamMembers = document.querySelectorAll(".team-member");

  // If no team members are found, exit early
  if (!teamMembers.length) {
    console.warn("No team members found in the document.");
    return;
  }

  // Initialize the audio element for the pandeiro
  pandeiro = new Audio("audio/pandeiro2.mp3");
  pandeiro.preload = "auto";

  // Set up audio toggle for member10 (pandeiro)
  const pandeiroMember = document.getElementById("member10");
  if (pandeiroMember) {
    pandeiroMember.isPlaying = false;

    pandeiroMember.addEventListener("click", function () {
      // Toggle audio playback
      if (this.isPlaying) {
        pandeiro.pause();
        pandeiro.currentTime = 0; // Reset playback position
        this.isPlaying = false;

        // Stop any animation related to audio playback
        const memberImageContainer = this.querySelector(
          ".member-image-container1"
        );
        if (memberImageContainer) {
          memberImageContainer.classList.remove("audio-playing");
        }
      } else {
        pandeiro.play();
        this.isPlaying = true;

        // Add animation class to indicate audio is playing
        const memberImageContainer = this.querySelector(
          ".member-image-container1"
        );
        if (memberImageContainer) {
          memberImageContainer.classList.add("audio-playing");
        }
      }
    });
  }

  // Set up interactions for each team member
  teamMembers.forEach((member) => {
    const memberImageContainer = member.querySelector(
      ".member-image-container, .member-image-container1"
    );
    if (!memberImageContainer) return;

    // Handle mouse interactions (desktop)
    member.addEventListener("mouseenter", () => {
      // Pause the floating animation
      memberImageContainer.style.animationPlayState = "paused";
      // Add flipped class to trigger the CSS transition
      member.classList.add("flipped");
    });

    member.addEventListener("mouseleave", () => {
      // Resume the floating animation
      memberImageContainer.style.animationPlayState = "running";
      // Remove flipped class to revert the flip
      member.classList.remove("flipped");
    });

    // Handle touch interactions (mobile & tablet)
    member.addEventListener(
      "touchstart",
      (e) => {
        // Prevent default touch behavior
        e.preventDefault();
        // Toggle the flipped state
        member.classList.toggle("flipped");
        // Toggle animation play state
        const currentState = memberImageContainer.style.animationPlayState;
        memberImageContainer.style.animationPlayState =
          currentState === "paused" ? "running" : "paused";
      },
      { passive: false }
    );
  });

  // Make sure team layout is appropriate for screen size
  adjustTeamLayout();
  window.addEventListener("resize", adjustTeamLayout);
  adjustTeamLayout1();
  window.addEventListener("resize", adjustTeamLayout1);

  // Add touchend listener for better mobile experience
  document.addEventListener("touchend", (e) => {
    // If the touch ends outside any team member, reset all flipped states
    const touchedMember = e.target.closest(".team-member");
    if (!touchedMember) {
      teamMembers.forEach((member) => {
        member.classList.remove("flipped");
        const container = member.querySelector(
          ".member-image-container, .member-image-container1"
        );
        if (container) {
          container.style.animationPlayState = "running";
        }
      });
    }
  });
}

// Adjust team layout based on screen size
function adjustTeamLayout() {
  const teamContainer = document.querySelector(".team-container");
  if (!teamContainer) return;

  // Get current viewport width
  const viewportWidth = window.innerWidth;

  if (viewportWidth <= 480) {
    // Mobile layout
    mobileLayout();
  } else if (viewportWidth <= 768) {
    // Tablet layout
    tabletLayout();
  } else {
    // Desktop layout
    resetTeamPositions();
  }
}
function adjustTeamLayout1() {
  const teamContainer = document.querySelector(".team-container");
  if (!teamContainer) return;

  // Get current viewport width
  const viewportWidth = window.innerWidth;

  if (viewportWidth <= 480) {
    // Mobile layout
    mobileLayout();
  } else if (viewportWidth <= 768) {
    // Tablet layout
    tabletLayout();
  } else {
    // Desktop layout
    resetTeamPositions();
  }
}

// Layout for mobile devices
function mobileLayout() {
  const teamMembers = document.querySelectorAll(".team-member");
  teamMembers.forEach((member, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;

    // Set positions with percentage units for better responsiveness
    member.style.top = `${5 + row * 20}%`;
    member.style.left = col === 0 ? "5%" : "55%";
  });
}

// Layout for tablet devices
function tabletLayout() {
  const teamMembers = document.querySelectorAll(".team-member");
  teamMembers.forEach((member, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;

    // Set positions with percentage units for better responsiveness
    member.style.top = `${5 + row * 20}%`;
    member.style.left = col === 0 ? "10%" : "50%";
  });
}

// Reset team member positions to original layout
function resetTeamPositions() {
  const positions = [
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

  positions.forEach((pos) => {
    const member = document.getElementById(pos.id);
    if (member) {
      member.style.top = pos.top;
      member.style.left = pos.left;
    }
  });
}

// Export initialization function
export { initTeamSection };
