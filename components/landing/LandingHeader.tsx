"use client";

import Link from "next/link";

export default function LandingHeader() {
    return (
        <header style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            borderBottom: "1px solid rgba(255,255,255,.05)",
            background: "rgba(2,6,23,.85)",
            backdropFilter: "blur(20px)"
        }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{
                maxWidth: 1140,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <span style={{ fontSize: 22, color: "#f59e0b", filter: "drop-shadow(0 0 12px rgba(245,158,11,.5))" }} className="animate-pulse-glow">✦</span>
                    <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 18, letterSpacing: 3 }}>Mapa Astral</span>
                </Link>

                <nav style={{ display: "flex", gap: 28, position: "absolute", left: "50%", transform: "translateX(-50%)" }} className="hidden md:flex">
                    {[["#features", "Recursos"], ["#pricing", "Planos"], ["#testimonials", "Depoimentos"]].map(([href, label]) => (
                        <a key={href} href={href} style={{ color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>{label}</a>
                    ))}
                </nav>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Link href="/login" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
                        <span className="hidden sm:inline">Entrar</span>
                        <span className="sm:hidden">Login</span>
                    </Link>
                    <Link href="/register" className="btn-gold" style={{ padding: "9px 18px", fontSize: 13 }}>
                        <span className="hidden sm:inline">Começar grátis →</span>
                        <span className="sm:hidden">Começar</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
