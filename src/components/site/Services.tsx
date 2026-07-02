import {
  Smartphone, Stethoscope, CalendarClock, Workflow, Flame, LayoutDashboard, Palette, LifeBuoy,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Smartphone, Stethoscope, CalendarClock, Workflow, Flame, LayoutDashboard, Palette, LifeBuoy];

export function Services() {
  const { t } = useI18n();
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="01" title={t.services.title} subtitle={t.services.subtitle} />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.services.items.map((s, i) => {
            const Icon = icons[i] ?? Smartphone;
            return (
              <div
                key={s.t}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
              >
                <div className="absolute inset-x-0 -top-24 h-32 bg-gradient-hero opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow, title, subtitle, center = true,
}: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <span className="h-px w-6 bg-primary/60" />
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </div>
  );
}