import { readContent } from "@decha/content/server";

import { saveServices } from "@/app/actions";
import { ListEditor, type Item } from "@/components/list-editor";
import { PageTitle } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { services } = await readContent();

  return (
    <>
      <PageTitle
        title="Hizmetler"
        description="Sitenin hizmetler bölümünde ve iletişim formunun hizmet listesinde görünür."
      />

      <ListEditor
        items={services as unknown as Item[]}
        titleField="title"
        addLabel="Hizmet ekle"
        emptyText="Henüz hizmet yok. İlk hizmeti eklemek için aşağıdaki düğmeyi kullanın."
        blank={{ title: "", summary: "", icon: "" }}
        action={saveServices}
        fields={[
          { name: "title", label: "Başlık", type: "text" },
          {
            name: "icon",
            label: "İkon",
            type: "text",
            placeholder: "Smartphone",
            help: "lucide.dev üzerindeki ikon adı (ör. Smartphone, TrendingUp). Boş bırakılırsa nötr bir işaret kullanılır.",
          },
          { name: "summary", label: "Açıklama", type: "textarea" },
        ]}
      />
    </>
  );
}
