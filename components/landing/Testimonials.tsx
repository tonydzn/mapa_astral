"use client";

import { motion } from "framer-motion";

const testimonials = [
    { name: "Ana Clara", sign: "♏ Escorpião", rating: 5, text: "A interpretação foi tão precisa que me deu arrepios. Nunca havia me visto tão claramente em palavras." },
    { name: "Lucas M.", sign: "♊ Gêmeos", rating: 5, text: "Fiz a sinastria com minha namorada. A compatibilidade e as análises foram simplesmente incríveis." },
    { name: "Fernanda R.", sign: "♓ Peixes", rating: 5, text: "O Mood Tracker me ajudou a entender meus ciclos emocionais de uma forma completamente nova." },
];

export default function Testimonials() {
    return (
        <section id="testimonials" style={{ padding: "80px 24px", position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,.04)" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: "center", marginBottom: 48 }}
                >
                    <span className="section-label">Depoimentos</span>
                    <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#fff" }}>
                        O cosmos fala por <span className="gradient-text">si mesmo</span>
                    </h2>
                </motion.div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="card"
                            style={{ padding: 28 }}
                        >
                            <div style={{ color: "#f59e0b", fontSize: 16, letterSpacing: 2, marginBottom: 14 }}>{"★".repeat(t.rating)}</div>
                            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, fontStyle: "italic", marginBottom: 20 }}>"{t.text}"</p>
                            <div style={{ borderTop: "1px solid #1a2540", paddingTop: 16 }}>
                                <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                                <div style={{ color: "#475569", fontSize: 12, marginTop: 3 }}>{t.sign}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
