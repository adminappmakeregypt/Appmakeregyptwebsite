// ===== v4: Customer subscription form (before Paymob) =====
// Flow: load the selected promotion by its Firestore ID → customer fills the form →
// save to subscriptionRequests FIRST → only after the save succeeds, redirect to the
// exact paymentUrl stored in that promotion. Payment is NOT verified here; the
// administrator confirms it manually later.
import { db, storage } from "./promotions-firebase.js";
import { doc, getDoc, setDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const $ = (id) => document.getElementById(id);
const MAX_IMG = 2 * 1024 * 1024;
const IMG_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const SPECIALTIES = ["general", "dental", "ophthalmology", "pediatrics", "dermatology", "orthopedics", "obgyn", "ent", "aesthetic", "gastro", "internal"];
const RATE_KEY = "amSubLastSubmit";
const RATE_MS = 60 * 1000; // one submission per minute per browser

let promo = null;
let submitting = false;
// One request ID per form visit, so a retry can never create a second request.
const requestId = doc(collection(db, "subscriptionRequests")).id;

function safeUrl(v) {
  try { const u = new URL(String(v || "")); return u.protocol === "https:" || u.protocol === "http:" ? u.href : ""; }
  catch { return ""; }
}
function toDate(v) { if (!v) return null; if (typeof v.toDate === "function") return v.toDate(); const d = new Date(v); return isNaN(d) ? null : d; }

async function loadPromo() {
  const id = new URLSearchParams(location.search).get("promo") || "";
  if (!id || id.length > 60) return showMissing();
  try {
    const snap = await getDoc(doc(db, "promotions", id));
    if (!snap.exists()) return showMissing();
    const p = { id: snap.id, ...snap.data() };
    const now = new Date(), s = toDate(p.startDate), e = toDate(p.endDate);
    if (p.status !== "published" || (s && now < s) || (e && now > e) || !safeUrl(p.paymentUrl)) return showMissing();
    promo = p;
    $("promo-title").textContent = p.title || "";
    $("promo-desc").textContent = p.description || "";
    if (p.priceText) { $("promo-price").textContent = p.priceText; $("promo-price").hidden = false; }
    if (p.durationMonths) { $("promo-duration").textContent = "مدة الاشتراك: " + p.durationMonths + " شهر"; $("promo-duration").hidden = false; }
    $("promo-loading").hidden = true;
    $("promo-box").hidden = false;
    $("sub-form").hidden = false;
  } catch { showMissing(); }
}
function showMissing() { $("promo-loading").hidden = true; $("promo-missing").hidden = false; }

const val = (id) => $(id).value.trim();
function opt(obj, k, v) { if (v) obj[k] = v; }

function collect() {
  const doctor = { fullName: val("d-name"), specialty: $("d-specialty").value, clinicName: val("d-clinic"), mobile: val("d-mobile"), email: val("d-email").toLowerCase() };
  opt(doctor, "whatsapp", val("d-whatsapp")); opt(doctor, "city", val("d-city")); opt(doctor, "address", val("d-address"));
  const website = {};
  opt(website, "bio", val("w-bio")); opt(website, "qualifications", val("w-qual")); opt(website, "services", val("w-services"));
  opt(website, "workingHours", val("w-hours")); opt(website, "appointmentDuration", val("w-duration")); opt(website, "extra", val("w-extra"));
  const setup = {};
  opt(setup, "doctorsCount", val("s-doctors")); opt(setup, "staffCount", val("s-staff"));
  opt(setup, "additionalDoctors", val("s-additional")); opt(setup, "staffRoles", val("s-roles")); opt(setup, "extra", val("s-extra"));
  return { doctor, website, setup };
}

export function validateForm(d, files, consent) {
  const errs = [];
  if (!d.doctor.fullName) errs.push(["d-name", "اكتب اسم الطبيب."]);
  if (!SPECIALTIES.includes(d.doctor.specialty)) errs.push(["d-specialty", "اختر التخصص."]);
  if (!d.doctor.clinicName) errs.push(["d-clinic", "اكتب اسم العيادة."]);
  if (!/^\+?[0-9\s-]{8,20}$/.test(d.doctor.mobile)) errs.push(["d-mobile", "رقم الموبايل غير صحيح."]);
  if (d.doctor.whatsapp && !/^\+?[0-9\s-]{8,20}$/.test(d.doctor.whatsapp)) errs.push(["d-whatsapp", "رقم الواتساب غير صحيح."]);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.doctor.email)) errs.push(["d-email", "البريد الإلكتروني غير صحيح."]);
  for (const [id, f] of Object.entries(files)) {
    if (!f) continue;
    if (!IMG_TYPES[f.type]) errs.push([id, "الصورة يجب أن تكون JPG أو PNG أو WebP."]);
    else if (f.size > MAX_IMG) errs.push([id, "حجم الصورة أكبر من 2 ميجا."]);
  }
  if (!consent) errs.push(["consent", "من فضلك وافق على استخدام البيانات."]);
  return errs;
}

