import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Services } from "@/components/site/Services";
import { WhyUs } from "@/components/site/WhyUs";
import { Portfolio } from "@/components/site/Portfolio";
import { Pricing } from "@/components/site/Pricing";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BackToTop, CookieBanner, FloatingWhatsApp } from "@/components/site/FloatingUI";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AppMaker Egypt — Mobile Apps & Clinic Management Systems" },
      {
        name: "description",
        content:
          "AppMaker Egypt builds premium mobile apps, clinic management systems and business automation for ambitious teams. We turn your ideas into powerful apps.",
      },
      { property: "og:title", content: "AppMaker Egypt — We Turn Your Ideas Into Powerful Apps" },
      { property: "og:description", content: "Custom mobile apps, clinic management systems and dashboards, built in Egypt." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AppMaker Egypt" },
      { name: "twitter:description", content: "We turn your ideas into powerful apps." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AppMaker Egypt",
          slogan: "We Turn Your Ideas Into Powerful Apps",
          areaServed: "EG",
          address: { "@type": "PostalAddress", addressCountry: "EG", addressLocality: "Cairo" },
          contactPoint: [{ "@type": "ContactPoint", telephone: "+201110044008", contactType: "sales" }],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <Stats />
          <Services />
          <WhyUs />
          <Portfolio />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <BackToTop />
        <CookieBanner />
        <Toaster richColors position="top-center" />
      </div>
    </I18nProvider>
  );
}
