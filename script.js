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
