import { useI18n } from "@/lib/i18n";
import { SectionHeader } from "./Services";
import { ArrowUpRight } from "lucide-react";

const gradients = [
  "linear-gradient(135deg,#4f46e5,#a855f7)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#f43f5e,#8b5cf6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#7c3aed,#ec4899)",
];

export function Portfolio() {
  const { t } = useI18n();
  return (
    <section id="portfolio" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="03" title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.portfolio.items.map((p, i) => (
            <article
              key={p.t}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div
                className="relative aspect-[4/3] w-full"
                style={{ background: gradients[i % gradients.length] }}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <span className="rounded-xl bg-white/15 px-4 py-2 text-lg font-black text-white backdrop-blur-md">
                    {p.t.split(" ")[0]}
                  </span>
                </div>
                <div className="absolute end-3 top-3 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {p.tag}
                </div>
              </div>
              <div className="flex items-start justify-between gap-3 p-5">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold">{p.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
                </div>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-foreground transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}