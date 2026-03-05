import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
    const checks: Record<string, string> = {};

    // 1. Check env vars presence (never expose actual values)
    checks["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `OK (${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 30)}...)`
        : "MISSING";
    checks["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `OK (length: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length})`
        : "MISSING";
    checks["SUPABASE_SERVICE_ROLE_KEY"] = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? `OK (length: ${process.env.SUPABASE_SERVICE_ROLE_KEY.length})`
        : "MISSING";

    // 2. Test admin client connection
    try {
        const admin = createAdminClient();
        const { count, error } = await admin
            .from("profiles")
            .select("*", { count: "exact", head: true });

        if (error) {
            checks["db_connection"] = `ERROR: ${error.message}`;
        } else {
            checks["db_connection"] = `OK - profiles count: ${count}`;
        }
    } catch (e: any) {
        checks["db_connection"] = `EXCEPTION: ${e.message}`;
    }

    return NextResponse.json(checks);
}
