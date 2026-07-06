import { useI18n, WHATSAPP_NUMBER, CONTACT_EMAIL, FACEBOOK_URL } from "@/lib/i18n";
import logo from "@/assets/logo.jpg";
import { Facebook, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  const { t } = useI18n();
  const links = ["home", "services", "why", "portfolio", "pricing", "faq", "contact"] as const;
  const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="AppMaker Egypt" width={120} height={48} className="h-12 w-auto object-contain" />
            <span className="text-base font-bold">AppMaker <span className="text-gradient">Egypt</span></span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t.footer.tagline}</p>
        </div>

        <div>
          <h4 className="text-sm font-bold">{t.footer.quick}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l}>
                <button onClick={() => goto(l)} className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.nav[l]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold">{t.footer.services}</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {t.services.items.slice(0, 5).map((s) => (
              <li key={s.t}>{s.t}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold">{t.footer.social}</h4>
          <div className="mt-4 flex gap-3">
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer noopener" aria-label="Facebook"
               className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-background transition-colors hover:bg-primary hover:text-primary-foreground">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer noopener" aria-label="WhatsApp"
               className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-background transition-colors hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email"
               className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-background transition-colors hover:bg-primary hover:text-primary-foreground">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AppMaker Egypt · {t.footer.rights}
      </div>
    </footer>
  );
}