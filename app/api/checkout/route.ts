import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { preferenceClient, PLANS } from "@/lib/mercadopago/client";

export async function POST(req: NextRequest) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const couponCode = body.couponCode;

    const plan = PLANS.premium;
    let finalPrice = plan.price;

    if (couponCode) {
        const { data: coupon } = await supabase
            .from("coupons")
            .select("discount_percent, active")
            .eq("code", couponCode.toUpperCase())
            .eq("active", true)
            .single();

        if (coupon) {
            finalPrice = Math.round(plan.price * (1 - coupon.discount_percent / 100) * 100) / 100;
        }
    }

    // Cria order pendente
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: user.id,
            amount: finalPrice,
            status: "pending",
            plan: "premium",
            coupon_code: couponCode ?? null,
        })
        .select("id")
        .single();

    if (orderError) {
        console.error("Database order creation error:", orderError);
        return NextResponse.json({ error: "Erro ao criar pedido no banco de dados." }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    try {
        const isLocal = appUrl.includes("localhost");

        // Cria preferência no MP
        const preference = await preferenceClient.create({
            body: {
                items: [
                    {
                        id: "premium",
                        title: plan.title,
                        description: plan.description,
                        quantity: 1,
                        unit_price: finalPrice,
                        currency_id: "BRL",
                    },
                ],
                payer: {
                    email: user.email ?? "cliente@mapaastral.com",
                },
                external_reference: `${user.id}|${order?.id ?? ""}`,
                back_urls: {
                    success: `${appUrl}/dashboard?payment=success`,
                    failure: `${appUrl}/dashboard?payment=failure`,
                    pending: `${appUrl}/dashboard?payment=pending`,
                },
                auto_return: "approved",
                // Mercado Pago não aceita localhost na notification_url
                notification_url: isLocal ? undefined : `${appUrl}/api/webhooks/mercadopago`,
            },
        });

        if (order?.id && preference.id) {
            await supabase
                .from("orders")
                .update({ mp_preference_id: preference.id })
                .eq("id", order.id);
        }

        return NextResponse.json({
            init_point: preference.init_point,
            preference_id: preference.id,
        });
    } catch (err: any) {
        // Log detalhado para depuração
        console.error("MP checkout error details:", {
            message: err.message,
            stack: err.stack,
            cause: err.cause,
            status: err.response?.status,
            data: err.response?.data,
            params: {
                unit_price: finalPrice,
                email: user.email,
                external_reference: `${user.id}|${order?.id ?? ""}`
            }
        });

        // Se for erro de validação do MP (ex: preço inválido ou data malformada)
        const mpErrorMsg = err.response?.data?.message || err.message;

        return NextResponse.json(
            {
                error: "Erro ao criar preferência de pagamento. Tente novamente.",
                details: process.env.NODE_ENV === "development" ? mpErrorMsg : undefined
            },
            { status: err.response?.status || 500 }
        );
    }
}
