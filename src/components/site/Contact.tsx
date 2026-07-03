import { useState } from "react";
import { Mail, MapPin, MessageCircle, Send, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, CONTACT_EMAIL, FACEBOOK_URL, COMPANY_ADDRESS_EN, COMPANY_ADDRESS_AR } from "@/lib/i18n";
import { SectionHeader } from "./Services";
import { toast } from "sonner";

export function Contact() {
  const { t, lang } = useI18n();
  const address = lang === "ar" ? COMPANY_ADDRESS_AR : COMPANY_ADDRESS_EN;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    try {
      const res = await fetch("https://formspree.io/f/xvzjvjdy", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        toast.success(t.contact.sent);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="07" title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border/60 bg-card p-6 shadow-card sm:p-8 lg:col-span-3"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input required name="name" placeholder={t.contact.name} />
              <Input required type="email" name="email" placeholder={t.contact.email} />
            </div>
            <Input className="mt-4" name="phone" placeholder={t.contact.phone} />
            <Textarea required rows={5} className="mt-4" name="message" placeholder={t.contact.message} />
            <Button type="submit" size="lg" className="mt-5 w-full shadow-elegant" disabled={loading}>
              <Send className="me-2 h-4 w-4" />
              {t.contact.send}
            </Button>
          </form>

          <div className="space-y-4 lg:col-span-2">
            <ContactCard
              icon={<MessageCircle className="h-5 w-5" />}
              title={t.contact.whatsapp_us}
              value={WHATSAPP_DISPLAY}
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
            />
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title={t.contact.email_us}
              value={CONTACT_EMAIL}
              href={`mailto:${CONTACT_EMAIL}`}
            />
            <ContactCard
              icon={<Facebook className="h-5 w-5" />}
              title={t.contact.facebook}
              value="AppMaker Egypt"
              href={FACEBOOK_URL}
            />
            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              title={t.contact.location}
              value={address}
            />
            <div className="overflow-hidden rounded-2xl border border-border/60">
              <iframe
                title="AppMaker Egypt location"
                src="https://www.google.com/maps?q=Smart+Village+B215+F7+Phase+1+Cairo+Alexandria+Desert+Road&output=embed"
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon, title, value, href,
}: { icon: React.ReactNode; title: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <div className="truncate text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer</parameter>
</invoke></think>The current project already contains the **correct** code. The key part is the `onSubmit` handler starting at line 15 — it uses `fetch("https://formspree.io/f/xvzjvjdy", ...)` to actually send the form data.

The code the other AI showed you is functionally identical to what's already here. If your live site still isn't sending messages, the issue is that your **deployed build does not include this version** of the file.

To fix this, download the latest ZIP from this project and redeploy it to Cloudflare Pages, making sure the new `Contact.tsx` replaces the old one.
