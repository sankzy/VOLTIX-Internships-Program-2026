const express = require("express");
const cors = require("cors");
const contactRoutes = require("./routes/contactRoutes");
const contentRoutes = require("./routes/contentRoutes");
const authRoutes = require("./routes/authRoutes");

function createApp() {
  const app = express();

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ status: "ok", service: "sankzytech-backend" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/content", contentRoutes);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: "Not found." });
  });

  return app;
}

module.exports = createApp;
