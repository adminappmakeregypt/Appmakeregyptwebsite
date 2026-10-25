Keep this deliverable dependency-free: index.html contains initial English content, app.js owns shared translations and interactions, and styles.css owns visual tokens. This allows direct GitHub Pages hosting without a build step.

Subscription requests live in their own Firestore collections (subscriptionRequests, subscriptionActivations keyed by request ID) and are protected by firestore.rules/storage.rules, not page logic; customers may only create, the website admin alone reads/updates, so payment status and dates can never be set by the public.
The public form always saves before redirecting and reads the payment link from the promotion document, so payment links are never hardcoded and no customer is sent to payment without a saved request.
