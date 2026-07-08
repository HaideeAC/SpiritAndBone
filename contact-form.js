// Find form when page loads, set up events
function initContactForm() {
  let formBox = document.querySelector(".contact-form-container");
  if (!formBox) {
    console.error("Can't find the contact form box");
    return;
  }

  formBox.classList.add("visible");

  let formEl = formBox.querySelector("form");
  if (!formEl) {
    console.error("No form inside the container");
    return;
  }

  // Form submit handler
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check valid inputs
    if (!checkFormFields(formEl)) return;

    // Get button for status updates
    let submitBtn = formEl.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    // Save text and update status
    let btnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Prepare data to send
    let data = new FormData(formEl);
    data.append("recipient", "alexanderopera@gmail.com");

    // Send the form data
    fetch("https://formsubmit.co/ajax/alexanderopera@gmail.com", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Server error");
      })
      .then(() => {
        alert("Thank you for your message! We will get back to you soon.");
        formEl.reset();
      })
      .catch((err) => {
        console.error("Problem:", err);
        alert("Sorry, couldn't send your message. Try again later.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = btnText;
        makeFooterVisible();
      });
  });

  // Set up fade-in effects
  setupFadeEffects(formBox);

  // Handle footer visibility on scroll
  setupFooterVisibility();

  // Get footer element
  let footerEl = document.querySelector("footer");
  if (footerEl) {
    // Make function available globally
    window.showFooter = makeFooterVisible;

    // Show footer if we're at bottom
    if (isAtPageBottom()) {
      makeFooterVisible();
    }
  }
}

// Wire up the mailing list circle (email input + JOIN button)
function initMailingList() {
  let circle = document.querySelector(".mailing-list-circle");
  if (!circle) {
    console.error("Can't find the mailing list circle");
    return;
  }

  let emailInput = circle.querySelector(".mailing-list-input");
  let joinBtn = circle.querySelector(".mailing-list-join-btn");

  if (!emailInput || !joinBtn) {
    console.error("Mailing list input or button missing");
    return;
  }

  let emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function submitEmail() {
    let email = emailInput.value.trim();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    if (!emailCheck.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    let btnText = joinBtn.textContent;
    joinBtn.disabled = true;
    joinBtn.textContent = "...";

    // Brevo signup form fields
    let data = new FormData();
    data.append("EMAIL", email);
    data.append("email_address_check", ""); // honeypot - must stay empty
    data.append("locale", "en");

    // Brevo's form endpoint doesn't give a readable CORS response to a
    // plain fetch, so this is sent in no-cors mode. That means we can't
    // actually confirm success/failure from the response - only that the
    // request went out. Verify real signups by checking the Contacts
    // list in Brevo.
    fetch(
      "https://0eea910f.sibforms.com/serve/MUIFAIie5Lgs9HwRq9EW2cJH-v4i9trP0IMwmJGL7-YfCQUjDtjjfiJjBqQLHj3o4LmNUepRSXYQTH72uWooe7l65UU6NouhkIcuGZDS2Qwz_8xswKvVlI8LU7sDiTQ3LWDUxflglVgKXndV-Si0pRk30yGygjusFCptQeV2RPSJviQuVDbiBP2uO1QsmKPTHYllySlzrc0WVFtGdw==",
      {
        method: "POST",
        mode: "no-cors",
        body: data,
      },
    )
      .then(() => {
        alert("Thanks for joining our mailing list!");
        emailInput.value = "";
      })
      .catch((err) => {
        console.error("Mailing list signup problem:", err);
        alert("Sorry, couldn't sign you up. Please try again later.");
      })
      .finally(() => {
        joinBtn.disabled = false;
        joinBtn.textContent = btnText;
      });
  }

  // Click JOIN button
  joinBtn.addEventListener("click", submitEmail);

  // Also allow hitting Enter in the input
  emailInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitEmail();
    }
  });
}

// Make sure all required fields are filled
function checkFormFields(form) {
  let nameVal = form.querySelector("#name")?.value.trim();
  let emailVal = form.querySelector("#email")?.value.trim();
  let msgVal = form.querySelector("#message")?.value.trim();

  // Make sure everything is filled
  if (!nameVal || !emailVal || !msgVal) {
    alert("Please fill out all fields.");
    return false;
  }

  // Check email format
  let emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailCheck.test(emailVal)) {
    alert("Please enter a valid email address.");
    return false;
  }

  return true;
}

// Add fade-in animation to form elements
function setupFadeEffects(container) {
  let inputs = container.querySelectorAll(".form-group");

  // Add staggered delays
  inputs.forEach(function (inp, idx) {
    inp.style.transitionDelay = idx * 0.1 + "s";
  });

  // Create scroll watcher
  let watcher = new IntersectionObserver(
    function (items) {
      if (items[0].isIntersecting) {
        container.classList.add("visible");

        // Also animate contact info
        let infoBox = document.querySelector(".contact-info");
        if (infoBox) {
          infoBox.style.transition = "transform 0.5s ease 0.3s";
          infoBox.style.transform = "translateY(0)";
        }

        // Stop watching
        watcher.unobserve(items[0].target);
      }
    },
    { threshold: 0.2 },
  );

  // Start watching
  watcher.observe(container);

  // Set initial state
  let infoBox = document.querySelector(".contact-info");
  if (infoBox) {
    infoBox.style.transform = "translateY(20px)";
  }
}

// Watch for contact section visibility
function setupFooterVisibility() {
  let contactEl = document.getElementById("contact");
  if (!contactEl) return;

  // Create watcher
  let watcher = new IntersectionObserver(
    function (items) {
      if (items[0].isIntersecting || isAtPageBottom()) {
        makeFooterVisible();
      }
    },
    { threshold: 0.8 },
  );

  // Start watching
  watcher.observe(contactEl);

  // Fix spacing when window resizes
  window.addEventListener("resize", fixPageSpacing);
}

// Check if we're near the bottom of page
function isAtPageBottom() {
  let scrollPos = window.scrollY || document.documentElement.scrollTop;
  let viewportHeight = window.innerHeight;
  let docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );

  // Within 100px of bottom
  return docHeight - (scrollPos + viewportHeight) < 100;
}

// Show the footer element
function makeFooterVisible() {
  let footerEl = document.querySelector("footer");
  if (!footerEl) return;

  footerEl.classList.add("visible");
  fixPageSpacing();
}

// Fix spacing issues with footer
function fixPageSpacing() {
  // Handle contact section
  let contactEl = document.getElementById("contact");
  if (contactEl) {
    let nextEl = contactEl.nextElementSibling;
    if (nextEl && nextEl.classList.contains("section-spacer")) {
      nextEl.style.display = "none";
    }

    // Remove margins
    contactEl.style.marginBottom = "0";
    contactEl.style.paddingBottom = "0";
  }

  // Fix footer margin
  let footerEl = document.querySelector("footer");
  if (footerEl) {
    footerEl.style.marginBottom = "0";
  }

  // Fix body margins
  document.body.style.marginBottom = "0";
  document.body.style.paddingBottom = "0";
  document.documentElement.style.marginBottom = "0";
  document.documentElement.style.paddingBottom = "0";
}

// Export these functions for use elsewhere
export { initContactForm, makeFooterVisible as showFooter, initMailingList };
