/**
 * Spirit&Bone - Project Section Interactions
 */

function initProjectParallax() {
  // Get references to main elements
  const projectContainer = document.querySelector(".project-container");
  const parallaxBoxes = document.querySelectorAll(".parallax-box");
  const parallaxImages = document.querySelectorAll(".parallax-image");
  const scrollDown2 = document.getElementById("scroll-down2");
  const tier2 = document.querySelector(".tier2");

  // Exit if no project container
  if (!projectContainer) return;

  // Make the container visible with a subtle animation
  setTimeout(() => {
    projectContainer.classList.add("visible");
  }, 300);

  // Handle scroll down button
  if (scrollDown2) {
    scrollDown2.addEventListener("click", () => {
      if (tier2) {
        tier2.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Set up mouse movement parallax effect
  parallaxBoxes.forEach((box) => {
    box.addEventListener("mousemove", (e) => {
      const image = box.querySelector(".parallax-image");
      if (!image) return;

      // Calculate mouse position relative to the box
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the box
      const y = e.clientY - rect.top; // y position within the box

      // Calculate movement based on mouse position
      // Move opposite to mouse direction for parallax effect
      const xMove = (rect.width / 2 - x) / 20;
      const yMove = (rect.height / 2 - y) / 20;

      // Apply transform
      image.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });

    // Reset transform when mouse leaves
    box.addEventListener("mouseleave", () => {
      const image = box.querySelector(".parallax-image");
      if (image) {
        image.style.transform = "translate(0, 0)";
      }
    });
  });

  // Set up on-scroll parallax effect
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const projectSection = document.getElementById("project");

    if (!projectSection) return;

    const projectTop = projectSection.offsetTop;
    const projectHeight = projectSection.offsetHeight;

    // Only apply effects when project section is in view
    if (
      scrollY >= projectTop - window.innerHeight &&
      scrollY <= projectTop + projectHeight
    ) {
      // Calculate how far we've scrolled into the section
      const scrollPosition = scrollY - projectTop;

      // Apply staggered movement to parallax boxes
      parallaxBoxes.forEach((box, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const speed = 0.05 + index * 0.01;
        const yValue = scrollPosition * speed * direction;

        // Apply subtle movement based on scroll
        box.style.transform = `translateY(${yValue}px)`;
      });
    }
  });

  // Smooth transition for project details in tier 2
  if (tier2) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("tier2-visible");

            // Add staggered animations to project details
            const projectDetails = tier2.querySelector(".project-details");
            if (projectDetails) {
              const headings = projectDetails.querySelectorAll("h2, h3");
              const paragraphs = projectDetails.querySelectorAll("p");

              // Animate headings
              headings.forEach((heading, index) => {
                heading.style.opacity = "0";
                heading.style.transform = "translateY(20px)";
                heading.style.transition = `all 0.5s ease ${
                  0.2 + index * 0.1
                }s`;

                setTimeout(() => {
                  heading.style.opacity = "1";
                  heading.style.transform = "translateY(0)";
                }, 100);
              });

              // Animate paragraphs
              paragraphs.forEach((paragraph, index) => {
                paragraph.style.opacity = "0";
                paragraph.style.transform = "translateY(20px)";
                paragraph.style.transition = `all 0.5s ease ${
                  0.4 + index * 0.1
                }s`;

                setTimeout(() => {
                  paragraph.style.opacity = "1";
                  paragraph.style.transform = "translateY(0)";
                }, 200);
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(tier2);
  }

  // Initialize enhanced hover effects for project images
  setupImageHoverEffects();

  // Initialize poster image animation
  setupPosterAnimation();

  // Initialize text reveal animation
  setupTextReveal();
}

// Setup enhanced hover effects for project images
function setupImageHoverEffects() {
  const images = document.querySelectorAll(".parallax-box img");

  images.forEach((img) => {
    // Add tilt effect on hover
    img.addEventListener("mousemove", (e) => {
      const box = img.closest(".parallax-box");
      const rect = box.getBoundingClientRect();

      // Calculate mouse position as percentage
      const xPos = (e.clientX - rect.left) / rect.width;
      const yPos = (e.clientY - rect.top) / rect.height;

      // Calculate tilt angle (max 10 degrees)
      const tiltX = (0.5 - yPos) * 10;
      const tiltY = (xPos - 0.5) * 10;

      // Apply transform
      img.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
    });

    // Reset on mouse leave
    img.addEventListener("mouseleave", () => {
      img.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      img.style.transition = "transform 0.5s ease";
    });
  });
}

// Setup special animation for poster
function setupPosterAnimation() {
  const poster = document.querySelector(".project-poster img");

  if (!poster) return;

  // Create a subtle floating animation for the poster
  let floatDirection = 1;
  let floatPosition = 0;
  const floatSpeed = 0.05;
  const floatLimit = 10;

  function animatePoster() {
    floatPosition += floatSpeed * floatDirection;

    // Reverse direction when limits reached
    if (floatPosition >= floatLimit || floatPosition <= -floatLimit) {
      floatDirection *= -1;
    }

    // Apply subtle floating effect
    poster.style.transform = `translateY(${floatPosition}px)`;

    // Continue animation
    requestAnimationFrame(animatePoster);
  }

  // Start animation
  animatePoster();

  // Add special shine effect on hover
  poster.addEventListener("mousemove", (e) => {
    const rect = poster.getBoundingClientRect();

    // Calculate mouse position as percentage
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;

    // Create gradient position based on mouse
    poster.style.boxShadow = `
      0 15px 35px rgba(0, 0, 0, 0.25),
      inset 0 0 100px rgba(255, 255, 255, ${
        0.2 - (xPos - 0.5) * 0.1 - (yPos - 0.5) * 0.1
      })
    `;
  });

  // Reset on mouse leave
  poster.addEventListener("mouseleave", () => {
    poster.style.boxShadow = "var(--shadow-lg)";
  });
}

// Setup text reveal animation for project-text
function setupTextReveal() {
  const projectText = document.querySelector(".project-text");

  if (!projectText) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Create letter-by-letter animation for heading
          const heading = projectText.querySelector("h2");
          if (heading) {
            const text = heading.textContent;
            heading.textContent = "";

            // Create span for each letter
            for (let i = 0; i < text.length; i++) {
              const span = document.createElement("span");
              span.textContent = text[i];
              span.style.opacity = "0";
              span.style.transform = "translateY(20px)";
              span.style.display = "inline-block";
              span.style.transition = `all 0.3s ease ${0.1 + i * 0.03}s`;
              heading.appendChild(span);

              // Reveal letter with delay
              setTimeout(() => {
                span.style.opacity = "1";
                span.style.transform = "translateY(0)";
              }, 100);
            }
          }

          // Fade in paragraph
          const paragraph = projectText.querySelector("p");
          if (paragraph) {
            paragraph.style.opacity = "0";
            paragraph.style.transform = "translateY(20px)";
            paragraph.style.transition = "all 0.5s ease 0.5s";

            setTimeout(() => {
              paragraph.style.opacity = "1";
              paragraph.style.transform = "translateY(0)";
            }, 200);
          }

          // Only need to observe once
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(projectText);
}

// Export the initialization function
export { initProjectParallax };
