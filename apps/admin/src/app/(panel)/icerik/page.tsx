import { readContent } from "@decha/content/server";

import { PageTitle } from "@/components/ui";
import { SiteForm } from "./site-form";

export const dynamic = "force-dynamic";

export default async function SiteContentPage() {
  const { site } = await readContent();

  return (
    <>
      <PageTitle
        title="Site metinleri"
        description="Boş bırakılan alanlar sitede yer tutucu olarak görünür; düğmeler ve açıklamalar ise tamamen gizlenir."
      />
      <SiteForm site={site} />
    </>
  );
}
