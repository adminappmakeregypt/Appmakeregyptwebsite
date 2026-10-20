// ===== Manage Promotions admin page (AppMaker Egypt website) =====
// Only PROMO_ADMIN_EMAIL can use this page. The UI gate below is convenience;
// the REAL enforcement is in firestore.rules and storage.rules (same email).
import { auth, db, storage, PROMO_ADMIN_EMAIL } from "./promotions-firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { promoCard } from "./promotions.js";

const $ = (id) => document.getElementById(id);
const loginView = $("login-view"), adminView = $("admin-view");
const editor = $("editor"), listEl = $("promo-list");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

let editingId = null;          // null = adding a new promotion
let existingImagePath = "";    // storage path of the current image (for safe cleanup)
let existingImageUrl = "";
let promos = [];

// ---------- auth ----------
$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("login-msg").textContent = "";
  try {
    await signInWithEmailAndPassword(auth, $("login-email").value.trim(), $("login-password").value);
  } catch {
    $("login-msg").textContent = "Wrong email or password.";
  }
});

$("signout-btn").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user && (user.email || "").toLowerCase() === PROMO_ADMIN_EMAIL) {
    loginView.hidden = true;
    adminView.hidden = false;
    startList();
  } else {
    adminView.hidden = true;
    loginView.hidden = false;
    if (user) { // signed in but not the authorized administrator
      $("login-msg").textContent = "This account is not authorized to manage promotions.";
      signOut(auth);
    }
  }
});

// ---------- list ----------
let unsubscribe = null;
function startList() {
  if (unsubscribe) return;
  unsubscribe = onSnapshot(collection(db, "promotions"), (snap) => {
    promos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    promos.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    renderList();
  }, (err) => {
    $("admin-msg").className = "msg error";
    $("admin-msg").textContent = "Could not load promotions: " + err.message;
  });
}

function fmt(ts) {
  const d = ts && typeof ts.toDate === "function" ? ts.toDate() : (ts ? new Date(ts) : null);
  return d && !isNaN(d) ? d.toLocaleString() : "—";
}

