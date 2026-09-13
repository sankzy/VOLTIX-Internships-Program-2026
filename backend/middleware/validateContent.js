function validateContentItem(req, res, next) {
  const { title, content, section } = req.body || {};
  const errors = {};

  if (!title || !String(title).trim()) {
    errors.title = "Title is required.";
  }

  if (!content || !String(content).trim()) {
    errors.content = "Content is required.";
  }

  if (section !== undefined && !String(section).trim()) {
    errors.section = "Section cannot be blank if provided.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  req.validatedBody = {
    title: String(title).trim(),
    content: String(content).trim(),
    ...(section !== undefined ? { section: String(section).trim() } : {}),
  };

  next();
}

module.exports = validateContentItem;
