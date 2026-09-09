const express = require("express");
const validateContact = require("../middleware/validateContact");
const { createInquiry } = require("../controllers/contactController");

const router = express.Router();

// POST /api/contact
router.post("/", validateContact, createInquiry);

module.exports = router;
