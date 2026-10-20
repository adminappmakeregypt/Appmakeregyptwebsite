// ===== Public promotions section (AppMaker Egypt website) =====
// Shows only Published promotions within their start/end dates.
// Updates live when the admin publishes, edits, or unpublishes — no code edits needed.
// On any error (offline, rules not published yet) the section simply stays hidden.
import { db } from "./promotions-firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const d = new Date(value);
  return isNaN(d) ? null : d;
}

function safeUrl(value) {
  try {
    const u = new URL(String(value || ""), window.location.href);
    return (u.protocol === "https:" || u.protocol === "http:") ? u.href : "";
  } catch { return ""; }
}

function isActiveNow(promo, now) {
  const start = toDate(promo.startDate);
  const end = toDate(promo.endDate);
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export function promoCard(promo) {
  const card = document.createElement("article");
  card.className = "card promo-card";

  const img = document.createElement("img");
  img.className = "promo-img";
  img.src = safeUrl(promo.imageUrl);
  img.alt = promo.title || "Promotion";
  img.loading = "lazy";
  card.appendChild(img);

  const body = document.createElement("div");
  body.className = "promo-body";

  const h3 = document.createElement("h3");
  h3.dir = "auto"; // Arabic right-to-left and English both render correctly
  h3.textContent = promo.title || "";
  body.appendChild(h3);

  const p = document.createElement("p");
  p.dir = "auto";
  p.textContent = promo.description || "";
  body.appendChild(p);

  if (promo.priceText) {
    const pr = document.createElement("p");
    pr.className = "promo-price";
    pr.dir = "auto";
    pr.textContent = promo.priceText;
    body.appendChild(pr);
  }

  // v4: the button opens the customer information form first. The form saves the
  // request to Firebase, and only then sends the customer to THIS promotion's own
  // payment link (read from the promotion document — never hardcoded).
  if (safeUrl(promo.paymentUrl)) {
    const a = document.createElement("a");
    a.className = "button";
    a.href = "subscribe.html" + (promo.id ? "?promo=" + encodeURIComponent(promo.id) : "");
    a.dir = "auto";
    a.textContent = promo.buttonText || "Subscribe Now";
    body.appendChild(a);
  }

  card.appendChild(body);
  return card;
}

const section = document.getElementById("promotions");
const grid = document.getElementById("promotions-items");
if (section && grid) {
  try {
    const q = query(collection(db, "promotions"), where("status", "==", "published"));
    onSnapshot(q, (snap) => {
      const now = new Date();
      const visible = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => isActiveNow(p, now))
        .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
      grid.textContent = "";
      visible.forEach((p) => grid.appendChild(promoCard(p)));
      section.hidden = visible.length === 0; // hide section when no active offers
    }, () => { section.hidden = true; });
  } catch { section.hidden = true; }
}
