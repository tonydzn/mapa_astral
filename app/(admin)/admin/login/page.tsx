"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
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

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
            setError("Credenciais inválidas.");
            setLoading(false);
            return;
        }

        // Verify admin status
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setError("Erro de autenticação."); setLoading(false); return; }

        const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();

        if (!profile?.is_admin) {
            await supabase.auth.signOut();
            setError("Acesso negado. Esta conta não tem privilégios de admin.");
            setLoading(false);
            return;
        }

        router.push("/admin/dashboard");
        router.refresh();
    }

    return (
        <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", padding: "24px" }}>
            {/* Ambient glow */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.07), transparent)", filter: "blur(60px)" }} />
            </div>

            <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <span style={{ fontSize: 40, color: "#f59e0b", filter: "drop-shadow(0 0 20px rgba(245,158,11,.5))" }}>⚙️</span>
                    <h1 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 28, marginTop: 16, marginBottom: 6 }}>Painel Admin</h1>
                    <p style={{ color: "#475569", fontSize: 14 }}>Acesso restrito a administradores</p>
                </div>

                <div className="card" style={{ padding: 36 }}>
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 13, marginBottom: 7, fontWeight: 500 }}>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="admin@email.com" required className="input-dark" />
                        </div>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 13, marginBottom: 7, fontWeight: 500 }}>Senha</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••" required className="input-dark" />
                        </div>

                        {error && (
                            <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-gold" style={{ padding: 14, borderRadius: 10, fontSize: 15, marginTop: 4 }}>
                            {loading ? "Verificando..." : "Entrar como Admin →"}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: "center", marginTop: 20, color: "#1e293b", fontSize: 12 }}>
                    Área restrita · Mapa Astral Admin
                </p>
            </div>
        </div>
    );
}
