import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    // 1. Dapatkan session menggunakan better-auth
    const session = await auth.api.getSession({
        headers: request.headers
    });

    // 2. Tentukan path yang sedang diakses
    const { pathname } = request.nextUrl;

    // 3. Logika Proteksi
    // Jika user BELUM login dan mencoba mengakses dashboard (selain halaman login)
    if (!session && pathname !== "/login" && !pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Jika user SUDAH login dan mencoba mengakses halaman login
    if (session && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

// Tentukan path mana saja yang akan diproses oleh middleware ini
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
