# Every Shape Therapy website

The website for Every Shape Therapy LLC, a home-based ABA practice in Dallas, Texas.
Preview: **https://chuman-glitch.github.io/everyshape-website/**
Later: **everyshapetherapy.com** (once the domain is connected; that step adds a `CNAME` file).

It's a plain HTML site with no build step: edit a file, save, and the site updates.

## Files

| File | What it is |
| --- | --- |
| `index.html` | All the words on the page |
| `styles.css` | Colors, fonts, layout, the paper-cut buttons |
| `script.js` | Small extras (FAQ bubble, footer year, contact form message) |
| `assets/img/` | Logos, fruit icons, favicon, photos, cut-outs, team |

## Common edits

**Change text.** Open `index.html`, find the sentence, and change it. Keep the `<p>`, `<h2>` and other tags around it.

**Finish placeholders.** Anything with `class="todo"` shows up highlighted on the site. Replace the text, then delete `class="todo"` (or just the word `todo`).

**Add a team member.**
- Founding team: copy one `<article class="founder …">…</article>` block. Put the photo in `assets/img/team/` and point the `<img src="…">` at it.
- RBTs: copy one `<article class="rbt">…</article>` block. Replace `<span class="todo">Photo</span>` with `<img src="assets/img/team/name.jpg" alt="Name">`.

**Add an FAQ.** Copy one question `<button class="faq-q" …>` and one answer `<div class="faq-a" …>`, and give both the next number (`q-7` / `a-7`). Pick a `data-color`: pink, yellow, orange, sage, peach, or red.

**Cut-out photos.** Stickers use transparent PNGs in `assets/img/cutouts/` with the class `sticker`, which adds the white outline.

**After changing styles.css or script.js,** raise the number in `styles.css?v=8` / `script.js?v=8` in `index.html` so visitors get the new version.

**Change a section color.** In `styles.css`, the colors are at the top under `SECTION COLORS`.

**Edit on github.com.** Open a file on GitHub, click the pencil icon, make the change, and click "Commit changes". The live site updates in about a minute.

## Preview on your computer

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Still to do before launch

- Real team names, bios and photos
- Service area, phone, and email
- FAQ answers, and the ABA explanation reviewed by the Clinical Director
- Connect the contact form to an email service (for example Formspree). Collect only name, email, and role, never health information.

## Languages (English, Español, 中文)

The page is written in English. Spanish and Chinese live in `assets/i18n-strings.js`,
one line per block of text:

```js
"Pick a way in.": ["Elige cómo empezar.", "选一个切入点。"],
```

- To fix a translation, edit the Spanish or Chinese text on that line.
- If you change English text on the page, change the same English line here too
  (otherwise that block stays in English when someone switches language).
- Text marked `class="todo"` is never translated.
- Link straight to a language with `?lang=es` or `?lang=zh` at the end of the address.

## Playful buttons

Add `data-cta="wave"`, `"drum"`, `"paint"` or `"eyes"` to any button or link:
googly eyes follow the cursor, a doodle buddy peeks out on hover, and clicks burst
into paper confetti.

## Photos

Put new photos in the EveryShape `photos` folder and ask Claude to place them, or
drop a transparent PNG cut-out in `assets/img/cutouts/` and add `class="sticker"`
for the white outline.

## Brand shapes (locked)

Every icon on the site uses one of five fixed cut-paper shapes in `assets/img/shapes/`
(SVG for the web, PNG for print or slides). See `_reference-sheet.png`.

| File | Color | Used for |
| --- | --- | --- |
| `orange` | #E96E35 | In your home · step 1 · workshops |
| `yellow` | #F5C742 | BCBA-led · step 2 · field trips · Dallas |
| `pink` | #D95870 | Dallas, Austin & rural Texas · step 3 · open house · Austin |
| `sage` | #8EA268 | Telehealth |
| `red` | #C6493F | Spare |

Don't redraw or recolor these; reuse the files.
