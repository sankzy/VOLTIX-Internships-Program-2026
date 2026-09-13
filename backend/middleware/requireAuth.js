const jwt = require("jsonwebtoken");

// Verifies a Bearer JWT (issued by POST /api/auth/login) on protected routes.
function requireAuth(req, res, next) {
  const authHeader = req.header("authorization") || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not set on the server.");
    return res.status(500).json({ success: false, message: "Server misconfiguration." });
  }

  try {
    jwt.verify(token, jwtSecret);
    next();
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Session expired." : "Unauthorized.";
    return res.status(401).json({ success: false, message });
  }
}

module.exports = requireAuth;
