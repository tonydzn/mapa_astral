"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid rgba(255,255,255,.05)",
            background: "#020617",
            padding: "60px 24px 40px",
            position: "relative",
            zIndex: 10,
            overflow: "hidden"
        }}>
            {/* Ambient Background for Footer */}
            <div style={{ position: "absolute", bottom: -100, left: "20%", width: 300, height: 300, background: "radial-gradient(circle,rgba(139,92,246,.03),transparent)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 50 }}>
                    {/* Brand Section */}
                    <div style={{ gridColumn: "span 2" }}>
                        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, textDecoration: "none" }}>
                            <span style={{ color: "#f59e0b", fontSize: 24 }}>✦</span>
                            <span style={{ color: "#f59e0b", fontWeight: 800, letterSpacing: 2, fontSize: 22 }}>Mapa Astral</span>
                        </Link>
                        <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
                            Descubra a sabedoria dos astros e compreenda seu propósito através da astrologia moderna e personalizada.
                        </p>
                    </div>

                    {/* Links - Navegação */}
                    <div>
                        <h4 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Navegação</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                            <li><Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none", fontSize: 14, transition: "color .2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#8b5cf6")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>Painel Inicial</Link></li>
                            <li><Link href="/chart/new" style={{ color: "#64748b", textDecoration: "none", fontSize: 14, transition: "color .2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#8b5cf6")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>Novo Mapa Natal</Link></li>
                            <li><Link href="/synastry/new" style={{ color: "#64748b", textDecoration: "none", fontSize: 14, transition: "color .2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#8b5cf6")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>Sinastria Amorosa</Link></li>
                        </ul>
                    </div>

                    {/* Links - Institucional */}
                    <div>
                        <h4 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Institucional</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                            <li><Link href="#" style={{ color: "#64748b", textDecoration: "none", fontSize: 14, transition: "color .2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#8b5cf6")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>Sobre Nós</Link></li>
                            <li><Link href="#" style={{ color: "#64748b", textDecoration: "none", fontSize: 14, transition: "color .2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#8b5cf6")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>Termos de Uso</Link></li>
                            <li><Link href="#" style={{ color: "#64748b", textDecoration: "none", fontSize: 14, transition: "color .2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#8b5cf6")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>Privacidade</Link></li>
                        </ul>
                    </div>

                    {/* Social/Contact */}
                    <div>
                        <h4 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Conecte-se</h4>
                        <div style={{ display: "flex", gap: 16 }}>
                            <a href="#" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", textDecoration: "none", transition: "all .2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,.1)"; (e.currentTarget as HTMLElement).style.color = "#8b5cf6"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.03)"; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}>
                                📸
                            </a>
                            <a href="#" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", textDecoration: "none", transition: "all .2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,.1)"; (e.currentTarget as HTMLElement).style.color = "#8b5cf6"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.03)"; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}>
                                🐦
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,.03)", paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                    <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>
                        &copy; {new Date().getFullYear()} Mapa Astral. Todos os direitos reservados.
                    </p>
                    <p style={{ color: "#334155", fontSize: 12, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                        Feito com <span style={{ color: "#f43f5e" }}>❤</span> para o autoconhecimento.
                    </p>
                </div>
            </div>
        </footer>
    );
}
