/* ============================================================
   EVERY SHAPE — VERSION 2 behaviour
   - Left index <-> right story stay in sync
   - Clicking things on the right opens details on the left (morphing)
   ============================================================ */
(function () {
  var mobile = window.matchMedia("(max-width: 900px)");
  var right = document.getElementById("right");
  var left = document.getElementById("left");
  var detail = document.getElementById("detail");
  var detailBody = document.getElementById("detail-body");
  var chaps = Array.prototype.slice.call(document.querySelectorAll(".chap"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".ch[data-chapter]"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canMorph = !!document.startViewTransition && !reduce;
  var lastTrigger = null;

  function scroller() { return mobile.matches ? window : right; }

  if (window.ESMotion) window.ESMotion.init({ scroller: scroller() });

  /* ---------- active chapter ---------- */
  function setActive(id) {
    if (left.getAttribute("data-chapter") === id) return;
    left.setAttribute("data-chapter", id);
    chaps.forEach(function (c) {
      var on = c.getAttribute("data-target") === id;
      c.classList.toggle("is-active", on);
      if (on) {
        c.setAttribute("aria-current", "true");
        if (mobile.matches) c.scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" });
      } else {
        c.removeAttribute("aria-current");
      }
    });
  }

  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    closeDetail(true);
    setActive(id);
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  chaps.forEach(function (c) {
    c.addEventListener("click", function () { goTo(c.getAttribute("data-target")); });
  });

  document.addEventListener("click", function (e) {
    var jump = e.target.closest("[data-jump]");
    if (jump) { e.preventDefault(); goTo(jump.getAttribute("data-jump")); }
  });

  /* scroll spy: whichever chapter crosses the upper-middle of the story */
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) setActive(en.target.getAttribute("data-chapter"));
    });
  }, { root: mobile.matches ? null : right, rootMargin: "-35% 0px -60% 0px" });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- details (left side reacts to right side) ---------- */
  function clearNames() {
    document.querySelectorAll("[style*='view-transition-name']").forEach(function (el) {
      el.style.viewTransitionName = "";
    });
  }

  function openDetail(tplId, trigger) {
    var tpl = document.getElementById(tplId);
    if (!tpl) return;
    lastTrigger = trigger;
    var src = trigger.querySelector("[data-morph]") || (trigger.classList.contains("faq-q") ? trigger : null);

    document.querySelectorAll(".faq-q.is-open").forEach(function (q) { q.classList.remove("is-open"); });
    if (trigger.classList.contains("faq-q")) trigger.classList.add("is-open");

    function render() {
      detailBody.replaceChildren(tpl.content.cloneNode(true));
      if (window.ESI18n) window.ESI18n.translate(detailBody);
      detail.hidden = false;
      if (src) src.style.viewTransitionName = "";
      var dst = detailBody.querySelector("[data-morph]");
      if (dst && canMorph && src) dst.style.viewTransitionName = "morph";
    }

    if (canMorph && src) {
      clearNames();
      src.style.viewTransitionName = "morph";
      var t = document.startViewTransition(render);
      t.finished.finally(clearNames);
    } else {
      render();
      detail.classList.remove("is-entering");
      void detail.offsetWidth;
      detail.classList.add("is-entering");
    }
    detail.querySelector(".detail__close").focus({ preventScroll: true });
    if (window.ESMotion) window.ESMotion.magnetic(detail);
  }

  function closeDetail(silent) {
    if (detail.hidden) return;
    var dst = detailBody.querySelector("[data-morph]");
    var src = lastTrigger && (lastTrigger.querySelector("[data-morph]") || (lastTrigger.classList.contains("faq-q") ? lastTrigger : null));
    function hide() {
      detail.hidden = true;
      if (dst) dst.style.viewTransitionName = "";
      if (src && canMorph && !silent) src.style.viewTransitionName = "morph";
    }
    document.querySelectorAll(".faq-q.is-open").forEach(function (q) { q.classList.remove("is-open"); });
    if (canMorph && dst && src && !silent) {
      clearNames();
      dst.style.viewTransitionName = "morph";
      document.startViewTransition(hide).finished.finally(clearNames);
    } else {
      hide();
    }
    if (!silent && lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-detail]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (!detail.hidden && lastTrigger === el) { closeDetail(); return; }
      openDetail(el.getAttribute("data-detail"), el);
    });
  });
  detail.querySelector(".detail__close").addEventListener("click", function () { closeDetail(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDetail(); });

  /* ---------- small things ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var form = document.getElementById("contact-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = "Thanks! This form isn't connected yet. Please call or text +1 (917) 310-5162, or email hi@everyshapetherapy.com.";
    document.getElementById("form-note").textContent = window.ESI18n ? window.ESI18n.t(msg) : msg;
  });
})();
