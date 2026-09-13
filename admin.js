// Update this once the backend is deployed — same value as script.js's API_BASE_URL.
const API_BASE_URL = "http://localhost:4000";
const CONTENT_ENDPOINT = `${API_BASE_URL}/api/content`;

const STORAGE_KEY = "sankzytech_admin_key";

// ---------- Elements ----------
const loginGate = document.getElementById("login-gate");
const managerView = document.getElementById("manager-view");
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const adminKeyInput = document.getElementById("admin-key");
const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");
const newItemBtn = document.getElementById("new-item-btn");
const listStatus = document.getElementById("list-status");
const tbody = document.getElementById("content-tbody");
const emptyState = document.getElementById("empty-state");

const modal = document.getElementById("item-modal");
const modalTitle = document.getElementById("modal-title");
const itemForm = document.getElementById("item-form");
const itemIdInput = document.getElementById("item-id");
const itemTitleInput = document.getElementById("item-title");
const itemSectionInput = document.getElementById("item-section");
const itemContentInput = document.getElementById("item-content");
const modalStatus = document.getElementById("modal-status");
const cancelModalBtn = document.getElementById("cancel-modal-btn");

let adminKey = sessionStorage.getItem(STORAGE_KEY) || "";

// ---------- Helpers ----------
function setStatus(el, message, type) {
  el.textContent = message;
  el.classList.remove("success", "error");
  if (type) el.classList.add(type);
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "x-admin-key": adminKey,
  };
}

function showManager() {
  loginGate.classList.add("hidden");
  managerView.classList.remove("hidden");
  loadContent();
}

function showLogin() {
  managerView.classList.add("hidden");
  loginGate.classList.remove("hidden");
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
}

function applyFieldErrors(form, errors) {
  Object.entries(errors || {}).forEach(([field, message]) => {
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (errorEl) errorEl.textContent = message;
    const inputEl = form.querySelector(`#item-${field}`);
    if (inputEl) inputEl.classList.add("invalid");
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// ---------- Auth ----------
if (adminKey) {
  showManager();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus(loginStatus, "", null);

  const candidateKey = adminKeyInput.value.trim();
  if (!candidateKey) {
    setStatus(loginStatus, "Enter your admin key.", "error");
    return;
  }

  // Verify the key by attempting to list content with it.
  try {
    const res = await fetch(CONTENT_ENDPOINT, { headers: { "x-admin-key": candidateKey } });
    if (res.status === 401) {
      setStatus(loginStatus, "Incorrect admin key.", "error");
      return;
    }
    if (!res.ok) {
      setStatus(loginStatus, "Could not reach the server. Try again.", "error");
      return;
    }
    adminKey = candidateKey;
    sessionStorage.setItem(STORAGE_KEY, adminKey);
    adminKeyInput.value = "";
    showManager();
  } catch (err) {
    setStatus(loginStatus, "Couldn't reach the server. Check your connection.", "error");
  }
});

logoutBtn.addEventListener("click", () => {
  adminKey = "";
  sessionStorage.removeItem(STORAGE_KEY);
  showLogin();
});

// ---------- List ----------
async function loadContent() {
  setStatus(listStatus, "Loading…", null);
  tbody.innerHTML = "";
  emptyState.classList.add("hidden");

  try {
    const res = await fetch(CONTENT_ENDPOINT, { headers: authHeaders() });

    if (res.status === 401) {
      setStatus(listStatus, "Session expired — please log in again.", "error");
      adminKey = "";
      sessionStorage.removeItem(STORAGE_KEY);
      showLogin();
      return;
    }

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus(listStatus, result.message || "Could not load content.", "error");
      return;
    }

    setStatus(listStatus, "", null);
    renderRows(result.data || []);
  } catch (err) {
    setStatus(listStatus, "Couldn't reach the server. Check your connection.", "error");
  }
}

function renderRows(items) {
  tbody.innerHTML = "";

  if (items.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="cell-title">${escapeHtml(item.title)}</td>
      <td><span class="section-pill">${escapeHtml(item.section || "general")}</span></td>
      <td class="cell-content">${escapeHtml(item.content).slice(0, 120)}${item.content.length > 120 ? "…" : ""}</td>
      <td>${formatDate(item.updatedAt)}</td>
      <td class="cell-actions">
        <button type="button" class="row-action" data-action="edit" data-id="${item._id}">Edit</button>
        <button type="button" class="row-action danger" data-action="delete" data-id="${item._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.dataset.action === "edit") {
    await openEditModal(id);
  } else if (btn.dataset.action === "delete") {
    await deleteItem(id, btn);
  }
});

refreshBtn.addEventListener("click", loadContent);

// ---------- Modal (add/edit) ----------
let currentItems = [];

async function openEditModal(id) {
  // Re-fetch to make sure we're editing current data.
  try {
    const res = await fetch(CONTENT_ENDPOINT, { headers: authHeaders() });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) return;
    currentItems = result.data || [];
  } catch (err) {
    return;
  }

  const item = currentItems.find((i) => i._id === id);
  if (!item) return;

  modalTitle.textContent = "Edit content item";
  itemIdInput.value = item._id;
  itemTitleInput.value = item.title;
  itemSectionInput.value = item.section || "";
  itemContentInput.value = item.content;
  clearFieldErrors(itemForm);
  setStatus(modalStatus, "", null);
  modal.classList.remove("hidden");
}

newItemBtn.addEventListener("click", () => {
  modalTitle.textContent = "New content item";
  itemIdInput.value = "";
  itemTitleInput.value = "";
  itemSectionInput.value = "";
  itemContentInput.value = "";
  clearFieldErrors(itemForm);
  setStatus(modalStatus, "", null);
  modal.classList.remove("hidden");
});

cancelModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.add("hidden");
}

itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors(itemForm);
  setStatus(modalStatus, "", null);

  const id = itemIdInput.value;
  const payload = {
    title: itemTitleInput.value,
    content: itemContentInput.value,
    section: itemSectionInput.value || "general",
  };

  const saveBtn = document.getElementById("save-item-btn");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";

  try {
    const res = await fetch(id ? `${CONTENT_ENDPOINT}/${id}` : CONTENT_ENDPOINT, {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await res.json().catch(() => ({}));

    if (res.ok) {
      closeModal();
      loadContent();
    } else if (res.status === 400 && result.errors) {
      applyFieldErrors(itemForm, result.errors);
      setStatus(modalStatus, "Please fix the highlighted fields.", "error");
    } else if (res.status === 401) {
      setStatus(modalStatus, "Session expired — please log in again.", "error");
    } else {
      setStatus(modalStatus, result.message || "Something went wrong.", "error");
    }
  } catch (err) {
    setStatus(modalStatus, "Couldn't reach the server. Check your connection.", "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save";
  }
});

// ---------- Delete ----------
async function deleteItem(id, triggerBtn) {
  const confirmed = window.confirm("Delete this content item? This can't be undone.");
  if (!confirmed) return;

  triggerBtn.disabled = true;

  try {
    const res = await fetch(`${CONTENT_ENDPOINT}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const result = await res.json().catch(() => ({}));

    if (res.ok) {
      loadContent();
    } else {
      setStatus(listStatus, result.message || "Could not delete item.", "error");
    }
  } catch (err) {
    setStatus(listStatus, "Couldn't reach the server. Check your connection.", "error");
  } finally {
    triggerBtn.disabled = false;
  }
}
