"use client";

import { useState } from "react";

interface Props {
    onClose: () => void;
    userId: string;
}

export default function PremiumModal({ onClose, userId }: Props) {
    const [coupon, setCoupon] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const features = [
        ["🌌", "Mapas ilimitados"],
        ["🤖", "Interpretação Avançada"],
        ["📄", "PDFs personalizados"],
        ["💑", "Sinastria completa"],
        ["🔮", "Previsões mensais"],
        ["⚡", "Suporte prioritário"],
    ];

    async function handleCheckout() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ couponCode: coupon || undefined }),
            });
            const data = await res.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                setError("Erro ao iniciar pagamento. Tente novamente.");
            }
        } catch {
            setError("Erro de conexão. Tente novamente.");
        }
        setLoading(false);
    }

    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#0f172a", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: 36, maxWidth: 400, width: "90%", position: "relative", boxShadow: "0 0 80px rgba(245,158,11,0.12), 0 0 200px rgba(139,92,246,0.08)" }}>
                <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#64748b", fontSize: 18, cursor: "pointer" }}>✕</button>

                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
                    <h2 style={{ color: "#f59e0b", fontFamily: "Georgia, serif", fontSize: 24, margin: 0 }}>Mapa Astral Premium</h2>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Desbloqueie todo o cosmos</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                    {features.map(([icon, text]) => (
                        <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 13, color: "#cbd5e1" }}>
                            <span>{icon}</span><span>{text}</span>
                        </div>
                    ))}
                </div>

                <input
                    value={coupon}
                    onChange={e => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Cupom de desconto (opcional)"
                    className="input-dark"
                    style={{ marginBottom: 14 }}
                />

                <div style={{ textAlign: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 32, fontWeight: "bold", color: "white" }}>R$49,90</span>
                    <span style={{ color: "#64748b", fontSize: 13 }}> /pagamento único</span>
                </div>

                {error && <p style={{ color: "#ef4444", fontSize: 12, textAlign: "center", marginBottom: 10 }}>{error}</p>}

                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn-gold"
                    style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 15 }}
                >
                    {loading ? "Redirecionando..." : "🚀 Ativar Premium agora"}
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#475569", marginTop: 10 }}>
                    Pagamento seguro via Mercado Pago · Garantia 7 dias
                </p>
            </div>
        </div>
    );
}
