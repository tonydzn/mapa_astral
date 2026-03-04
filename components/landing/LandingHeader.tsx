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
            <div style={{
                maxWidth: 1140,
                margin: "0 auto",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
                    <span style={{ fontSize: 22, color: "#f59e0b", filter: "drop-shadow(0 0 12px rgba(245,158,11,.5))" }} className="animate-pulse-glow">✦</span>
                    <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 18, letterSpacing: 3 }}>Mapa Astral</span>
                </Link>

                {/* Nav central - ONLY visible on desktop, using CSS not inline style to avoid override */}
                <nav className="landing-nav-center">
                    {[["#features", "Recursos"], ["#pricing", "Planos"], ["#testimonials", "Depoimentos"]].map(([href, label]) => (
                        <a key={href} href={href} style={{ color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>{label}</a>
                    ))}
                </nav>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    <Link href="/login" className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>Entrar</Link>
                    <Link href="/register" className="btn-gold" style={{ padding: "9px 14px", fontSize: 13 }}>
                        <span className="hidden sm:inline">Começar grátis →</span>
                        <span className="sm:hidden">Começar</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
