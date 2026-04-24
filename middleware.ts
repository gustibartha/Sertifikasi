import { NextResponse, type NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
    // 1. Dapatkan cookie session dari better-auth
    // Nama default cookie better-auth adalah 'better-auth.session_token'
    const sessionToken = request.cookies.get("better-auth.session_token");

    // 2. Tentukan path yang sedang diakses
    const { pathname } = request.nextUrl;

    // 3. Logika Proteksi Ringan (Edge Compatible)
    // Jika user BELUM punya cookie dan mencoba mengakses dashboard
    if (!sessionToken && pathname !== "/login" && !pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Jika user SUDAH punya cookie dan mencoba mengakses halaman login
    if (sessionToken && pathname === "/login") {
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
