// Simple shared-key authorization for the internal content management endpoints.
// Not a full user-auth system — appropriate for a single internal admin tool.
// The key is sent by the frontend as an "x-admin-key" header.
function requireAdminKey(req, res, next) {
  const providedKey = req.header("x-admin-key");
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    console.error("ADMIN_KEY is not set on the server.");
    return res.status(500).json({ success: false, message: "Server misconfiguration." });
  }

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  next();
}

module.exports = requireAdminKey;
