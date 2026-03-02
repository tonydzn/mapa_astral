"use client";

import { useState } from "react";
import Link from "next/link";
import MandalaChart from "@/components/astro/MandalaChart";
import Header from "@/components/layout/Header";
import type { ChartData } from "@/lib/astro-engine";

interface Chart {
    id: string; name: string | null; birth_date: string;
    birth_time: string | null; birth_place: string | null;
    chart_data: unknown; full_interpretation: string | null;
}
interface Profile { full_name: string | null; is_premium: boolean; }
interface Props { chart: Chart; profile: Profile | null; }

const PLANET_SYMBOLS: Record<string, string> = {
    "Sol": "☀", "Lua": "☽", "Mercúrio": "☿", "Vênus": "♀", "Marte": "♂",
    "Júpiter": "♃", "Saturno": "♄", "Urano": "♅", "Netuno": "♆", "Plutão": "♇",
};
const PLANET_COLORS: Record<string, string> = {
    "Sol": "#fbbf24", "Lua": "#c4b5fd", "Mercúrio": "#67e8f9", "Vênus": "#f9a8d4",
    "Marte": "#fca5a5", "Júpiter": "#86efac", "Saturno": "#94a3b8", "Urano": "#7dd3fc",
    "Netuno": "#a5b4fc", "Plutão": "#e879f9",
};
const ASPECT_COLORS: Record<string, string> = {
    "Conjunção": "#f59e0b", "Trígono": "#22c55e", "Sextil": "#67e8f9",
    "Quadratura": "#f43f5e", "Oposição": "#f97316", "Quincúncio": "#8b5cf6",
};

