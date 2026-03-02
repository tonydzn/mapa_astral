"use client";

import { motion } from "framer-motion";

const features = [
    { icon: "🌌", title: "Mapa Natal Completo", desc: "Posições planetárias precisas com casas astrológicas e aspectos", color: "#f59e0b" },
    { icon: "✨", title: "Interpretação Estelar", desc: "Análise profunda e detalhada das suas tendências e potenciais", color: "#8b5cf6" },
    { icon: "💑", title: "Sinastria Amorosa", desc: "Link viral de compatibilidade astrológica com seu parceiro(a)", color: "#f43f5e" },
    { icon: "🌕", title: "Mood Tracker Lunar", desc: "Registre seu humor e correlacione com as fases da Lua", color: "#c4b5fd" },
    { icon: "📄", title: "PDF Personalizado", desc: "Mapa natal em PDF bonito para baixar e guardar", color: "#10b981" },
    { icon: "🔮", title: "Trânsitos Mensais", desc: "Previsões personalizadas com base nos trânsitos planetários", color: "#67e8f9" },
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
                            style={{ padding: "24px", transition: "all .3s", cursor: "default" }}
                            whileHover={{ y: -5, borderColor: `${f.color}40`, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}
                        >
                            <div style={{ fontSize: 36, marginBottom: 14, filter: `drop-shadow(0 0 8px ${f.color}60)` }}>{f.icon}</div>
                            <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
