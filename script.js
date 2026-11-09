// Current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form: not connected to an email service yet.
// When you set one up (see README), replace this block.
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("form-note").textContent =
    "Thanks! This form isn't connected yet. Please call or text +1 (917) 310-5162, or email hi@everyshapetherapy.com.";
});

// FAQ: show the answer for the selected question inside the big bubble
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".faq-q"));
  var bubble = document.querySelector(".faq-c__bubble");
  if (!tabs.length || !bubble) return;
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    bubble.setAttribute("data-color", tab.getAttribute("data-color") || "pink");
  }
  tabs.forEach(function (tab, i) {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var next = tabs[(i + d + tabs.length) % tabs.length];
      select(next); next.focus();
    });
  });
})();

// Motion: magnetic buttons, custom cursor, parallax stickers, reveal on scroll
(function () {
  function mark(sel, attr, val) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.setAttribute(attr, typeof val === "function" ? val(i) : val);
    });
  }
  mark(".paper-btn, .site-nav a", "data-magnetic", "0.3");
  mark(".brand", "data-magnetic", "0.15");
  mark(".frame--pill", "data-speed", function (i) { return i % 2 ? "-0.08" : "0.1"; });
  mark(".frame--pop img", "data-speed", "-0.05");
  mark(".approach__kid, .places__kid", "data-speed", "0.12");
  mark(".duo__chair, .community__kids", "data-speed", "-0.1");
  mark(".duo__a", "data-speed", "0.05");
  mark(".duo__b", "data-speed", "-0.07");
  mark(".motif", "data-speed", function (i) { return i % 2 ? "-0.25" : "0.2"; });
  mark(".sheet h2, .step, .founder, .rbt, .place, .outing", "data-reveal", function (i) { return String((i % 3) + 1); });
  mark(".founder, .rbt", "data-cursor", "Hi");
  mark(".faq-q", "data-cursor", "Ask");
  if (window.ESMotion) window.ESMotion.init();
})();
