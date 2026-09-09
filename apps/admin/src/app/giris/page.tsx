import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { SESSION_COOKIE, isConfigured, verifyToken } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const store = await cookies();
  if (verifyToken(store.get(SESSION_COOKIE)?.value)) redirect("/");

  const configured = isConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent-soft">
            DECHA
          </p>
          <h1 className="mt-3 text-xl font-semibold">Yönetim Paneli</h1>
        </div>

        {configured ? (
          <LoginForm />
        ) : (
          <div className="rounded-card border border-danger/30 bg-danger/8 p-6">
            <h2 className="text-sm font-semibold text-danger-soft">
              Kurulum tamamlanmadı
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bone-dim">
              Panel, bir şifre tanımlanmadan açılmaz. Proje kökünde{" "}
              <code className="font-mono text-accent-soft">apps/admin/.env.local</code>{" "}
              dosyası oluşturup içine{" "}
              <code className="font-mono text-accent-soft">ADMIN_PASSWORD=…</code>{" "}
              satırını ekleyin ve sunucuyu yeniden başlatın.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
