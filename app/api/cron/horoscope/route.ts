import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

export const maxDuration = 60; // Max execution time for Vercel Hobby/Pro

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const ASTRO_SYSTEM_PROMPT = `Você é uma astróloga mestre. 
Seu objetivo é entregar um Horóscopo Diário curto, direto e transformador para o consulente, baseado no mapa astral dele e nos trânsitos astrológicos atuais.
Tom: Íntimo, direto e acolhedor.
Escreva um pequeno texto (máximo de 3 parágrafos) com a previsão do dia, focando na energia geral, possíveis desafios amorosos/profissionais e um conselho espiritual prático.
Lembre-se de saudar a pessoa pelo nome e incluir emojis.`;

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${secret}` && req.nextUrl.searchParams.get('secret') !== secret) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const admin = createAdminClient();

        // 1. Fetch Premium Users
        const { data: profiles, error: profileErr } = await admin
            .from("profiles")
            .select("id, email, full_name, is_premium")
            .eq("is_premium", true);

        if (profileErr || !profiles) {
            throw new Error("Failed to fetch premium profiles.");
        }

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let sentCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        // 2. Process each user
        for (const profile of profiles) {
            try {
                // Check if already sent today
                const { data: existing } = await admin
                    .from("daily_horoscopes")
                    .select("id")
                    .eq("user_id", profile.id)
                    .eq("date", today)
                    .maybeSingle();

                if (existing) {
                    skipCount++;
                    continue;
                }

                // Fetch birth chart
                const { data: chart } = await admin
                    .from("birth_charts")
                    .select("*")
                    .eq("user_id", profile.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (!chart) {
                    throw new Error(`No chart found for user ${profile.id}`);
                }

                const chartData = (chart as any).chart_data as any;
                const ascendantStr = chartData?.ascendant ? `${chartData.ascendant.sign} ${chartData.ascendant.degree.toFixed(1)}°` : "Desconhecido";
                const sun = chartData?.planets?.find((p: any) => p.planet === "Sol");
                const moon = chartData?.planets?.find((p: any) => p.planet === "Lua");

                const userPrompt = `
Gere o horóscopo de hoje para:
**Nome:** ${profile.full_name || "Pessoa"}
**Sol:** ${sun?.sign || "Desconhecido"}
**Lua:** ${moon?.sign || "Desconhecido"}
**Ascendente:** ${ascendantStr}
Data atual para previsão: ${today}
`.trim();

                const rawModel = process.env.PREMIUM_MODEL || "google/gemini-2.0-flash-001";
                const model = rawModel.trim();

                const response = await fetch(OPENROUTER_URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
                        "X-Title": "Mapa Astral Horoscope",
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: "system", content: ASTRO_SYSTEM_PROMPT },
                            { role: "user", content: userPrompt },
                        ],
                        max_tokens: 1024,
                        temperature: 0.85,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`OpenRouter Error: ${await response.text()}`);
                }

                const json = await response.json();
                const horoscope = json.choices?.[0]?.message?.content ?? "";

                if (!horoscope) {
                    throw new Error("Empty horoscope from OpenRouter");
                }

                // Save to DB
                await admin.from("daily_horoscopes").insert({
                    user_id: profile.id,
                    date: today,
                    horoscope: horoscope
                });

                // Send Email via Resend
                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                        <h2 style="color: #6a0dad;">Seu Horóscopo do Dia 🌠</h2>
                        <p>Olá <strong>${profile.full_name?.split(' ')[0] || 'Luz Estelar'}</strong>,</p>
                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                        <div style="line-height: 1.6; white-space: pre-wrap;">
                            ${horoscope.replace(/\n/g, '<br/>')}
                        </div>
                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #888;">Você está recebendo este email pois é um usuário Premium do Mapa Astral.</p>
                    </div>
                `;

                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || "AstroSaaS <noreply@mapaastral.com>",
                    to: profile.email,
                    subject: "✨ Seu Horóscopo Diário Chegou!",
                    html: emailHtml,
                });

                sentCount++;
            } catch (err) {
                console.error(`Error processing user ${profile.id}:`, err);
                errorCount++;
            }
        }

        return NextResponse.json({
            success: true,
            results: {
                total_premium: profiles.length,
                sent: sentCount,
                skipped: skipCount,
                errors: errorCount,
            }
        });

    } catch (err: any) {
        console.error("Cron Horoscope API error:", err);
        return NextResponse.json({ error: `Internal Server Error (${err.message})` }, { status: 500 });
    }
}
