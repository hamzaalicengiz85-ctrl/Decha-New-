export {
  contentSchema,
  siteSchema,
  serviceSchema,
  projectSchema,
  socialSchema,
  contactSchema,
  emptyContent,
  parseContent,
} from "./schema";

export type {
  Content,
  Site,
  Service,
  Project,
  Social,
  Contact,
} from "./schema";

/** Boş bir dizeyi "veri yok" olarak sayar. */
export function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/** İçerikte gösterilecek hiçbir şey yoksa true. */
export function isEmptyContent(content: {
  site: { heroHeadline: string };
  services: unknown[];
  projects: unknown[];
}): boolean {
  return (
    isBlank(content.site.heroHeadline) &&
    content.services.length === 0 &&
    content.projects.length === 0
  );
}
