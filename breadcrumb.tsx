import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useI18n, WHATSAPP_NUMBER } from "@/lib/i18n";

export function FloatingWhatsApp() {
  const { t } = useI18n();
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={t.hero.whatsapp}
      className="fixed bottom-6 end-6 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-elegant transition-transform hover:scale-110"
      style={{ background: "#25D366" }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-400/50" />
    </a>
  );
}

export function BackToTop() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.back_to_top}
      className="fixed bottom-24 end-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-border/60 bg-background text-foreground shadow-card transition-transform hover:-translate-y-0.5"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

export function CookieBanner() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-consent")) {
        const id = setTimeout(() => setShow(true), 1500);
        return () => clearTimeout(id);
      }
    } catch {}
  }, []);
  const close = (value: "accept" | "decline") => {
    try { localStorage.setItem("cookie-consent", value); } catch {}
    setShow(false);
  };
  if (!show) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-border/60 bg-background/95 p-4 shadow-elegant backdrop-blur-xl animate-fade-in sm:flex sm:items-center sm:gap-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{t.cookies.text}</p>
      <div className="mt-3 flex gap-2 sm:mt-0 sm:ms-auto sm:shrink-0">
        <button
          onClick={() => close("decline")}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t.cookies.decline}
        </button>
        <button
          onClick={() => close("accept")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card hover:opacity-90"
        >
          {t.cookies.accept}
        </button>
      </div>
    </div>
  );
}