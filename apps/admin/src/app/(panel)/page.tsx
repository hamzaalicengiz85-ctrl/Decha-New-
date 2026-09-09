import Link from "next/link";
import { Check, CircleDashed } from "lucide-react";

import { isBlank } from "@decha/content";
import { readContent } from "@decha/content/server";

import { Card, PageTitle } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const content = await readContent();

  const rows = [
    {
      href: "/icerik",
      label: "Site metinleri",
      done: !isBlank(content.site.heroHeadline),
      detail: isBlank(content.site.heroHeadline)
        ? "Hero başlığı henüz yazılmadı"
        : content.site.heroHeadline,
    },
    {
      href: "/hizmetler",
      label: "Hizmetler",
      done: content.services.length > 0,
      detail: `${content.services.length} kayıt`,
    },
    {
      href: "/isler",
      label: "İşler",
      done: content.projects.length > 0,
      detail: `${content.projects.length} proje`,
    },
    {
      href: "/iletisim",
      label: "İletişim",
      done: !isBlank(content.contact.email),
      detail: isBlank(content.contact.email)
        ? "E-posta girilmedi — form devre dışı"
        : content.contact.email,
    },
  ];

  const remaining = rows.filter((row) => !row.done).length;

  return (
    <>
      <PageTitle
        title="Genel bakış"
        description={
          remaining === 0
            ? "Bütün bölümler dolu. Site yayına hazır."
            : `${remaining} bölüm henüz boş. Boş bölümler sitede yer tutucu olarak görünür.`
        }
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.href}>
            <Link href={row.href} className="block">
              <Card className="h-full transition-colors hover:border-white/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-[0.95rem] font-medium">{row.label}</h2>
                    <p className="mt-1 truncate text-sm text-muted">{row.detail}</p>
                  </div>
                  <span
                    className={row.done ? "text-ok" : "text-muted"}
                    aria-label={row.done ? "Dolu" : "Boş"}
                  >
                    {row.done ? (
                      <Check size={18} aria-hidden="true" />
                    ) : (
                      <CircleDashed size={18} aria-hidden="true" />
                    )}
                  </span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      {content.updatedAt !== "" && (
        <p className="mt-6 font-mono text-[0.75rem] text-muted">
          Son kayıt: {new Date(content.updatedAt).toLocaleString("tr-TR")}
        </p>
      )}
    </>
  );
}
