import { MercadoPagoConfig, Preference } from "mercadopago";

export const mpConfig = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const preferenceClient = new Preference(mpConfig);

export const PLANS = {
    premium: {
        title: "Mapa Astral Premium",
        description: "Mapas ilimitados, PDF, Sinastria e Interpretação Avançada",
        price: 97.0,
        currency: "BRL",
    },
} as const;

export type PlanKey = keyof typeof PLANS;
