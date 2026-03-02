import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("x-signature") ?? "";
    const requestId = req.headers.get("x-request-id") ?? "";

    // Validação de assinatura HMAC
    const crypto = await import("crypto");
    const parts = signature.split(",");
    const tsPart = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
    const v1Part = parts.find((p) => p.startsWith("v1="))?.split("=")[1];
    const manifest = `id:${new URL(req.url).searchParams.get("data.id")};request-id:${requestId};ts:${tsPart};`;
    const expected = crypto
        .createHmac("sha256", process.env.MP_WEBHOOK_SECRET ?? "")
        .update(manifest)
        .digest("hex");

    if (v1Part !== expected && process.env.MP_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    if (event.type !== "payment") {
        return NextResponse.json({ received: true });
    }

    const paymentId = event.data?.id;
    if (!paymentId) return NextResponse.json({ received: true });

    const mpRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
            headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
        }
    );
    const payment = await mpRes.json();

    if (payment.status !== "approved") {
        return NextResponse.json({ received: true });
    }

    const externalRef = payment.external_reference; // format: "userId|orderId"
    if (!externalRef) return NextResponse.json({ received: true });

    const [userId, orderId] = externalRef.split("|");
    if (!userId) return NextResponse.json({ received: true });

    const supabase = createAdminClient();

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .update({ is_premium: true, maps_limit: 999 })
        .eq("id", userId)
        .select("email, full_name")
        .single();

    if (profileError) {
        console.error("Profile update error:", profileError);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    if (orderId) {
        await supabase
            .from("orders")
            .update({ status: "approved", mp_payment_id: String(paymentId) })
            .eq("id", orderId);
    }

    if (profile?.email) {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: profile.email,
            subject: "✨ Bem-vindo ao Mapa Astral Premium!",
            html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#020617;color:#e2e8f0;padding:40px;border-radius:12px;">
          <h1 style="color:#f59e0b;text-align:center;">✨ Você é Premium!</h1>
          <p>Olá, ${profile.full_name ?? "Astronauta"}!</p>
          <p>Seu acesso Premium foi ativado com sucesso. Agora você tem:</p>
          <ul>
            <li>Mapas Natais ilimitados</li>
            <li>Interpretação Estelar Avançada</li>
            <li>Download em PDF</li>
            <li>Sinastria Amorosa</li>
            <li>Previsões mensais personalizadas</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display:block;text-align:center;background:#f59e0b;color:#020617;padding:16px;border-radius:8px;font-weight:bold;margin-top:24px;text-decoration:none;">
            Acessar meu Dashboard →
          </a>
        </div>
      `,
        });
    }

    return NextResponse.json({ received: true });
}
