import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import type { ChartData } from "@/lib/astro-engine";

const PLANET_SYMBOLS: Record<string, string> = {
    "Sol": "☀", "Lua": "☽", "Mercúrio": "☿", "Vênus": "♀", "Marte": "♂",
    "Júpiter": "♃", "Saturno": "♄", "Urano": "♅", "Netuno": "♆", "Plutão": "♇",
};

export default async function ChartPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: chart, error } = await supabase
        .from("birth_charts").select("*")
        .eq("id", id).eq("user_id", user.id).single();

    if (error || !chart) return notFound();

    const { data: profile } = await supabase
        .from("profiles").select("full_name, is_premium").eq("id", user.id).single();

    if (!profile?.is_premium) redirect(`/chart/${id}`);

    const chartData = chart.chart_data as ChartData;
    const sun = chartData.planets?.find(p => p.planet === "Sol");
    const moon = chartData.planets?.find(p => p.planet === "Lua");
    const birthInfo = [
        chart.birth_place,
        chart.birth_date && new Date(chart.birth_date).toLocaleDateString("pt-BR"),
        chart.birth_time && `às ${chart.birth_time}`,
    ].filter(Boolean).join(" · ");

    const interpretation = chart.full_interpretation ?? "";

    return (
        <html lang="pt-BR">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Mapa Astral — {chart.name}</title>
                <style>{`
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                    body { font-family: 'Inter', system-ui, sans-serif; background:#020617; color:#f1f5f9; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .page { max-width: 800px; margin: 0 auto; padding: 48px 40px; }
                    
                    /* HEADER */
                    .header { border-bottom: 2px solid #f59e0b; padding-bottom: 24px; margin-bottom: 36px; }
                    .logo { display:flex; align-items:center; gap:8px; margin-bottom:20px; }
                    .logo-star { color:#f59e0b; font-size:20px; filter:drop-shadow(0 0 8px rgba(245,158,11,.5)); }
                    .logo-text { color:#f59e0b; font-weight:800; letter-spacing:2px; font-size:14px; }
                    .main-title { font-size: 36px; font-weight: 800; color: #fbbf24; margin-bottom: 8px; }
                    .subtitle { font-size: 15px; color: #94a3b8; margin-bottom: 4px; }
                    .birth-info { font-size: 13px; color: #475569; }
                    
                    /* PILLARS */
                    .section { margin-bottom: 32px; }
                    .section-title { font-size: 13px; font-weight: 700; color: #8b5cf6; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; padding-left: 12px; border-left: 3px solid #8b5cf6; }
                    .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                    .pillar { background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; }
                    .pillar-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
                    .pillar-value { font-size: 16px; font-weight: 700; color: #fff; }
                    .pillar-sub { font-size: 11px; color: #475569; margin-top: 2px; }
                    
                    /* PLANETS TABLE */
                    .planets-table { width: 100%; border-collapse: collapse; }
                    .planets-table thead tr { border-bottom: 2px solid #1e293b; }
                    .planets-table th { text-align:left; font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px; }
                    .planets-table tbody tr { border-bottom: 1px solid #0f172a; }
                    .planets-table tbody tr:hover { background: rgba(255,255,255,.02); }
                    .planets-table td { padding: 10px 12px; font-size: 13px; }
                    .planet-symbol { font-size: 18px; margin-right: 6px; }
                    .planet-name { font-weight: 600; color: #f1f5f9; }
                    .planet-sign { color: #f59e0b; }
                    .planet-degree { color: #94a3b8; }
                    .planet-house { color: #8b5cf6; text-align: right; }
                    .planet-retro { color: #f43f5e; font-size: 11px; }
                    
                    /* ASPECTS */
                    .aspects-grid { display: flex; flex-direction: column; gap: 6px; }
                    .aspect-row { display:flex; align-items:center; gap:12px; padding: 8px 12px; background:#0f172a; border-radius:8px; font-size: 12px; }
                    .aspect-planet { color:#94a3b8; width: 100px; }
                    .aspect-type { font-weight:700; width: 110px; text-align:center; }
                    .aspect-orb { color:#334155; margin-left:auto; }
                    
                    /* INTERPRETATION */
                    .interpretation { font-size: 13px; line-height: 1.85; color: #cbd5e1; }
                    .interpretation h1, .interpretation h2, .interpretation h3 { color: #f59e0b; font-weight: 700; margin: 20px 0 8px; }
                    .interpretation h1 { font-size: 18px; }
                    .interpretation h2 { font-size: 16px; }
                    .interpretation h3 { font-size: 14px; color: #c4b5fd; }
                    .interpretation p { margin-bottom: 10px; }
                    .interpretation strong { color:#f1f5f9; }
                    
                    /* FOOTER */
                    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #1e293b; text-align:center; font-size: 11px; color: #334155; }
                    
                    /* PRINT */
                    .print-btn { position:fixed; top:20px; right:20px; background:linear-gradient(135deg,#f59e0b,#d97706); color:#0a0600; border:none; border-radius:10px; padding:12px 20px; font-weight:700; font-size:14px; cursor:pointer; z-index:999; display:flex; align-items:center; gap:6px; }
                    @media print {
                        .print-btn { display: none !important; }
                        body { background: white !important; color: #111 !important; }
                        .main-title { color: #b45309 !important; }
                        .section-title { color: #7c3aed !important; }
                        .pillar { background: #f8fafc !important; border-color:#e2e8f0 !important; }
                        .pillar-value { color: #111 !important; }
                        .interpretation { color: #374151 !important; }
                        .aspect-row { background: #f8fafc !important; }
                    }
                `}</style>
            </head>
            <body>
                <button className="print-btn" onClick={() => window.print()}>🖨️ Imprimir / Salvar PDF</button>

                <div className="page">
                    {/* ── HEADER ── */}
                    <div className="header">
                        <div className="logo">
                            <span className="logo-star">✦</span>
                            <span className="logo-text">MAPA ASTRAL</span>
                        </div>
                        <h1 className="main-title">Mapa Natal</h1>
                        <p className="subtitle">Relatório Premium — {profile?.full_name}</p>
                        <p className="birth-info">{birthInfo}</p>
                    </div>

                    {/* ── OS TRÊS PILARES ── */}
                    <div className="section">
                        <h2 className="section-title">Os Três Pilares da Alma</h2>
                        <div className="pillars">
                            <div className="pillar">
                                <div className="pillar-label">☀ Sol (Essência)</div>
                                <div className="pillar-value">{sun?.sign ?? "—"}</div>
                                <div className="pillar-sub">Casa {sun?.house}</div>
                            </div>
                            <div className="pillar">
                                <div className="pillar-label">☽ Lua (Emoção)</div>
                                <div className="pillar-value">{moon?.sign ?? "—"}</div>
                                <div className="pillar-sub">Casa {moon?.house}</div>
                            </div>
                            <div className="pillar">
                                <div className="pillar-label">↑ Ascendente</div>
                                <div className="pillar-value">{chartData.ascendant?.sign ?? "—"}</div>
                                <div className="pillar-sub">{chartData.ascendant?.degree?.toFixed(1)}°</div>
                            </div>
                            <div className="pillar">
                                <div className="pillar-label">MC Meio do Céu</div>
                                <div className="pillar-value">{chartData.midheaven?.sign ?? "—"}</div>
                                <div className="pillar-sub">{chartData.midheaven?.degree?.toFixed(1)}°</div>
                            </div>
                            <div className="pillar" style={{ gridColumn: "2 / 4" }}>
                                <div className="pillar-label">Fase Lunar de Nascimento</div>
                                <div className="pillar-value">{chartData.moonPhase?.emoji} {chartData.moonPhase?.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* ── PLANETAS ── */}
                    <div className="section">
                        <h2 className="section-title">Distribuição Planetária</h2>
                        <table className="planets-table">
                            <thead>
                                <tr>
                                    <th>Planeta</th>
                                    <th>Signo</th>
                                    <th>Grau</th>
                                    <th style={{ textAlign: "right" }}>Casa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.planets?.map((p) => (
                                    <tr key={p.planet}>
                                        <td>
                                            <span className="planet-symbol">{PLANET_SYMBOLS[p.planet] ?? "★"}</span>
                                            <span className="planet-name">{p.planet}</span>
                                            {p.retrograde && <span className="planet-retro"> ℞</span>}
                                        </td>
                                        <td className="planet-sign">{p.sign}</td>
                                        <td className="planet-degree">{p.degree.toFixed(1)}°</td>
                                        <td className="planet-house">Casa {p.house}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── ASPECTOS ── */}
                    {chartData.aspects && chartData.aspects.length > 0 && (
                        <div className="section">
                            <h2 className="section-title">Aspectos Principais</h2>
                            <div className="aspects-grid">
                                {chartData.aspects.slice(0, 12).map((a, i) => (
                                    <div key={i} className="aspect-row">
                                        <span className="aspect-planet">{a.planet1}</span>
                                        <span className="aspect-type" style={{ color: { "Trígono": "#22c55e", "Sextil": "#67e8f9", "Quadratura": "#f43f5e", "Oposição": "#f97316", "Conjunção": "#f59e0b" }[a.type] ?? "#f59e0b" }}>{a.type}</span>
                                        <span className="aspect-planet">{a.planet2}</span>
                                        <span className="aspect-orb">orbe {a.orb}°</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── INTERPRETAÇÃO ── */}
                    {interpretation && (
                        <div className="section">
                            <h2 className="section-title">Interpretação Estelar</h2>
                            <div className="interpretation" dangerouslySetInnerHTML={{
                                __html: interpretation
                                    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                                    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/^- (.+)$/gm, '<li>$1</li>')
                                    .replace(/\n\n/g, '</p><p>')
                                    .replace(/^([^<\n].+)$/gm, m => m.startsWith('<') ? m : `<p>${m}</p>`)
                            }} />
                        </div>
                    )}

                    <div className="footer">
                        © {new Date().getFullYear()} AstroSaaS · Seu Guia Estelar Personalizado
                    </div>
                </div>

                <script dangerouslySetInnerHTML={{
                    __html: `
                    document.querySelector('.print-btn').addEventListener('click', function() { window.print(); });
                ` }} />
            </body>
        </html>
    );
}
