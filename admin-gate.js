// ===== v4: shared administrator sign-in gate for the subscription pages =====
// Convenience only — real protection is in firestore.rules / storage.rules.
import { auth, PROMO_ADMIN_EMAIL } from "./promotions-firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function adminGate(onReady) {
  const $ = (id) => document.getElementById(id);
  let started = false;
  $("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("login-msg").textContent = "";
    try { await signInWithEmailAndPassword(auth, $("login-email").value.trim(), $("login-password").value); }
    catch { $("login-msg").textContent = "Wrong email or password."; }
  });
  $("signout-btn").addEventListener("click", () => signOut(auth));
  onAuthStateChanged(auth, (user) => {
    const ok = user && (user.email || "").toLowerCase() === PROMO_ADMIN_EMAIL;
    $("login-view").hidden = !!ok;
    $("admin-view").hidden = !ok;
    if (ok && !started) { started = true; onReady(user); }
    if (user && !ok) { $("login-msg").textContent = "This account is not authorized."; signOut(auth); }
  });
}

export function fmtDate(ts) {
  const d = ts && typeof ts.toDate === "function" ? ts.toDate() : (ts ? new Date(ts) : null);
  return d && !isNaN(d) ? d.toLocaleString() : "—";
}

export function pill(value) {
  const map = { confirmed: "ok", completed: "ok", complete: "ok", active: "ok", rejected: "bad", needs_info: "warn", pending: "warn", in_progress: "warn", suspended: "bad", expired: "bad" };
  const s = document.createElement("span");
  s.className = "pill " + (map[value] || "");
  s.textContent = String(value ?? "—").replace(/_/g, " ");
  return s;
}
