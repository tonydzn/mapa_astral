"use client";

import { motion } from "framer-motion";

const features = [
    { icon: "/images/features/natal.png", type: "image", title: "mapa astral Completo", desc: "Posições planetárias precisas com casas astrológicas e aspectos", color: "#f59e0b" },
    { icon: "/images/features/horoscope.png", type: "image", title: "Interpretação Estelar", desc: "Análise profunda e detalhada das suas tendências e potenciais", color: "#8b5cf6" },
    { icon: "/images/features/synastry.png", type: "image", title: "Sinastria Amorosa", desc: "Link viral de compatibilidade astrológica com seu parceiro(a)", color: "#f43f5e" },
    { icon: "🌕", type: "emoji", title: "Mood Tracker Lunar", desc: "Registre seu humor e correlacione com as fases da Lua", color: "#c4b5fd" },
    { icon: "📄", type: "emoji", title: "PDF Personalizado", desc: "mapa astral em PDF bonito para baixar e guardar", color: "#10b981" },
    { icon: "🔮", type: "emoji", title: "Trânsitos Mensais", desc: "Previsões personalizadas com base nos trânsitos planetários", color: "#67e8f9" },
];

export default function Features() {
    return (
        <section id="features" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: "center", marginBottom: 56 }}
                >
                    <span className="section-label">Recursos</span>
                    <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>
                        Tudo que você precisa para <span className="gradient-text-warm">se conhecer</span>
                    </h2>
                    <p style={{ color: "#64748b", maxWidth: 480, margin: "0 auto", fontSize: 15 }}>
                        Astrologia moderna com interpretações profundas para revelar padrões, missões e talentos únicos
                    </p>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="card"
                            style={{ padding: "32px", transition: "all .3s", cursor: "default", overflow: "hidden" }}
                            whileHover={{ y: -8, borderColor: `${f.color}60`, boxShadow: `0 20px 60px ${f.color}15` }}
                        >
                            <div style={{ marginBottom: 20, height: 60, display: "flex", alignItems: "center" }}>
                                {f.type === "image" ? (
                                    <img
                                        src={f.icon}
                                        alt={f.title}
                                        style={{ height: "100%", width: "auto", filter: `drop-shadow(0 0 12px ${f.color}40)` }}
                                    />
                                ) : (
                                    <div style={{ fontSize: 40, filter: `drop-shadow(0 0 8px ${f.color}60)` }}>{f.icon}</div>
                                )}
                            </div>
                            <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{f.title}</h3>
                            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
