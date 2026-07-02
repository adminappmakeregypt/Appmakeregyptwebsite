import { Cpu, ShieldCheck, Wallet, Rocket, HeartHandshake, Wand2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SectionHeader } from "./Services";

const icons = [Cpu, ShieldCheck, Wallet, Rocket, HeartHandshake, Wand2];

export function WhyUs() {
  const { t } = useI18n();
  return (
    <section id="why" className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 100%, color-mix(in oklab, var(--color-primary) 15%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="02" title={t.why.title} subtitle={t.why.subtitle} />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.why.items.map((s, i) => {
            const Icon = icons[i] ?? Cpu;
            return (
              <div
                key={s.t}
                className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div
                  className="grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground shadow-elegant"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Icon className="h-6 w-6" />
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