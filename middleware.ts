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

    // ─── Admin route protection ────────────────────────────────
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!user) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Check admin flag in profiles
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // ─── App route protection ──────────────────────────────────
    const appRoutes = ["/dashboard", "/chart"];
    const isAppRoute = appRoutes.some(r => pathname.startsWith(r));
    if (isAppRoute && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};
