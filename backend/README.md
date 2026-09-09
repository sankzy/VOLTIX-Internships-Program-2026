# SankzyTech Backend — Contact & Inquiry API

Backend for Task 2 of the VOLTIX internship: a validated Contact/Inquiry API backed by MongoDB.

## Structure

```
backend/
├── app.js                  # Express app definition (middleware + routes)
├── server.js               # Bootstraps: connects DB, then starts the app
├── config/
│   └── db.js                # MongoDB connection
├── models/
│   └── Inquiry.js           # Mongoose schema for a stored inquiry
├── middleware/
│   └── validateContact.js   # Input validation, runs before the controller
├── controllers/
│   └── contactController.js # Business logic: save a validated inquiry
├── routes/
│   └── contactRoutes.js     # Wires POST /api/contact to validation + controller
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

## Local setup

1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI` (see below for a free database).
3. `npm run dev` (or `npm start`)
4. Test it: `curl -X POST http://localhost:4000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","subject":"Hi","message":"Hello"}'`

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
5. Add environment variables in Render's dashboard: `MONGODB_URI`, `ALLOWED_ORIGINS` (set this to `https://sankzytech.vercel.app`).
6. Deploy. Render gives you a URL like `https://sankzytech-backend.onrender.com`.

## Connecting the frontend

In `script.js`, update:
```js
const API_BASE_URL = "https://sankzytech-backend.onrender.com";
```
to whatever URL Render (or your chosen host) gives you, then redeploy the frontend on Vercel.

Note: Render's free tier "spins down" after inactivity, so the first request after a while can take ~30-50 seconds to wake up — this is normal, not a bug.
