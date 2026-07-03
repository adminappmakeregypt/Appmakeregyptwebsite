import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";
import { SectionHeader } from "./Services";

export function FAQ() {
  const { t } = useI18n();
  return (
    <section id="faq" className="bg-gradient-soft py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="06" title={t.faq.title} />
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {t.faq.items.map((f, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card px-5"
            >
              <AccordionTrigger className="text-start text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}