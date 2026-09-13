# SankzyTech Landing Page

A responsive company landing page with a contact/inquiry system and an internal content management tool, built for the VOLTIX Full Stack Development internship — Task 1 (landing page), Task 2 (Contact & Inquiry System), and Task 3 (Internal Content Management).

## Project structure

```
voltix-landing/
├── index.html      # Public site: structure and content, including the contact form
├── style.css       # Shared design tokens, layout, and component styles
├── script.js       # Mobile nav toggle + contact form submission logic
├── admin.html       # Internal content management page (not linked from the public site)
├── admin.css        # Admin-page-specific styles (reuses tokens from style.css)
├── admin.js         # Admin login gate + content CRUD logic
├── backend/         # Express + MongoDB API (contact + content) — see backend/README.md
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

The frontend (`index.html`, `admin.html`, and their assets) is a static site with no build step, so any static host works:

- **Netlify Drop** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — `vercel` CLI or drag-and-drop via the dashboard
- **GitHub Pages** — push to a repo and enable Pages on the `main` branch

The `backend/` folder is a separate Node service and needs its own host — see `backend/README.md`.

## Contact system (Task 2)

The contact form in the `#contact` section submits to a backend API (`POST /api/contact`), which validates the input and stores it in MongoDB. See `backend/README.md` for the API contract, local setup, and deployment steps.

Before this works end-to-end, update `API_BASE_URL` in `script.js` to point at your deployed backend URL (it defaults to `http://localhost:4000` for local development).

## Content management (Task 3)

`admin.html` is a self-contained internal tool for managing site content — add, view, edit, and delete content items, all backed by the `/api/content` endpoints and stored in MongoDB. It's deliberately not linked from the public site (`index.html`); access it directly at `/admin.html`.

Access is gated by a single shared admin key (set as `ADMIN_KEY` in the backend's environment) rather than a full multi-user login system — appropriate for one internal tool used by the site owner, not a public-facing feature.

Before this works end-to-end, update `API_BASE_URL` at the top of `admin.js` to match your deployed backend URL, the same as `script.js`.

## Possible next steps (not implemented, out of scope for this task)

- Split `style.css` into `base.css` / `layout.css` / `components.css` if the site grows past one page
- Extract the hero SVG into its own `.svg` asset if it's reused elsewhere
- Replace the shared admin key with real per-user authentication if more than one person needs access
- Have the public site actually render content items from `/api/content` instead of static copy
