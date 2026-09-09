import { promises as fs } from "node:fs";
import path from "node:path";

import { emptyContent, parseContent, type Content } from "./schema";

/**
 * İçerik deposu: depo kökündeki content/content.json.
 *
 * Ana site burayı okur, admin paneli buraya yazar. Yol, çalışma
 * dizinine göre değil açıkça çözülür; her iki uygulama da
 * apps/<ad> içinden çalıştığı için iki seviye yukarı bakılır.
 * DECHA_CONTENT_DIR ile geçersiz kılınabilir (ör. dağıtımda).
 */
export function contentDir(): string {
  const fromEnv = process.env.DECHA_CONTENT_DIR;
  if (fromEnv) return path.resolve(fromEnv);
  return path.resolve(process.cwd(), "..", "..", "content");
}

export function contentFile(): string {
  return path.join(contentDir(), "content.json");
}

export function uploadsDir(): string {
  return path.join(contentDir(), "uploads");
}

/** Dosya yoksa ya da bozuksa boş içerik döner; asla hata fırlatmaz. */
export async function readContent(): Promise<Content> {
  try {
    const raw = await fs.readFile(contentFile(), "utf8");
    return parseContent(JSON.parse(raw));
  } catch {
    return emptyContent();
  }
}

/**
 * Atomik yazma: önce geçici dosyaya yazıp sonra taşıyoruz; yazma
 * yarıda kesilirse content.json bozulmuş hâlde kalmaz.
 */
export async function writeContent(content: Content): Promise<Content> {
  const next: Content = { ...content, updatedAt: new Date().toISOString() };
  const dir = contentDir();
  await fs.mkdir(dir, { recursive: true });

  const target = contentFile();
  const temp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  await fs.rename(temp, target);

  return next;
}

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

/**
 * content/uploads altındaki bir dosyayı servis eder.
 *
 * Yol, uploads klasörünün dışına çıkamaz: istenen yol mutlak hâle
 * getirilip kök dizinin altında kaldığı doğrulanır (path traversal).
 */
export async function serveUpload(segments: string[]): Promise<Response> {
  const base = path.resolve(uploadsDir());
  const target = path.resolve(base, segments.join("/"));

  if (target !== base && !target.startsWith(base + path.sep)) {
    return new Response("Bulunamadı", { status: 404 });
  }

  const type = MIME[path.extname(target).toLowerCase()];
  if (!type) return new Response("Bulunamadı", { status: 404 });

  try {
    const file = await fs.readFile(target);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch {
    return new Response("Bulunamadı", { status: 404 });
  }
}
