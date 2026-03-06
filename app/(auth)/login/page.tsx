"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message === "Invalid login credentials"
                ? "Email ou senha incorretos."
                : error.message);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
        setLoading(false);
    }

    return (
        <div style={{ minHeight: "100dvh", display: "flex", background: "#020617" }}>

            {/* Left panel — decorative */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "none" }} className="md-show">
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0518 0%, #07091a 100%)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
                    <span style={{ fontSize: 80, marginBottom: 24, filter: "drop-shadow(0 0 30px rgba(245,158,11,.4))" }} className="animate-float">✦</span>
                    <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 32, textAlign: "center", marginBottom: 16 }}>
                        O cosmos te espera
                    </h2>
                    <p style={{ color: "#475569", textAlign: "center", lineHeight: 1.8, maxWidth: 360 }}>
                        Mapas natais completos, sinastria amorosa e previsões personalizadas para seu autoconhecimento.
                    </p>
                    <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 14 }}>
                        {["🌌 Mapa natal com posições planetárias precisas", "✨ Interpretação de Mapa Astral Profunda", "💑 Sinastria amorosa viral", "🌕 Mood tracker com fases lunares"].map(t => (
                            <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, color: "#64748b", fontSize: 14 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Glow circles */}
                <div style={{ position: "absolute", top: "20%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,.12),transparent)", filter: "blur(40px)" }} />
                <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,.08),transparent)", filter: "blur(30px)" }} />
            </div>

            {/* Right panel — form */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", minWidth: 0, position: "relative" }}>
                <div className="ambient">
                    <div className="blob" style={{ top: "10%", right: "10%", width: 300, height: 300, background: "radial-gradient(circle,rgba(139,92,246,.06),transparent)" }} />
                </div>

                <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }} className="animate-scale-in">
                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: 36 }}>
                        <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
                            <span style={{ color: "#f59e0b", fontSize: 24, filter: "drop-shadow(0 0 12px rgba(245,158,11,.5))" }}>✦</span>
                            <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 20, letterSpacing: 3 }}>Mapa Astral</span>
                        </Link>
                        <h1 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 24, marginTop: 28, marginBottom: 6 }}>Bem-vindo de volta</h1>
                        <p style={{ color: "#475569", fontSize: 14 }}>Entre para acessar seus mapas</p>
                    </div>

                    <div className="card" style={{ padding: 32 }}>
                        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div>
                                <label style={{ display: "block", color: "#64748b", fontSize: 13, marginBottom: 7, fontWeight: 500 }} htmlFor="email">Email</label>
                                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="seu@email.com" required className="input-dark" />
                            </div>
                            <div>
                                <label style={{ display: "block", color: "#64748b", fontSize: 13, marginBottom: 7, fontWeight: 500 }} htmlFor="password">Senha</label>
                                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="Sua senha" required className="input-dark" />
                            </div>

                            {error && (
                                <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>
                                    ⚠️ {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-gold" style={{ padding: "13px", borderRadius: 10, fontSize: 15, marginTop: 4 }}>
                                {loading ? "Entrando..." : "Entrar →"}
                            </button>
                        </form>

                        <div style={{ borderTop: "1px solid #1a2540", marginTop: 24, paddingTop: 20, textAlign: "center" }}>
                            <span style={{ color: "#334155", fontSize: 14 }}>Não tem conta? </span>
                            <Link href="/register" style={{ color: "#f59e0b", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>Criar conta grátis →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
