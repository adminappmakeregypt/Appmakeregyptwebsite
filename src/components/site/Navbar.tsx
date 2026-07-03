import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import logoAsset from "@/assets/logo.jpg.asset.json";

const sections = ["home", "services", "why", "portfolio", "pricing", "testimonials", "faq", "contact"] as const;

export function Navbar() {
  const { t, lang, toggleLang, theme, toggleTheme } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNav("home")}
          className="flex min-w-0 items-center gap-2 shrink-0"
          aria-label="AppMaker Egypt"
        >
          <img
            src={logoAsset.url}
            alt="AppMaker Egypt logo"
            className="h-10 w-auto max-w-[160px] object-contain"
          />
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {sections.slice(0, -1).map((s) => (
            <button
              key={s}
              onClick={() => handleNav(s)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t.nav[s]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLang}
            aria-label="Toggle language"
            className="shrink-0"
          >
            <Languages className="h-4 w-4" />
            <span className="ml-1 text-xs font-semibold">{lang === "ar" ? "EN" : "ع"}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "light" ? t.theme.dark : t.theme.light}
            className="shrink-0"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => handleNav("contact")}
            className="hidden shrink-0 shadow-elegant lg:inline-flex"
          >
            {t.nav.cta}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden animate-fade-in">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => handleNav(s)}
                className="rounded-lg px-3 py-2 text-start text-sm font-medium text-foreground/80 transition-colors hover:bg-accent"
              >
                {t.nav[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}