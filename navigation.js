/* ---Navigation--- */

import { updateActiveIndicator } from "/main.js";

// setup nav elements and handlers
function initNavigation() {
  // grab elements we need
  var menuBtn = document.getElementById("menu-circle");
  var navMenu = document.getElementById("nav-links");
  var closeBtn = document.getElementById("close-menu");

  // make transition elements
  makeTransitionElements();

  // bail if stuff is missing
  if (!menuBtn || !navMenu) return;

  // toggle menu when clicked
  menuBtn.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    var circle = menuBtn.querySelector(".circle");
    if (circle) {
      circle.classList.add("pulse");
      setTimeout(function () {
        circle.classList.remove("pulse");
      }, 700);
    }
  });

  // close with X button
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      navMenu.classList.remove("active");
    });
  }

  // hook up nav links
  hookupNavLinks(navMenu);

  // close menu when clicking elsewhere
  document.addEventListener("click", function (e) {
    if (
      navMenu.classList.contains("active") &&
      !navMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      navMenu.classList.remove("active");
    }
  });

  // escape key closes menu
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
    }
  });

  // section dots
  var dots = document.querySelectorAll(".indicator-dot");
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var sectionId = this.getAttribute("data-section");
      var sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        doTransition(sectionEl, sectionId);
      }
    });
  });
}

// create both transition overlays
function makeTransitionElements() {
  // remove any existing ones
  var oldOnes = document.querySelectorAll(
    ".page-transition-up, .page-transition-down"
  );
  for (var i = 0; i < oldOnes.length; i++) {
    oldOnes[i].remove();
  }

  // make upward transition
  var upTransition = document.createElement("div");
  upTransition.className = "page-transition page-transition-up";
  document.body.appendChild(upTransition);

  // make downward transition
  var downTransition = document.createElement("div");
  downTransition.className = "page-transition page-transition-down";
  document.body.appendChild(downTransition);
}

// attach click handlers to nav links
function hookupNavLinks(menu) {
  var links = document.querySelectorAll(".nav-links li a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
      // don't follow the link
      e.preventDefault();

      // figure out where to go
      var targetId = this.getAttribute("href").substring(1);
      var targetSection = document.getElementById(targetId);

      // close menu and run transition
      menu.classList.remove("active");
      doTransition(targetSection, targetId, this);
    });
  }
}

// figure out section order
function getSectionInfo() {
  var sectionIds = ["home", "project", "team", "contact"];
  var activeDot = document.querySelector(".indicator-dot.active");
  var currentId = activeDot ? activeDot.getAttribute("data-section") : "";

  return {
    list: sectionIds,
    current: sectionIds.indexOf(currentId),
  };
}

// run page transition animation
function doTransition(target, targetId, clickedLink) {
  // bail if no target
  if (!target) return;

  // figure out where we are
  var info = getSectionInfo();
  var targetIndex = info.list.indexOf(targetId);

  // figure out direction - default to down if we can't tell
  var goingUp = info.current !== -1 && targetIndex < info.current;

  // get the right transition element
  var transEl = document.querySelector(
    goingUp ? ".page-transition-up" : ".page-transition-down"
  );

  if (!transEl) return;

  // lock the page
  document.body.classList.add("is-transitioning");
  if (clickedLink) clickedLink.classList.add("nav-selected");

  // Phase 1: transition slides in
  transEl.classList.add("enter");

  // Phase 2: after covering screen, update content
  setTimeout(function () {
    // mark active section
    var allSections = document.querySelectorAll(".section");
    for (var i = 0; i < allSections.length; i++) {
      allSections[i].classList.remove("transition-in");
    }

    target.classList.add("transition-in");

    // update indicator and URL
    updateActiveIndicator(targetId);
    target.scrollIntoView({ behavior: "auto" });
    history.pushState(null, null, "#" + targetId);

    // Phase 3: slide out in opposite direction
    transEl.classList.remove("enter");
    transEl.classList.add("exit");

    // Phase 4: cleanup after exit done
    setTimeout(function () {
      transEl.classList.remove("exit");
      document.body.classList.remove("is-transitioning");
      if (clickedLink) clickedLink.classList.remove("nav-selected");
    }, 700);
  }, 700);
}

// export just the init function
export { initNavigation };
