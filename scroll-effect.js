/* --Scroll effects-- */

import { debounce } from "./utils.js";
import { updateActiveIndicator } from "./main.js";

// main init function
function initScrollEffects() {
  // grab elements
  var sections = document.querySelectorAll(".section");
  var menuCircle = document.getElementById("menu-circle");
  var progressBar = document.getElementById("scroll-progress");

  // bail if no sections
  if (!sections.length) return;

  // run setup functions
  setupScrollIndicators();
  makeScrollingSmoother();
  window.scrollTo(0, 0); // start at top

  // watch for sections becoming visible
  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var sectionId = entry.target.id;

        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");

          // update nav dots and URL when loaded
          if (document.readyState === "complete") {
            updateActiveIndicator(sectionId);

            // update URL hash
            if (sectionId !== "home") {
              history.replaceState(null, null, "#" + sectionId);
            } else {
              history.replaceState(null, null, window.location.pathname);
            }
          }

          // section-specific stuff
          if (sectionId === "contact") {
            var contactForm = document.querySelector(".contact-form-container");
            if (contactForm) contactForm.classList.add("visible");

            // show footer if available
            if (typeof window.showFooter === "function") {
              window.showFooter();
            }
          }
        }
      }
    },
    {
      root: null,
      rootMargin: "-5% 0px -5% 0px",
      threshold: [0.05, 0.25],
    }
  );

  // observe all sections
  for (var i = 0; i < sections.length; i++) {
    observer.observe(sections[i]);
  }

  // add scroll handlers
  window.addEventListener("scroll", handleQuickScrollUpdates);
  window.addEventListener("scroll", debounce(handleSlowScrollUpdates, 50));

  // fast scroll handler for UI updates
  function handleQuickScrollUpdates() {
    // bail if elements missing
    if (!progressBar && !menuCircle) return;

    var scrollPos = window.scrollY;
    var windowHeight = window.innerHeight;

    // update progress bar width
    if (progressBar) {
      var pageHeight = document.body.scrollHeight - windowHeight;
      var scrollPercent = (scrollPos / pageHeight) * 100;
      progressBar.style.width = scrollPercent + "%";
    }

    // shrink menu circle as we scroll
    if (menuCircle) {
      var circle = menuCircle.querySelector(".circle");
      if (circle) {
        var startSize = 40; // original size in px
        var minSize = 36; // smallest size in px
        var scrollFactor = Math.min(scrollPos / 300, 1);
        var newSize = startSize - (startSize - minSize) * scrollFactor;

        circle.style.width = newSize + "px";
        circle.style.height = newSize + "px";
      }
    }
  }

  // slower scroll handler for less frequent stuff
  function handleSlowScrollUpdates() {
    var scrollPos = window.scrollY;
    var windowHeight = window.innerHeight;
    var pageHeight = document.body.scrollHeight - windowHeight;

    // check if we're near bottom - show footer
    if (
      (pageHeight - scrollPos < 50 || scrollPos >= pageHeight) &&
      typeof window.showFooter === "function"
    ) {
      window.showFooter();
    }

    // apply parallax effects based on scroll position
    doParallaxStuff(scrollPos, windowHeight);
  }

  // apply various parallax effects
  function doParallaxStuff(scrollPos, windowHeight) {
    // video background parallax
    var videoBox = document.querySelector(".video-container");
    if (videoBox) {
      var moveAmount = scrollPos * 0.15;
      var scaleAmount = 1 + scrollPos * 0.0002;
      videoBox.style.transform =
        "translateY(" +
        moveAmount +
        "px) translateZ(-1px) scale(" +
        scaleAmount +
        ")";
    }

    // team section parallax
    var teamPeople = document.querySelectorAll(".team-member");
    var teamSection = document.getElementById("team");

    if (teamPeople.length && teamSection) {
      var teamPos = scrollPos - teamSection.offsetTop;

      // only apply when team section is visible
      if (teamPos > -windowHeight && teamPos < windowHeight) {
        for (var i = 0; i < teamPeople.length; i++) {
          var member = teamPeople[i];
          var depthFactor = 0.05 + (i % 3) * 0.02;
          var xDir = i % 2 === 0 ? 1 : -1; // alternate direction
          var yMove = teamPos * depthFactor * 0.5;
          var xMove = teamPos * depthFactor * 0.2 * xDir;

          member.style.transform =
            "translate(" + xMove + "px, " + yMove + "px)";
        }
      }
    }

    // contact section parallax
    var contactItems = document.querySelectorAll(".contact-info > *");
    var contactSection = document.getElementById("contact");

    if (contactItems.length && contactSection) {
      var contactPos = scrollPos - contactSection.offsetTop;

      // only apply when contact section is visible
      if (contactPos > -windowHeight && contactPos < windowHeight) {
        for (var j = 0; j < contactItems.length; j++) {
          var item = contactItems[j];
          var moveY = contactPos * 0.05 * (j % 2 === 0 ? 1 : -1);
          item.style.transform = "translateY(" + moveY + "px)";
        }
      }
    }
  }

  // setup smooth scrolling
  function makeScrollingSmoother() {
    // use native smooth scrolling if browser supports it
    if ("scrollBehavior" in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = "smooth";

      // apply to all anchor links
      var anchorLinks = document.querySelectorAll('a[href^="#"]');
      for (var i = 0; i < anchorLinks.length; i++) {
        anchorLinks[i].addEventListener("click", function (e) {
          var href = this.getAttribute("href");
          if (href.length > 1) {
            var target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: "smooth" });
            }
          }
        });
      }
      return;
    }

    // fallback for older browsers
    var links = document.querySelectorAll('a[href^="#"]');
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener("click", function (e) {
        var href = this.getAttribute("href");
        if (href.length > 1) {
          e.preventDefault();

          var target = document.querySelector(href);
          if (target) {
            var targetY =
              target.getBoundingClientRect().top + window.pageYOffset;
            var startY = window.pageYOffset;
            var distance = targetY - startY;
            var duration = 2000; // ms
            var startTime = null;

            function scrollAnimation(currentTime) {
              if (startTime === null) startTime = currentTime;
              var timeElapsed = currentTime - startTime;
              var scrollY = easeScrolling(
                timeElapsed,
                startY,
                distance,
                duration
              );
              window.scrollTo(0, scrollY);

              if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
              }
            }

            // easing function - quadratic
            function easeScrolling(t, b, c, d) {
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(scrollAnimation);
          }
        }
      });
    }
  }

  // setup scroll indicators
  function setupScrollIndicators() {
    // handle home scroll down arrow
    var scrollDownBtn = document.querySelector(".scroll-down");
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener("click", function () {
        var projectSection = document.getElementById("project");
        if (projectSection) {
          projectSection.scrollIntoView({ behavior: "smooth" });
          updateActiveIndicator("project");
        }
      });
    }

    // handle indicator visibility based on scroll
    window.addEventListener(
      "scroll",
      debounce(function () {
        var scrollPos = window.scrollY;
        var windowHeight = window.innerHeight;

        // home scroll indicator
        if (scrollDownBtn) {
          var homeSection = document.getElementById("home");
          if (homeSection && scrollPos > windowHeight / 2) {
            scrollDownBtn.style.opacity = "0";
            setTimeout(function () {
              scrollDownBtn.style.display = "none";
            }, 500);
          } else if (homeSection) {
            scrollDownBtn.style.display = "block";
            setTimeout(function () {
              scrollDownBtn.style.opacity = "1";
            }, 100);
          }
        }
      }, 100)
    );
  }
}

// export just the init function
export { initScrollEffects };
