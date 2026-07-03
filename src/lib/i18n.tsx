import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = typeof en;

const en = {
  nav: {
    home: "Home",
    services: "Services",
    why: "Why Us",
    portfolio: "Portfolio",
    pricing: "Pricing",
    testimonials: "Testimonials",
    faq: "FAQ",
    contact: "Contact",
    cta: "Free Consultation",
  },
  hero: {
    badge: "Custom Software Studio · Egypt",
    title: "Build Your Mobile App with Confidence",
    subtitle:
      "We develop custom mobile applications and clinic management systems for ambitious businesses in Egypt and the region.",
    consult: "Get Free Consultation",
    whatsapp: "Contact on WhatsApp",
    tagline: "We Turn Your Ideas Into Powerful Apps",
  },
  stats: {
    satisfaction: "Customer Satisfaction",
    delivery: "Fast Delivery",
    cloud: "Secure Cloud Solutions",
    support: "Professional Support",
  },
  services: {
    title: "Our Services",
    subtitle: "End-to-end product development, backed by modern engineering.",
    items: [
      { t: "Mobile App Development", d: "Native-quality iOS & Android apps built with Flutter and React Native." },
      { t: "Clinic Management Systems", d: "Complete EMR, scheduling, billing and patient portals for clinics." },
      { t: "Booking & Appointments", d: "Smart booking systems with reminders, payments and calendars." },
      { t: "Business Automation", d: "Automate repetitive workflows and integrate your business tools." },
      { t: "Firebase Backend", d: "Realtime databases, auth, cloud functions and secure hosting." },
      { t: "Admin Dashboards", d: "Powerful analytics dashboards to run your operations at scale." },
      { t: "UI / UX Design", d: "Premium interfaces that feel effortless on every device." },
      { t: "Support & Maintenance", d: "Ongoing monitoring, updates and 24/7 technical support." },
    ],
  },
  why: {
    title: "Why Choose AppMaker",
    subtitle: "A partner that ships, scales and stays with you.",
    items: [
      { t: "Modern Technologies", d: "We use today's best stack — Flutter, React, Firebase, Node." },
      { t: "Secure Systems", d: "Enterprise-grade security, encryption and cloud best practices." },
      { t: "Affordable Prices", d: "Fair, transparent pricing tuned for the Egyptian market." },
      { t: "Fast Delivery", d: "Agile sprints and rapid MVPs that reach users quickly." },
      { t: "Ongoing Support", d: "Long-term partnership with proactive maintenance." },
      { t: "Custom Solutions", d: "Every project is tailored to your exact business logic." },
    ],
  },
  portfolio: {
    title: "Selected Work",
    subtitle: "A glimpse of the products we've shipped for our clients.",
    items: [
      { t: "MediCare Clinic Suite", tag: "Healthcare", d: "Full EMR & appointment platform for a chain of clinics." },
      { t: "BookNow", tag: "Booking", d: "Appointment platform serving beauty & wellness businesses." },
      { t: "FleetPilot", tag: "Logistics", d: "Realtime fleet tracking dashboard for delivery operations." },
      { t: "EduFlow", tag: "Education", d: "Learning app with live sessions and progress tracking." },
      { t: "ShopHub", tag: "E-commerce", d: "Mobile-first store with payments and vendor dashboards." },
      { t: "GymPro", tag: "Fitness", d: "Training & membership app with automated billing." },
    ],
  },
  pricing: {
    title: "Simple, Transparent Pricing",
    subtitle: "Pick a plan that fits your stage. Custom quotes available.",
    contact: "Contact Us",
    popular: "Most Popular",
    plans: [
      {
        name: "Ready-Made Apps",
        price: "100 EGP / month",
        d: "Monthly subscription for our ready-made applications.",
        features: ["Instant activation", "Regular updates", "Technical support", "Cloud hosting"],
      },
      {
        name: "Customized Apps",
        price: "10,000 EGP",
        d: "Fully customized app + 2,000 EGP annual renewal.",
        features: ["Tailored to your business", "iOS + Android", "Admin dashboard", "Annual renewal 2,000 EGP", "Priority support"],
      },
      {
        name: "Enterprise",
        price: "By Agreement",
        d: "For clinics, chains and complex platforms.",
        features: ["Custom architecture", "Unlimited screens", "Dedicated team", "SLA & priority support", "12 months maintenance"],
      },
    ],
  },
  testimonials: {
    title: "Loved by Founders & Clinics",
    items: [
      { q: "AppMaker delivered our clinic system in weeks. Patient no-shows dropped 40%.", a: "Dr. Ahmed Hassan", r: "MediCare Group" },
      { q: "The team truly cares. Our booking app has 4.9 stars on the App Store.", a: "Sara Ibrahim", r: "Founder, BookNow" },
      { q: "Clean code, fast delivery and great UI. Highly recommended.", a: "Omar El-Sayed", r: "CTO, ShopHub" },
      { q: "They understood our business better than we did. Amazing partner.", a: "Mona Adel", r: "Ops, FleetPilot" },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { q: "How long does it take to build an app?", a: "MVPs typically ship in 4–8 weeks. Larger platforms take 3–6 months depending on scope." },
      { q: "How much does a mobile app cost?", a: "Ready-made apps start from 100 EGP/month. Customized apps start from 10,000 EGP with 2,000 EGP annual renewal." },
      { q: "Do you provide ongoing support?", a: "Yes. All plans include support, and we offer long-term maintenance packages." },
      { q: "Who owns the source code?", a: "You do. Full IP, source code and design files are handed over on delivery." },
      { q: "Do you sign NDAs?", a: "Absolutely. We can sign an NDA before our first discovery call." },
      { q: "Can you take over an existing project?", a: "Yes, after a short technical audit we can continue development from where you are." },
    ],
  },
  contact: {
    title: "Let's Build Something Great",
    subtitle: "Tell us about your idea and we'll get back within 24 hours.",
    name: "Your name",
    email: "Email address",
    phone: "Phone (optional)",
    message: "Tell us about your project",
    send: "Send Message",
    sent: "Thanks! We'll reach out shortly.",
    email_us: "Email us",
    whatsapp_us: "WhatsApp",
    location: "Smart Village, Cairo",
    facebook: "Facebook",
  },
  footer: {
    tagline: "We Turn Your Ideas Into Powerful Apps",
    quick: "Quick Links",
    services: "Services",
    social: "Follow Us",
    rights: "All rights reserved.",
  },
  cookies: {
    text: "We use cookies to improve your experience and analyze traffic.",
    accept: "Accept",
    decline: "Decline",
  },
  back_to_top: "Back to top",
  theme: { light: "Light mode", dark: "Dark mode" },
};

