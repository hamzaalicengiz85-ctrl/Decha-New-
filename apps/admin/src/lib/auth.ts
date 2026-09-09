import { createHmac, timingSafeEqual } from "node:crypto";

export { SESSION_COOKIE } from "./session";

/**
 * Panel, ADMIN_PASSWORD tanımlanmadan açılmaz.
 * Böylece "varsayılan şifre" ile açıkta kalan bir kurulum oluşmaz.
 */
export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function secret(): string {
  // Ayrı bir oturum anahtarı verilmemişse şifreden türetilir:
  // şifre değişince eski oturumlar kendiliğinden geçersiz olur.
  return (
    process.env.ADMIN_SESSION_SECRET ?? `decha:${process.env.ADMIN_PASSWORD ?? ""}`
  );
}

export function createToken(): string {
  return createHmac("sha256", secret()).update("decha-admin-v1").digest("hex");
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !isConfigured()) return false;
  const expected = Buffer.from(createToken(), "utf8");
  const received = Buffer.from(token, "utf8");
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

/** Şifre karşılaştırması sabit sürede yapılır. */
export function checkPassword(input: string): boolean {
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? "", "utf8");
  const received = Buffer.from(input, "utf8");
  if (expected.length === 0 || expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}
