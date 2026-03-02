"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ChartData } from "@/lib/astro-engine";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const ASTRO_SYSTEM_PROMPT = `Você é uma astróloga especialista com 30 anos de experiência.
Seu estilo é: profundo, empático e transformador.

Se o usuário for PREMIUM, você gera uma interpretação COMPLETA (1500-2000 palavras) com:
1. Tema Central (Sun/ASC/Moon)
2. Missão de Vida (Nodo Norte + Casa 10)
3. Padrões Emocionais (Lua, Vênus)
4. Desafios Kármicos (Saturno, Plutão)
5. Dons e Talentos (Júpiter)
6. Orientações Práticas

Se o usuário for GRATUITO, você gera uma interpretação PARCIAL e RESUMIDA (apenas 300-400 palavras), focando APENAS no Sol, Lua e Ascendente.
Extensão: Conforme o plano (400 vs 2000 palavras).
Formato: markdown estruturado.
Tom: íntimo, como uma carta pessoal.`;

export async function generateChartInterpretation(
    chartId: string,
    chartData: ChartData,
    birthInfo: { name: string; date: string; place: string }
): Promise<{ interpretation: string; error?: string }> {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { interpretation: "", error: "Não autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

    const model = profile?.is_premium
        ? process.env.PREMIUM_MODEL
        : process.env.FREE_MODEL;

    const planetSummary = chartData.planets
        .map((p) => `${p.planet} em ${p.sign} ${p.degree.toFixed(1)}° (casa ${p.house})${p.retrograde ? " ℞" : ""}`)
        .join("\n");

    const aspectSummary = chartData.aspects
        .slice(0, 10)
        .map((a) => `${a.planet1} ${a.type} ${a.planet2} (orbe ${a.orb}°)`)
        .join("\n");

    const userPrompt = `
O usuário é ${profile?.is_premium ? "PREMIUM (Mapa Completo)" : "GRATUITO (Mapa Parcial)"}.

Gere uma interpretação astrológica para:
**Nome:** ${birthInfo.name}
**Data:** ${birthInfo.date}
**Local:** ${birthInfo.place}

${profile?.is_premium ? "Por ser Premium, forneça todos os 6 pontos do sistema detalhadamente." : "Por ser Gratuito, forneça apenas o resumo do Sol, Lua e Ascendente e sugira o Premium para o resto."}

## Dados Técnicos
${planetSummary}
## Ascendente: ${chartData.ascendant.sign}
## Aspectos: ${aspectSummary}
`.trim();

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL!,
                "X-Title": "Mapa Astral",
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: ASTRO_SYSTEM_PROMPT },
                    { role: "user", content: userPrompt },
                ],
                max_tokens: 3000,
                temperature: 0.85,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenRouter error: ${err}`);
        }

        const json = await response.json();
        const interpretation = json.choices?.[0]?.message?.content ?? "";

        await supabase
            .from("birth_charts")
            .update({ full_interpretation: interpretation })
            .eq("id", chartId);

        return { interpretation };
    } catch (error) {
        console.error("Interpretation generation error:", error);
        return { interpretation: "", error: "Erro ao gerar interpretação. Tente novamente." };
    }
}
