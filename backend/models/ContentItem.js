const mongoose = require("mongoose");

const contentItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true, default: "general" },
  },
  { timestamps: true } // createdAt / updatedAt
);

module.exports = mongoose.model("ContentItem", contentItemSchema);
