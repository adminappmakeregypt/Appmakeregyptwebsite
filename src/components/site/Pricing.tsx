import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SectionHeader } from "./Services";

export function Pricing() {
  const { t } = useI18n();
  const goto = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="pricing" className="bg-gradient-soft py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="04" title={t.pricing.title} subtitle={t.pricing.subtitle} />
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {t.pricing.plans.map((p, i) => {
            const featured = i === 1;
            return (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all ${
                  featured
                    ? "border-transparent bg-primary text-primary-foreground shadow-elegant lg:-translate-y-3"
                    : "border-border/60 bg-card"
                }`}
              >
                {featured && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-card rtl:translate-x-1/2">
                    <Star className="me-1 inline h-3 w-3 fill-current" />
                    {t.pricing.popular}
                  </div>
                )}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className={`mt-1 text-sm ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {p.d}
                </p>
                <div className="mt-6 text-4xl font-extrabold tracking-tight">{p.price}</div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "" : "text-primary"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={goto}
                  variant={featured ? "secondary" : "default"}
                  className="mt-8 w-full"
                >
                  {t.pricing.contact}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}