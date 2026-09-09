import { isBlank } from "@decha/content";
import { readContent } from "@decha/content/server";

import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { Work } from "@/components/site/work";
import { ToTop } from "@/components/site/to-top";

// İçerik dosyası her istekte okunur; admin panelinden yapılan
// değişiklik yeniden derleme gerektirmeden yansır.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readContent();
  const brand = isBlank(content.site.brandName) ? "DECHA" : content.site.brandName;

  return (
    <>
      <a
        href="#ana-icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-white"
      >
        İçeriğe geç
      </a>

      <Header brandName={brand} />

      <main id="ana-icerik">
        <Hero site={content.site} />
        <Services site={content.site} services={content.services} />
        <Work site={content.site} projects={content.projects} />
        <Contact
          site={content.site}
          contact={content.contact}
          services={content.services}
          socials={content.socials}
        />
      </main>

      <Footer site={content.site} />
      <ToTop />
    </>
  );
}
