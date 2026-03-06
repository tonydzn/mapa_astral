import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/admin/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

    if (!profile?.is_admin) redirect("/admin/login");

    return (
        <div style={{ minHeight: "100dvh", background: "#020617", display: "flex", flexDirection: "column" }}>
            {children}
        </div>
    );
}
