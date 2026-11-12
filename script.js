// Current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form: not connected to an email service yet.
// When you set one up (see README), replace this block.
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var msg = "Thanks! This form isn't connected yet. Please call or text +1 (917) 310-5162, or email hi@everyshapetherapy.com.";
  document.getElementById("form-note").textContent = window.ESI18n ? window.ESI18n.t(msg) : msg;
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
    place(tab);
  }
  // On phones the answer opens right under its question; on wider screens it sits beside the list
  var home = bubble.parentElement, phone = window.matchMedia("(max-width: 520px)");
  function place(tab) {
    if (phone.matches) tab.after(bubble);
    else if (bubble.parentElement !== home) home.appendChild(bubble);
  }
  phone.addEventListener("change", function () { place(tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0]); });
  place(tabs[0]);
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

// Curriculum: pick an interest, light up the skills it builds
(function () {
  var box = document.querySelector("[data-ways]");
  if (!box) return;
  var ways = Array.prototype.slice.call(box.querySelectorAll(".way"));
  var says = box.querySelectorAll(".way__say p");
  var say = box.querySelector(".way__say");
  var skills = box.querySelectorAll(".skill");
  var tint = { pink: "var(--t-pink)", yellow: "var(--t-yellow)", sage: "var(--t-sage)", red: "var(--t-red)" };
  function pick(w) {
    var i = ways.indexOf(w), keys = (w.getAttribute("data-skills") || "").split(" ");
    var t = tint[w.getAttribute("data-color")] || tint.pink;
    ways.forEach(function (x) { var on = x === w; x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1; });
    says.forEach(function (p, j) { p.hidden = j !== i; });
    say.style.backgroundColor = t;
    skills.forEach(function (s) {
      var on = keys.indexOf(s.getAttribute("data-skill")) > -1;
      s.classList.toggle("is-on", on);
      s.style.setProperty("--t", t);
    });
    box.classList.add("has-pick");
  }
  ways.forEach(function (w, i) {
    w.addEventListener("click", function () { pick(w); });
    w.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return; e.preventDefault();
      var n = ways[(i + d + ways.length) % ways.length]; pick(n); n.focus();
    });
  });
  pick(ways[0]);
})();

// Header: underline the section you're reading
(function () {
  var links = document.querySelectorAll(".site-nav a");
  if (!("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle("is-here", a.getAttribute("href") === "#" + en.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });
})();

// Motion: magnetic buttons, custom cursor, parallax stickers, reveal on scroll
(function () {
  function mark(sel, attr, val) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.setAttribute(attr, typeof val === "function" ? val(i) : val);
    });
  }
  mark(".paper-btn", "data-magnetic", "0.3");
  mark(".brand", "data-magnetic", "0.15");
  mark(".frame--pill", "data-speed", function (i) { return i % 2 ? "-0.08" : "0.1"; });
  mark(".frame--pop img", "data-speed", "-0.05");
  mark(".svc__kid", "data-speed", "0.1");
  mark(".sheet h2, .founder, .skill", "data-reveal", function (i) { return String((i % 3) + 1); });
  mark(".founder", "data-cursor", "Hi");
  mark(".way", "data-cursor", "Pick");
  mark(".faq-q", "data-cursor", "Ask");
  if (window.ESMotion) window.ESMotion.init();
})();
