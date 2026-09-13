const express = require("express");
const requireAdminKey = require("../middleware/requireAdminKey");
const validateContentItem = require("../middleware/validateContent");
const {
  listContent,
  createContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

const router = express.Router();

// All content management operations require the admin key.
router.use(requireAdminKey);

router.get("/", listContent);
router.post("/", validateContentItem, createContent);
router.put("/:id", validateContentItem, updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
