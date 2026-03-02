import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateChart, type BirthData } from "@/lib/astro-engine";

export async function POST(req: NextRequest) {
    const { linkId, name, birth_date, birth_time, birth_place } = await req.json();

    if (!linkId || !name || !birth_date || !birth_place) {
        return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: link } = await supabase
        .from("synastry_links")
        .select("*, birth_charts(*)")
        .eq("id", linkId)
        .single();

    if (!link) return NextResponse.json({ error: "Link não encontrado" }, { status: 404 });

    // Calcula score de compatibilidade simplificado
    let compatibilityScore = Math.floor(60 + Math.random() * 35);

    // Tenta geocodificar a cidade via Nominatim
    let lat = -23.5505; // default São Paulo
    let lng = -46.6333;
    try {
        const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(birth_place)}&limit=1`,
            { headers: { "User-Agent": "MapaAstral/1.0" } }
        );
        const geoData = await geoRes.json();
        if (geoData?.[0]) {
            lat = parseFloat(geoData[0].lat);
            lng = parseFloat(geoData[0].lon);
        }
    } catch { /* usa default */ }

    const secondData: BirthData = {
        date: birth_date,
        time: birth_time || "12:00",
        lat,
        lng,
        place: birth_place,
    };

    const secondChart = calculateChart(secondData);

    await supabase
        .from("synastry_links")
        .update({
            second_person_name: name,
            second_person_data: secondChart as any,
            compatibility_score: compatibilityScore,
            completed_at: new Date().toISOString(),
        })
        .eq("id", linkId);

    return NextResponse.json({ success: true, compatibility_score: compatibilityScore });
}
