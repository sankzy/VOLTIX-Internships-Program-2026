const ContentItem = require("../models/ContentItem");

async function listContent(req, res) {
  try {
    const items = await ContentItem.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error("Failed to list content:", err);
    return res.status(500).json({ success: false, message: "Could not load content." });
  }
}

async function createContent(req, res) {
  try {
    const item = await ContentItem.create(req.validatedBody);
    return res.status(201).json({ success: true, message: "Content item created.", data: item });
  } catch (err) {
    console.error("Failed to create content:", err);
    return res.status(500).json({ success: false, message: "Could not create content item." });
  }
}

async function updateContent(req, res) {
  try {
    const item = await ContentItem.findByIdAndUpdate(req.params.id, req.validatedBody, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Content item not found." });
    }

    return res.status(200).json({ success: true, message: "Content item updated.", data: item });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid content item id." });
    }
    console.error("Failed to update content:", err);
    return res.status(500).json({ success: false, message: "Could not update content item." });
  }
}

async function deleteContent(req, res) {
  try {
    const item = await ContentItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Content item not found." });
    }

    return res.status(200).json({ success: true, message: "Content item deleted." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid content item id." });
    }
    console.error("Failed to delete content:", err);
    return res.status(500).json({ success: false, message: "Could not delete content item." });
  }
}

module.exports = { listContent, createContent, updateContent, deleteContent };
