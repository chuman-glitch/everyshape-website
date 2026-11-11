/* ============================================================
   EVERY SHAPE — version 3
   - Cards with data-open="x" open <template id="x"> in a panel that
     slides open right under the row of the card you clicked.
   - Gentle fade-in on scroll for anything with data-reveal.
   ============================================================ */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year + form ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  var form = document.getElementById("contact-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = "Thanks! This form isn't connected yet. Please call or text +1 (917) 310-5162, or email hi@everyshapetherapy.com.";
    document.getElementById("form-note").textContent = window.ESI18n ? window.ESI18n.t(msg) : msg;
  });

  /* ---------- open in place ---------- */
  function lastInRow(card) {
    var group = card.parentElement, last = card;
    Array.prototype.forEach.call(group.children, function (c) {
      if (c.classList.contains("xpanel")) return;
      if (Math.abs(c.offsetTop - card.offsetTop) < 4) last = c;
    });
    return last;
  }

  function close(group, instant) {
    var p = group.querySelector(".xpanel");
    group.querySelectorAll("[aria-expanded=true]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (!p) return;
    if (instant || reduce) { p.remove(); return; }
    p.classList.remove("is-open");
    setTimeout(function () { p.remove(); }, 380);
  }

  function open(card) {
    var group = card.closest("[data-group]");
    var wasOpen = card.getAttribute("aria-expanded") === "true";
    var old = group.querySelector(".xpanel");
    var sameRow = old && old.previousElementSibling === lastInRow(card);
    close(group, sameRow);
    if (wasOpen) return;

    var tpl = document.getElementById(card.getAttribute("data-open"));
    if (!tpl) return;
    var p = document.createElement("div");
    p.className = "xpanel" + (card.classList.contains("person") ? " xpanel--person" : "");
    p.setAttribute("role", "region");
    p.innerHTML = '<div class="xpanel__clip"><div class="xpanel__in"><button class="xpanel__close" type="button" aria-label="Close">×</button></div></div>';
    var inner = p.querySelector(".xpanel__in");
    inner.appendChild(tpl.content.cloneNode(true));
    if (!inner.querySelector(".x__kid, .x__photo")) inner.classList.add("xpanel__in--text");
    lastInRow(card).after(p);
    if (window.ESI18n) window.ESI18n.translate(p);
    card.setAttribute("aria-expanded", "true");
    p.querySelector(".xpanel__close").addEventListener("click", function () { close(group); card.focus(); });
    if (sameRow || reduce) p.classList.add("is-open");
    else requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add("is-open"); }); });

    /* bring the panel into view if it opened below the fold */
    setTimeout(function () {
      var r = p.getBoundingClientRect();
      if (r.bottom > window.innerHeight) window.scrollBy({ top: Math.min(r.bottom - window.innerHeight + 24, r.top - 90), behavior: reduce ? "auto" : "smooth" });
    }, 420);
  }

  document.addEventListener("click", function (e) {
    var card = e.target.closest("[data-open]");
    if (card) open(card);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll("[data-group]").forEach(function (g) { close(g); });
  });
  /* re-place an open panel if the layout reflows (window resized) */
  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(function () {
      document.querySelectorAll("[data-group]").forEach(function (g) {
        var b = g.querySelector("[aria-expanded=true]"), p = g.querySelector(".xpanel");
        if (b && p && p.previousElementSibling !== lastInRow(b)) lastInRow(b).after(p);
      });
    }, 150);
  });

  /* ---------- header shadow once you scroll ---------- */
  var top = document.querySelector(".top");
  window.addEventListener("scroll", function () { top.classList.toggle("is-scrolled", window.scrollY > 8); }, { passive: true });

  /* ---------- reveal on scroll ---------- */
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("can-reveal");
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
})();
