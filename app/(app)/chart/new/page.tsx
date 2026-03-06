"use client";

import { useState } from "react";
import { createBirthChart } from "@/actions/chart.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import PremiumModal from "@/components/checkout/PremiumModal";

interface GeoResult {
    display_name: string;
    lat: string;
    lon: string;
}

export default function NewChartPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "", birth_date: "", birth_time: "", birth_place: "",
    });
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPremium, setShowPremium] = useState(false);

    async function searchCity(query: string) {
        if (query.length < 3) { setSuggestions([]); return; }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
                headers: { "User-Agent": "MapaAstral/1.0" }
            });
            const data = await res.json();
            setSuggestions(data);
        } catch { setSuggestions([]); }
    }

    function selectCity(g: GeoResult) {
        setForm(f => ({ ...f, birth_place: g.display_name.split(",").slice(0, 2).join(",").trim() }));
        setCoords({ lat: parseFloat(g.lat), lng: parseFloat(g.lon) });
        setSuggestions([]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!coords) {
            setError("Selecione uma cidade da lista de sugestões.");
            return;
        }
        setLoading(true);
        setError("");

        const result = await createBirthChart({
            name: form.name,
            birth_date: form.birth_date,
            birth_time: form.birth_time,
            birth_place: form.birth_place,
            latitude: coords.lat,
            longitude: coords.lng,
        });

        if (result.error === "LIMIT_REACHED") {
            setError(result.message || "Você atingiu o limite de mapas. Faça upgrade para Premium!");
            setLoading(false);
            return;
        }
        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        router.push(`/chart/${(result as any).chart?.id}`);
    }

    const inputStyle = "input-dark";

    return (
        <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
            {/* Fixed ambient */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.05),transparent)" }} />
            </div>

            <Header
                showBack={true}
                title="Novo Mapa Astral"
                profile={null} // O perfil será carregado via hook se necessário, ou podemos passar um prop
                onShowPremium={() => setShowPremium(true)}
            />

            {showPremium && <PremiumModal onClose={() => setShowPremium(false)} userId="" />}

            <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 10 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🌌</div>
                    <h2 style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 8 }}>
                        Criar Mapa Astral
                    </h2>
                    <p style={{ color: "#64748b", fontSize: 14 }}>
                        Insira os dados de nascimento para calcular as posições planetárias exatas
                    </p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div>
                            <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Nome da pessoa *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Ex: Mariana Silva"
                                required
                                className={inputStyle}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Data de nascimento *</label>
                                <input
                                    type="date"
                                    value={form.birth_date}
                                    onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Hora (aprox.)</label>
                                <input
                                    type="time"
                                    value={form.birth_time}
                                    onChange={e => setForm(f => ({ ...f, birth_time: e.target.value }))}
                                    className={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ position: "relative" }}>
                            <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Cidade de nascimento *</label>
                            <input
                                type="text"
                                value={form.birth_place}
                                onChange={e => {
                                    setForm(f => ({ ...f, birth_place: e.target.value }));
                                    setCoords(null);
                                    searchCity(e.target.value);
                                }}
                                placeholder="Digite e selecione da lista..."
                                required
                                className={inputStyle}
                            />
                            {coords && (
                                <span style={{ position: "absolute", right: 12, top: 38, fontSize: 12, color: "#22c55e" }}>✓ Coordenadas obtidas</span>
                            )}
                            {suggestions.length > 0 && (
                                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0f172a", border: "1px solid #334155", borderRadius: 8, zIndex: 20, marginTop: 4, overflow: "hidden" }}>
                                    {suggestions.map((s, i) => (
                                        <button key={i} type="button" onClick={() => selectCity(s)}
                                            style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", color: "#e2e8f0", fontSize: 13, cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid #1e293b" : "none" }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                                        >
                                            {s.display_name.split(",").slice(0, 3).join(", ")}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", color: "#ef4444", fontSize: 13 }}>
                                {error}
                                {error.includes("limite") && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPremium(true)}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            marginTop: 10,
                                            background: "linear-gradient(135deg,#f59e0b,#d97706)",
                                            color: "#000",
                                            fontWeight: 700,
                                            fontSize: 13,
                                            textAlign: "center",
                                            padding: "10px 16px",
                                            borderRadius: 8,
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        ⭐ Tornar-se Premium
                                    </button>
                                )}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-gold" style={{ padding: "14px", borderRadius: 12, fontSize: 15, marginTop: 4 }}>
                            {loading ? "Calculando mapa..." : "✨ Calcular meu mapa natal"}
                        </button>

                        <p style={{ textAlign: "center", fontSize: 12, color: "#475569" }}>
                            Calculado instantaneamente com base nas posições astronômicas reais
                        </p>

                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                            <Link
                                href="/dashboard"
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    padding: "11px 16px",
                                    borderRadius: 10,
                                    border: "1px solid #334155",
                                    background: "rgba(255,255,255,0.04)",
                                    color: "#94a3b8",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                            >
                                ← Voltar
                            </Link>

                            <button
                                type="button"
                                onClick={() => setShowPremium(true)}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    padding: "11px 16px",
                                    borderRadius: 10,
                                    border: "none",
                                    cursor: "pointer",
                                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    transition: "opacity 0.2s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                            >
                                ⭐ Tornar-se Premium
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
