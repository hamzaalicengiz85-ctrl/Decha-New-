import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { logout } from "@/app/actions";

const nav = [
  { href: "/", label: "Genel bakış" },
  { href: "/icerik", label: "Site metinleri" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/isler", label: "İşler" },
  { href: "/iletisim", label: "İletişim" },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware yalnızca çerezin varlığına bakar; imza burada doğrulanır.
  const store = await cookies();
  if (!verifyToken(store.get(SESSION_COOKIE)?.value)) redirect("/giris");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-8 md:flex-row md:gap-12 md:py-12">
      <aside className="md:w-52 md:shrink-0">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent-soft">
          DECHA
        </p>
        <p className="mt-1 text-sm text-muted">Yönetim Paneli</p>

        <nav aria-label="Panel menüsü" className="mt-6">
          <ul className="flex flex-wrap gap-1 md:flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center rounded-lg px-3 text-[0.925rem] text-bone-dim transition-colors hover:bg-white/5 hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <form
          action={async () => {
            "use server";
            await logout();
            redirect("/giris");
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-[0.925rem] text-muted transition-colors hover:bg-white/5 hover:text-bone"
          >
            <LogOut size={16} aria-hidden="true" />
            Çıkış yap
          </button>
        </form>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
