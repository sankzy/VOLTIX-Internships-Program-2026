const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/auth/login
// Body: { key: "<admin password>" }
// Returns a short-lived signed JWT if the password matches ADMIN_KEY.
router.post("/login", (req, res) => {
  const { key } = req.body || {};
  const expectedKey = process.env.ADMIN_KEY;
  const jwtSecret = process.env.JWT_SECRET;

  if (!expectedKey || !jwtSecret) {
    console.error("ADMIN_KEY or JWT_SECRET is not set on the server.");
    return res.status(500).json({ success: false, message: "Server misconfiguration." });
  }

  if (!key || key !== expectedKey) {
    return res.status(401).json({ success: false, message: "Incorrect admin key." });
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "12h" });

  return res.status(200).json({ success: true, token, expiresIn: "12h" });
});

module.exports = router;
