// ===== v4: Subscription Activation admin page =====
// One activation record per request (document ID = request ID → no duplicates).
// "active" is only allowed after manual payment confirmation and completed setup
// (checked here AND enforced in firestore.rules). No account creation or credential
// delivery is automated.
import { auth, db } from "./promotions-firebase.js";
import { collection, doc, onSnapshot, setDoc, updateDoc, addDoc, serverTimestamp, Timestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { adminGate, fmtDate, pill } from "./admin-gate.js";

const $ = (id) => document.getElementById(id);
let requests = [], activations = new Map(), current = null;

adminGate(() => {
  onSnapshot(query(collection(db, "subscriptionRequests"), orderBy("createdAt", "desc")), (snap) => {
    requests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render(); openFromUrl();
    if (current && !$("detail").hidden) { const fresh = requests.find((x) => x.id === current.id); if (fresh) refreshStatus(fresh); }
  }, (err) => showErr(err));
  onSnapshot(collection(db, "subscriptionActivations"), (snap) => {
    activations = new Map(snap.docs.map((d) => [d.id, d.data()]));
    render();
  }, (err) => showErr(err));
});
function showErr(err) { $("admin-msg").className = "msg error"; $("admin-msg").textContent = "Could not load: " + err.message; }

let urlOpened = false;
function openFromUrl() {
  if (urlOpened) return;
  const id = new URLSearchParams(location.search).get("request");
  const r = id && requests.find((x) => x.id === id);
  if (r) { urlOpened = true; openDetail(r); }
}

const dateStr = (ts) => { const d = ts && typeof ts.toDate === "function" ? ts.toDate() : null; return d ? d.toISOString().slice(0, 10) : ""; };

export function canActivate(r) {
  return !!r && r.paymentStatus === "confirmed" && r.accountSetupStatus === "completed" && r.websiteSetupStatus === "completed";
}
export function suggestEnd(startIso, months) {
  if (!startIso || !months) return "";
  const d = new Date(startIso + "T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + Number(months));
  return d.toISOString().slice(0, 10);
}

function render() {
  const q = $("q").value.toLowerCase();
  const tb = $("rows"); tb.textContent = "";
  requests.filter((r) => !q || [r.id, r.doctor?.fullName, r.doctor?.clinicName, activations.get(r.id)?.loginEmail].some((v) => String(v || "").toLowerCase().includes(q)))
    .forEach((r) => {
      const a = activations.get(r.id) || {};
      const tr = document.createElement("tr");
      [r.doctor?.fullName, r.doctor?.clinicName, r.id, r.promotionSnapshot?.title].forEach((v) => { const td = document.createElement("td"); td.dir = "auto"; td.textContent = v || "—"; tr.appendChild(td); });
      const tdp = document.createElement("td"); tdp.appendChild(pill(r.paymentStatus)); tr.appendChild(tdp);
      [dateStr(a.startDate) || "—", dateStr(a.endDate) || "—"].forEach((v) => { const td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
      const tds = document.createElement("td"); tds.appendChild(pill(a.activationStatus || "not created")); tr.appendChild(tds);
      const tdc = document.createElement("td"); tdc.textContent = a.credentialsSent ? "Yes" : "No"; tr.appendChild(tdc);
      tr.addEventListener("click", () => openDetail(r));
      tb.appendChild(tr);
    });
}
$("q").addEventListener("input", render);

function openDetail(r) {
  current = r;
  const a = activations.get(r.id) || {};
  $("a-title").textContent = `${r.doctor?.fullName || ""} — ${r.doctor?.clinicName || ""}`;
  $("a-uid").value = a.clinicUserId || "";
  $("a-email").value = a.loginEmail || r.doctor?.email || "";
  $("a-url").value = a.websiteUrl || "";
  $("a-start").value = dateStr(a.startDate);
  $("a-end").value = dateStr(a.endDate);
  $("a-status").value = a.activationStatus || "pending";
  $("a-cred").value = String(!!a.credentialsSent);
  $("a-notes").value = a.notes || "";
  refreshStatus(r);
  updateSuggest();
  $("a-msg").textContent = "";
  $("detail").hidden = false;
}

// Updates only the status summary + "active" lock, leaving typed form values intact.
function refreshStatus(r) {
  current = r;
  const sum = $("a-summary"); sum.textContent = "";
  const p = document.createElement("p");
  p.append(`Request ${r.id} · ${r.promotionSnapshot?.title || ""} · Payment `, pill(r.paymentStatus), " · Account ", pill(r.accountSetupStatus), " · Website ", pill(r.websiteSetupStatus));
  sum.appendChild(p);
  $("a-status").querySelector('[value="active"]').disabled = !canActivate(r);
  $("a-req").textContent = canActivate(r) ? "Ready: payment confirmed and setup completed — you may mark it active."
    : "“Active” is locked until payment is confirmed and both Clinic account and website setup are marked completed — use the buttons above.";
  document.querySelectorAll("[data-setup]").forEach((b) => { const done = r[b.dataset.setup] === "completed"; b.disabled = done; b.textContent = b.textContent.replace(/^(✓ )?/, done ? "✓ " : ""); });
}

document.querySelectorAll("[data-setup]").forEach((b) => b.addEventListener("click", async () => {
  if (!current) return;
  const k = b.dataset.setup, msg = $("a-msg");
  try {
    await updateDoc(doc(db, "subscriptionRequests", current.id), { [k]: "completed", updatedAt: serverTimestamp(), updatedBy: auth.currentUser.email });
    await addDoc(collection(db, "subscriptionRequests", current.id, "auditLog"), { action: `${k} → completed`, by: auth.currentUser.email, at: serverTimestamp() });
    msg.className = "msg ok"; msg.textContent = "Saved.";
  } catch (err) { msg.className = "msg error"; msg.textContent = "Could not save: " + err.message; }
}));

function updateSuggest() {
  const m = current?.promotionSnapshot?.durationMonths;
  const s = suggestEnd($("a-start").value, m);
  $("a-suggest").textContent = m ? `(promotion: ${m} months${s ? " → suggested " + s : ""})` : "";
}
$("a-start").addEventListener("input", updateSuggest);

$("a-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("a-msg");
  const status = $("a-status").value;
  const start = $("a-start").value, end = $("a-end").value;
  if (start && end && end <= start) { msg.className = "msg error"; msg.textContent = "End date must be after the start date."; return; }
  if (status === "active" && !canActivate(current)) { msg.className = "msg error"; msg.textContent = "Cannot activate yet: confirm payment and complete setup first."; return; }
  if (status === "active" && (!start || !end)) { msg.className = "msg error"; msg.textContent = "Enter start and end dates before activating."; return; }
  const url = $("a-url").value.trim();
  if (url && !/^https?:\/\//i.test(url)) { msg.className = "msg error"; msg.textContent = "Website URL must start with https://"; return; }
  const ts = (v) => v ? Timestamp.fromDate(new Date(v + "T00:00:00")) : null;
  const existing = activations.has(current.id);
  const record = {
    requestId: current.id,
    doctorName: current.doctor?.fullName || "", clinicName: current.doctor?.clinicName || "",
    promotionId: current.promotionId, promotionTitle: current.promotionSnapshot?.title || "",
    durationMonths: current.promotionSnapshot?.durationMonths ?? null,
    clinicUserId: $("a-uid").value.trim(), loginEmail: $("a-email").value.trim().toLowerCase(), websiteUrl: url,
    startDate: ts(start), endDate: ts(end), activationStatus: status,
    credentialsSent: $("a-cred").value === "true", notes: $("a-notes").value.trim().slice(0, 5000),
    updatedAt: serverTimestamp(), updatedBy: auth.currentUser.email,
  };
  if (!existing) record.createdAt = serverTimestamp();
  try {
    await setDoc(doc(db, "subscriptionActivations", current.id), record, { merge: true });
    // Mirror dates + credentials flag onto the original request for one-glance review.
    await updateDoc(doc(db, "subscriptionRequests", current.id), {
      subscriptionStart: record.startDate, subscriptionEnd: record.endDate, credentialsSent: record.credentialsSent,
      updatedAt: serverTimestamp(), updatedBy: auth.currentUser.email,
    });
    await addDoc(collection(db, "subscriptionRequests", current.id, "auditLog"), { action: `activation saved (${status}, ${start || "—"} → ${end || "—"}, credentials ${record.credentialsSent ? "sent" : "not sent"})`, by: auth.currentUser.email, at: serverTimestamp() });
    msg.className = "msg ok"; msg.textContent = "Activation record saved.";
  } catch (err) { msg.className = "msg error"; msg.textContent = "Could not save: " + err.message; }
});
$("a-close").addEventListener("click", () => { $("detail").hidden = true; current = null; });
