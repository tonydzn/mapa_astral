"use client";

import { motion } from "framer-motion";

export default function ProductPreview() {
    return (
        <section style={{ padding: "40px 24px", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="card"
                    style={{
                        padding: "8px",
                        background: "rgba(15, 23, 42, 0.6)",
                        boxShadow: "0 0 100px rgba(139, 92, 246, 0.1)",
                        borderRadius: 24,
                        overflow: "hidden"
                    }}
                >
                    <div style={{
                        background: "#020617",
                        borderRadius: 18,
                        overflow: "hidden",
                        aspectRatio: "auto",
                        minHeight: 250,
                        position: "relative"
                    }}>
                        <style jsx>{`
                            @media (min-width: 640px) {
                                div { aspect-ratio: 16/9 !important; }
                            }
                        `}</style>
                        <img
                            src="/images/hero-desktop.png"
                            alt="Interface Preview"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: 0.8
                            }}
                        />
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, #020617, transparent 60%)",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            padding: "24px 20px 40px"
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <span className="badge-violet" style={{ marginBottom: 12 }}>Interface Intuitiva</span>
                                <h3 style={{ color: "#fff", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 700, lineHeight: 1.3 }}>Uma experiência celestial em cada detalhe</h3>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
