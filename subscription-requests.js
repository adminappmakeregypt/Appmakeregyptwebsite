// ===== v4: Subscription Requests admin page =====
// Payment confirmation is MANUAL. Nothing here checks the Paymob redirect.
import { auth, db, storage } from "./promotions-firebase.js";
import { collection, doc, onSnapshot, updateDoc, addDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { adminGate, fmtDate, pill } from "./admin-gate.js";

const $ = (id) => document.getElementById(id);
let all = [];
let current = null;
let logUnsub = null;

const SPEC = { general: "طب عام", dental: "أسنان", ophthalmology: "رمد وعيون", pediatrics: "أطفال", dermatology: "جلدية", orthopedics: "عظام", obgyn: "نساء وتوليد", ent: "أنف وأذن وحنجرة", aesthetic: "تجميل", gastro: "جهاز هضمي", internal: "باطنة" };

adminGate(() => {
  onSnapshot(query(collection(db, "subscriptionRequests"), orderBy("createdAt", "desc")), (snap) => {
    all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    fillPromoFilter();
    render();
    if (current) { const fresh = all.find((r) => r.id === current.id); if (fresh) { current = fresh; renderDetail(); } }
  }, (err) => { $("admin-msg").className = "msg error"; $("admin-msg").textContent = "Could not load requests: " + err.message; });
});

function fillPromoFilter() {
  const sel = $("f-promo"), keep = sel.value;
  const seen = new Map();
  all.forEach((r) => seen.set(r.promotionId, r.promotionSnapshot?.title || r.promotionId));
  sel.length = 1;
  seen.forEach((title, id) => { const o = document.createElement("option"); o.value = id; o.textContent = title; sel.appendChild(o); });
  sel.value = keep;
}

function toD(ts) { return ts && typeof ts.toDate === "function" ? ts.toDate() : null; }

export function filterRequests(list, f) {
  const q = (f.q || "").toLowerCase();
  const from = f.from ? new Date(f.from + "T00:00:00") : null;
  const to = f.to ? new Date(f.to + "T23:59:59") : null;
  return list.filter((r) => {
    const d = r.doctor || {};
    if (q && ![r.id, d.fullName, d.clinicName, d.mobile, d.whatsapp, d.email, r.promotionSnapshot?.title].some((v) => String(v || "").toLowerCase().includes(q))) return false;
    if (f.promo && r.promotionId !== f.promo) return false;
    if (f.pay && r.paymentStatus !== f.pay) return false;
    if (f.form && r.formStatus !== f.form) return false;
    if (f.acc && r.accountSetupStatus !== f.acc) return false;
    if (f.web && r.websiteSetupStatus !== f.web) return false;
    const c = toD(r.createdAt);
    if (from && (!c || c < from)) return false;
    if (to && (!c || c > to)) return false;
    return true;
  });
}

function render() {
  const f = { q: $("q").value, promo: $("f-promo").value, from: $("f-from").value, to: $("f-to").value, pay: $("f-pay").value, form: $("f-form").value, acc: $("f-acc").value, web: $("f-web").value };
  const rows = filterRequests(all, f);
  $("count").textContent = `${rows.length} of ${all.length} requests`;
  const tb = $("rows");
  tb.textContent = "";
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    const cells = [fmtDate(r.createdAt), r.doctor?.fullName, r.doctor?.clinicName, r.doctor?.mobile, r.promotionSnapshot?.title];
    cells.forEach((v) => { const td = document.createElement("td"); td.dir = "auto"; td.textContent = v || "—"; tr.appendChild(td); });
    [r.paymentStatus, r.formStatus, r.accountSetupStatus, r.websiteSetupStatus].forEach((v) => { const td = document.createElement("td"); td.appendChild(pill(v)); tr.appendChild(td); });
    tr.addEventListener("click", () => openDetail(r));
    tb.appendChild(tr);
  });
}
["q", "f-promo", "f-from", "f-to", "f-pay", "f-form", "f-acc", "f-web"].forEach((id) => $(id).addEventListener("input", render));

function dl(title, pairs) {
  const frag = document.createDocumentFragment();
  const h = document.createElement("h3"); h.textContent = title; frag.appendChild(h);
  const d = document.createElement("dl");
  pairs.forEach(([k, v]) => {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.dir = "auto";
    if (v instanceof Node) dd.appendChild(v); else dd.textContent = (v === undefined || v === null || v === "") ? "—" : String(v);
    d.append(dt, dd);
  });
  frag.appendChild(d);
  return frag;
}

