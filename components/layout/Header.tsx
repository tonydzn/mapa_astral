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
            padding: "0 16px" // Reduzido para mobile
        }}>
            <div style={{
                maxWidth: 1200,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // Melhor distribuição
                gap: 12,
                height: 60
            }}>
                {/* Logo & Back button */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {showBack && (
                        <Link href="/dashboard" style={{
                            color: "#475569",
                            textDecoration: "none",
                            fontSize: 22,
                            display: "flex",
                            alignItems: "center",
                            transition: "color .2s",
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                            ←
                        </Link>
                    )}
                    <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                        <span style={{ color: "#f59e0b", fontSize: 18, filter: "drop-shadow(0 0 8px rgba(245,158,11,.5))" }}>✦</span>
                        <span style={{ color: "#f59e0b", fontWeight: 800, letterSpacing: 1, fontSize: 13, whiteSpace: "nowrap" }}>Mapa Astral</span>
                    </Link>
                </div>

                {/* Title and Subtitle - Oculto em telas pequenas se houver tabs */}
                {(title || subtitle) && (
                    <div style={{
                        flex: 1,
                        minWidth: 0,
                        display: tabs && typeof window !== "undefined" && window.innerWidth < 640 ? "none" : "block"
                    }}>
                        {title && <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 14, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>}
                        {subtitle && <div style={{ color: "#334155", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div>}
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
                        padding: "4px 0"
                    }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={`nav-pill ${activeTab === tab.key ? "active" : ""}`}
                                onClick={() => onTabChange(tab.key)}
                                style={{ fontSize: 12 }}
                            >
                                {tab.label.split(" ").pop()} {/* Mostra apenas a última palavra/emoji em mobile se necessário */}
                            </button>
                        ))}
                    </nav>
                )}

                {/* Right side */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {!isPremium && onShowPremium && (
                        <button onClick={onShowPremium} className="btn-gold" style={{ padding: "6px 10px", fontSize: 11, borderRadius: 8 }}>
                            ✨ Tornar-se premium
                        </button>
                    )}
                    {isPremium && <span className="badge-gold" style={{ display: typeof window !== "undefined" && window.innerWidth < 480 ? "none" : "inline-block" }}>✦ Premium</span>}

                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#7c3aed,#f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#fff",
                        flexShrink: 0,
                        cursor: "pointer"
                    }} onClick={handleLogout} title="Sair">
                        {firstName[0]?.toUpperCase() || "A"}
                    </div>
                </div>
            </div>
        </header>
    );
}
