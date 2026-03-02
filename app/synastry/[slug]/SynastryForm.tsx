"use client";

import { useState } from "react";

interface Props {
    linkId: string;
    ownerName: string;
}

export default function SynastryForm({ linkId, ownerName }: Props) {
    const [form, setForm] = useState({ name: "", birth_date: "", birth_time: "", birth_place: "" });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    async function handleSubmit() {
        if (!form.name || !form.birth_date || !form.birth_place) return;
        setLoading(true);
        const res = await fetch("/api/synastry/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkId, ...form }),
        });
        const data = await res.json();
        if (res.ok) {
            setScore(data.compatibility_score);
            setDone(true);
        }
        setLoading(false);
    }

    if (done) return (
        <div style={{ textAlign: "center", padding: "20px 24px 60px", maxWidth: 520, margin: "0 auto" }}>
            <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, padding: 40 }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🌟</div>
                <h2 style={{ color: "#f59e0b", marginTop: 8, fontSize: 22 }}>Compatibilidade Revelada!</h2>
                {score && <div style={{ fontSize: 56, color: "#f59e0b", fontWeight: "bold", margin: "16px 0" }}>{score}%</div>}
                <p style={{ color: "#94a3b8", marginTop: 8, fontSize: 14 }}>
                    {ownerName} receberá a análise completa de compatibilidade entre vocês.
                </p>
                <a href="/" style={{ display: "inline-block", marginTop: 24, padding: "14px 36px", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#020617", borderRadius: 10, fontWeight: "bold", fontSize: 14, textDecoration: "none" }}>
                    Quero meu próprio mapa natal →
                </a>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px 60px" }}>
            <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid #1e293b", borderRadius: 16, padding: 32 }}>
                <h2 style={{ color: "#e2e8f0", marginBottom: 24, fontSize: 20 }}>Seus dados de nascimento</h2>
                {[
                    { key: "name", label: "Seu nome", type: "text", placeholder: "Como você se chama?" },
                    { key: "birth_date", label: "Data de nascimento", type: "date", placeholder: "" },
                    { key: "birth_time", label: "Hora (aprox.)", type: "time", placeholder: "" },
                    { key: "birth_place", label: "Cidade de nascimento", type: "text", placeholder: "São Paulo, SP" },
                ].map(f => (
                    <div key={f.key} style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>{f.label}</label>
                        <input
                            type={f.type}
                            value={form[f.key as keyof typeof form]}
                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="input-dark"
                        />
                    </div>
                ))}
                <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14, borderRadius: 10, fontSize: 15, marginTop: 8 }}>
                    {loading ? "Calculando..." : "✨ Revelar nossa compatibilidade"}
                </button>
                <p style={{ color: "#64748b", fontSize: 11, textAlign: "center", marginTop: 12 }}>
                    Seus dados são usados apenas para o cálculo astrológico
                </p>
            </div>
        </div>
    );
}
