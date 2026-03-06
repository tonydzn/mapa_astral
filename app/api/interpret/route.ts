import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60; // Allow up to 60 seconds on Vercel for OpenRouter generation

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

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { chartId } = await req.json();

    // Busca o mapa do banco (garante ownership)
    const admin = createAdminClient();
    const { data: chart, error: chartErr } = await admin
        .from("birth_charts")
        .select("*")
        .eq("id", chartId)
        .eq("user_id", user.id)
        .single();

    if (chartErr || !chart) {
        return NextResponse.json({ error: "Mapa não encontrado" }, { status: 404 });
    }

    // Verifica se é premium
    const { data: profile } = await admin
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

    const rawModel = process.env.PREMIUM_MODEL || "google/gemini-2.0-flash-001";
    const model = rawModel.trim();

    // Extrai dados do chart_data com segurança
    const chartData = (chart as any).chart_data as {
        planets?: { planet: string; sign: string; degree: number; house: number; retrograde?: boolean }[];
        ascendant?: { sign: string; degree: number };
        midheaven?: { sign: string; degree: number };
        aspects?: { planet1: string; type: string; planet2: string; orb: number }[];
        moonPhase?: { name: string; emoji: string };
    } | null;

    const planetSummary = (chartData?.planets || [])
        .map(p => `${p.planet} em ${p.sign} ${p.degree.toFixed(1)}° (casa ${p.house})${p.retrograde ? " ℞" : ""}`)
        .join("\n");

    const aspectSummary = (chartData?.aspects || [])
        .slice(0, 12)
        .map(a => `${a.planet1} ${a.type} ${a.planet2} (orbe ${a.orb}°)`)
        .join("\n");

    const ascendantStr = chartData?.ascendant ? `${chartData.ascendant.sign} ${chartData.ascendant.degree.toFixed(1)}°` : "Desconhecido";
    const midheavenStr = chartData?.midheaven ? `${chartData.midheaven.sign} ${chartData.midheaven.degree.toFixed(1)}°` : "Desconhecido";

    const userPrompt = `
Gere uma interpretação astrológica profunda e personalizada para:

**Nome:** ${(chart as any).name || "Pessoa"}
**Data:** ${(chart as any).birth_date}
**Local:** ${(chart as any).birth_place || "Brasil"}
**Hora:** ${(chart as any).birth_time || "Não informada"}
**Fase Lunar no nascimento:** ${chartData?.moonPhase?.name || ""}

## Posições Planetárias
${planetSummary}

## Ascendente: ${ascendantStr}
## Meio do Céu: ${midheavenStr}

## Aspectos Principais
${aspectSummary}

Gere a interpretação completa seguindo o sistema do prompt.
`.trim();

    try {
        if (!process.env.OPENROUTER_API_KEY) {
            console.error("Missing OPENROUTER_API_KEY environment variable");
            return NextResponse.json({ error: "Configuração do servidor incompleta (OpenRouter API Key ausente)." }, { status: 500 });
        }

        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
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
            const errText = await response.text();
            console.error("OpenRouter error:", errText);
            // Try to extract the exact error message from OpenRouter JSON
            let apiErrorMsg = "";
            try {
                const parsedErr = JSON.parse(errText);
                apiErrorMsg = parsedErr?.error?.message || errText;
            } catch {
                apiErrorMsg = errText;
            }
            return NextResponse.json({ error: `Erro OpenRouter (${response.status}): ${apiErrorMsg}` }, { status: 500 });
        }

        const json = await response.json();
        const interpretation = json.choices?.[0]?.message?.content ?? "";

        if (!interpretation) {
            return NextResponse.json({ error: "Sistema retornou resposta vazia" }, { status: 500 });
        }

        // Salva no banco
        await admin
            .from("birth_charts")
            .update({ full_interpretation: interpretation })
            .eq("id", chartId);

        return NextResponse.json({ interpretation });
    } catch (err: any) {
        console.error("Interpret API error:", err);
        return NextResponse.json({ error: `Erro interno (${err.message}). Tente novamente.` }, { status: 500 });
    }
}
