# SankzyTech Landing Page

A responsive company landing page built for the VOLTIX Full Stack Development internship — Task 1.

## Project structure

```
voltix-landing/
├── index.html      # Page structure and content
├── style.css       # Design tokens, layout, and component styles
├── script.js       # Mobile navigation toggle behavior
└── README.md        # This file
```

Each file has a single responsibility: `index.html` holds content and structure only, `style.css` holds all visual styling, and `script.js` holds the one piece of interactive behavior (the mobile menu). No inline styles or inline scripts are used, so any of the three can be edited independently.

## Design decisions

- **Color tokens** are defined once in `:root` in `style.css` and reused everywhere via CSS variables (`--ink`, `--signal`, `--wire`, etc.), so the palette can be changed from one place.
- **Two typefaces**: Space Grotesk for headings, IBM Plex Sans for body text — loaded from Google Fonts.
- **Layout**: an asymmetric hero (text + circuit-style diagram) rather than a centered stock layout, and alternating left/right service sections instead of identical cards, to avoid a generic templated look.
- **Motion**: a single animated moment (the circuit lines drawing in on page load), respecting `prefers-reduced-motion`. No hover animations were added beyond simple color transitions on buttons/links.

## Running locally

No build step or dependencies required. Either:

1. Open `index.html` directly in a browser, or
2. Serve it locally for a closer-to-production experience:
   ```bash
   npx serve .
   ```

## Deploying

Any static host works since there's no backend or build step:

- **Netlify Drop** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — `vercel` CLI or drag-and-drop via the dashboard
- **GitHub Pages** — push to a repo and enable Pages on the `main` branch

## Possible next steps (not implemented, out of scope for this task)

- Split `style.css` into `base.css` / `layout.css` / `components.css` if the site grows past one page
- Extract the hero SVG into its own `.svg` asset if it's reused elsewhere
- Add a contact form with real form handling instead of a `mailto:` link
