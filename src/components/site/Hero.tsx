import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, WHATSAPP_NUMBER } from "@/lib/i18n";
import heroImg from "@/assets/hero-app.jpg";

export function Hero() {
  const { t } = useI18n();
  const goto = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--color-primary) 22%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] opacity-40"
        style={{
          background:
            "radial-gradient(40% 60% at 10% 40%, color-mix(in oklab, var(--color-brand-accent) 30%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="animate-fade-in text-center lg:text-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {t.hero.badge}
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
            {t.hero.subtitle}
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            — {t.hero.tagline}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start lg:justify-start justify-center">
            <Button
              size="lg"
              onClick={() => goto("contact")}
              className="shadow-elegant"
            >
              {t.hero.consult}
              <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary/30 hover:bg-primary/5"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageCircle className="me-2 h-4 w-4" />
                {t.hero.whatsapp}
              </a>
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-hero opacity-30 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-elegant">
            <img
              src={heroImg}
              alt="Modern mobile app development illustration"
              width={1280}
              height={1024}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}