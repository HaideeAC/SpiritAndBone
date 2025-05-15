/* Contact Form */

// Initialize contact form
function initContactForm() {
  const contactFormContainer = document.querySelector(
    ".contact-form-container"
  );
  if (!contactFormContainer) {
    console.error("Contact form container not found");
    return;
  }

  contactFormContainer.classList.add("visible");

  const form = contactFormContainer.querySelector("form");
  if (!form) {
    console.error("Contact form not found");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm(form)) return;

    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const formData = new FormData(form);
    formData.append("recipient", "alexanderopera@gmail.com");

    fetch("https://formsubmit.co/alexanderopera@gmail.com", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) return response;
        throw new Error("Network response was not ok.");
      })
      .then(() => {
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
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        showFooter();
      });
  });

  setupVisibilityObserver(contactFormContainer);

  showFooterOnScroll();

  window.addEventListener("resize", fixFooterSpace);

  const footer = document.querySelector("footer");
  if (footer) {
    window.showFooter = showFooter;

    if (isNearPageBottom()) {
      showFooter();
    }
  }
}

function validateForm(form) {
  const name = form.querySelector("#name")?.value.trim();
  const email = form.querySelector("#email")?.value.trim();
  const message = form.querySelector("#message")?.value.trim();

  if (!name || !email || !message) {
    alert("Please fill out all fields.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  return true;
}

function setupVisibilityObserver(container) {
  const formGroups = container.querySelectorAll(".form-group");
  formGroups.forEach((group, index) => {
    group.style.transitionDelay = `${index * 0.1}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          container.classList.add("visible");

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

  const contactInfo = document.querySelector(".contact-info");
  if (contactInfo) {
    contactInfo.style.transform = "translateY(20px)";
  }
}

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

function isNearPageBottom() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );

  return docHeight - (scrollTop + windowHeight) < 100;
}

function showFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.classList.add("visible");
  fixFooterSpace();
}

function fixFooterSpace() {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    const nextElement = contactSection.nextElementSibling;
    if (nextElement && nextElement.classList.contains("section-spacer")) {
      nextElement.style.display = "none";
    }

    contactSection.style.marginBottom = "0";
    contactSection.style.paddingBottom = "0";
  }

  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.marginBottom = "0";
  }

  document.body.style.marginBottom = "0";
  document.body.style.paddingBottom = "0";
  document.documentElement.style.marginBottom = "0";
  document.documentElement.style.paddingBottom = "0";
}

export { initContactForm, showFooter };
