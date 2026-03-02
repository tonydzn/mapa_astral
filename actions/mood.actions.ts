"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { currentMoonPhase } from "@/lib/astro-engine";

export async function logMood(score: number, note?: string) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autenticado" };

    const moonPhase = currentMoonPhase();

    const { error } = await supabase.from("mood_logs").insert({
        user_id: user.id,
        mood_score: score,
        note: note ?? null,
        moon_phase: moonPhase.name,
    });

    if (error) return { error: error.message };

    revalidatePath("/mood");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function getMoodHistory(days = 30) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

    return data ?? [];
}
