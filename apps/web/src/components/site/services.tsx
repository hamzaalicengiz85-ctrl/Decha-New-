import * as icons from "lucide-react";

import { isBlank, type Service, type Site } from "@decha/content";

import { EmptySlot } from "./empty-slot";
import { Container, Section, SectionHeading } from "./section";
import { Reveal } from "./reveal";

/** İçerikte adı verilen lucide ikonunu çözer; yoksa nötr bir işaret döner. */
function ServiceIcon({ name }: { name: string }) {
  const fallback = icons.Asterisk;
  const Resolved = (
    !isBlank(name) && name in icons ? icons[name as keyof typeof icons] : fallback
  ) as typeof fallback;

  return <Resolved size={20} strokeWidth={1.6} aria-hidden="true" />;
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal as="li" index={index} className="group relative">
      <div className="hairline flex h-full flex-col gap-5 rounded-card border border-white/8 bg-ink-raised/60 p-7 transition-[transform,border-color,background-color] duration-500 [transition-timing-function:var(--ease-spring)] group-hover:-translate-y-1 group-hover:border-white/16 group-hover:bg-ink-high/70">
        <div className="flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-accent-soft transition-colors duration-500 group-hover:border-accent-soft/40">
            <ServiceIcon name={service.icon} />
          </span>
          <span className="font-mono text-[0.75rem] tracking-[0.18em] text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight tracking-[-0.01em]">
          {isBlank(service.title) ? "Başlıksız hizmet" : service.title}
        </h3>

        {!isBlank(service.summary) && (
          <p className="text-[0.95rem] leading-relaxed text-bone-dim text-pretty">
            {service.summary}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export function Services({
  site,
  services,
}: {
  site: Site;
  services: Service[];
}) {
  return (
    <Section id="hizmetler" className="border-t border-white/6">
      <Container>
        <SectionHeading
          eyebrow="Hizmetler"
          title={site.servicesTitle}
          body={site.servicesBody}
          emptyLabel="Hizmetler başlığı"
        />

        <div className="mt-14">
          {services.length === 0 ? (
            <EmptySlot
              label="Hizmet listesi"
              hint="Henüz hizmet eklenmedi. Yönetim panelinde Hizmetler bölümünden ekleyin."
              size="lg"
            />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
