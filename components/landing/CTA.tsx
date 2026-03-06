"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
    return (
        <section style={{ padding: "80px 24px 100px", textAlign: "center", position: "relative", zIndex: 1 }}>
            <motion.div
                initial={{ opacity: 0.5, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ maxWidth: 560, margin: "0 auto" }}
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ fontSize: 60, marginBottom: 20 }}
                >
                    🌌
                </motion.div>
                <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
                    Pronto para se descobrir <span className="gradient-text">nos astros</span>?
                </h2>
                <p style={{ color: "#64748b", marginBottom: 32, fontSize: 16 }}>
                    Comece agora, grátis. Seu mapa natal completo em menos de 30 segundos.
                </p>
                <Link href="/register" className="btn-gold" style={{ padding: "16px 48px", fontSize: 17, borderRadius: 14 }}>
                    ✨ Criar meu mapa gratuitamente
                </Link>
            </motion.div>
        </section>
    );
}
