const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validateContentItem = require("../middleware/validateContent");
const {
  listContent,
  createContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

const router = express.Router();

// All content management operations require a valid JWT (from POST /api/auth/login).
router.use(requireAuth);

router.get("/", listContent);
router.post("/", validateContentItem, createContent);
router.put("/:id", validateContentItem, updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
