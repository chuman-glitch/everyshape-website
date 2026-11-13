/* ============================================================
   EVERY SHAPE — shared motion
   - Custom cursor (mouse/trackpad only)
   - Magnetic hover: add data-magnetic to any link or button
   - Parallax: add data-speed="0.2" (negative = moves the other way)
   - Reveal on scroll: add data-reveal
   Everything is skipped when the visitor asks for reduced motion.
   ============================================================ */
(function () {
  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/motion\.js.*$/, "");
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


  /* ---------- playful CTA buttons ----------
     add data-cta="wave" | "drum" | "paint" | "eyes" to a button or link */
  var BUDDY = {
    head: '<circle cx="60" cy="54" r="24" class="f"/><circle cx="52" cy="50" r="2.4" class="d"/><circle cx="68" cy="50" r="2.4" class="d"/><path d="M51 60q9 8 18 0"/>' +
          '<path class="f" d="M38 90c0-7 4-11 8-11s7 4 7 11"/><path class="f" d="M67 90c0-7 3-11 7-11s8 4 8 11"/>',
    wave: '<g class="cta-buddy__arm"><path d="M83 62c10-6 16-16 17-28"/><path class="f" d="M95 34c-3-7 0-12 5-12s8 5 6 12z"/><path d="M93 22l-3-6M100 19v-7M107 22l3-6"/></g>' +
          '<path class="cta-buddy__x" d="M18 30l4 4M22 22v6M14 26h6"/>',
    drum: '<g class="cta-buddy__arm"><path d="M84 66l18-22"/><circle class="f" cx="103" cy="42" r="4"/></g>' +
          '<ellipse class="f" cx="100" cy="80" rx="15" ry="6"/><path class="f" d="M85 80v9c0 3 7 6 15 6s15-3 15-6v-9"/><path d="M87 84l5 8 5-8 5 8 5-8 5 8"/>' +
          '<path class="cta-buddy__x" d="M20 26v-12l8-2v12"/><circle class="f" cx="17" cy="27" r="3"/><circle class="f" cx="25" cy="25" r="3"/>',
    paint: '<g class="cta-buddy__arm"><path d="M84 64c8 2 14-2 16-8"/><path class="f" d="M92 56c6-8 22-6 22 4 0 6-6 4-8 8s2 8-6 8c-10 0-14-12-8-20z"/>' +
           '<circle cx="100" cy="58" r="2" class="d"/><circle cx="107" cy="60" r="2" class="d"/><circle cx="99" cy="66" r="2" class="d"/></g>' +
           '<path class="cta-buddy__x" d="M20 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>'
  };
  var SPARKS = '<path d="M8 20l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M150 8l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z"/>' +
               '<path d="M156 46l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/><circle cx="20" cy="50" r="2.5"/><circle cx="140" cy="54" r="2"/>';
  var BITS = ["#E96E35", "#F5C742", "#D95870", "#8EA268", "#C6493F"];

  function initCTA() {
    var eyes = [];
    document.querySelectorAll("[data-cta]").forEach(function (btn) {
      if (btn._esCta) return;
      btn._esCta = true;
      var kind = btn.getAttribute("data-cta");
      btn.classList.add("cta");
      var label = btn.querySelector("span") || btn;
      if (btn.hasAttribute("data-eyes")) {
        var e = document.createElement("span");
        e.className = "cta-eyes";
        e.setAttribute("aria-hidden", "true");
        e.innerHTML = '<span class="cta-eye"><i></i></span><span class="cta-eye"><i></i></span>';
        label.after ? label.after(e) : btn.appendChild(e);
        eyes.push.apply(eyes, e.querySelectorAll(".cta-eye"));
      } else {
        var f = document.createElement("img");
        f.className = "cta-fruit";
        f.alt = "";
        f.setAttribute("aria-hidden", "true");
        f.src = BASE + "img/icon-" + (btn.getAttribute("data-fruit") || "1") + ".png";
        label.after ? label.after(f) : btn.appendChild(f);
      }
      if (BUDDY[kind]) {
        var b = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        b.setAttribute("viewBox", "0 0 120 92");
        b.setAttribute("class", "cta-buddy");
        b.setAttribute("aria-hidden", "true");
        b.innerHTML = BUDDY.head + BUDDY[kind];
        btn.appendChild(b);
        var sp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        sp.setAttribute("viewBox", "0 0 164 64");
        sp.setAttribute("class", "cta-sparks");
        sp.setAttribute("aria-hidden", "true");
        sp.setAttribute("preserveAspectRatio", "none");
        sp.innerHTML = SPARKS;
        btn.appendChild(sp);
      }
      btn.addEventListener("click", function (ev) { if (!reduce) burst(btn, ev); });
    });
    if (!eyes.length) return;
    if (!reduce) {
      window.addEventListener("mousemove", function (ev) {
        eyes.forEach(function (eye) {
          var r = eye.getBoundingClientRect();
          if (!r.width) return;
          var a = Math.atan2(ev.clientY - (r.top + r.height / 2), ev.clientX - (r.left + r.width / 2));
          var d = Math.min(r.width * 0.2, Math.hypot(ev.clientX - r.left, ev.clientY - r.top) / 30);
          eye.firstChild.style.transform = "translate(" + (Math.cos(a) * d).toFixed(1) + "px," + (Math.sin(a) * d).toFixed(1) + "px)";
        });
      }, { passive: true });
      setInterval(function () {
        var pair = eyes[Math.floor(Math.random() * eyes.length)].parentNode;
        pair.classList.add("is-blink");
        setTimeout(function () { pair.classList.remove("is-blink"); }, 180);
      }, 2600);
    }
  }

  function burst(btn, ev) {
    var r = btn.getBoundingClientRect();
    var x = ev.clientX || r.left + r.width / 2, y = ev.clientY || r.top + r.height / 2;
    for (var i = 0; i < 14; i++) {
      var bit = document.createElement("span");
      bit.className = "cta-bit cta-bit--" + (i % 3);
      bit.style.background = BITS[i % BITS.length];
      bit.style.left = x + "px"; bit.style.top = y + "px";
      document.body.appendChild(bit);
      var ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
      var dist = 50 + Math.random() * 60;
      var anim = bit.animate([
        { transform: "translate(-50%,-50%) rotate(0deg) scale(1)", opacity: 1 },
        { transform: "translate(calc(-50% + " + Math.cos(ang) * dist + "px), calc(-50% + " + (Math.sin(ang) * dist + 30) + "px)) rotate(" + (Math.random() * 360) + "deg) scale(.6)", opacity: 0 }
      ], { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.8,.2,1)" });
      anim.onfinish = (function (b) { return function () { b.remove(); }; })(bit);
    }
  }

  window.ESMotion = {
    reduce: reduce,
    init: function (opts) {
      opts = opts || {};
      if (opts.cursor !== false) initCursor();
      initCTA();
      initMagnetic();
      initParallax(opts.scroller);
      initReveal(opts.scroller);
    },
    magnetic: initMagnetic,
    parallax: initParallax
  };
})();
