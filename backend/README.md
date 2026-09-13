# SankzyTech Backend — Contact & Inquiry API

Backend for Task 2 of the VOLTIX internship: a validated Contact/Inquiry API backed by MongoDB.

## Structure

```
backend/
├── app.js                  # Express app definition (middleware + routes)
├── server.js               # Bootstraps: connects DB, then starts the app
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── Inquiry.js            # Schema for a stored contact inquiry (Task 2)
│   └── ContentItem.js        # Schema for a manageable content item (Task 3)
├── middleware/
│   ├── validateContact.js    # Input validation for /api/contact
│   ├── validateContent.js    # Input validation for /api/content
│   └── requireAuth.js        # Verifies the Bearer JWT on protected routes
├── controllers/
│   ├── contactController.js  # Business logic: save a validated inquiry
│   └── contentController.js  # Business logic: content item CRUD
├── routes/
│   ├── authRoutes.js         # POST /api/auth/login — issues a signed JWT
│   ├── contactRoutes.js      # Wires POST /api/contact to validation + controller
│   └── contentRoutes.js      # Wires /api/content CRUD to auth + validation + controller
└── .env.example
```

Each layer has one job, and each only talks to the layer next to it:
- **routes** — maps an HTTP verb + path to middleware/controller, nothing else
- **middleware** — checks the request is valid; rejects bad input before it reaches business logic
- **controllers** — assumes input is already valid; only responsible for saving it and shaping the response
- **models** — defines what an Inquiry looks like in the database

This means, for example, the validation rules can be changed without touching the controller, and the controller doesn't need to know *how* a request was validated.

## API

### `POST /api/contact`

**Request body:**
```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "subject": "Project inquiry",
  "message": "Hi, I'd like a quote for a landing page."
}
```

**Success — `201 Created`:**
```json
{
  "success": true,
  "message": "Inquiry received. We'll be in touch soon.",
  "data": { "id": "...", "createdAt": "..." }
}
```

**Validation failure — `400 Bad Request`:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": "Email must be a valid email address.",
    "subject": "Subject is required."
  }
}
```

**Server error — `500 Internal Server Error`:**
```json
{ "success": false, "message": "Something went wrong while saving your inquiry. Please try again." }
```

### Authentication — `/api/auth`

The content management endpoints require a signed JWT rather than a static shared key. Get one by logging in:

**`POST /api/auth/login`**

Request body:
```json
{ "key": "<the ADMIN_KEY value from your environment>" }
```

Success — `200 OK`:
```json
{ "success": true, "token": "<jwt>", "expiresIn": "12h" }
```

Wrong password — `401 Unauthorized`:
```json
{ "success": false, "message": "Incorrect admin key." }
```

Send the returned token on every content request as `Authorization: Bearer <jwt>`. Tokens expire after 12 hours; after that, log in again to get a new one.

### Content management — `/api/content`

All endpoints below require a valid `Authorization: Bearer <jwt>` header (see above).

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/content` | List all content items, newest first |
| POST | `/api/content` | Create a content item (`title`, `content`, optional `section`) |
| PUT | `/api/content/:id` | Update a content item |
| DELETE | `/api/content/:id` | Delete a content item |

**Missing/invalid/expired token — `401 Unauthorized`:**
```json
{ "success": false, "message": "Unauthorized." }
```
(or `"Session expired."` specifically for an expired-but-otherwise-valid token)

**Create/update validation failure — `400 Bad Request`:**
```json
{ "success": false, "message": "Validation failed.", "errors": { "title": "Title is required." } }
```

**Not found — `404 Not Found`:**
```json
{ "success": false, "message": "Content item not found." }
```

## Local setup

1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI` (see below for a free database), `ADMIN_KEY` (your login password), and `JWT_SECRET` (a separate random string used to sign tokens).
3. `npm run dev` (or `npm start`)
4. Test the contact endpoint: `curl -X POST http://localhost:4000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","subject":"Hi","message":"Hello"}'`
5. Test login: `curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"key":"<your ADMIN_KEY>"}'` — copy the returned `token`.
6. Test the content endpoint with it: `curl http://localhost:4000/api/content -H "Authorization: Bearer <token>"`

## Getting a free MongoDB database (MongoDB Atlas)

1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create a free (M0) cluster.
3. Under **Database Access**, create a database user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) so your deployed backend can reach it.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
6. Paste it into `MONGODB_URI` in your `.env` (and add a database name after the host if you like, e.g. `.../sankzytech?retryWrites=...`).

## Deploying the backend (Render, free tier)

Vercel (which hosts the frontend) runs serverless functions with no persistent process, so this Express server is deployed separately:

1. Push the `backend/` folder to GitHub (can be the same repo as the frontend, or its own).
2. Go to https://render.com → New → Web Service → connect the repo.
3. Set **Root Directory** to `backend` (if it's in the same repo as the frontend).
4. Build command: `npm install` — Start command: `npm start`
5. Add environment variables in Render's dashboard: `MONGODB_URI`, `ADMIN_KEY`, `JWT_SECRET`, `ALLOWED_ORIGINS` (set this to `https://sankzytech.vercel.app`).
6. Deploy. Render gives you a URL like `https://sankzytech-backend.onrender.com`.

## Connecting the frontend

In `script.js`, update:
```js
const API_BASE_URL = "https://sankzytech-backend.onrender.com";
```
to whatever URL Render (or your chosen host) gives you, then redeploy the frontend on Vercel.

Note: Render's free tier "spins down" after inactivity, so the first request after a while can take ~30-50 seconds to wake up — this is normal, not a bug.
