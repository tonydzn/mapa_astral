"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section style={{ padding: "clamp(60px, 10vw, 120px) 24px 80px", position: "relative", zIndex: 1, overflow: "hidden" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "clamp(40px, 8vw, 80px)", alignItems: "center" }} className="md:grid-cols-2">
                <style jsx>{`
                    @media (min-width: 768px) {
                        .md\:grid-cols-2 {
                            grid-template-columns: 1.1fr 0.9fr !important;
                            text-align: left !important;
                        }
                        .md\:items-start {
                            align-items: flex-start !important;
                            justify-content: flex-start !important;
                        }
                        .md\:block {
                            display: block !important;
                        }
                    }
                    @media (max-width: 767px) {
                        .mobile-center-text {
                            text-align: center !important;
                            align-items: center !important;
                        }
                    }
                `}</style>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="md:items-start"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ fontSize: 64, marginBottom: 20, display: "inline-block", filter: "drop-shadow(0 0 30px rgba(245,158,11,.4))" }}
                    >
                        ✦
                    </motion.div>

                    <div className="badge-gold" style={{ marginBottom: 20, width: "fit-content" }}>
                        🌕 Lua Crescente · Sabedoria dos Astros
                    </div>

                    <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
                        Seu Mapa Astral<br />
                        <span className="gradient-text">Personalizado e Completo</span>
                    </h1>

                    <p style={{ fontSize: "clamp(16px,1.5vw,19px)", color: "#94a3b8", maxWidth: 520, marginBottom: 36, lineHeight: 1.7 }}>
                        Descubra quem você veio ser. mapa astral completo, sinastria amorosa e previsões personalizadas para sua jornada.
                    </p>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "inherit" }}>
                        <Link href="/register" className="btn-gold" style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>
                            ✨ Criar meu mapa agora
                        </Link>
                        <a href="#features" className="btn-ghost" style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}>
                            Ver como funciona ↓
                        </a>
                    </div>

                    <p style={{ color: "#334155", fontSize: 13, marginTop: 16 }}>Gratuito · 3 mapas sem cartão · Sem compromisso</p>
                </motion.div>

                {/* Main Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ position: "relative", filter: "drop-shadow(0 0 50px rgba(139,92,246,0.15))" }}
                >
                    <div style={{ position: "absolute", inset: -20, background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)", zIndex: 0 }} />
                    <img
                        src="/images/hero-desktop.png"
                        alt="Mapa Natal Completo - Exemplo de Interpretação Astrológica"
                        style={{ width: "100%", height: "auto", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}
                        className="animate-float"
                    />

                    {/* Floating Mobile Preview for complexity/WOW factor */}
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            bottom: "-10%",
                            left: "-5%",
                            width: "35%",
                            zIndex: 2,
                            display: "none"
                        }}
                        className="md:block"
                    >
                        <img
                            src="/images/hero-mobile.png"
                            alt="Interface do Aplicativo Mapa Astral no Celular"
                            style={{ width: "100%", height: "auto", borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Stats - Now as a bottom bar */}
            <div style={{ maxWidth: 1200, margin: "clamp(60px, 10vw, 100px) auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 40 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 32, justifyContent: "center" }}>
                    {[["12k+", "Mapas gerados"], ["98%", "Satisfação"], ["< 30s", "Tempo de geração"]].map(([v, l], i) => (
                        <motion.div
                            key={l}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            style={{ textAlign: "center" }}
                        >
                            <div className="gradient-text" style={{ fontSize: "clamp(20px, 5vw, 24px)", fontWeight: 800 }}>{v}</div>
                            <div style={{ fontSize: "clamp(10px, 2vw, 12px)", color: "#475569", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
