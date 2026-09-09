import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

/**
 * Oturum çerezi yoksa her şey /giris'e yönlenir.
 *
 * Middleware Edge çalışma zamanında olduğu için burada yalnızca çerezin
 * varlığına bakılır; imza doğrulaması sayfa/aksiyon tarafında Node
 * çalışma zamanında yapılır (requireSession).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/giris")) return NextResponse.next();

  if (!request.cookies.get(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
