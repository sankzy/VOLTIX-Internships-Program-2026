const Inquiry = require("../models/Inquiry");

async function createInquiry(req, res) {
  try {
    const inquiry = await Inquiry.create(req.validatedBody);

    return res.status(201).json({
      success: true,
      message: "Inquiry received. We'll be in touch soon.",
      data: {
        id: inquiry._id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (err) {
    console.error("Failed to save inquiry:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving your inquiry. Please try again.",
    });
  }
}

module.exports = { createInquiry };