const ar: Dict = {
  nav: {
    home: "الرئيسية",
    services: "خدماتنا",
    why: "لماذا نحن",
    portfolio: "أعمالنا",
    pricing: "الأسعار",
    testimonials: "آراء العملاء",
    faq: "الأسئلة الشائعة",
    contact: "تواصل معنا",
    cta: "استشارة مجانية",
  },
  hero: {
    badge: "استوديو برمجيات مخصصة · مصر",
    title: "ابن تطبيق ويب يعمل من الموبايل و اللابتوب",
    subtitle:
      "نطوّر تطبيقات موبايل مخصصة وأنظمة إدارة عيادات للشركات الطموحة في مصر والمنطقة.",
    consult: "احصل على استشارة مجانية",
    whatsapp: "تواصل عبر واتساب",
    tagline: "نحوّل أفكارك إلى تطبيقات قوية",
  },
  stats: {
    satisfaction: "رضا العملاء",
    delivery: "تسليم سريع",
    cloud: "حلول سحابية آمنة",
    support: "دعم احترافي",
  },
  services: {
    title: "خدماتنا",
    subtitle: "تطوير منتجات متكامل مدعوم بأحدث التقنيات.",
    items: [
      { t: "تطوير تطبيقات الموبايل", d: "تطبيقات iOS و Android بجودة عالية باستخدام Flutter و React Native." },
      { t: "أنظمة إدارة العيادات", d: "نظام سجلات طبية، حجوزات، فوترة وبوابات مرضى متكاملة." },
      { t: "أنظمة الحجز والمواعيد", d: "أنظمة حجز ذكية مع تذكيرات ومدفوعات وتقويم متكامل." },
      { t: "أتمتة الأعمال", d: "أتمتة سير العمل وربط أدوات شركتك بسهولة." },
      { t: "خدمات Firebase الخلفية", d: "قواعد بيانات لحظية، مصادقة، دوال سحابية واستضافة آمنة." },
      { t: "لوحات تحكم إدارية", d: "لوحات تحليلات قوية لإدارة عملياتك بكفاءة." },
      { t: "تصميم واجهات UI/UX", d: "واجهات مميزة تعمل بسلاسة على كل الأجهزة." },
      { t: "الدعم والصيانة", d: "مراقبة مستمرة وتحديثات ودعم فني على مدار الساعة." },
    ],
  },
  why: {
    title: "لماذا AppMaker",
    subtitle: "شريك يُطلق منتجك، يوسّعه، ويبقى معك.",
    items: [
      { t: "أحدث التقنيات", d: "نستخدم أفضل التقنيات الحديثة — Flutter و React و Firebase و Node." },
      { t: "أنظمة آمنة", d: "أمان بمستوى الشركات، تشفير، وممارسات سحابية موثوقة." },
      { t: "أسعار مناسبة", d: "أسعار عادلة وشفافة مخصصة للسوق المصري." },
      { t: "تسليم سريع", d: "دورات عمل مرنة و MVP سريع للوصول للمستخدمين بسرعة." },
      { t: "دعم مستمر", d: "شراكة طويلة الأمد وصيانة استباقية." },
      { t: "حلول مخصصة", d: "كل مشروع مصمم خصيصًا لمنطق عملك." },
    ],
  },
  portfolio: {
    title: "أعمال مختارة",
    subtitle: "لمحة من المنتجات التي أطلقناها لعملائنا.",
    items: [
      { t: "MediCare Clinic Suite", tag: "الصحة", d: "منصة سجلات طبية ومواعيد لسلسلة عيادات." },
      { t: "BookNow", tag: "حجوزات", d: "منصة حجوزات لخدمات التجميل والعافية." },
      { t: "FleetPilot", tag: "لوجستيات", d: "لوحة تتبع أسطول لحظية لعمليات التوصيل." },
      { t: "EduFlow", tag: "تعليم", d: "تطبيق تعليمي بجلسات مباشرة وتتبع تقدم." },
      { t: "ShopHub", tag: "متاجر", d: "متجر إلكتروني بمدفوعات ولوحة تجار." },
      { t: "GymPro", tag: "لياقة", d: "تطبيق تدريب واشتراكات مع فوترة تلقائية." },
    ],
  },
  pricing: {
    title: "أسعار بسيطة وشفافة",
    subtitle: "اختر الخطة المناسبة لمرحلتك. نوفّر عروض مخصصة أيضًا.",
    contact: "تواصل معنا",
    popular: "الأكثر طلبًا",
    plans: [
      {
        name: "التطبيقات الجاهزة",
        price: "اشتراك شهري 100 جنيه",
        d: "اشتراك شهري لتطبيقاتنا الجاهزة.",
        features: ["تفعيل فوري", "تحديثات مستمرة", "دعم فني", "استضافة سحابية"],
      },
      {
        name: "التطبيقات المخصصة (Customized)",
        price: "10,000 جنيه + تجديد سنوي 2,000 جنيه",
        d: "تطبيق مخصص بالكامل لعملك مع تجديد سنوي.",
        features: ["مصمم خصيصًا لعملك", "iOS و Android", "لوحة تحكم إدارية", "تجديد سنوي 2,000 جنيه", "دعم بأولوية"],
      },
      {
        name: "المؤسسي",
        price: "حسب الاتفاق",
        d: "للعيادات والسلاسل والمنصات المعقدة.",
        features: ["معمارية مخصصة", "شاشات غير محدودة", "فريق مخصص", "دعم بأولوية و SLA", "صيانة 12 شهر"],
      },
    ],
  },
  testimonials: {
    title: "عملاؤنا يتحدثون",
    items: [
      { q: "سلّمنا AppMaker نظام العيادة خلال أسابيع. انخفضت حالات عدم الحضور بنسبة 40%.", a: "د. أحمد حسن", r: "مجموعة MediCare" },
      { q: "فريق يهتم بالتفاصيل. تطبيق الحجز عندنا حصل على 4.9 نجوم.", a: "سارة إبراهيم", r: "مؤسسة BookNow" },
      { q: "كود نظيف، تسليم سريع، وواجهات رائعة. أنصح بهم بشدة.", a: "عمر السيد", r: "CTO, ShopHub" },
      { q: "فهموا طبيعة عملنا أفضل منا. شراكة رائعة.", a: "منى عادل", r: "عمليات FleetPilot" },
    ],
  },
  faq: {
    title: "الأسئلة الشائعة",
    items: [
      { q: "كم يستغرق بناء تطبيق؟", a: "MVP يستغرق عادة 4–8 أسابيع. المشاريع الأكبر من 3 إلى 6 أشهر حسب النطاق." },
      { q: "ما تكلفة تطبيق الموبايل؟", a: "التطبيقات الجاهزة تبدأ من 100 جنيه شهريًا. التطبيقات المخصصة تبدأ من 10,000 جنيه مع تجديد سنوي 2,000 جنيه." },
      { q: "هل تقدمون دعمًا مستمرًا؟", a: "نعم، كل الباقات تشمل دعمًا، ونقدم باقات صيانة طويلة الأمد." },
      { q: "من يملك الكود المصدري؟", a: "أنت. نسلّمك حقوق الملكية الكاملة والكود المصدري وملفات التصميم." },
      { q: "هل توقعون اتفاقيات NDA؟", a: "بالتأكيد، يمكننا توقيع NDA قبل جلسة الاكتشاف الأولى." },
      { q: "هل يمكنكم استكمال مشروع قائم؟", a: "نعم، بعد مراجعة تقنية قصيرة نستطيع المتابعة من حيث توقفت." },
    ],
  },
  contact: {
    title: "لنبنِ شيئًا رائعًا معًا",
    subtitle: "حدّثنا عن فكرتك وسنعود إليك خلال 24 ساعة.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف (اختياري)",
    message: "أخبرنا عن مشروعك",
    send: "أرسل الرسالة",
    sent: "شكرًا لك! سنتواصل معك قريبًا.",
    email_us: "راسلنا",
    whatsapp_us: "واتساب",
    location: "القرية الذكية، القاهرة",
    facebook: "فيسبوك",
  },
  footer: {
    tagline: "نحوّل أفكارك إلى تطبيقات قوية",
    quick: "روابط سريعة",
    services: "الخدمات",
    social: "تابعنا",
    rights: "جميع الحقوق محفوظة.",
  },
  cookies: {
    text: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل الزيارات.",
    accept: "قبول",
    decline: "رفض",
  },
  back_to_top: "العودة للأعلى",
  theme: { light: "الوضع الفاتح", dark: "الوضع الداكن" },
};

const dicts: Record<Lang, Dict> = { en, ar };

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const storedTheme = (localStorage.getItem("theme") as "light" | "dark" | null) ?? "light";
      localStorage.setItem("lang", "en");
      setLangState("en");
      setTheme(storedTheme);
    } catch {}
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const value: Ctx = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: dicts[lang],
    setLang: setLangState,
    toggleLang: () => setLangState((l) => (l === "ar" ? "en" : "ar")),
    theme,
    toggleTheme: () => setTheme((v) => (v === "light" ? "dark" : "light")),
  };

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export const WHATSAPP_NUMBER = "201110044008";
export const WHATSAPP_DISPLAY = "01110044008";
export const CONTACT_EMAIL = "contact@appmakeregypt.com";
export const FACEBOOK_URL = "https://web.facebook.com/profile.php?id=61591233944299";
export const COMPANY_ADDRESS_EN = "Smart Village B215 F7 Phase 1, Cairo–Alex Desert Road";
export const COMPANY_ADDRESS_AR = "القرية الذكية B215 F7 المرحلة 1، طريق القاهرة الإسكندرية الصحراوي";