function renderList() {
  listEl.textContent = "";
  $("empty-msg").hidden = promos.length > 0;
  promos.forEach((p) => {
    const row = document.createElement("div");
    row.className = "promo-row";

    const img = document.createElement("img");
    img.src = p.imageUrl || "assets/logo.png";
    img.alt = "";
    row.appendChild(img);

    const info = document.createElement("div");
    info.className = "info";
    const h = document.createElement("h3");
    h.dir = "auto";
    h.textContent = p.title || "(untitled)";
    const badge = document.createElement("span");
    badge.className = "badge-status st-" + (p.status || "draft");
    badge.textContent = p.status || "draft";
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Order ${p.displayOrder ?? "—"} · Created ${fmt(p.createdAt)} · Updated ${fmt(p.updatedAt)}`;
    info.append(h, badge, meta);
    row.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button"; editBtn.className = "button outline"; editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openEditor(p));

    const prevBtn = document.createElement("button");
    prevBtn.type = "button"; prevBtn.className = "button outline"; prevBtn.textContent = "Preview";
    prevBtn.addEventListener("click", () => showPreview(p));

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button"; toggleBtn.className = "button outline";
    toggleBtn.textContent = p.status === "published" ? "Unpublish" : "Publish";
    toggleBtn.addEventListener("click", () => toggleStatus(p));

    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.className = "quiet-link"; delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => removePromo(p));

    actions.append(editBtn, prevBtn, toggleBtn, delBtn);
    row.appendChild(actions);
    listEl.appendChild(row);
  });
}

// ---------- editor ----------
function openEditor(p) {
  editingId = p ? p.id : null;
  existingImagePath = p ? (p.imagePath || "") : "";
  existingImageUrl = p ? (p.imageUrl || "") : "";
  $("editor-title").textContent = p ? "Edit Promotion" : "Add Promotion";
  $("f-title").value = p ? p.title || "" : "";
  $("f-description").value = p ? p.description || "" : "";
  $("f-payment").value = p ? p.paymentUrl || "" : "";
  $("f-button").value = p ? p.buttonText || "" : "";
  $("f-price").value = p ? p.priceText || "" : "";
  $("f-duration").value = p && p.durationMonths != null ? p.durationMonths : "";
  $("f-status").value = p ? p.status || "draft" : "draft";
  $("f-order").value = p ? (p.displayOrder ?? 1) : (promos.length + 1);
  $("f-start").value = p && p.startDate ? toLocalInput(p.startDate) : "";
  $("f-end").value = p && p.endDate ? toLocalInput(p.endDate) : "";
  $("f-image").value = "";
  $("f-current-img").hidden = !existingImageUrl;
  if (existingImageUrl) $("f-current-img").src = existingImageUrl;
  $("editor-msg").textContent = "";
  editor.hidden = false;
  editor.scrollIntoView({ behavior: "smooth" });
}

function toLocalInput(ts) {
  const d = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d) ? null : Timestamp.fromDate(d);
}

$("add-btn").addEventListener("click", () => openEditor(null));
$("cancel-btn").addEventListener("click", () => { editor.hidden = true; editingId = null; });

function readForm() {
  return {
    title: $("f-title").value.trim(),
    description: $("f-description").value.trim(),
    paymentUrl: $("f-payment").value.trim(),
    buttonText: $("f-button").value.trim(),
    priceText: $("f-price").value.trim(),
    durationMonths: $("f-duration").value === "" ? null : Math.max(0, Math.min(120, Math.round(Number($("f-duration").value) || 0))),
    status: $("f-status").value,
    displayOrder: Number($("f-order").value) || 0,
    startDate: fromLocalInput($("f-start").value),
    endDate: fromLocalInput($("f-end").value),
  };
}

function validate(data, file, publishing) {
  if (!data.title) return "Please enter a title.";
  if (!data.description) return "Please enter the promotion text.";
  if (!data.buttonText) return "Please enter the button text.";
  if (!/^https?:\/\//i.test(data.paymentUrl)) return "The payment link must start with https:// or http://";
  if (file) {
    if (!IMAGE_TYPES.includes(file.type)) return "The photo must be a JPG, PNG or WebP image.";
    if (file.size > MAX_IMAGE_BYTES) return "The photo is larger than 5 MB.";
  }
  if (publishing && !file && !existingImageUrl) return "Please upload a promotion photo before publishing.";
  if (data.startDate && data.endDate && data.endDate.toDate() < data.startDate.toDate()) return "The end date is before the start date.";
  return "";
}

async function savePromo(status) {
  const data = readForm();
  data.status = status;
  $("f-status").value = status;
  const file = $("f-image").files[0] || null;
  const error = validate(data, file, status === "published");
  $("editor-msg").textContent = error;
  if (error) return;

  try {
    let docId = editingId;
    if (!docId) {
      // Create first so the image can be stored under the stable document ID.
      const refDoc = await addDoc(collection(db, "promotions"), {
        ...data, imageUrl: "", imagePath: "",
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.email,
      });
      docId = refDoc.id;
      editingId = docId;
    } else {
      await updateDoc(doc(db, "promotions", docId), { ...data, updatedAt: serverTimestamp() });
    }

    if (file) {
      const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
      const path = `promotions/${docId}/photo${ext}`;
      await uploadBytes(ref(storage, path), file, { contentType: file.type });
      const url = await getDownloadURL(ref(storage, path));
      await updateDoc(doc(db, "promotions", docId), { imageUrl: url, imagePath: path, updatedAt: serverTimestamp() });
      // Safely remove the replaced image — only if it belonged to THIS promotion.
      if (existingImagePath && existingImagePath !== path && existingImagePath.startsWith(`promotions/${docId}/`)) {
        try { await deleteObject(ref(storage, existingImagePath)); } catch { /* old file already gone */ }
      }
      existingImagePath = path;
      existingImageUrl = url;
    }

    $("admin-msg").className = "msg ok";
    $("admin-msg").textContent = status === "published" ? "Published — it is now visible on the website." : "Draft saved.";
    editor.hidden = true;
    editingId = null;
  } catch (err) {
    $("editor-msg").textContent = "Save failed: " + err.message;
  }
}

$("editor-form").addEventListener("submit", (e) => {
  e.preventDefault();
  savePromo(e.submitter && e.submitter.dataset.status === "published" ? "published" : "draft");
});

async function toggleStatus(p) {
  const next = p.status === "published" ? "unpublished" : "published";
  try {
    await updateDoc(doc(db, "promotions", p.id), { status: next, updatedAt: serverTimestamp() });
    $("admin-msg").className = "msg ok";
    $("admin-msg").textContent = next === "published" ? "Published." : "Unpublished — hidden from visitors.";
  } catch (err) {
    $("admin-msg").className = "msg error";
    $("admin-msg").textContent = "Could not change status: " + err.message;
  }
}

async function removePromo(p) {
  if (!window.confirm(`Delete “${p.title || "this promotion"}” permanently? This cannot be undone.`)) return;
  try {
    await deleteDoc(doc(db, "promotions", p.id));
    if (p.imagePath && p.imagePath.startsWith(`promotions/${p.id}/`)) {
      try { await deleteObject(ref(storage, p.imagePath)); } catch { /* image already gone */ }
    }
    $("admin-msg").className = "msg ok";
    $("admin-msg").textContent = "Promotion deleted.";
  } catch (err) {
    $("admin-msg").className = "msg error";
    $("admin-msg").textContent = "Delete failed: " + err.message;
  }
}

// ---------- preview (same card the public page renders) ----------
function showPreview(p) {
  const body = $("preview-body");
  body.textContent = "";
  body.appendChild(promoCard(p));
  $("preview-modal").hidden = false;
}

$("preview-btn").addEventListener("click", () => {
  const data = readForm();
  const file = $("f-image").files[0];
  showPreview({ ...data, imageUrl: file ? URL.createObjectURL(file) : existingImageUrl });
});
$("preview-close").addEventListener("click", () => { $("preview-modal").hidden = true; });
