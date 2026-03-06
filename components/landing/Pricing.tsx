"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Pricing() {
    return (
        <section id="pricing" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: "center", marginBottom: 48 }}
                >
                    <span className="section-label">Planos</span>
                    <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#fff" }}>
                        Simples e <span className="gradient-text">transparente</span>
                    </h2>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                    {/* Free */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="card"
                        style={{ padding: "32px 28px" }}
                    >
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>GRATUITO</div>
                            <div style={{ fontSize: 42, fontWeight: 800, color: "#fff" }}>R$0</div>
                            <div style={{ color: "#475569", fontSize: 13 }}>Para sempre</div>
                        </div>
                        <div style={{ borderTop: "1px solid #1a2540", paddingTop: 20, marginBottom: 24 }}>
                            {[["✓", "1 mapa astral Parcial", "#22c55e"], ["✓", "Interpretação Ascendente", "#22c55e"], ["✓", "Mood tracker", "#22c55e"], ["✓", "Compartilhamento", "#22c55e"], ["✗", "PDF personalizado", "#334155"], ["✗", "Sinastria", "#334155"], ["✗", "Mapa Completo", "#334155"]].map(([ic, tx, c], i) => (
                                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 14, color: c === "#22c55e" ? "#94a3b8" : "#2d3e5a" }}>
                                    <span style={{ color: c, fontWeight: 700 }}>{ic}</span> {tx}
                                </div>
                            ))}
                        </div>
                        <Link href="/register" className="btn-ghost" style={{ width: "100%", textAlign: "center", display: "block", padding: 13, borderRadius: 10 }}>
                            Começar grátis
                        </Link>
                    </motion.div>

                    {/* Premium */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="card glow-gold"
                        style={{ padding: "32px 28px", borderColor: "rgba(245,158,11,.3)", position: "relative", overflow: "hidden" }}
                    >
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#f59e0b,#ec4899,#8b5cf6)" }} />
                        <div style={{ position: "absolute", top: 14, right: 14 }} className="badge-gold">✨ Popular</div>

                        <div style={{ marginBottom: 20 }}>
                            <div style={{ color: "#f59e0b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>PREMIUM</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                                <div style={{ fontSize: 42, fontWeight: 800, color: "#fff" }}>R$49,90</div>
                                <div style={{ color: "#475569", fontSize: 13, marginBottom: 10 }}>pagamento único</div>
                            </div>
                            <div style={{ color: "#475569", fontSize: 13 }}>Acesso <strong style={{ color: "#f59e0b" }}>vitalício</strong></div>
                        </div>

                        <div style={{ borderTop: "1px solid rgba(245,158,11,.2)", paddingTop: 20, marginBottom: 24 }}>
                            {[["1 Mapa Completo p/ mês"], ["Interpretação Avançada"], ["PDF personalizado"], ["Sinastria amorosa"], ["Previsões mensais"], ["Suporte prioritário"]].map(([tx], i) => (
                                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 14, color: "#cbd5e1" }}>
                                    <span style={{ color: "#f59e0b" }}>✦</span> {tx}
                                </div>
                            ))}
                        </div>
                        <Link href="/register" className="btn-gold" style={{ width: "100%", textAlign: "center", display: "block", padding: 14, borderRadius: 10, fontSize: 15 }}>
                            🚀 Ativar Premium
                        </Link>
                        <p style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 10 }}>Garantia de 7 dias · Pagamento via MP</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
