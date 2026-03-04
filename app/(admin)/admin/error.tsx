"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Admin Area Error:", error);
    }, [error]);

    return (
        <div style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#020617",
            padding: 24,
            textAlign: "center"
        }}>
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: 32, borderRadius: 16, maxWidth: 480 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
                    Erro inesperado no Painel Admin
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                    Houve um problema de carregamento no servidor ou falha no banco de dados.
                    Verifique o log do Vercel e se a variável <strong>SUPABASE_SERVICE_ROLE_KEY</strong> está configurada na produção.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <button
                        onClick={() => reset()}
                        className="btn-gold"
                        style={{ padding: "10px 20px" }}
                    >
                        Tentar Novamente
                    </button>
                    <Link href="/dashboard" className="btn-ghost" style={{ padding: "10px 20px" }}>
                        Voltar ao App
                    </Link>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div style={{ marginTop: 24, padding: 12, background: "rgba(0,0,0,0.5)", borderRadius: 8, textAlign: "left" }}>
                        <code style={{ color: "#ef4444", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                            {error.message || "Erro desconhecido"}
                            {error.digest && `\nDigest: ${error.digest}`}
                        </code>
                    </div>
                )}
            </div>
        </div>
    );
}
