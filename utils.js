/* ---Utility functions--- */

// stops functions from firing too often during scroll
function debounce(fn, wait, runFirst) {
  var timer;

  return function () {
    var context = this;
    var args = arguments;

    // function to run after delay
    var laterFn = function () {
      timer = null;
      if (!runFirst) fn.apply(context, args);
    };

    // if we want to run immediately and no timer exists
    var callNow = runFirst && !timer;

    // clear existing timer
    clearTimeout(timer);

    // set new timer
    timer = setTimeout(laterFn, wait || 20);

    // run now if needed
    if (callNow) fn.apply(context, args);
  };
}

// limits how often a function runs
function throttle(fn, limit) {
  var lastRun = 0;
  var waiting = null;

  // set default if not provided
  limit = limit || 300;

  return function () {
    var self = this;
    var stuff = arguments;
    var now = Date.now();

    // if enough time passed, run right away
    if (now - lastRun >= limit) {
      // if there's a waiting call, cancel it
      if (waiting) clearTimeout(waiting);

      // run function & update timestamp
      fn.apply(self, stuff);
      lastRun = now;
    } else {
      // not enough time passed, schedule for later
      clearTimeout(waiting);
      waiting = setTimeout(function () {
        // make sure we update lastRun when it finally executes
        lastRun = Date.now();
        fn.apply(self, stuff);
      }, limit - (now - lastRun));
    }
  };
}

// check if element is visible
function isInViewport(el, offset) {
  // bail if element not found
  if (!el) return false;

  // default offset to 0 if not passed
  offset = offset || 0;

  // get element position
  var box = el.getBoundingClientRect();

  // get viewport dimensions
  var winHeight = window.innerHeight || document.documentElement.clientHeight;
  var winWidth = window.innerWidth || document.documentElement.clientWidth;

  // check if element is in viewport with offset
  return (
    box.top - offset <= winHeight &&
    box.left - offset <= winWidth &&
    box.bottom + offset >= 0 &&
    box.right + offset >= 0
  );
}

// export our functions
export { debounce, throttle, isInViewport };
