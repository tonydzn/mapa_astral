"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateChart, type BirthData } from "@/lib/astro-engine";
import { revalidatePath } from "next/cache";

export async function createBirthChart(formData: {
    name: string;
    birth_date: string;
    birth_time: string;
    birth_place: string;
    latitude: number;
    longitude: number;
}) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("maps_count, maps_limit, is_premium")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Perfil não encontrado" };

    if (!profile.is_premium && profile.maps_count >= profile.maps_limit) {
        return {
            error: "LIMIT_REACHED",
            message: `Você atingiu o limite de ${profile.maps_limit} mapas. Torne-se Premium para mapas ilimitados!`,
        };
    }

    const birthData: BirthData = {
        date: formData.birth_date,
        time: formData.birth_time || "12:00",
        lat: formData.latitude,
        lng: formData.longitude,
        place: formData.birth_place,
    };

    const chartData = calculateChart(birthData);

    const { data: chart, error } = await supabase
        .from("birth_charts")
        .insert({
            user_id: user.id,
            name: formData.name,
            birth_date: formData.birth_date,
            birth_time: formData.birth_time || null,
            birth_place: formData.birth_place,
            latitude: formData.latitude,
            longitude: formData.longitude,
            chart_data: chartData as unknown as Record<string, unknown>,
        })
        .select()
        .single();

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    return { chart };
}

export async function getUserCharts() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("birth_charts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return data ?? [];
}

export async function deleteChart(chartId: string) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autenticado" };

    const { error } = await supabase
        .from("birth_charts")
        .delete()
        .eq("id", chartId)
        .eq("user_id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    return { success: true };
}
