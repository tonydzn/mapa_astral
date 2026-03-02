"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative", zIndex: 1 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: 64, marginBottom: 20, display: "inline-block", filter: "drop-shadow(0 0 30px rgba(245,158,11,.4))" }}
                >
                    ✦
                </motion.div>

                <div className="badge-gold" style={{ marginBottom: 20, marginInline: "auto", width: "fit-content" }}>
                    🌕 Lua Crescente · Sabedoria dos Astros
                </div>

                <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
                    Seu Mapa Astral<br />
                    <span className="gradient-text">Personalizado e Completo</span>
                </h1>

                <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#94a3b8", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
                    Descubra quem você veio ser. Mapa natal completo, sinastria amorosa e previsões personalizadas para sua jornada.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/register" className="btn-gold" style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>
                        ✨ Criar meu mapa agora
                    </Link>
                    <a href="#features" className="btn-ghost" style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}>
                        Ver como funciona ↓
                    </a>
                </div>
                <p style={{ color: "#334155", fontSize: 13, marginTop: 16 }}>Gratuito · 3 mapas sem cartão · Sem compromisso</p>

                {/* Stats */}
                <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
                    {[["12k+", "Mapas gerados"], ["98%", "Satisfação"], ["< 30s", "Tempo de geração"]].map(([v, l], i) => (
                        <motion.div
                            key={l}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            style={{ textAlign: "center" }}
                        >
                            <div className="gradient-text" style={{ fontSize: 30, fontWeight: 800 }}>{v}</div>
                            <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{l}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
