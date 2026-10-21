const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const SPECIALTIES_MAP = {
  general: "طب عام (General Practice)",
  dental: "أسنان (Dental)",
  ophthalmology: "رمد وعيون (Ophthalmology)",
  pediatrics: "أطفال (Pediatrics)",
  dermatology: "جلدية (Dermatology)",
  orthopedics: "عظام (Orthopedics)",
  obgyn: "نساء وتوليد (OB-GYN)",
  ent: "أنف وأذن وحنجرة (ENT)",
  aesthetic: "تجميل (Aesthetic)",
  gastro: "جهاز هضمي (Gastroenterology)",
  internal: "باطنة (Internal Medicine)"
};

exports.sendDoctorRegistrationNotification = onDocumentCreated(
  {
    document: "subscriptionRequests/{requestId}",
    secrets: ["RESEND_API_KEY"],
    region: "europe-west1",
    retry: true
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const requestId = event.params.requestId;

    // 1. Idempotency Check: Prevent duplicate sends
    if (data.emailNotified === true) {
      logger.info(`Notification already sent for request ${requestId}. Skipping.`);
      return;
    }

    const doctor = data.doctor || {};
    const website = data.website || {};
    const setup = data.setup || {};
    const promo = data.promotionSnapshot || {};

    // 2. Format Date (Cairo Time UTC+2 / UTC+3)
    const dateFormatted = data.createdAt?.toDate
      ? data.createdAt.toDate().toLocaleString("en-US", { timeZone: "Africa/Cairo" })
      : new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" });

    const specialtyName = SPECIALTIES_MAP[doctor.specialty] || doctor.specialty || "Not specified";
    const adminLink = `https://appmakeregypt.com/subscription-requests.html`;

    // 3. Compose HTML Email
    const subject = `New AppMaker Egypt Doctor Registration - ${doctor.clinicName || doctor.fullName || requestId}`;

    const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[char]);
    const text = (value, fallback = "—") => escapeHtml(value || fallback);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 20px; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0 0 6px; font-size: 20px; color: #ffffff; }
    .content { padding: 24px; }
    .warning-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px; font-size: 14px; color: #92400e; }
    .sec-title { font-size: 15px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 22px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    td { padding: 8px 6px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    td.lbl { width: 35%; color: #64748b; font-weight: 600; }
    td.val { color: #0f172a; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 24px; text-align: center; }
    .footer { padding: 16px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Doctor Registration</h1>
      <p style="margin: 0; opacity: 0.85; font-size: 14px;">AppMaker Egypt Subscription Request</p>
    </div>
    <div class="content">
      <div class="warning-box">
        <strong>⚠️ Status Verification Notice:</strong> This request was submitted by the customer. <strong>Do not activate</strong> the clinic account or website until you independently verify payment in your Paymob dashboard.
      </div>

      <div class="sec-title">Registration Status & IDs</div>
      <table>
        <tr><td class="lbl">Registration ID</td><td class="val"><code>${text(requestId)}</code></td></tr>
        <tr><td class="lbl">Submission Time</td><td class="val">${dateFormatted} (Cairo Time)</td></tr>
        <tr><td class="lbl">Registration Status</td><td class="val"><span class="badge">Submitted</span></td></tr>
        <tr><td class="lbl">Payment Status</td><td class="val"><span class="badge">Pending (Requires Paymob Verification)</span></td></tr>
        <tr><td class="lbl">Selected Promotion</td><td class="val"><strong>${text(promo.title, 'N/A')}</strong> ${promo.priceText ? `(${text(promo.priceText)})` : ''}</td></tr>
      </table>

      <div class="sec-title">Doctor & Clinic Information</div>
      <table>
        <tr><td class="lbl">Doctor Name</td><td class="val"><strong>${text(doctor.fullName)}</strong></td></tr>
        <tr><td class="lbl">Specialty</td><td class="val">${text(specialtyName)}</td></tr>
        <tr><td class="lbl">Clinic Name</td><td class="val"><strong>${text(doctor.clinicName)}</strong></td></tr>
        <tr><td class="lbl">Mobile</td><td class="val"><a href="tel:${text(doctor.mobile, '')}">${text(doctor.mobile)}</a></td></tr>
        ${doctor.whatsapp ? `<tr><td class="lbl">WhatsApp</td><td class="val"><a href="https://wa.me/${doctor.whatsapp.replace(/[^0-9]/g, '')}">${text(doctor.whatsapp)}</a></td></tr>` : ''}
        <tr><td class="lbl">Email</td><td class="val"><a href="mailto:${text(doctor.email, '')}">${text(doctor.email)}</a></td></tr>
        ${(doctor.city || doctor.address) ? `<tr><td class="lbl">Clinic Location</td><td class="val">${text([doctor.city, doctor.address].filter(Boolean).join(' - '))}</td></tr>` : ''}
      </table>

      ${(setup.doctorsCount || setup.staffCount || setup.additionalDoctors || setup.staffRoles) ? `
      <div class="sec-title">Clinic Staff & Setup Details</div>
      <table>
        ${setup.doctorsCount ? `<tr><td class="lbl">Doctors Count</td><td class="val">${text(setup.doctorsCount)}</td></tr>` : ''}
        ${setup.staffCount ? `<tr><td class="lbl">Staff Count</td><td class="val">${text(setup.staffCount)}</td></tr>` : ''}
        ${setup.additionalDoctors ? `<tr><td class="lbl">Additional Doctors</td><td class="val">${text(setup.additionalDoctors)}</td></tr>` : ''}
        ${setup.staffRoles ? `<tr><td class="lbl">Staff Roles</td><td class="val">${text(setup.staffRoles)}</td></tr>` : ''}
      </table>` : ''}

      ${(website.bio || website.services || website.workingHours) ? `
      <div class="sec-title">Doctor Website Information</div>
      <table>
        ${website.bio ? `<tr><td class="lbl">Bio / About</td><td class="val">${text(website.bio)}</td></tr>` : ''}
        ${website.services ? `<tr><td class="lbl">Services</td><td class="val">${text(website.services)}</td></tr>` : ''}
        ${website.workingHours ? `<tr><td class="lbl">Working Hours</td><td class="val">${text(website.workingHours)}</td></tr>` : ''}
      </table>` : ''}

      <div style="text-align: center; margin-top: 24px;">
        <a href="${adminLink}" class="btn">Open in Admin Dashboard</a>
      </div>
    </div>
    <div class="footer">
      AppMaker Egypt &bull; Automated System &bull; bookmydoctor-6c93c
    </div>
  </div>
</body>
</html>
    `;

    // 4. Send via Resend
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          // Resend deduplicates retries of this registration email for 24 hours.
          "Idempotency-Key": `doctor-registration/${requestId}`
        },
        body: JSON.stringify({
          from: "AppMaker Egypt <onboarding@resend.dev>",
          to: ["mostafa.hegab83@gmail.com"],
          subject,
          html
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(`Resend API error ${response.status}: ${result.message || "Email send failed"}`);
      }

      // 5. Update Firestore record atomically to record successful email delivery
      await snap.ref.update({
        emailNotified: true,
        emailNotifiedAt: FieldValue.serverTimestamp(),
        emailMessageId: result.id || null
      });

      logger.info(`Email successfully delivered for request ${requestId}`);
    } catch (err) {
      logger.error(`Failed to deliver email for request ${requestId}:`, err);

      // Record failure on document for admin inspection without losing the registration
      await snap.ref.update({
        emailNotified: false,
        emailNotificationError: err.message || String(err),
        emailNotificationAttemptedAt: FieldValue.serverTimestamp()
      });
      // Re-throw to let the configured event retry policy retry transient provider failures.
      throw err;
    }
  }
);
