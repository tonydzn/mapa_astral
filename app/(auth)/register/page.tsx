"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
        setLoading(true); setError("");

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email, password,
            options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` },
        });

        if (signUpError) { setError(signUpError.message); setLoading(false); return; }

        if (!signUpData.session) {
            setEmailSent(email); setSuccess(true); setLoading(false); return;
        }
        router.push("/dashboard"); router.refresh(); setLoading(false);
    }

    if (success && emailSent) {
        return (
            <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#020617" }}>
                <div className="card animate-scale-in" style={{ maxWidth: 440, width: "100%", padding: "40px 36px", textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 20 }}>✉️</div>
                    <h2 style={{ color: "#f59e0b", fontWeight: 800, fontSize: 22, marginBottom: 12 }}>Verifique seu email!</h2>
                    <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                        Enviamos um link de confirmação para <strong style={{ color: "#f1f5f9" }}>{emailSent}</strong>. Clique no link para ativar sua conta.
                    </p>
                    <div style={{ background: "rgba(245,158,11,.05)", border: "1px solid rgba(245,158,11,.15)", borderRadius: 10, padding: "14px 16px", textAlign: "left", marginBottom: 24 }}>
                        <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💡 Dica de desenvolvimento</p>
                        <p style={{ color: "#475569", fontSize: 12, lineHeight: 1.7 }}>
                            Desabilite confirmação em:<br />
                            <span style={{ color: "#64748b" }}>Supabase → Authentication → Providers → Email</span><br />
                            Desmarque <strong style={{ color: "#94a3b8" }}>"Confirm email"</strong>
                        </p>
                    </div>
                    <Link href="/login" className="btn-gold" style={{ padding: "12px 32px", borderRadius: 10 }}>Ir para o Login →</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "#020617", position: "relative" }}>
            <div className="ambient">
                <div className="blob" style={{ top: "-10%", left: "20%", width: 500, height: 500, background: "radial-gradient(circle,rgba(139,92,246,.06),transparent)" }} />
                <div className="blob" style={{ bottom: 0, right: "10%", width: 300, height: 300, background: "radial-gradient(circle,rgba(245,158,11,.04),transparent)" }} />
            </div>

            <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }} className="animate-scale-in">
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#f59e0b", fontSize: 24, filter: "drop-shadow(0 0 12px rgba(245,158,11,.5))" }}>✦</span>
                        <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 20, letterSpacing: 3 }}>Mapa Astral</span>
                    </Link>
                    <h1 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 24, marginTop: 28, marginBottom: 6 }}>Criar conta gratuita</h1>
                    <p style={{ color: "#475569", fontSize: 14 }}>3 mapas grátis · Sem cartão necessário</p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 13, marginBottom: 7, fontWeight: 500 }} htmlFor="name">Nome completo</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
                                placeholder="Como você se chama?" required className="input-dark" />
                        </div>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 13, marginBottom: 7, fontWeight: 500 }} htmlFor="email">Email</label>
                            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com" required className="input-dark" />
                        </div>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 13, marginBottom: 7, fontWeight: 500 }} htmlFor="password">Senha</label>
                            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres" required minLength={6} className="input-dark" />
                        </div>

                        {error && (
                            <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-gold" style={{ padding: 14, borderRadius: 10, fontSize: 15, marginTop: 4 }}>
                            {loading ? "Criando conta..." : "🚀 Criar minha conta"}
                        </button>
                        <p style={{ textAlign: "center", color: "#2d3e5a", fontSize: 12 }}>
                            Ao criar conta, você concorda com nossos termos.
                        </p>
                    </form>

                    <div style={{ borderTop: "1px solid #1a2540", marginTop: 20, paddingTop: 20, textAlign: "center" }}>
                        <span style={{ color: "#334155", fontSize: 14 }}>Já tem conta? </span>
                        <Link href="/login" style={{ color: "#f59e0b", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>Entrar →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
