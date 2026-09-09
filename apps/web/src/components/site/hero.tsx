import { ArrowDown, ArrowRight } from "lucide-react";

import { isBlank, type Site } from "@decha/content";

import { LinkButton } from "@/components/ui/button";
import { EmptySlot } from "./empty-slot";
import { Container, Eyebrow } from "./section";
import { Reveal } from "./reveal";

/**
 * Başlıkta vurgulanacak öbeği serif italik olarak ayırır.
 * Vurgu metni başlıkta geçmiyorsa başlık olduğu gibi yazılır.
 */
function Headline({ headline, highlight }: { headline: string; highlight: string }) {
  if (isBlank(highlight) || !headline.includes(highlight)) {
    return <>{headline}</>;
  }

  const [before, ...rest] = headline.split(highlight);
  return (
    <>
      {before}
      <em className="italic text-accent-soft">{highlight}</em>
      {rest.join(highlight)}
    </>
  );
}

export function Hero({ site }: { site: Site }) {
  return (
    <section id="ust" className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32">
      {/* Tek, ölçülü ışık kaynağı — sahneyi kurar, dikkati dağıtmaz */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[64rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(79 70 229 / 0.22), transparent 72%)",
        }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <Reveal>
              <Eyebrow>
                {isBlank(site.heroEyebrow) ? "Dijital Ajans" : site.heroEyebrow}
              </Eyebrow>
            </Reveal>

            {isBlank(site.heroHeadline) ? (
              <Reveal index={1} className="mt-8 block">
                <EmptySlot
                  label="Hero başlığı"
                  hint="Sitenin ilk cümlesi. Yönetim panelinde İçerik → Hero alanından yazılır."
                  size="lg"
                />
              </Reveal>
            ) : (
              <Reveal index={1}>
                <h1 className="mt-8 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.98] tracking-[-0.03em] text-balance">
                  <Headline
                    headline={site.heroHeadline}
                    highlight={site.heroHighlight}
                  />
                </h1>
              </Reveal>
            )}

            {!isBlank(site.heroBody) && (
              <Reveal index={2}>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim text-pretty">
                  {site.heroBody}
                </p>
              </Reveal>
            )}

            {(!isBlank(site.primaryCtaLabel) || !isBlank(site.secondaryCtaLabel)) && (
              <Reveal index={3}>
                <div className="mt-10 flex flex-wrap gap-3">
                  {!isBlank(site.primaryCtaLabel) && (
                    <LinkButton href="#iletisim">
                      {site.primaryCtaLabel}
                      <ArrowRight size={17} aria-hidden="true" />
                    </LinkButton>
                  )}
                  {!isBlank(site.secondaryCtaLabel) && (
                    <LinkButton href="#isler" variant="ghost">
                      {site.secondaryCtaLabel}
                    </LinkButton>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* Editoryal kenar sütunu: kasıtlı asimetri */}
          <div className="hidden lg:col-span-3 lg:flex lg:items-end lg:justify-end">
            <Reveal index={4}>
              <a
                href="#hizmetler"
                className="group flex flex-col items-end gap-3 text-right"
              >
                <span className="font-mono text-[0.75rem] uppercase tracking-[0.22em] text-muted transition-colors group-hover:text-bone">
                  Aşağı
                </span>
                <span className="flex size-11 items-center justify-center rounded-full border border-white/12 text-muted transition-all duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-y-1 group-hover:border-accent-soft/50 group-hover:text-bone">
                  <ArrowDown size={16} aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
