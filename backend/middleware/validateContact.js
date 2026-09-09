const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(req, res, next) {
  const { name, email, subject, message } = req.body || {};
  const errors = {};

  if (!name || !String(name).trim()) {
    errors.name = "Name is required.";
  }

  if (!email || !String(email).trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(String(email).trim())) {
    errors.email = "Email must be a valid email address.";
  }

  if (!subject || !String(subject).trim()) {
    errors.subject = "Subject is required.";
  }

  if (!message || !String(message).trim()) {
    errors.message = "Message is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  // Attach the trimmed, validated fields for the controller to use.
  req.validatedBody = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    subject: String(subject).trim(),
    message: String(message).trim(),
  };

  next();
}

module.exports = validateContact;
