/*
 * Fireflies over the skyline.
 *
 * Replaces ~1,300 lines of generated @keyframes with randomized Web Animations.
 * Progressive enhancement: with JS off the page is complete, just still.
 */
(function () {
  "use strict";

  var layer = document.querySelector(".fireflies");
  if (!layer || typeof layer.animate !== "function") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var animations = [];
  var resizeTimer;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function clear() {
    animations.forEach(function (a) {
      a.cancel();
    });
    animations = [];
    layer.textContent = "";
  }

  function build() {
    clear();
    if (reduceMotion.matches) return;

    var w = window.innerWidth || layer.clientWidth;
    var h = window.innerHeight || layer.clientHeight;

    // Scale with area so a phone feels as populated as a monitor.
    var count = Math.min(46, Math.max(16, Math.round((w * h) / 26000)));
    var frag = document.createDocumentFragment();
    var flies = [];

    for (var i = 0; i < count; i++) {
      var fly = document.createElement("span");
      var size = rand(2, 4.5).toFixed(1);
      fly.className = "firefly";
      fly.style.width = size + "px";
      fly.style.height = size + "px";
      frag.appendChild(fly);
      flies.push(fly);
    }
    layer.appendChild(frag);

    flies.forEach(function (fly) {
      // A closed loop of 4–6 waypoints so the drift never jumps at the seam.
      var steps = Math.round(rand(4, 6));
      var frames = [];
      for (var s = 0; s < steps; s++) {
        frames.push({
          transform:
            "translate3d(" +
            rand(-40, w + 40).toFixed(0) + "px," +
            rand(-40, h + 40).toFixed(0) + "px,0) scale(" +
            rand(0.6, 1.35).toFixed(2) + ")",
          easing: "ease-in-out"
        });
      }
      frames.push(frames[0]);

      animations.push(
        fly.animate(frames, {
          duration: rand(24000, 48000),
          delay: -rand(0, 24000), // stagger: everyone is already mid-flight
          iterations: Infinity
        })
      );

      // Two soft pulses per cycle, never fully out. A firefly that spends most
      // of its life at opacity 0 reads as an empty sky.
      var peak = rand(0.6, 1);
      animations.push(
        fly.animate(
          [
            { opacity: peak * 0.22 },
            { opacity: peak, offset: 0.22 },
            { opacity: peak * 0.3, offset: 0.47 },
            { opacity: peak * 0.85, offset: 0.7 },
            { opacity: peak * 0.22 }
          ],
          {
            duration: rand(4200, 9000),
            delay: -rand(0, 9000),
            iterations: Infinity,
            easing: "ease-in-out"
          }
        )
      );
    });
  }

  // A backgrounded tab should cost nothing.
  document.addEventListener("visibilitychange", function () {
    animations.forEach(function (a) {
      document.hidden ? a.pause() : a.play();
    });
  });

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 300);
  });

  // Honor the preference changing mid-session.
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", build);
  }

  build();
})();
