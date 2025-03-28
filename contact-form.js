/**
 * Spirit&Bone - Contact Form Module
 * Primary controller for contact form and footer behaviors
 */

// Initialize contact form
function initContactForm() {
  const contactFormContainer = document.querySelector(
    ".contact-form-container"
  );
  if (!contactFormContainer) {
    console.error("Contact form container not found");
    return;
  }

  // Make form elements visible
  contactFormContainer.classList.add("visible");

  // Get form reference
  const form = contactFormContainer.querySelector("form");
  if (!form) {
    console.error("Contact form not found");
    return;
  }

  // Form submission handling
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Basic validation
    if (!validateForm(form)) return;

    // Add visual feedback during submission
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    // Prepare form data
    const formData = new FormData(form);
    formData.append("recipient", "alexanderopera@gmail.com");

    // Submit to server endpoint
    fetch("https://formsubmit.co/alexanderopera@gmail.com", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) return response;
        throw new Error("Network response was not ok.");
      })
      .then(() => {
        // Success message
        alert("Thank you for your message! We will get back to you soon.");
        form.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "There was an issue sending your message. Please try again later."
        );
      })
      .finally(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // Show footer - now the primary controller of footer visibility
        showFooter();
      });
  });

  // Set up visibility observer
  setupVisibilityObserver(contactFormContainer);

  // Show footer when reaching the contact section
  showFooterOnScroll();

  // Handle window resize for footer position
  window.addEventListener("resize", fixFooterSpace);

  // Initialize footer visibility
  const footer = document.querySelector("footer");
  if (footer) {
    // Register footer visibility method for external use
    window.showFooter = showFooter;

    // Show footer if already at the bottom of the page
    if (isNearPageBottom()) {
      showFooter();
    }
  }
}

// Validate form inputs
function validateForm(form) {
  const name = form.querySelector("#name")?.value.trim();
  const email = form.querySelector("#email")?.value.trim();
  const message = form.querySelector("#message")?.value.trim();

  // Check required fields
  if (!name || !email || !message) {
    alert("Please fill out all fields.");
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  return true;
}

// Set up observer to add visible class when form scrolls into view
function setupVisibilityObserver(container) {
  // Animate form elements with proper delays
  const formGroups = container.querySelectorAll(".form-group");
  formGroups.forEach((group, index) => {
    group.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          container.classList.add("visible");

          // Also make the parent info container slide up slightly
          const contactInfo = document.querySelector(".contact-info");
          if (contactInfo) {
            contactInfo.style.transition = "transform 0.5s ease 0.3s";
            contactInfo.style.transform = "translateY(0)";
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(container);

  // Initialize contact info with slight offset
  const contactInfo = document.querySelector(".contact-info");
  if (contactInfo) {
    contactInfo.style.transform = "translateY(20px)";
  }
}

// Show footer based on scroll position
function showFooterOnScroll() {
  const contactSection = document.getElementById("contact");
  if (!contactSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting || isNearPageBottom()) {
        showFooter();
      }
    },
    { threshold: 0.8 }
  );

  observer.observe(contactSection);
}

// Check if user is near the bottom of the page
function isNearPageBottom() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );

  return docHeight - (scrollTop + windowHeight) < 100;
}

// Primary footer visibility controller
function showFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.classList.add("visible");
  fixFooterSpace();
}

// Fix any extra space below the footer
function fixFooterSpace() {
  // Hide any spacer after the contact section
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    const nextElement = contactSection.nextElementSibling;
    if (nextElement && nextElement.classList.contains("section-spacer")) {
      nextElement.style.display = "none";
    }

    // Ensure contact section has no bottom margin/padding
    contactSection.style.marginBottom = "0";
    contactSection.style.paddingBottom = "0";
  }

  // Ensure footer is properly displayed
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.marginBottom = "0";
  }

  // Global fix for any extra space
  document.body.style.marginBottom = "0";
  document.body.style.paddingBottom = "0";
  document.documentElement.style.marginBottom = "0";
  document.documentElement.style.paddingBottom = "0";
}

// Export the initialization function and footer controller
export { initContactForm, showFooter };
