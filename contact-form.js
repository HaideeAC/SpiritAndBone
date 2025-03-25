/**
 * Spirit&Bone - Contact Form Module
 * Handles contact form interactions, validation, and submission
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

  // Make form elements visible immediately
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
    if (!validateForm(form)) {
      return;
    }

    // Add visual feedback during submission
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    // Prepare form data
    const formData = new FormData(form);
    formData.append("recipient", "alexanderopera@gmail.com"); // Add recipient email

    // You can use one of these methods to send the email:

    // Method 1: Using fetch to submit to a server endpoint
    // Replace 'your-server-endpoint' with the actual server endpoint that will process the email
    fetch("your-server-endpoint", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
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

        // Show footer
        const footer = document.querySelector("footer");
        if (footer) {
          footer.classList.add("visible");
        }

        // Ensure no extra space below footer
        fixFooterSpace();
      });

    /* 
    // Method 2: Using mailto link (fallback)
    // Note: This opens the user's email client and doesn't actually send the email automatically
    // It's a fallback option if server-side processing isn't available
    
    const name = form.querySelector("#name").value;
    const email = form.querySelector("#email").value;
    const message = form.querySelector("#message").value;
    
    const mailtoLink = `mailto:alexanderopera@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    window.location.href = mailtoLink;
    
    // Reset button and form after a delay
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      form.reset();
      
      // Show footer
      const footer = document.querySelector("footer");
      if (footer) {
        footer.classList.add("visible");
      }
      
      // Ensure no extra space below footer
      fixFooterSpace();
    }, 1000);
    */

    /* 
    // Method 3: Using a third-party email service (like EmailJS)
    // This requires including the EmailJS library and setting up an account
    
    // Example with EmailJS:
    // Include this in your HTML: <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
    
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form, 'YOUR_USER_ID')
      .then(function() {
        alert("Thank you for your message! We will get back to you soon.");
        form.reset();
      }, function(error) {
        console.error('Email error:', error);
        alert("There was an issue sending your message. Please try again later.");
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Show footer
        const footer = document.querySelector("footer");
        if (footer) {
          footer.classList.add("visible");
        }
        
        // Ensure no extra space below footer
        fixFooterSpace();
      });
    */
  });

  // Set up visibility observer
  setupVisibilityObserver(contactFormContainer);

  // Fix for extra space below footer
  fixFooterSpace();
}

// Validate form inputs
function validateForm(form) {
  // Get form fields
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

  // Add intersection observer to trigger animation when form is in viewport
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
    footer.classList.add("visible");
  }

  // Global fix for any extra space
  document.body.style.marginBottom = "0";
  document.body.style.paddingBottom = "0";
  document.documentElement.style.marginBottom = "0";
  document.documentElement.style.paddingBottom = "0";
}

// Export the initialization function
export { initContactForm };
