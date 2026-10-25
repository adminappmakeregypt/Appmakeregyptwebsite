APPMAKER EGYPT — HTML / CSS / JAVASCRIPT (v4 — Promotions + Subscription Requests)

1. Extract this ZIP.
2. Upload ALL files to your hosting (GitHub repository root or Cloudflare Pages project): index.html, styles.css, app.js, promotions.js, promotions-firebase.js, promotions-admin.html, promotions-admin.js, favicon.png, robots.txt, .nojekyll and the assets folder. Keep assets as a folder; do not flatten it. firestore.rules and storage.rules are NOT uploaded to the website — see step 3.
3. ONE-TIME SETUP in the Firebase Console (project bookmydoctor-6c93c, the same project your clinic system uses):
   a. Firestore Database → Rules: replace everything with the contents of firestore.rules from this ZIP, then Publish.
   b. Storage → Rules: replace everything with the contents of storage.rules from this ZIP, then Publish. (If Storage is not enabled yet, click "Get started" in the Storage section first.)
   c. Authentication → Sign-in method: make sure Email/Password is enabled (it already is for the clinic system) and that the account appmakeregypt@gmail.com exists (it already does).
4. Wait for deployment and refresh the website with Ctrl+Shift+R.

MANAGING PROMOTIONS
- Open https://<your-website>/promotions-admin.html
- Sign in with appmakeregypt@gmail.com and its password (the same account as the clinic admin).
- Click "Add Promotion", upload a photo (JPG/PNG/WebP, max 5 MB), enter the title and text (Arabic and English both work), paste the payment link, set the button text, status, display order and optional start/end dates.
- "Preview" shows exactly what visitors will see. "Save Draft" keeps it hidden; "Publish" shows it on the website immediately.
- Edit updates the same offer (no duplicates). Publish/Unpublish toggles visibility. Delete asks for confirmation and removes the offer and its photo.
- The public "Current Offers" section appears on the homepage automatically while at least one published offer is within its start/end dates, and hides itself when there is nothing to show. No code changes are ever needed to add or remove offers.

SECURITY
- Only appmakeregypt@gmail.com can create, edit, publish or delete promotions. This is enforced by the Firestore and Storage security rules (step 3), not just by the page. Without step 3 the admin page cannot save anything and the public section stays hidden.
- Visitors can read only published promotions. Draft, unpublished, future and expired offers are never shown publicly.

Preserved from v2: Arabic/English with RTL, light/dark theme, mobile navigation, the 500% logo, all services/projects/prices, testimonials carousel, FAQ, consultation links, WhatsApp/Facebook/email, Google Maps, Web3Forms contact form, cookie consent and back-to-top.

The original public Web3Forms form access key is retained; it is designed for browser use. Internet access is required for form delivery, maps, fonts and the promotions feature. Contact delivery success/failure was tested with simulated responses; real inbox delivery is not verified. Submit a real enquiry after upload to confirm your Web3Forms account/domain settings.

Existing marketing claims, prices, testimonials and portfolio content are copied from your supplied source, not independently validated. Language starts in English on each new page load, matching the original. Theme and consent persist on the same browser/origin.


============================================================
v4 — SUBSCRIPTION REQUESTS (customer form before Paymob)
============================================================
WHAT CHANGED FOR CUSTOMERS
- The button on each offer now opens subscribe.html (Arabic form). The customer fills in doctor/clinic,
  website and clinic-setup details. The request is SAVED FIRST; only then is the customer sent to that
  offer's own payment link (taken from the offer — never hardcoded). If saving fails, an error shows and
  there is no redirect. Repeated clicks create only one request.
- After saving, the customer sees the thank-you message (request received; payment and data will be
  reviewed). Payment is never shown as verified.

NEW FIELDS ON EACH OFFER (Manage Promotions, both optional)
- Price / Offer Details — shown on the offer card and on the form (customers cannot change it).
- Subscription Duration (months) — shown to the customer and used as a reference on the activation page.

NEW ADMIN PAGES (sign in with appmakeregypt@gmail.com; linked at the top of Manage Promotions)
- subscription-requests.html — searchable/filterable table (promotion, date, payment, form, account, website).
  Click a row for the full form, photos, and actions: form complete / request more info, confirm or reject
  payment (MANUAL — check Paymob yourself), website setup completed, clinic account setup completed,
  internal notes. Every change is recorded with time and admin email in "Change history".
- subscription-activation.html — one record per request: clinic user ID, login email, website URL, start/end
  dates (you enter them; the offer's duration is shown as a suggestion), activation status, credentials sent,
  notes. "Active" is only allowed after payment is confirmed AND account + website setup are completed.
  Nothing is created or sent automatically.

DATA STRUCTURE (Firestore, same project bookmydoctor-6c93c)
- subscriptionRequests/{requestId}: requestId, promotionId, promotionSnapshot{title,description,priceText,
  durationMonths}, paymentUrl, doctor{fullName,specialty,clinicName,mobile,whatsapp,email,city,address},
  website{bio,qualifications,services,workingHours,appointmentDuration,extra,photoPath,logoPath},
  setup{doctorsCount,additionalDoctors,staffCount,staffRoles,extra}, consent, lang, createdAt,
  paymentStatus(pending), formStatus(submitted), reviewNotes(""), accountSetupStatus(not_started),
  websiteSetupStatus(not_started), subscriptionStart(null), subscriptionEnd(null), credentialsSent(false),
  updatedAt, updatedBy
- subscriptionRequests/{requestId}/auditLog/{auto}: action, by, at
- subscriptionActivations/{requestId}: requestId, doctorName, clinicName, promotionId, promotionTitle,
  durationMonths, clinicUserId, loginEmail, websiteUrl, startDate, endDate, activationStatus, credentialsSent,
  notes, createdAt, updatedAt, updatedBy
- Storage: subscriptionRequests/{requestId}/photo.(jpg|png|webp) and logo.(...) — max 2 MB, images only.
No passwords or Paymob secret keys are stored anywhere.

YOU MUST RE-PUBLISH BOTH RULE FILES (Firebase Console → Firestore → Rules, and Storage → Rules)
using the v4 firestore.rules and storage.rules. Until then the form will show "could not save" and will
NOT redirect to payment. The clinic rules inside are unchanged; only new sections were added at the end.

SECURITY (enforced by the rules)
- Public: may only CREATE a request; status fields are forced to pending/submitted/not_started/false and dates
  to empty; the payment link and offer title must exactly match a currently published offer; strict field
  list and lengths; consent required. Public cannot read, list, update or delete any request.
- Only appmakeregypt@gmail.com can read requests, change review/payment/setup fields (never the customer's
  submitted content), and create/edit activation records.
- Abuse protection: rule validation, honeypot field, one submission per minute per browser, photo uploads
  create-only (no overwrite), 2 MB, JPG/PNG/WebP. For stronger protection later you can enable Firebase
  App Check in the Console.

FILES TO UPLOAD TO THE WEBSITE REPOSITORY (v4)
- NEW: subscribe.html, subscribe.js, subscription.css, subscription-requests.html, subscription-requests.js,
  subscription-activation.html, subscription-activation.js, admin-gate.js
- CHANGED: promotions.js, promotions-admin.html, promotions-admin.js
- Firebase Console only (not the website): firestore.rules, storage.rules
- tests/ folder is for testing only — do not upload.
