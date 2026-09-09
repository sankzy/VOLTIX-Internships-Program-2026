# SankzyTech Landing Page

A responsive company landing page with a working contact/inquiry system, built for the VOLTIX Full Stack Development internship — Task 1 (landing page) and Task 2 (Contact & Inquiry System).

## Project structure

```
voltix-landing/
├── index.html      # Page structure and content, including the contact form
├── style.css       # Design tokens, layout, and component styles
├── script.js       # Mobile nav toggle + contact form submission logic
├── backend/         # Express + MongoDB API that stores inquiries (see backend/README.md)
└── README.md        # This file
```

Each file has a single responsibility: `index.html` holds content and structure only, `style.css` holds all visual styling, and `script.js` holds interactive behavior (mobile menu, and the contact form's validation + API call). The backend is a separate service — see `backend/README.md` for its structure, setup, and deployment.

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

## Contact system (Task 2)

The contact form in the `#contact` section submits to a backend API (`POST /api/contact`), which validates the input and stores it in MongoDB. See `backend/README.md` for the API contract, local setup, and deployment steps.

Before this works end-to-end, update `API_BASE_URL` in `script.js` to point at your deployed backend URL (it defaults to `http://localhost:4000` for local development).

## Possible next steps (not implemented, out of scope for this task)

- Split `style.css` into `base.css` / `layout.css` / `components.css` if the site grows past one page
- Extract the hero SVG into its own `.svg` asset if it's reused elsewhere
- Add a basic admin view to list submitted inquiries
