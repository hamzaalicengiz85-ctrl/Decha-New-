import { Mail, MapPin, Phone } from "lucide-react";

import {
  isBlank,
  type Contact as ContactInfo,
  type Service,
  type Site,
  type Social,
} from "@decha/content";

import { ContactForm } from "./contact-form";
import { EmptySlot } from "./empty-slot";
import { Container, Section, SectionHeading } from "./section";
import { Reveal } from "./reveal";

function DetailRow({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-accent-soft">
        {icon}
      </span>
      <span className="text-[0.975rem] text-bone-dim transition-colors duration-300 group-hover:text-bone">
        {value}
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="group flex min-h-11 items-center gap-4">
          {content}
        </a>
      ) : (
        <div className="group flex min-h-11 items-center gap-4">{content}</div>
      )}
    </li>
  );
}

export function Contact({
  site,
  contact,
  services,
  socials,
}: {
  site: Site;
  contact: ContactInfo;
  services: Service[];
  socials: Social[];
}) {
  const hasDetails =
    !isBlank(contact.email) || !isBlank(contact.phone) || !isBlank(contact.location);

  return (
    <Section id="iletisim" className="border-t border-white/6">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="İletişim"
              title={site.contactTitle}
              body={site.contactBody}
              emptyLabel="İletişim başlığı"
            />

            <div className="mt-10 space-y-8">
              {hasDetails ? (
                <ul className="space-y-2">
                  {!isBlank(contact.email) && (
                    <DetailRow
                      icon={<Mail size={17} strokeWidth={1.6} aria-hidden="true" />}
                      value={contact.email}
                      href={`mailto:${contact.email}`}
                    />
                  )}
                  {!isBlank(contact.phone) && (
                    <DetailRow
                      icon={<Phone size={17} strokeWidth={1.6} aria-hidden="true" />}
                      value={contact.phone}
                      href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                    />
                  )}
                  {!isBlank(contact.location) && (
                    <DetailRow
                      icon={<MapPin size={17} strokeWidth={1.6} aria-hidden="true" />}
                      value={contact.location}
                    />
                  )}
                </ul>
              ) : (
                <EmptySlot
                  label="İletişim bilgileri"
                  hint="E-posta, telefon ve konum yönetim panelinden girilir."
                  size="sm"
                />
              )}

              {socials.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <li key={social.id}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex min-h-11 items-center rounded-full border border-white/10 bg-white/[0.03] px-5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:border-accent-soft/40 hover:text-bone"
                      >
                        {social.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <Reveal index={1}>
            <ContactForm
              services={services}
              email={contact.email}
              formEndpoint={contact.formEndpoint}
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
