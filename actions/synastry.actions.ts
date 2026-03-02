"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function generateSlug(): string {
    return Math.random().toString(36).substring(2, 10);
}

export async function createSynastryLink(chartId: string) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

    if (!profile?.is_premium) {
        return { error: "PREMIUM_REQUIRED", message: "Sinastria é um recurso Premium" };
    }

    const slug = generateSlug();

    const { data: link, error } = await supabase
        .from("synastry_links")
        .insert({
            owner_id: user.id,
            owner_chart_id: chartId,
            slug,
        })
        .select()
        .single();

    if (error) return { error: error.message };

    revalidatePath("/synastry");
    return { link };
}

export async function getSynastryLinks() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("synastry_links")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

    return data ?? [];
}
