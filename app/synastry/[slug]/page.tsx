import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import SynastryForm from "./SynastryForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createAdminClient();

    const { data: link } = await supabase
        .from("synastry_links")
        .select("owner_id, second_person_name")
        .eq("slug", slug)
        .single();

    if (!link) return { title: "Sinastria não encontrada" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", link.owner_id)
        .single();

    const ownerName = profile?.full_name ?? "alguém";
    const title = link.second_person_name
        ? `Sinastria entre ${ownerName} e ${link.second_person_name} | Mapa Astral`
        : `Sinastria de ${ownerName} | Mapa Astral`;

    const description = link.second_person_name
        ? `Confira a compatibilidade astrológica entre ${ownerName} e ${link.second_person_name}.`
        : `Descubra sua compatibilidade astrológica com ${ownerName}. Calcule sua sinastria agora!`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            images: ["/images/og-main.png"], // Idealmente uma imagem personalizada por sinastria
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/images/og-main.png"],
        }
    };
}

export default async function SynastryPublicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = createAdminClient();

    const { data: link, error } = await supabase
        .from("synastry_links")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !link) return notFound();

    const l = link as any;

    // Incrementa views
    await supabase
        .from("synastry_links")
        .update({ views_count: (l.views_count ?? 0) + 1 })
        .eq("id", l.id);

    // Busca nome do owner
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", l.owner_id)
        .single();

    const ownerName = profile?.full_name ?? "alguém";
    const isCompleted = !!l.second_person_name;

    return (
        <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "Georgia, serif" }}>
            {/* Ambient */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.06),transparent)" }} />
            </div>

            {/* Header */}
            <div style={{ textAlign: "center", padding: "48px 24px 32px", position: "relative", zIndex: 10 }}>
                <div style={{ fontSize: 52, marginBottom: 14, filter: "drop-shadow(0 0 20px rgba(245,158,11,0.4))" }}>💑</div>
                <h1 style={{ fontSize: 28, color: "#f59e0b", marginBottom: 8, fontWeight: "bold" }}>Sinastria Amorosa</h1>
                <p style={{ color: "#94a3b8", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
                    <strong style={{ color: "#e2e8f0" }}>{ownerName}</strong> quer descobrir a compatibilidade astrológica entre vocês.
                    Preencha seus dados de nascimento para revelar a conexão cósmica!
                </p>
            </div>

            <div style={{ position: "relative", zIndex: 10 }}>
                {isCompleted ? (
                    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 24px 60px" }}>
                        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, padding: 40, textAlign: "center" }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>✨</div>
                            <h2 style={{ color: "#c4b5fd", marginBottom: 8, fontSize: 22 }}>Sinastria Completa!</h2>
                            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>
                                {ownerName} e <strong style={{ color: "#e2e8f0" }}>{l.second_person_name}</strong> já têm sua compatibilidade calculada.
                            </p>
                            {l.compatibility_score && (
                                <div style={{ fontSize: 56, color: "#f59e0b", fontWeight: "bold", margin: "16px 0" }}>
                                    {l.compatibility_score}%
                                </div>
                            )}
                            <a href="/"
                                style={{ display: "inline-block", marginTop: 16, padding: "14px 36px", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#020617", borderRadius: 10, fontWeight: "bold", fontSize: 14, textDecoration: "none" }}>
                                Crie seu próprio mapa →
                            </a>
                        </div>
                    </div>
                ) : (
                    <SynastryForm linkId={l.id} ownerName={ownerName} />
                )}
            </div>
        </div>
    );
}
