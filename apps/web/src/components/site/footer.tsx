import { isBlank, type Site } from "@decha/content";

import { Container } from "./section";

export function Footer({ site }: { site: Site }) {
  const brand = isBlank(site.brandName) ? "DECHA" : site.brandName;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 py-12">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[0.06em]">
            {brand}
          </span>

          {!isBlank(site.footerNote) && (
            <p className="max-w-sm text-sm text-muted text-pretty">{site.footerNote}</p>
          )}

          <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-muted">
            © {year} {brand}
          </p>
        </div>
      </Container>
    </footer>
  );
}