$("sub-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitting || !promo) return;           // blocks double clicks
  const msg = $("form-msg");
  msg.textContent = "";
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  if ($("hp-website").value) return;          // bot
  const last = Number(localStorage.getItem(RATE_KEY) || 0);
  if (Date.now() - last < RATE_MS) { msg.textContent = "تم إرسال طلب منذ لحظات. من فضلك انتظر دقيقة ثم حاول مرة أخرى."; return; }

  const data = collect();
  const files = { "w-photo": $("w-photo").files[0] || null, "w-logo": $("w-logo").files[0] || null };
  const errs = validateForm(data, files, $("consent").checked);
  if (errs.length) {
    errs.forEach(([id]) => $(id).classList.add("invalid"));
    msg.textContent = errs[0][1];
    $(errs[0][0]).focus();
    return;
  }

  submitting = true;
  const btn = $("submit-btn");
  btn.disabled = true;
  btn.textContent = "جارٍ حفظ الطلب…";
  try {
    // Optional images first (stored under this request ID; admin-only to view).
    for (const [id, key] of [["w-photo", "photo"], ["w-logo", "logo"]]) {
      const f = files[id];
      if (!f) continue;
      const path = `subscriptionRequests/${requestId}/${key}.${IMG_TYPES[f.type]}`;
      await uploadBytes(ref(storage, path), f, { contentType: f.type });
      data.website[key + "Path"] = path;
    }
    const record = {
      requestId,
      promotionId: promo.id,
      promotionSnapshot: {
        title: promo.title || "",
        description: promo.description || "",
        priceText: promo.priceText || "",
        durationMonths: promo.durationMonths ?? null,
      },
      paymentUrl: promo.paymentUrl,   // the promotion's own configured link
      doctor: data.doctor, website: data.website, setup: data.setup,
      consent: true,
      lang: "ar",
      createdAt: serverTimestamp(),
      paymentStatus: "pending",
      formStatus: "submitted",
      reviewNotes: "",
      accountSetupStatus: "not_started",
      websiteSetupStatus: "not_started",
      subscriptionStart: null,
      subscriptionEnd: null,
      credentialsSent: false,
      emailNotified: false,
    };
    // Firestore keeps retrying while offline; give up after 20 s so the customer is
    // never stuck and is never sent to payment without a confirmed save.
    await Promise.race([
      setDoc(doc(db, "subscriptionRequests", requestId), record),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 20000)),
    ]);
    localStorage.setItem(RATE_KEY, String(Date.now()));
    showDone();
  } catch (err) {
    console.warn("Subscription save failed", err && err.code);
    msg.textContent = "تعذّر حفظ الطلب، لم يتم تحويلك للدفع. تأكد من الاتصال بالإنترنت وحاول مرة أخرى، أو تواصل معنا على واتساب.";
    submitting = false;
    btn.disabled = false;
    btn.textContent = "حفظ البيانات والمتابعة للدفع";
  }
});

function showDone() {
  const pay = safeUrl(promo.paymentUrl);
  $("sub-form").hidden = true;
  $("done-id").textContent = requestId;
  $("pay-link").href = pay;
  $("done-box").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Redirect only AFTER the save succeeded.
  setTimeout(() => { window.location.assign(pay); }, 4000);
}

loadPromo();
