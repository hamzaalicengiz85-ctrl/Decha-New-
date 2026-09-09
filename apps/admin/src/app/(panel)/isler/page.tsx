import { readContent } from "@decha/content/server";

import { saveProjects } from "@/app/actions";
import { ListEditor, type Item } from "@/components/list-editor";
import { PageTitle } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { projects } = await readContent();

  return (
    <>
      <PageTitle
        title="İşler"
        description="Portfolyo ızgarasında görünür. Öne çıkarılan projeler ızgarada iki sütun genişliğinde yer alır."
      />

      <ListEditor
        items={projects as unknown as Item[]}
        titleField="title"
        addLabel="Proje ekle"
        emptyText="Henüz proje yok. İlk projeyi eklemek için aşağıdaki düğmeyi kullanın."
        blank={{
          title: "",
          category: "",
          summary: "",
          year: "",
          image: "",
          imageAlt: "",
          url: "",
          featured: false,
        }}
        action={saveProjects}
        fields={[
          { name: "title", label: "Proje adı", type: "text" },
          { name: "category", label: "Kategori", type: "text", placeholder: "Marka Kimliği" },
          { name: "year", label: "Yıl", type: "text", placeholder: "2026" },
          {
            name: "url",
            label: "Bağlantı",
            type: "url",
            placeholder: "https://…",
            help: "Boş bırakılırsa kart tıklanabilir olmaz.",
          },
          { name: "summary", label: "Açıklama", type: "textarea" },
          {
            name: "image",
            label: "Görsel",
            type: "image",
            help: "JPG, PNG, WEBP, AVIF veya SVG — en fazla 8 MB.",
          },
          {
            name: "imageAlt",
            label: "Görsel alternatif metni",
            type: "text",
            help: "Görseli göremeyenler için kısa açıklama. Görsel yalnızca dekoratifse boş bırakın.",
          },
          { name: "featured", label: "Öne çıkar (geniş kart)", type: "checkbox" },
        ]}
      />
    </>
  );
}
