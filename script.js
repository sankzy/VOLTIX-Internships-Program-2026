const toggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector(".nav-mobile");

toggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Contact form ---------- */

// Update this once the backend is deployed (see backend/README.md).
const API_BASE_URL = "https://sankzytech.onrender.com";
const CONTACT_ENDPOINT = `${API_BASE_URL}/api/contact`;

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("contact-submit");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldError(name) {
  return form.querySelector(`[data-error-for="${name}"]`);
}

function setFieldError(name, message) {
  const input = form.elements[name];
  const errorEl = fieldError(name);
  if (message) {
    input.classList.add("invalid");
    errorEl.textContent = message;
  } else {
    input.classList.remove("invalid");
    errorEl.textContent = "";
  }
}

function validateForm(data) {
  let valid = true;

  ["name", "email", "subject", "message"].forEach((field) => setFieldError(field, ""));

  if (!data.name.trim()) {
    setFieldError("name", "Name is required.");
    valid = false;
  }
  if (!data.email.trim()) {
    setFieldError("email", "Email is required.");
    valid = false;
  } else if (!EMAIL_RE.test(data.email.trim())) {
    setFieldError("email", "Enter a valid email address.");
    valid = false;
  }
  if (!data.subject.trim()) {
    setFieldError("subject", "Subject is required.");
    valid = false;
  }
  if (!data.message.trim()) {
    setFieldError("message", "Message is required.");
    valid = false;
  }

  return valid;
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.classList.remove("success", "error");
  if (type) statusEl.classList.add(type);
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", null);

    const data = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      subject: form.elements.subject.value,
      message: form.elements.message.value,
    };

    if (!validateForm(data)) {
      setStatus("Please fix the highlighted fields.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("Thanks — your inquiry has been sent. We'll be in touch soon.", "success");
        form.reset();
      } else if (res.status === 400 && result.errors) {
        Object.entries(result.errors).forEach(([field, message]) => setFieldError(field, message));
        setStatus("Please fix the highlighted fields.", "error");
      } else {
        setStatus(result.message || "Something went wrong. Please try again.", "error");
      }
    } catch (err) {
      setStatus("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send inquiry";
    }
  });
}
