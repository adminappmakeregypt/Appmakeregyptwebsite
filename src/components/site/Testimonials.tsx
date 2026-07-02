import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SectionHeader } from "./Services";
import { Button } from "@/components/ui/button";

export function Testimonials() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const items = t.testimonials.items;
  const n = items.length;

  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(id);
  }, [n]);

  const current = items[i];

  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="05" title={t.testimonials.title} />
        <div className="relative mt-14">
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card sm:p-12">
            <Quote className="mx-auto h-8 w-8 text-primary/60" />
            <p key={i} className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed sm:text-xl animate-fade-in">
              &ldquo;{current.q}&rdquo;
            </p>
            <div className="mt-6">
              <div className="text-sm font-bold">{current.a}</div>
              <div className="text-xs text-muted-foreground">{current.r}</div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setI((x) => (x - 1 + n) % n)} aria-label="Previous">
              <ChevronLeft className="h-4 w-4 rtl:hidden" />
              <ChevronRight className="hidden h-4 w-4 rtl:inline" />
            </Button>
            <div className="flex gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === i ? "w-6 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={() => setI((x) => (x + 1) % n)} aria-label="Next">
              <ChevronRight className="h-4 w-4 rtl:hidden" />
              <ChevronLeft className="hidden h-4 w-4 rtl:inline" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}