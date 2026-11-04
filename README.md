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
| `script.js` | Small extras (footer year, contact form message) |
| `assets/img/` | Logos, fruit icons, favicon |

## Common edits

**Change text.** Open `index.html`, find the sentence, and change it. Keep the `<p>`, `<h2>` and other tags around it.

**Finish placeholders.** Anything with `class="todo"` shows up highlighted on the site. Replace the text, then delete `class="todo"` (or just the word `todo`).

**Add a team member.** In `index.html`, copy one whole `<article class="person">…</article>` block and paste it below the others. To use a real photo, put it in `assets/img/team/` and replace `<span class="todo">Photo</span>` with:

```html
<img src="assets/img/team/jane-smith.jpg" alt="Jane Smith">
```

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
