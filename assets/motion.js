/* ============================================================
   EVERY SHAPE — shared motion
   - Custom cursor (mouse/trackpad only)
   - Magnetic hover: add data-magnetic to any link or button
   - Parallax: add data-speed="0.2" (negative = moves the other way)
   - Reveal on scroll: add data-reveal
   Everything is skipped when the visitor asks for reduced motion.
   ============================================================ */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- custom cursor ---------- */
  function initCursor() {
    if (reduce || !finePointer) return;
    var root = document.createElement("div");
    root.className = "es-cursor";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = '<span class="es-cursor__dot"></span><span class="es-cursor__ring"><span class="es-cursor__label"></span></span>';
    document.body.appendChild(root);
    document.documentElement.classList.add("has-es-cursor");

    var dot = root.firstChild, ring = root.lastChild, label = ring.firstChild;
    var mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener("mouseleave", function () { root.classList.add("is-hidden"); });
    document.addEventListener("mouseenter", function () { root.classList.remove("is-hidden"); });
    window.addEventListener("mousedown", function () { root.classList.add("is-down"); });
    window.addEventListener("mouseup", function () { root.classList.remove("is-down"); });

    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("a, button, summary, label, select, input, textarea, [data-cursor]");
      root.classList.toggle("is-hover", !!t);
      var text = t && t.getAttribute("data-cursor");
      label.textContent = text || "";
      root.classList.toggle("has-label", !!text);
      root.classList.toggle("is-text", !!(t && t.matches("input, textarea")));
    });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- magnetic hover ---------- */
  function initMagnetic(scope) {
    if (reduce || !finePointer) return;
    (scope || document).querySelectorAll("[data-magnetic]").forEach(function (el) {
      if (el._esMagnetic) return;
      el._esMagnetic = true;
      var strength = parseFloat(el.getAttribute("data-magnetic")) || 0.35;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        el.style.translate = (x * strength) + "px " + (y * strength) + "px";
        el.classList.add("is-magnetic");
      });
      el.addEventListener("mouseleave", function () {
        el.style.translate = "0px 0px";
        el.classList.remove("is-magnetic");
      });
    });
  }

  /* ---------- parallax ---------- */
  function initParallax(scroller) {
    if (reduce) return;
    var isWindow = !scroller || scroller === window;
    var host = isWindow ? document : scroller;
    var items = Array.prototype.slice.call(host.querySelectorAll("[data-speed]"));
    if (!items.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = isWindow ? window.innerHeight : scroller.clientHeight;
      var top = isWindow ? 0 : scroller.getBoundingClientRect().top;
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < top - 200 || r.top > top + vh + 200) return;
        var center = r.top - top + r.height / 2 - vh / 2;
        var speed = parseFloat(el.getAttribute("data-speed")) || 0;
        el.style.translate = "0 " + (-center * speed).toFixed(1) + "px";
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    (isWindow ? window : scroller).addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal(scroller) {
    var els = document.querySelectorAll("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    document.documentElement.classList.add("es-reveal-ready");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { root: scroller && scroller !== window ? scroller : null, threshold: 0, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  window.ESMotion = {
    reduce: reduce,
    init: function (opts) {
      opts = opts || {};
      initCursor();
      initMagnetic();
      initParallax(opts.scroller);
      initReveal(opts.scroller);
    },
    magnetic: initMagnetic,
    parallax: initParallax
  };
})();
