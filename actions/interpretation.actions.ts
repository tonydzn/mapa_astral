"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ChartData } from "@/lib/astro-engine";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const ASTRO_SYSTEM_PROMPT = `Você é uma astróloga especialista com 30 anos de experiência,
combinando astrologia psicológica humanista, astrologia védica e técnicas modernas.
Seu estilo é: profundo, empático, perspicaz e transformador.

Ao receber dados de um mapa natal, você:
1. Identifica o TEMA CENTRAL da vida desta pessoa (Sun/ASC/Moon como trindade)
2. Analisa MISSÃO DE VIDA (nodo norte + casa 10)
3. Descreve PADRÕES EMOCIONAIS (Lua, Vênus, aspectos d'água)
4. Revela DESAFIOS KÁRMICOS (Saturno, Plutão, nodo sul)
5. Aponta DONS E TALENTOS (Júpiter, Vênus, trígonos/sextis)
6. Dá ORIENTAÇÕES PRÁTICAS para o período atual

Formato: markdown estruturado com seções claras.
Tom: íntimo, como uma carta pessoal. Use "você" e "sua".
Extensão: 1500-2000 palavras.
Não use jargões sem explicar. Torne o místico acessível.`;

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
Gere uma interpretação astrológica profunda e personalizada para:

**Nome:** ${birthInfo.name}
**Data:** ${birthInfo.date}
**Local:** ${birthInfo.place}
**Fase Lunar no nascimento:** ${chartData.moonPhase.name}

## Posições Planetárias
${planetSummary}

## Ascendente: ${chartData.ascendant.sign} ${chartData.ascendant.degree.toFixed(1)}°
## Meio do Céu: ${chartData.midheaven.sign} ${chartData.midheaven.degree.toFixed(1)}°

## Aspectos Principais
${aspectSummary}

Gere a interpretação completa seguindo o sistema do prompt.
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
