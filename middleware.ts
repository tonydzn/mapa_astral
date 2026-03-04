import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({ request });
    const pathname = request.nextUrl.pathname;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll(); },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // ─── Admin route protection (auth check only — is_admin checked in layout) ─
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!user) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // ─── App route protection ──────────────────────────────────────────────────
    const protectedPrefixes = ["/dashboard", "/chart"];
    const isProtected = protectedPrefixes.some(p => pathname.startsWith(p));
    if (isProtected && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};