function openDetail(r) {
  current = r;
  $("d-notes").value = r.reviewNotes || "";
  $("d-msg").textContent = "";
  renderDetail();
  $("detail").hidden = false;
  if (logUnsub) logUnsub();
  logUnsub = onSnapshot(query(collection(db, "subscriptionRequests", r.id, "auditLog"), orderBy("at", "desc")), (snap) => {
    const box = $("d-log"); box.textContent = "";
    if (snap.empty) box.textContent = "No changes yet.";
    snap.docs.forEach((d) => { const e = d.data(); const p = document.createElement("div"); p.textContent = `${fmtDate(e.at)} — ${e.by}: ${e.action}`; box.appendChild(p); });
  }, () => { $("d-log").textContent = "History unavailable."; });
}

function renderDetail() {
  const r = current, d = r.doctor || {}, w = r.website || {}, s = r.setup || {}, p = r.promotionSnapshot || {};
  $("d-title").textContent = `${d.fullName || ""} — ${d.clinicName || ""}`;
  $("d-activate").href = "subscription-activation.html?request=" + encodeURIComponent(r.id);
  const body = $("d-body"); body.textContent = "";
  const status = document.createElement("span");
  [r.paymentStatus, r.formStatus, r.accountSetupStatus, r.websiteSetupStatus].forEach((v) => { status.appendChild(pill(v)); status.append(" "); });
  body.appendChild(dl("Request", [["Request ID", r.id], ["Submitted", fmtDate(r.createdAt)], ["Status", status], ["Last change", r.updatedAt ? `${fmtDate(r.updatedAt)} by ${r.updatedBy || ""}` : "—"]]));
  const payA = document.createElement("a"); payA.href = r.paymentUrl || "#"; payA.target = "_blank"; payA.rel = "noopener"; payA.textContent = r.paymentUrl || "—";
  body.appendChild(dl("Selected promotion (snapshot)", [["Title", p.title], ["Details", p.description], ["Price", p.priceText], ["Duration (months)", p.durationMonths], ["Promotion ID", r.promotionId], ["Payment link", payA]]));
  body.appendChild(dl("A. Doctor & clinic", [["Doctor", d.fullName], ["Specialty", SPEC[d.specialty] || d.specialty], ["Clinic", d.clinicName], ["Mobile", d.mobile], ["WhatsApp", d.whatsapp], ["Email", d.email], ["City", d.city], ["Address", d.address]]));
  const imgs = document.createElement("div"); imgs.className = "adm-imgs";
  [["Photo", w.photoPath], ["Logo", w.logoPath]].forEach(([label, path]) => {
    if (!path) return;
    const img = document.createElement("img"); img.alt = label; img.title = label; imgs.appendChild(img);
    getDownloadURL(ref(storage, path)).then((u) => { img.src = u; }).catch(() => { img.alt = label + " (unavailable)"; });
  });
  body.appendChild(dl("B. Doctor website", [["Biography", w.bio], ["Qualifications", w.qualifications], ["Services", w.services], ["Working hours", w.workingHours], ["Appointment duration", w.appointmentDuration], ["Extra requirements", w.extra], ["Images", imgs.childNodes.length ? imgs : "—"]]));
  body.appendChild(dl("C. Clinic Management setup", [["Doctors", s.doctorsCount], ["Additional doctors", s.additionalDoctors], ["Staff accounts", s.staffCount], ["Staff roles", s.staffRoles], ["Extra", s.extra]]));
}

async function applyChange(changes, action) {
  const msg = $("d-msg");
  try {
    await updateDoc(doc(db, "subscriptionRequests", current.id), { ...changes, updatedAt: serverTimestamp(), updatedBy: auth.currentUser.email });
    await addDoc(collection(db, "subscriptionRequests", current.id, "auditLog"), { action, by: auth.currentUser.email, at: serverTimestamp() });
    msg.className = "msg ok"; msg.textContent = "Saved: " + action;
  } catch (err) { msg.className = "msg error"; msg.textContent = "Could not save: " + err.message; }
}

document.querySelectorAll("[data-set]").forEach((b) => b.addEventListener("click", () => {
  const [k, v] = b.dataset.set.split("=");
  if (k === "paymentStatus" && v === "confirmed" && !confirm("Confirm that you have verified this payment in your Paymob dashboard?")) return;
  applyChange({ [k]: v }, `${k} → ${v}`);
}));
$("d-save-notes").addEventListener("click", () => applyChange({ reviewNotes: $("d-notes").value.trim().slice(0, 5000) }, "notes updated"));
$("d-close").addEventListener("click", () => { $("detail").hidden = true; current = null; if (logUnsub) { logUnsub(); logUnsub = null; } });
