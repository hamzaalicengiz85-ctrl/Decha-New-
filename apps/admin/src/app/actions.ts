"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  contactSchema,
  projectSchema,
  serviceSchema,
  siteSchema,
  socialSchema,
} from "@decha/content";
import { readContent, uploadsDir, writeContent } from "@decha/content/server";

import {
  SESSION_COOKIE,
  checkPassword,
  createToken,
  isConfigured,
} from "@/lib/auth";
import { verifyToken } from "@/lib/auth";

export type ActionState = { ok: boolean; message: string };

const OK = (message: string): ActionState => ({ ok: true, message });
const FAIL = (message: string): ActionState => ({ ok: false, message });

async function requireSession(): Promise<void> {
  const store = await cookies();
  if (!verifyToken(store.get(SESSION_COOKIE)?.value)) {
    throw new Error("Oturum doğrulanamadı. Lütfen yeniden giriş yapın.");
  }
}

/** Kaydedilen içerik ana sitede anında görünsün. */
function refresh(): void {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------------ oturum */

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isConfigured()) {
    return FAIL("ADMIN_PASSWORD tanımlı değil. Kurulum tamamlanmadan giriş yapılamaz.");
  }

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return FAIL("Şifre hatalı.");
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return OK("Giriş başarılı.");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/* ------------------------------------------------------------------ içerik */

export async function saveSite(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireSession();

    const parsed = siteSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return FAIL(parsed.error.issues[0]?.message ?? "Alanlar doğrulanamadı.");
    }

    const current = await readContent();
    await writeContent({ ...current, site: parsed.data });
    refresh();
    return OK("Site metinleri kaydedildi.");
  } catch (error) {
    return FAIL(error instanceof Error ? error.message : "Kaydedilemedi.");
  }
}

export async function saveContact(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireSession();

    const parsed = contactSchema.safeParse({
      email: formData.get("email") ?? "",
      phone: formData.get("phone") ?? "",
      location: formData.get("location") ?? "",
      formEndpoint: formData.get("formEndpoint") ?? "",
    });
    if (!parsed.success) {
      return FAIL(parsed.error.issues[0]?.message ?? "Alanlar doğrulanamadı.");
    }

    const current = await readContent();
    await writeContent({ ...current, contact: parsed.data });
    refresh();
    return OK("İletişim bilgileri kaydedildi.");
  } catch (error) {
    return FAIL(error instanceof Error ? error.message : "Kaydedilemedi.");
  }
}

/**
 * Liste kaydetme: istemci diziyi JSON olarak gönderir, sunucu şemayla
 * doğrular. Tek bir yazma işlemi olduğu için kısmi kayıt riski yoktur.
 */
async function saveList<T>(
  formData: FormData,
  schema: { safeParse: (value: unknown) => { success: boolean; data?: T } },
  key: "services" | "projects" | "socials",
  label: string,
): Promise<ActionState> {
  try {
    await requireSession();

    const raw: unknown = JSON.parse(String(formData.get("payload") ?? "[]"));
    if (!Array.isArray(raw)) return FAIL("Beklenmeyen veri biçimi.");

    const items: T[] = [];
    for (const entry of raw) {
      const parsed = schema.safeParse(entry);
      if (!parsed.success || parsed.data === undefined) {
        return FAIL(`${label} listesinde geçersiz bir kayıt var.`);
      }
      items.push(parsed.data);
    }

    const current = await readContent();
    await writeContent({ ...current, [key]: items });
    refresh();
    return OK(`${label} kaydedildi (${items.length} kayıt).`);
  } catch (error) {
    return FAIL(error instanceof Error ? error.message : "Kaydedilemedi.");
  }
}

export async function saveServices(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return saveList(formData, serviceSchema, "services", "Hizmetler");
}

export async function saveProjects(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return saveList(formData, projectSchema, "projects", "Projeler");
}

export async function saveSocials(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return saveList(formData, socialSchema, "socials", "Sosyal medya");
}

/* ------------------------------------------------------------------ görsel */

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/svg+xml", "svg"],
]);

const MAX_BYTES = 8 * 1024 * 1024;

export type UploadState = { ok: boolean; message: string; path: string };

export async function uploadImage(formData: FormData): Promise<UploadState> {
  try {
    await requireSession();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Dosya seçilmedi.", path: "" };
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, message: "Dosya 8 MB sınırını aşıyor.", path: "" };
    }

    const extension = ALLOWED.get(file.type);
    if (!extension) {
      return {
        ok: false,
        message: "Yalnızca JPG, PNG, WEBP, AVIF ve SVG yüklenebilir.",
        path: "",
      };
    }

    // Dosya adı istemciden gelir; yol geçişi olmaması için tamamen yeniden üretilir
    const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
    const dir = uploadsDir();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, name),
      Buffer.from(await file.arrayBuffer()),
    );

    refresh();
    return { ok: true, message: "Görsel yüklendi.", path: `/uploads/${name}` };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Yüklenemedi.",
      path: "",
    };
  }
}
