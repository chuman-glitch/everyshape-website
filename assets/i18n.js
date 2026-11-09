/* ============================================================
   EVERY SHAPE — language switcher (English / Español / 中文)

   How it works: the page is written in English. When a visitor picks
   another language, every block of text that has a matching entry in
   assets/i18n-strings.js is swapped for its translation.

   To edit a translation: open assets/i18n-strings.js and change the
   Spanish or Chinese text next to the English line.
   If you change English text on the page, update the same English line
   in i18n-strings.js too, or that block will stay in English.
   ============================================================ */
(function () {
  var LANGS = ["en", "es", "zh"];
  var HTML_LANG = { en: "en", es: "es", zh: "zh-Hans" };
  var COL = { es: 0, zh: 1 };
  var SKIP = "script, style, svg, template, .todo, [data-no-i18n], .lang";
  var originals = new WeakMap();
  var current = "en";

  function norm(html) { return html.replace(/\s+/g, " ").trim(); }

  function hasOwnText(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue.trim()) return true;
    }
    return false;
  }

  /* blocks of text to translate: the outermost element that holds text directly */
  function blocks(root) {
    var out = [];
    (function walk(el) {
      for (var c = el.firstElementChild; c; c = c.nextElementSibling) {
        if (c.matches(SKIP)) continue;
        if (hasOwnText(c) || c.hasAttribute("data-i18n")) { out.push(c); continue; }
        walk(c);
      }
    })(root);
    return out;
  }

  function translateRoot(root, lang) {
    var dict = window.ES_STRINGS || {};
    blocks(root).forEach(function (el) {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      var en = originals.get(el);
      if (lang === "en") { if (el.innerHTML !== en) el.innerHTML = en; return; }
      var row = dict[norm(en)];
      var t = row && row[COL[lang]];
      el.innerHTML = t || en;
    });
    root.querySelectorAll ? root.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      if (!el._enLabel) el._enLabel = el.getAttribute("aria-label");
      var row = dict[el._enLabel];
      el.setAttribute("aria-label", lang === "en" || !row ? el._enLabel : row[COL[lang]] || el._enLabel);
    }) : null;
  }

  function setLang(lang, save) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    current = lang;
    document.documentElement.lang = HTML_LANG[lang];
    translateRoot(document.body, lang);
    document.querySelectorAll(".lang [data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    if (save) { try { localStorage.setItem("es-lang", lang); } catch (e) {} }
    document.dispatchEvent(new CustomEvent("es:lang", { detail: { lang: lang } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang [data-lang]");
    if (b) setLang(b.getAttribute("data-lang"), true);
  });

  window.ESI18n = {
    get lang() { return current; },
    set: setLang,
    translate: function (root) { translateRoot(root, current); },
    t: function (en) {
      if (current === "en") return en;
      var row = (window.ES_STRINGS || {})[en];
      return (row && row[COL[current]]) || en;
    },
    _blocks: blocks
  };

  var saved = null;
  try { saved = localStorage.getItem("es-lang"); } catch (e) {}
  var fromUrl = (location.search.match(/[?&]lang=(en|es|zh)/) || [])[1];
  setLang(fromUrl || saved || "en", false);
})();
