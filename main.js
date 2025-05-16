/* --Core Js-- */

import { initVideoReveal } from "/video-reveal.js";
import { initNavigation } from "/navigation.js";
import { initScrollEffects } from "/scroll-effect.js";
import { initTeamSection } from "/team-members.js";
import { initContactForm } from "/contact-form.js";
import { initProjectParallax } from "/project.js";
import { debounce } from "/utils.js";

// tracking vars
var pageLoadStatus = true;
var inTransition = false;

// highlight active section marker
function highlightSection(id) {
  var markers = document.querySelectorAll(".indicator-dot");
  for (var i = 0; i < markers.length; i++) {
    var m = markers[i];
    if (m.getAttribute("data-section") === id) {
      m.classList.add("active");
    } else {
      m.classList.remove("active");
    }
  }
}

// jump to section
function jumpTo(id) {
  var section = document.getElementById(id);
  if (!section) return;

  // go there
  section.scrollIntoView({ behavior: "smooth" });

  // update indicator
  highlightSection(id);

  // change url but don't make history entries
  if (id != "home") {
    history.replaceState(null, null, "#" + id);
  } else {
    history.replaceState(null, null, " ");
  }
}

// figure out where we are
function updateLocation() {
  // bail if we're in the middle of a transition
  if (inTransition) return;

  var allSections = document.querySelectorAll(".section");
  var whereAmI = window.scrollY + window.innerHeight / 3;
  var i,
    current = null;

  // hunt through sections
  for (i = 0; i < allSections.length; i++) {
    var s = allSections[i];
    var topPos = s.offsetTop;
    var height = s.offsetHeight;

    if (whereAmI >= topPos && whereAmI < topPos + height) {
      current = s.id;
      break;
    }
  }

  // found one
  if (current) {
    highlightSection(current);

    // update URL silently
    if (history.replaceState) {
      if (current != "home") {
        history.replaceState(null, null, "#" + current);
      } else {
        history.replaceState(null, null, " ");
      }
    }
  }
}

// load key files first
function loadStuff() {
  // stuff to load
  var items = [
    "/images/texture1.jpg",
    "/images/texture.jpg",
    "/images/project1.jpg",
    "/images/project2.jpg",
    "/images/ed.jpg",
    "/images/elbaby.jpg",
    { type: "sound", url: "/audio/pandeiro.mp3" },
  ];

  // try to load them
  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    if (typeof item === "string") {
      // it's an image
      var img = new Image();
      img.src = item;
    } else if (item.type === "sound") {
      // it's audio
      var snd = new Audio();
      snd.preload = "auto";
      snd.src = item.url;
    }
  }
}

// show loading spinner
function startSpinner() {
  // create loader
  var spinny = document.createElement("div");
  spinny.className = "page-loader";
  spinny.innerHTML = `
    <div class="loader-content">
      <div class="loader-circle"></div>
      <div class="loader-text">SPIRIT & BONE</div>
    </div>
  `;

  // add to page
  document.body.appendChild(spinny);

  // start loading
  loadStuff();

  // hide when done loading
  window.addEventListener("load", function () {
    // small delay looks better
    setTimeout(function () {
      spinny.classList.add("loaded");
      pageLoadStatus = false;

      // remove from DOM after animation
      setTimeout(function () {
        spinny.remove();
      }, 800);
    }, 1000);
  });

  // failsafe - remove after 5s even if not loaded
  setTimeout(function () {
    if (pageLoadStatus) {
      spinny.classList.add("loaded");
      pageLoadStatus = false;
      setTimeout(function () {
        spinny.remove();
      }, 800);
    }
  }, 5000);
}

// add transition element
function createTransitionEl() {
  var t = document.createElement("div");
  t.className = "page-transition";
  document.body.appendChild(t);
  return t;
}

// hook up event handlers
function hookEvents(transition) {
  // setup nav dots
  var dots = document.querySelectorAll(".indicator-dot");
  for (var i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", function () {
      var target = this.getAttribute("data-section");
      jumpTo(target);
    });
  }

  // watch scrolling
  window.addEventListener("scroll", debounce(updateLocation, 100));
}

// fade in sections that start visible
function handleInitialFades() {
  var sections = document.querySelectorAll(".section");

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var box = section.getBoundingClientRect();

    if (box.top >= 0 && box.top <= window.innerHeight) {
      // it's visible at load
      section.classList.add("fade-in");

      // special handling for some sections
      if (section.id === "project") {
        var projectBox = document.querySelector(".project-container");
        if (projectBox) projectBox.classList.add("visible");
      }

      if (section.id === "contact") {
        var formBox = document.querySelector(".contact-form-container");
        if (formBox) formBox.classList.add("visible");
      }
    }
  }
}

// handle URL hash on load
function checkUrlHash() {
  // bail if it's just #home
  if (window.location.hash === "#home") {
    history.replaceState(null, null, window.location.pathname);
    return;
  }

  // check for hash
  var hash = window.location.hash;
  if (hash && hash !== "#home") {
    // find section
    var target = document.querySelector(hash);
    if (target) {
      // wait for stuff to load
      setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth" });
        highlightSection(hash.substring(1));
      }, 2000);
    }
  } else {
    // force to top
    window.scrollTo(0, 0);
    highlightSection("home");
  }
}

// when DOM loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Site loading...");

  // scroll to top
  window.scrollTo(0, 0);

  // disable browser scroll memory
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // add home-page class if applicable
  if (!window.location.hash || window.location.hash === "#home") {
    document.body.classList.add("home-page");
  }

  // loader first
  startSpinner();

  // setup transitions
  var transEl = createTransitionEl();

  // init all the modules
  initVideoReveal();
  initNavigation(transEl);
  initScrollEffects();
  initTeamSection();
  initContactForm();
  initProjectParallax();

  // hook up everything
  hookEvents(transEl);
  handleInitialFades();
  checkUrlHash();

  // pulse the menu after loading
  setTimeout(function () {
    var menuCircle = document.querySelector(".menu-circle .circle");
    if (menuCircle) {
      menuCircle.classList.add("pulse");
      setTimeout(function () {
        menuCircle.classList.remove("pulse");
      }, 700);
    }
  }, 2500);
});

// export needed globals
export { highlightSection as updateActiveIndicator, jumpTo as scrollToSection };
