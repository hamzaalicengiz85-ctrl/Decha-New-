import { ArrowUpRight } from "lucide-react";

import { isBlank, type Project, type Site } from "@decha/content";

import { cn } from "@/lib/cn";
import { EmptySlot } from "./empty-slot";
import { Container, Section, SectionHeading } from "./section";
import { Reveal } from "./reveal";

function ProjectCard({
  project,
  index,
  wide,
}: {
  project: Project;
  index: number;
  wide: boolean;
}) {
  const hasImage = !isBlank(project.image);
  const body = (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-card border border-white/8 bg-ink-raised",
          wide ? "aspect-[16/9]" : "aspect-[4/3]",
        )}
      >
        {hasImage ? (
          // Görseller admin panelinden yükleniyor; boyutları önceden bilinmiyor
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={isBlank(project.imageAlt) ? "" : project.imageAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-spring)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-muted">
              Görsel yok
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight tracking-[-0.01em]">
            {isBlank(project.title) ? "Başlıksız proje" : project.title}
          </h3>
          {!isBlank(project.summary) && (
            <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-bone-dim text-pretty">
              {project.summary}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-1">
          {!isBlank(project.category) && (
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted">
              {project.category}
            </span>
          )}
          {!isBlank(project.url) && (
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="text-muted transition-all duration-500 [transition-timing-function:var(--ease-spring)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-soft"
            />
          )}
        </div>
      </div>
    </>
  );

  return (
    <Reveal
      as="li"
      index={index}
      className={cn("group", wide && "md:col-span-2")}
    >
      {isBlank(project.url) ? (
        <div>{body}</div>
      ) : (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          className="block rounded-card"
        >
          {body}
        </a>
      )}
    </Reveal>
  );
}

export function Work({ site, projects }: { site: Site; projects: Project[] }) {
  return (
    <Section id="isler" className="border-t border-white/6">
      <Container>
        <SectionHeading
          eyebrow="Seçili işler"
          title={site.workTitle}
          body={site.workBody}
          emptyLabel="İşler başlığı"
        />

        <div className="mt-14">
          {projects.length === 0 ? (
            <EmptySlot
              label="Proje listesi"
              hint="Henüz proje eklenmedi. Yönetim panelinde İşler bölümünden ekleyin; öne çıkardığınız projeler ızgarada geniş yer kaplar."
              size="lg"
            />
          ) : (
            <ul className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  wide={project.featured}
                />
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
