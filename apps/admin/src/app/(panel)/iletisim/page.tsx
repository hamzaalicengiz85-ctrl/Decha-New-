import { readContent } from "@decha/content/server";

import { saveSocials } from "@/app/actions";
import { ListEditor, type Item } from "@/components/list-editor";
import { PageTitle } from "@/components/ui";
import { ContactDetailsForm } from "./contact-form";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { contact, socials } = await readContent();

  return (
    <>
      <PageTitle
        title="İletişim"
        description="İletişim bilgileri sitede listelenir; e-posta ya da form uç noktası girilene kadar iletişim formu devre dışı kalır."
      />

      <ContactDetailsForm contact={contact} />

      <h2 className="mt-10 mb-4 text-[0.95rem] font-medium">Sosyal medya</h2>
      <ListEditor
        items={socials as unknown as Item[]}
        titleField="platform"
        addLabel="Hesap ekle"
        emptyText="Henüz hesap yok. Eklenmeyen hesaplar sitede hiç görünmez."
        blank={{ platform: "", url: "" }}
        action={saveSocials}
        fields={[
          { name: "platform", label: "Platform", type: "text", placeholder: "Instagram" },
          { name: "url", label: "Adres", type: "url", placeholder: "https://…" },
        ]}
      />
    </>
  );
}
