"use client";

import { useActionState } from "react";

import type { Site } from "@decha/content";

import { saveSite, type ActionState } from "@/app/actions";
import { Button, Card, Field, StatusLine, inputClass } from "@/components/ui";

const initial: ActionState = { ok: false, message: "" };

type Group = {
  title: string;
  note?: string;
  fields: {
    name: keyof Site;
    label: string;
    type?: "text" | "textarea";
    help?: string;
    placeholder?: string;
  }[];
};

const groups: Group[] = [
  {
    title: "Marka",
    fields: [
      { name: "brandName", label: "Marka adı", help: "Başlıkta ve alt bilgide görünür." },
      { name: "seoTitle", label: "Tarayıcı sekmesi başlığı", help: "Boşsa marka adı kullanılır." },
      { name: "seoDescription", label: "Arama sonucu açıklaması", type: "textarea" },
    ],
  },
  {
    title: "Hero",
    note: "Sitenin ilk ekranı.",
    fields: [
      { name: "heroEyebrow", label: "Üst etiket", placeholder: "Dijital Ajans" },
      { name: "heroHeadline", label: "Ana başlık", type: "textarea" },
      {
        name: "heroHighlight",
        label: "Vurgulanacak kelime öbeği",
        help: "Ana başlıkta geçen bir öbek yazın; serif italik ve vurgu renginde görünür.",
      },
      { name: "heroBody", label: "Alt metin", type: "textarea" },
      { name: "primaryCtaLabel", label: "Birincil düğme metni", help: "Boşsa düğme gösterilmez." },
      { name: "secondaryCtaLabel", label: "İkincil düğme metni", help: "Boşsa düğme gösterilmez." },
    ],
  },
  {
    title: "Bölüm başlıkları",
    fields: [
      { name: "servicesTitle", label: "Hizmetler başlığı" },
      { name: "servicesBody", label: "Hizmetler açıklaması", type: "textarea" },
      { name: "workTitle", label: "İşler başlığı" },
      { name: "workBody", label: "İşler açıklaması", type: "textarea" },
      { name: "contactTitle", label: "İletişim başlığı" },
      { name: "contactBody", label: "İletişim açıklaması", type: "textarea" },
    ],
  },
  {
    title: "Alt bilgi",
    fields: [{ name: "footerNote", label: "Alt bilgi notu", type: "textarea" }],
  },
];

export function SiteForm({ site }: { site: Site }) {
  const [state, formAction, pending] = useActionState(saveSite, initial);

  return (
    <form action={formAction} className="space-y-4">
      {groups.map((group) => (
        <Card key={group.title}>
          <h2 className="text-[0.95rem] font-medium">{group.title}</h2>
          {group.note && <p className="mt-1 text-sm text-muted">{group.note}</p>}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={String(field.name)}
                className={field.type === "textarea" ? "sm:col-span-2" : undefined}
              >
                <Field label={field.label} help={field.help} htmlFor={String(field.name)}>
                  {field.type === "textarea" ? (
                    <textarea
                      id={String(field.name)}
                      name={String(field.name)}
                      rows={3}
                      defaultValue={site[field.name]}
                      placeholder={field.placeholder}
                      className={`${inputClass} resize-y`}
                    />
                  ) : (
                    <input
                      id={String(field.name)}
                      name={String(field.name)}
                      type="text"
                      defaultValue={site[field.name]}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </Button>
        <StatusLine state={state} />
      </div>
    </form>
  );
}
