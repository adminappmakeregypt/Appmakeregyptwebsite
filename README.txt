APPMAKER EGYPT — HTML / CSS / JAVASCRIPT (v3 — Promotions)

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
