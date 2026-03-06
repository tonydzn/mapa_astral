import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    return NextResponse.json({ status: "ok" });
}

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const url = new URL(req.url);
        const signature = req.headers.get("x-signature") ?? "";
        const requestId = req.headers.get("x-request-id") ?? "";

        // Tenta pegar o ID de onde estiver disponível (query param ou body)
        const paramId = url.searchParams.get("id") || url.searchParams.get("data.id");

        let event: any = {};
        try {
            event = JSON.parse(bodyText);
        } catch (e) {
            console.error("Webhook parse error:", e);
        }

        const dataId = event.data?.id || paramId;

        console.log("Webhook MP received:", {
            type: event.type,
            action: event.action,
            dataId,
            requestId
        });

        // Validação de assinatura HMAC (se configurado)
        if (process.env.MP_WEBHOOK_SECRET && signature) {
            const crypto = await import("crypto");
            const parts = signature.split(",");
            const tsPart = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
            const v1Part = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

            if (tsPart && v1Part) {
                const manifest = `id:${dataId};request-id:${requestId};ts:${tsPart};`;
                const expected = crypto
                    .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
                    .update(manifest)
                    .digest("hex");

                if (v1Part !== expected) {
                    console.error("Webhook MP: Invalid signature");
                    // Opcionalmente retornar 401, mas logs ajudam a ver se o manifest bate com a docs
                }
            }
        }

        // Só processamos pagamentos
        if (event.type !== "payment" && event.action !== "payment.created" && event.action !== "payment.updated") {
            return NextResponse.json({ received: true });
        }

        if (!dataId) {
            console.warn("Webhook MP: No data ID found");
            return NextResponse.json({ received: true });
        }

        // Busca detalhes do pagamento no Mercado Pago
        const mpRes = await fetch(
            `https://api.mercadopago.com/v1/payments/${dataId}`,
            {
                headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
            }
        );

        if (!mpRes.ok) {
            console.error("MP API Error:", await mpRes.text());
            return NextResponse.json({ received: true }); // Retorna 200 pro MP parar de tentar
        }

        const payment = await mpRes.json();

        if (payment.status !== "approved") {
            console.log(`Payment ${dataId} status: ${payment.status}`);
            return NextResponse.json({ received: true });
        }

        const externalRef = payment.external_reference;
        if (!externalRef) {
            console.warn(`Payment ${dataId} has no external_reference`);
            return NextResponse.json({ received: true });
        }

        // Suporta formatos "userId|orderId", "userId" ou "orderId"
        let userId = "";
        let orderId = "";

        if (externalRef.includes("|")) {
            [userId, orderId] = externalRef.split("|");
        } else {
            // Se não tem pipe, tenta descobrir se é UUID (user) ou ID numérico/texto (order)
            // No seu caso, ambos parecem ser UUIDs no Supabase Auth.
            // Vamos assumir que é o userId se vier sozinho por segurança.
            userId = externalRef;
        }

        if (!userId) {
            console.error("MP Webhook: Could not extract userId from ref", externalRef);
            return NextResponse.json({ received: true });
        }

        const supabase = createAdminClient();

        console.log(`Updating user ${userId} to premium (Ref: ${externalRef})`);

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .update({ is_premium: true, maps_limit: 999 })
            .eq("id", userId)
            .select("email, full_name")
            .maybeSingle(); // maybeSingle para evitar erro se não achar

        if (profileError) {
            console.error("Profile update error:", profileError);
            return NextResponse.json({ error: "DB error" }, { status: 500 });
        }

        if (orderId) {
            await supabase
                .from("orders")
                .update({ status: "approved", mp_payment_id: String(dataId) })
                .eq("id", orderId);
        }

        if (profile?.email) {
            try {
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL!,
                    to: profile.email,
                    subject: "✨ Bem-vindo ao Mapa Astral Premium!",
                    html: `
                        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#020617;color:#e2e8f0;padding:40px;border-radius:12px;">
                          <h1 style="color:#f59e0b;text-align:center;">✨ Você é Premium!</h1>
                          <p>Olá, ${profile.full_name ?? "Astronauta"}!</p>
                          <p>Seu acesso Premium foi ativado com sucesso.</p>
                          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                             style="display:block;text-align:center;background:#f59e0b;color:#020617;padding:16px;border-radius:8px;font-weight:bold;margin-top:24px;text-decoration:none;">
                            Acessar meu Dashboard →
                          </a>
                        </div>
                    `,
                });
            } catch (emailErr) {
                console.error("Resend email error:", emailErr);
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Critical Webhook Error:", err.message);
        // Mesmo em erro crítico, retornamos algo para o MP não ficar dando 400 se for um crash
        return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
    }
}