/** Renderiza markdown básico como HTML inline */
function renderMarkdown(text: string): string {
    return text
        .replace(/^### (.+)$/gm, '<h3 style="color:#c4b5fd;font-size:15px;font-weight:700;margin:20px 0 8px">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 style="color:#f59e0b;font-size:17px;font-weight:700;margin:24px 0 10px;padding-bottom:8px;border-bottom:1px solid #1a2540">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 style="color:#f59e0b;font-size:20px;font-weight:800;margin:0 0 16px">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f1f5f9;font-weight:600">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em style="color:#a5b4fc">$1</em>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^---$/gm, '<hr/>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/^([^<\n].+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);
}

export default function ChartView({ chart, profile }: Props) {
    const chartData = chart.chart_data as ChartData;
    const [interpretation, setInterpretation] = useState(chart.full_interpretation ?? "");
    const [generating, setGenerating] = useState(false);
    const [interpretationError, setInterpretationError] = useState("");
    const [activeTab, setActiveTab] = useState("planets");

    async function handleGenerate() {
        setGenerating(true);
        setInterpretationError("");
        try {
            const res = await fetch("/api/interpret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chartId: chart.id }),
            });
            const data = await res.json();
            if (!res.ok || data.error) setInterpretationError(data.error ?? "Erro desconhecido.");
            else if (data.interpretation) setInterpretation(data.interpretation);
            else setInterpretationError("Resposta vazia da interpretação. Tente novamente.");
        } catch { setInterpretationError("Erro de conexão."); }
        setGenerating(false);
    }

    const tabs = [
        { key: "planets", label: "🪐 Planetas" },
        { key: "aspects", label: "⚡ Aspectos" },
        { key: "ai", label: "✨ Interpretação Estelar" },
    ];

    return (
        <div style={{ minHeight: "100dvh", background: "#020617", color: "#f1f5f9", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            {/* ===== HEADER ===== */}
            <Header
                showBack={true}
                title={chart.name || "Mapa Natal"}
                subtitle={[chart.birth_place, chart.birth_date && new Date(chart.birth_date).toLocaleDateString("pt-BR"), chart.birth_time && `às ${chart.birth_time}`].filter(Boolean).join(" · ")}
                activeTab={activeTab}
                tabs={tabs}
                onTabChange={setActiveTab}
                profile={profile}
            />

            {/* ===== CONTENT ===== */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, position: "relative", zIndex: 1 }} className="animate-fade-in">

                {/* SIDEBAR — Mandala + ascendant */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="card" style={{ padding: "20px 16px", textAlign: "center" }}>
                        <p style={{ fontSize: 10, color: "#2d3e5a", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Mapa Natal</p>
                        <MandalaChart />
                        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {[
                                { label: "Ascendente", value: chartData.ascendant.sign, color: "#f59e0b" },
                                { label: "Meio do Céu", value: chartData.midheaven.sign, color: "#c4b5fd" },
                                { label: "Sol", value: chartData.planets?.find(p => p.planet === "Sol")?.sign ?? "—", color: "#fbbf24" },
                                { label: "Lua", value: chartData.planets?.find(p => p.planet === "Lua")?.sign ?? "—", color: "#c4b5fd" },
                            ].map(item => (
                                <div key={item.label} style={{ background: "rgba(0,0,0,.2)", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                                    <div style={{ fontSize: 11, color: "#334155", marginBottom: 4 }}>{item.label}</div>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: item.color }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Moon phase */}
                    <div className="card-sm" style={{ padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 28, marginBottom: 4 }}>{chartData.moonPhase?.emoji}</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>{chartData.moonPhase?.name}</div>
                        <div style={{ fontSize: 11, color: "#2d3e5a", marginTop: 2 }}>Fase lunar no nascimento</div>
                    </div>
                </div>

                {/* MAIN PANEL */}
                <div className="card" style={{ padding: 28, minHeight: 500 }}>

                    {/* ===== PLANETS ===== */}
                    {activeTab === "planets" && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Posições Planetárias</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                                {chartData.planets?.map(p => (
                                    <div key={p.planet} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,.04)", transition: "border-color .2s" }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${PLANET_COLORS[p.planet] ?? "#fff"}30`)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.04)")}>
                                        <span style={{ fontSize: 22, color: PLANET_COLORS[p.planet] ?? "#e2e8f0", filter: `drop-shadow(0 0 6px ${PLANET_COLORS[p.planet] ?? "#fff"}60)` }}>
                                            {PLANET_SYMBOLS[p.planet] ?? "★"}
                                        </span>
                                        <div>
                                            <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 13 }}>{p.planet}</div>
                                            <div style={{ fontSize: 11, color: "#475569" }}>{p.sign} {p.degree.toFixed(1)}° · Casa {p.house}{p.retrograde ? " ℞" : ""}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== ASPECTS ===== */}
                    {activeTab === "aspects" && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Aspectos Principais</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {chartData.aspects?.map((a, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(255,255,255,.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,.04)", transition: "all .2s" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.02)")}>
                                        <span style={{ width: 90, fontSize: 13, color: "#94a3b8" }}>{a.planet1}</span>
                                        <span style={{ width: 100, fontSize: 12, fontWeight: 700, color: ASPECT_COLORS[a.type] ?? "#f59e0b", textAlign: "center" }}>{a.type}</span>
                                        <span style={{ width: 90, fontSize: 13, color: "#94a3b8" }}>{a.planet2}</span>
                                        <span style={{ fontSize: 11, color: "#334155", marginLeft: "auto" }}>orbe {a.orb}°</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== AI INTERPRETATION ===== */}
                    {activeTab === "ai" && (
                        <div className="animate-fade-in">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Interpretação Estelar</h2>
                                    <p style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
                                        {profile?.is_premium ? "✦ Interpretação Completa (Premium)" : "Análise Essencial (gratuito)"}
                                    </p>
                                </div>
                                <button onClick={handleGenerate} disabled={generating} className="btn-gold" style={{ padding: "9px 18px", fontSize: 13 }}>
                                    {generating ? "⏳ Gerando..." : interpretation ? "🔄 Regenerar" : "✨ Gerar interpretação"}
                                </button>
                            </div>

                            {interpretationError && (
                                <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 10, padding: "14px 18px", color: "#f87171", fontSize: 13, marginBottom: 20 }}>
                                    ⚠️ {interpretationError}
                                </div>
                            )}

                            {generating && (
                                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                                    <div style={{ fontSize: 48, marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>✨</div>
                                    <p style={{ color: "#64748b", fontSize: 15, marginBottom: 8 }}>Gerando sua interpretação...</p>
                                    <p style={{ color: "#334155", fontSize: 12 }}>Isso pode levar 15–30 segundos</p>
                                    <div style={{ marginTop: 24, height: 3, background: "#0f1a2e", borderRadius: 99, width: 200, margin: "24px auto 0", overflow: "hidden" }}>
                                        <div style={{ height: "100%", background: "linear-gradient(90deg,#8b5cf6,#f59e0b)", borderRadius: 99, animation: "shimmer 2s linear infinite", backgroundSize: "200% 100%" }} />
                                    </div>
                                </div>
                            )}

                            {!interpretation && !generating && !interpretationError && (
                                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                                    <div style={{ fontSize: 56, marginBottom: 16, opacity: .3 }}>🔮</div>
                                    <p style={{ color: "#475569", fontSize: 15, marginBottom: 8 }}>Nenhuma interpretação ainda</p>
                                    <p style={{ color: "#334155", fontSize: 13 }}>Clique em "✨ Gerar interpretação" para desbloquear os insights do seu mapa</p>
                                </div>
                            )}

                            {interpretation && !generating && (
                                <div className="interpretation-content"
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(interpretation) }}
                                    style={{ fontSize: 14, lineHeight: 1.85 }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
