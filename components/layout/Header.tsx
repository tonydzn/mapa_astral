"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Tab {
    key: string;
    label: string;
}

interface HeaderProps {
    showBack?: boolean;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    activeTab?: string;
    tabs?: Tab[];
    onTabChange?: (key: string) => void;
    profile?: {
        full_name: string | null;
        is_premium: boolean;
    } | null;
    onShowPremium?: () => void;
}

export default function Header({
    showBack = false,
    title,
    subtitle,
    activeTab,
    tabs,
    onTabChange,
    profile,
    onShowPremium
}: HeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    const isPremium = profile?.is_premium ?? false;
    const firstName = profile?.full_name?.split(" ")[0] ?? "Astronauta";

    return (
        <header style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            borderBottom: "1px solid rgba(255,255,255,.05)",
            background: "rgba(2,6,23,.9)",
            backdropFilter: "blur(20px)",
            padding: "16px 24px" // Mais respiro lateral e vertical
        }}>
            <div style={{
                maxWidth: 1200,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20, // Maior espaço entre os blocos
                minHeight: 68,
                height: "auto"
            }}>
                {/* Logo & Back button */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {showBack && (
                        <Link href="/dashboard" style={{
                            color: "#64748b",
                            textDecoration: "none",
                            fontSize: 24, // Seta de voltar um pouco maior
                            display: "flex",
                            alignItems: "center",
                            transition: "color .2s",
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                            ←
                        </Link>
                    )}
                    <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginRight: 16 }}>
                        <span style={{ color: "#f59e0b", fontSize: 24, filter: "drop-shadow(0 0 8px rgba(245,158,11,.5))" }}>✦</span>
                        <span className="hidden sm:inline-block" style={{ color: "#f59e0b", fontWeight: 800, letterSpacing: 1.5, fontSize: 16, whiteSpace: "nowrap" }}>Mapa Astral</span>
                    </Link>
                </div>

                {/* Title and Subtitle - Oculto em telas pequenas se houver tabs */}
                {(title || subtitle) && (
                    <div className={tabs ? "hidden sm:block" : "block"} style={{
                        flex: 1,
                        minWidth: 0,
                    }}>
                        {title && <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: 18, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>}
                        {subtitle && <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div>}
                    </div>
                )}

                {/* Nav tabs - Scrollable on mobile */}
                {tabs && onTabChange && (
                    <nav style={{
                        display: "flex",
                        gap: 4,
                        flex: title ? undefined : 1,
                        overflowX: "auto",
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        padding: "8px 0",
                        justifyContent: "center" // Centraliza as abas
                    }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={`nav-pill ${activeTab === tab.key ? "active" : ""}`}
                                onClick={() => onTabChange(tab.key)}
                                style={{ fontSize: 14, padding: "10px 20px" }}
                            >
                                <span className="sm:hidden">{tab.label.split(" ")[0]} {tab.label.split(" ").slice(1, 2)}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                )}

                {/* Right side */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                    {!isPremium && onShowPremium && (
                        <button onClick={onShowPremium} className="btn-gold" style={{ padding: "10px 18px", fontSize: 14, borderRadius: 8, width: "auto" }}>
                            <span className="hidden sm:inline">✨ Tornar-se premium</span>
                            <span className="sm:hidden">✨ Premium</span>
                        </button>
                    )}
                    {isPremium && <span className="badge-gold hidden min-[480px]:inline-block">✦ Premium</span>}

                    <div style={{
                        width: 42, // Avatar maior
                        height: 42,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#7c3aed,#f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
                        flexShrink: 0,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }} onClick={handleLogout} title="Sair">
                        {firstName[0]?.toUpperCase() || "A"}
                    </div>
                </div>
            </div>
        </header>
    );
}
