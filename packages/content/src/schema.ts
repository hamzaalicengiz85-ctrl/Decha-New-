import { z } from "zod";

/**
 * DECHA içerik şeması.
 *
 * Site üzerindeki BÜTÜN işletme verisi buradan gelir; kodda gömülü
 * uydurma içerik yoktur. Gerçek veriler admin panelinden girilir.
 * Bu yüzden her alanın boş hâli geçerlidir ve arayüz boş duruma göre
 * tasarlanmıştır.
 */

const trimmed = z.string().trim();
const optionalUrl = trimmed
  .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
    message: "https:// ile başlayan geçerli bir adres girin",
  })
  .default("");

export const serviceSchema = z.object({
  id: trimmed.min(1),
  title: trimmed.default(""),
  summary: trimmed.default(""),
  /** lucide-react ikon adı, ör. "Smartphone" */
  icon: trimmed.default(""),
});

export const projectSchema = z.object({
  id: trimmed.min(1),
  title: trimmed.default(""),
  category: trimmed.default(""),
  summary: trimmed.default(""),
  year: trimmed.default(""),
  /** /uploads/... ya da tam URL */
  image: trimmed.default(""),
  imageAlt: trimmed.default(""),
  url: optionalUrl,
  featured: z.boolean().default(false),
});

export const socialSchema = z.object({
  id: trimmed.min(1),
  platform: trimmed.default(""),
  url: optionalUrl,
});

export const siteSchema = z.object({
  brandName: trimmed.default("DECHA"),
  /** Tarayıcı sekmesi ve arama sonuçları */
  seoTitle: trimmed.default(""),
  seoDescription: trimmed.default(""),
  heroEyebrow: trimmed.default(""),
  heroHeadline: trimmed.default(""),
  /** Başlıkta serif italik olarak vurgulanacak kelime öbeği */
  heroHighlight: trimmed.default(""),
  heroBody: trimmed.default(""),
  primaryCtaLabel: trimmed.default(""),
  secondaryCtaLabel: trimmed.default(""),
  servicesTitle: trimmed.default(""),
  servicesBody: trimmed.default(""),
  workTitle: trimmed.default(""),
  workBody: trimmed.default(""),
  contactTitle: trimmed.default(""),
  contactBody: trimmed.default(""),
  footerNote: trimmed.default(""),
});

export const contactSchema = z.object({
  email: trimmed
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Geçerli bir e-posta adresi girin",
    })
    .default(""),
  phone: trimmed.default(""),
  location: trimmed.default(""),
  /** Boşsa form ziyaretçinin e-posta uygulamasını açar */
  formEndpoint: optionalUrl,
});

export const contentSchema = z.object({
  site: siteSchema.default(() => siteSchema.parse({})),
  services: z.array(serviceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  contact: contactSchema.default(() => contactSchema.parse({})),
  socials: z.array(socialSchema).default([]),
  updatedAt: trimmed.default(""),
});

export type Service = z.infer<typeof serviceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Social = z.infer<typeof socialSchema>;
export type Site = z.infer<typeof siteSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Content = z.infer<typeof contentSchema>;

/** Tamamen boş ama şemaya uygun içerik. */
export function emptyContent(): Content {
  return contentSchema.parse({});
}

/**
 * Ham veriyi şemaya oturtur. Eksik alanlar varsayılanla tamamlanır,
 * böylece elle düzenlenmiş ya da eski sürümden kalan bir dosya
 * uygulamayı çökertmez.
 */
export function parseContent(raw: unknown): Content {
  const result = contentSchema.safeParse(raw ?? {});
  return result.success ? result.data : emptyContent();
}
