"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateChart, type BirthData } from "@/lib/astro-engine";
import { revalidatePath } from "next/cache";
import type { Json } from "@/types/database.types";

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

    // Calcula 30 dias atrás
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    if (profile.is_premium) {
        // Premium: 1 mapa a cada 30 dias
        const { count } = await supabase
            .from("birth_charts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", thirtyDaysAgo);

        if (count && count >= 1) {
            return {
                error: "LIMIT_REACHED",
                message: "Como usuário Premium, você pode gerar 1 mapa completo a cada 30 dias.",
            };
        }
    } else {
        // Gratuito: 1 mapa total
        if (profile.maps_count >= 1) {
            return {
                error: "LIMIT_REACHED",
                message: "Você atingiu o limite de 1 mapa gratuito. Torne-se Premium para gerar novos mapas completos mensalmente!",
            };
        }
    }

    const birthData: BirthData = {
        date: formData.birth_date,
        time: formData.birth_time || "12:00",
        lat: formData.latitude,
        lng: formData.longitude,
        place: formData.birth_place,
    };

    // Calula o mapa natal e insere no banco
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
            chart_data: chartData as any,
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
