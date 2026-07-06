import { Smile, Zap, Cloud, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Stats() {
  const { t } = useI18n();
  const items = [
    { icon: Smile, label: t.stats.satisfaction, value: "99%" },
    { icon: Zap, label: t.stats.delivery, value: "4-8w" },
    { icon: Cloud, label: t.stats.cloud, value: "24/7" },
    { icon: Headphones, label: t.stats.support, value: "100%" },
  ];
  return (
    <section className="border-y border-border/60 bg-gradient-soft py-10 sm:py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:gap-10 lg:px-8">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</div>
              <div className="text-xs text-muted-foreground sm:text-sm">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}