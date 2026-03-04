"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MandalaChart from "@/components/astro/MandalaChart";
import PremiumModal from "@/components/checkout/PremiumModal";
import Header from "@/components/layout/Header";
import { logMood } from "@/actions/mood.actions";
import type { MoonPhase } from "@/lib/astro-engine";

interface Profile {
    id: string; full_name: string | null; email: string;
    is_premium: boolean; maps_count: number; maps_limit: number;
}
interface Chart {
    id: string; name: string | null; birth_date: string;
    birth_place: string | null; chart_data: unknown; created_at: string;
}
interface MoodLog { id: string; mood_score: number; created_at: string; }
interface Props { profile: Profile | null; charts: Chart[]; moodLogs: MoodLog[]; moonPhase: MoonPhase; }

function MoodGraph({ data }: { data: MoodLog[] }) {
    if (!data.length) return (
        <div style={{ padding: "20px 0", textAlign: "center", color: "#334155", fontSize: 13 }}>
            Nenhum registro ainda. Registre seu humor! 👆
        </div>
    );
    const W = 100, H = 40;
    const pts = data.map((v, i) => [
        (i / Math.max(data.length - 1, 1)) * W,
        H - (v.mood_score / 10) * H,
    ]);
    const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
    const fillD = `M0,${H} ${pts.map(p => `L${p[0]},${p[1]}`).join(" ")} L${W},${H} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 56, overflow: "visible" }}>
            <defs>
                <linearGradient id="mf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".45" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fillD} fill="url(#mf)" />
            <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinejoin="round" />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="#8b5cf6" />)}
        </svg>
    );
}

const SIGN_FROM_DATA = (chart: Chart): string => {
    const d = chart.chart_data as { planets?: { planet: string; sign: string }[] };
    return d?.planets?.find(p => p.planet === "Sol")?.sign ?? "—";
};

export default function DashboardClient({ profile, charts, moodLogs, moonPhase }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [showPremium, setShowPremium] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [notif, setNotif] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
    const [moodLoading, setMoodLoading] = useState(false);

    const paymentStatus = searchParams.get("payment");

    // Feedback de pagamento
    useState(() => {
        if (paymentStatus === "success") setNotif({ msg: "✨ Parabéns! Seu acesso Premium foi ativado com sucesso.", type: "success" });
        if (paymentStatus === "failure") setNotif({ msg: "❌ O pagamento não foi concluído. Tente novamente ou use outro cartão.", type: "error" });
        if (paymentStatus === "pending") setNotif({ msg: "⏳ Seu pagamento está em processamento. Avisaremos assim que for aprovado.", type: "info" });
    });

    const isPremium = profile?.is_premium ?? false;
    const mapsCount = profile?.maps_count ?? 0;
    const mapsLimit = profile?.maps_limit ?? 3;
    const firstName = profile?.full_name?.split(" ")[0] ?? "Astronauta";
    const sunSign = charts[0] ? SIGN_FROM_DATA(charts[0]) : "—";
    const progressPct = isPremium ? 100 : Math.min((mapsCount / mapsLimit) * 100, 100);

    const dashboardTabs = [
        { key: "overview", label: "Início" },
        { key: "charts", label: "Mapas" },
        { key: "mood", label: "Humor" }
    ];

    async function handleLogMood(score: number) {
        if (moodLoading) return;
        setMoodLoading(true);
        const res = await logMood(score);
        if (res.success) {
            setNotif({ msg: "Humor registrado com sucesso! ✦", type: "success" });
            setTimeout(() => setNotif(null), 3000);
        } else {
            setNotif({ msg: "Erro ao registrar humor. Tente novamente.", type: "error" });
        }
        setMoodLoading(false);
    }

    return (
        <div style={{ minHeight: "100dvh", background: "#020617", color: "#f1f5f9", fontFamily: "var(--font-inter), system-ui, sans-serif", position: "relative" }}>
            {showPremium && <PremiumModal onClose={() => setShowPremium(false)} userId={profile?.id ?? ""} />}

            {/* Notifications */}
            {notif && (
                <div style={{
                    position: "fixed", top: 80, right: 24, zIndex: 100,
                    padding: "12px 20px", borderRadius: 12,
                    background: notif.type === "success" ? "rgba(16,185,129,0.9)" : notif.type === "error" ? "rgba(239,68,68,0.9)" : "rgba(59,130,246,0.9)",
                    backdropFilter: "blur(10px)", color: "#fff", fontSize: 13, fontWeight: 500,
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", gap: 10,
                    animation: "slideIn 0.3s ease-out"
                }}>
                    <span>{notif.msg}</span>
                    <button onClick={() => setNotif(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", opacity: 0.7 }}>✕</button>
                </div>
            )}

            {/* Ambient */}
            <div className="ambient">
                <div className="blob" style={{ top: -150, left: "10%", width: 500, height: 500, background: "radial-gradient(circle,rgba(139,92,246,.06),transparent)" }} />
                <div className="blob" style={{ bottom: 0, right: "5%", width: 400, height: 400, background: "radial-gradient(circle,rgba(245,158,11,.04),transparent)" }} />
            </div>

            {/* ===== HEADER ===== */}
            <Header
                profile={profile as any}
                activeTab={activeTab}
                tabs={dashboardTabs}
                onTabChange={setActiveTab}
                onShowPremium={() => setShowPremium(true)}
            />

            {/* ===== MAIN ===== */}
            <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px", position: "relative", zIndex: 1 }} className="animate-fade-in">

                {/* Greeting */}
                <div style={{ marginBottom: 28 }}>
                    <p style={{ color: "#475569", fontSize: 13, marginBottom: 4 }} suppressHydrationWarning>
                        {moonPhase.emoji} {moonPhase.name} &nbsp;·&nbsp; {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>
                        Olá, {firstName} &thinsp;<span style={{ color: "#f59e0b" }}>✦</span>
                    </h1>
                    <p style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>O cosmos tem mensagens para você hoje.</p>
                </div>

                {/* ===== OVERVIEW TAB ===== */}
                {activeTab === "overview" && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: typeof window !== "undefined" && window.innerWidth < 900 ? "1fr" : "1fr 1.7fr",
                        gap: 20
                    }}>

                        {/* LEFT COLUMN */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Stats cards */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: typeof window !== "undefined" && window.innerWidth < 480 ? "1fr 1fr" : "repeat(auto-fit, minmax(130px, 1fr))",
                                gap: 10
                            }}>
                                {[
                                    { icon: "🗺️", label: "Mapas", value: `${mapsCount}/${isPremium ? "∞" : mapsLimit}`, color: "#f59e0b" },
                                    { icon: moonPhase.emoji, label: "Fase Lunar", value: moonPhase.name.split(" ").slice(0, 2).join(" "), color: "#c4b5fd" },
                                    { icon: "☀", label: "Sol", value: sunSign || "—", color: "#fbbf24" },
                                    { icon: "💑", label: "Sinastria", value: isPremium ? "Ativo" : "Premium", color: "#f9a8d4" },
                                ].map(s => (
                                    <div key={s.label} className="stat-card">
                                        <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                                        <div style={{ fontWeight: 700, fontSize: 16, color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Mandala */}
                            <div className="card" style={{ padding: "20px 16px", textAlign: "center" }}>
                                <p style={{ fontSize: 10, color: "#2d3e5a", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
                                    Mapa Natal — {firstName}
                                </p>
                                <MandalaChart data={charts[0]?.chart_data as any} />
                            </div>

                            {/* Quick actions */}
                            <div className="card" style={{ padding: "6px 8px" }}>
                                {[
                                    { icon: "✦", text: "Criar novo mapa natal", locked: mapsCount >= mapsLimit && !isPremium, href: "/chart/new" },
                                    { icon: "💑", text: "Nova sinastria amorosa", locked: !isPremium, href: "/synastry/new" },
                                    { icon: "🔮", text: "Trânsitos do mês", locked: !isPremium, href: "#" },
                                ].map(a => (
                                    <button key={a.text} onClick={a.locked ? () => setShowPremium(true) : () => router.push(a.href)}
                                        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px", borderRadius: 8, border: "none", background: "transparent", color: a.locked ? "#2d3e5a" : "#94a3b8", cursor: "pointer", fontSize: 14, transition: "background .15s", fontFamily: "inherit", textAlign: "left" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                        <span style={{ color: a.locked ? "#2d3e5a" : "#f59e0b", fontSize: 16 }}>{a.icon}</span>
                                        <span style={{ flex: 1 }}>{a.text}</span>
                                        {a.locked && <span className="badge-gold" style={{ fontSize: 10 }}>Premium</span>}
                                        <span style={{ color: "#2d3e5a" }}>→</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Charts list */}
                            <div className="card" style={{ padding: 24 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Seus Mapas</h2>
                                    {!isPremium && (
                                        <div style={{ fontSize: 12, color: "#334155" }}>
                                            <span style={{ color: progressPct >= 100 ? "#ef4444" : "#f59e0b", fontWeight: 600 }}>{mapsCount}</span>/{mapsLimit} usados
                                        </div>
                                    )}
                                </div>

                                {!isPremium && (
                                    <div style={{ height: 3, background: "#0f1a2e", borderRadius: 99, marginBottom: 18 }}>
                                        <div style={{ height: "100%", borderRadius: 99, width: `${progressPct}%`, transition: "width .6s", background: progressPct >= 100 ? "#ef4444" : "linear-gradient(90deg,#8b5cf6,#f59e0b)" }} />
                                    </div>
                                )}

                                {charts.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "36px 20px" }}>
                                        <div style={{ fontSize: 44, marginBottom: 12, opacity: .4 }}>🌌</div>
                                        <p style={{ color: "#334155", fontSize: 14, marginBottom: 16 }}>Você ainda não tem mapas natais.</p>
                                        <Link href="/chart/new" className="btn-gold" style={{ padding: "10px 24px", fontSize: 13 }}>
                                            Criar meu primeiro mapa
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {charts.slice(0, 5).map(c => (
                                            <Link key={c.id} href={`/chart/${c.id}`} style={{ textDecoration: "none", display: "block" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", borderRadius: 10, border: "1px solid transparent", cursor: "pointer", marginBottom: 6, transition: "all .2s" }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.03)"; (e.currentTarget as HTMLElement).style.borderColor = "#1a2540"; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}>
                                                    <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(245,158,11,.35)", background: "rgba(245,158,11,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontSize: 18, flexShrink: 0 }}>✦</div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name || "Mapa sem nome"}</div>
                                                        <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }} suppressHydrationWarning>{c.birth_place} · {new Date(c.birth_date).toLocaleDateString("pt-BR")}</div>
                                                    </div>
                                                    <span style={{ color: "#2d3e5a", fontSize: 13, flexShrink: 0 }}>→</span>
                                                </div>
                                            </Link>
                                        ))}
                                        <button onClick={mapsCount >= mapsLimit && !isPremium ? () => setShowPremium(true) : () => router.push("/chart/new")}
                                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 13, borderRadius: 10, marginTop: 4, cursor: "pointer", border: "1px dashed rgba(245,158,11,.2)", background: "rgba(245,158,11,.03)", color: "#f59e0b", fontSize: 13, transition: "all .2s", fontFamily: "inherit" }}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,158,11,.5)")}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(245,158,11,.2)")}>
                                            {mapsCount >= mapsLimit && !isPremium ? "✨ Upgrade — mapas ilimitados" : "+ Criar novo mapa"}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Mood tracker */}
                            <div className="card" style={{ padding: 24 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Mood Tracker</h2>
                                    <span style={{ fontSize: 12, color: "#334155" }}>{moonPhase.emoji} {moonPhase.name}</span>
                                </div>
                                <p style={{ fontSize: 12, color: "#334155", marginBottom: 12 }}>Como você está hoje?</p>
                                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                    {[
                                        { e: "😔", s: 2 },
                                        { e: "😐", s: 4 },
                                        { e: "🙂", s: 6 },
                                        { e: "😊", s: 8 },
                                        { e: "🌟", s: 10 }
                                    ].map((m, i) => (
                                        <button key={i}
                                            onClick={() => handleLogMood(m.s)}
                                            disabled={moodLoading}
                                            style={{ fontSize: 24, width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(139,92,246,.2)", background: "rgba(139,92,246,.06)", cursor: moodLoading ? "default" : "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                                            onMouseEnter={e => { if (!moodLoading) { (e.currentTarget as HTMLElement).style.transform = "scale(1.2)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,.6)"; } }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,.2)"; }}>
                                            {m.e}
                                        </button>
                                    ))}
                                </div>
                                <MoodGraph data={moodLogs} />
                            </div>

                            {/* Daily insight */}
                            <div style={{ borderRadius: 14, padding: "20px 22px", background: "linear-gradient(135deg,rgba(139,92,246,.07),rgba(245,158,11,.03))", border: "1px solid rgba(139,92,246,.15)" }}>
                                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                    <span style={{ fontSize: 26, flexShrink: 0 }}>🔮</span>
                                    <div>
                                        <h3 style={{ color: "#c4b5fd", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Insight do Dia</h3>
                                        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
                                            <strong style={{ color: "#f59e0b" }}>{moonPhase.emoji} {moonPhase.name}</strong> — momento propício para introspecção. Confie no que sente, mesmo sem lógica aparente.
                                        </p>
                                        {!isPremium && (
                                            <button onClick={() => setShowPremium(true)} style={{ background: "none", border: "none", color: "#f59e0b", fontSize: 12, cursor: "pointer", marginTop: 10, padding: 0, fontFamily: "inherit" }}>
                                                ✨ Ver previsão mensal completa →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* ===== CHARTS TAB ===== */}
                {activeTab === "charts" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Todos os mapas ({charts.length})</h2>
                            <Link href="/chart/new" className="btn-gold" style={{ padding: "9px 18px", fontSize: 13 }}>+ Novo mapa</Link>
                        </div>
                        {charts.length === 0 ? (
                            <div className="card" style={{ padding: 60, textAlign: "center" }}>
                                <div style={{ fontSize: 52, marginBottom: 16, opacity: .3 }}>🌌</div>
                                <p style={{ color: "#334155", marginBottom: 20 }}>Nenhum mapa criado ainda.</p>
                                <Link href="/chart/new" className="btn-gold">Criar primeiro mapa</Link>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                                {charts.map(c => (
                                    <Link key={c.id} href={`/chart/${c.id}`} style={{ textDecoration: "none" }}>
                                        <div className="card" style={{ padding: 22, transition: "all .25s" }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                                            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>✦</div>
                                            <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15, textAlign: "center", marginBottom: 6 }}>{c.name || "Mapa sem nome"}</div>
                                            <div style={{ fontSize: 12, color: "#334155", textAlign: "center" }}>{c.birth_place}</div>
                                            <div style={{ fontSize: 11, color: "#2d3e5a", textAlign: "center", marginTop: 2 }} suppressHydrationWarning>{new Date(c.birth_date).toLocaleDateString("pt-BR")}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===== MOOD TAB ===== */}
                {activeTab === "mood" && (
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Seu Histórico de Humor</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 15, color: "#c4b5fd", fontWeight: 700, marginBottom: 16 }}>Registrar Humor</h3>
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    {[
                                        { e: "😔 Péssimo", s: 2 },
                                        { e: "😐 Regular", s: 4 },
                                        { e: "🙂 Bom", s: 6 },
                                        { e: "😊 Ótimo", s: 8 },
                                        { e: "🌟 Incrível", s: 10 }
                                    ].map((m, i) => (
                                        <button key={i}
                                            onClick={() => handleLogMood(m.s)}
                                            disabled={moodLoading}
                                            style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid rgba(139,92,246,.2)", background: "rgba(139,92,246,.06)", color: "#94a3b8", fontSize: 13, cursor: moodLoading ? "default" : "pointer", transition: "all .2s", fontFamily: "inherit" }}
                                            onMouseEnter={e => { if (!moodLoading) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,.5)"; (e.currentTarget as HTMLElement).style.color = "#f1f5f9"; } }}
                                            onMouseLeave={e => { if (!moodLoading) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,.2)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; } }}>
                                            {m.e}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 15, color: "#c4b5fd", fontWeight: 700, marginBottom: 16 }}>Últimas 2 semanas</h3>
                                <MoodGraph data={moodLogs} />
                                <p style={{ fontSize: 11, color: "#2d3e5a", marginTop: 12 }}>{moodLogs.length} registros · Fase atual: {moonPhase.emoji} {moonPhase.name}</p>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
