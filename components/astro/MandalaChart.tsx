"use client";

import { useEffect, useState } from "react";
import type { ChartData } from "@/lib/astro-engine";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    data?: ChartData;
    size?: number;
}

const SIGNS_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const SIGNS_NAMES = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];

const PLANET_SYMBOLS: Record<string, string> = {
    "Sol": "☀", "Lua": "☽", "Mercúrio": "☿", "Vênus": "♀", "Marte": "♂",
    "Júpiter": "♃", "Saturno": "♄", "Urano": "♅", "Netuno": "♆", "Plutão": "♇",
};

const PLANET_COLORS: Record<string, string> = {
    "Sol": "#fbbf24", "Lua": "#c4b5fd", "Mercúrio": "#67e8f9", "Vênus": "#f9a8d4",
    "Marte": "#fca5a5", "Júpiter": "#86efac", "Saturno": "#94a3b8", "Urano": "#7dd3fc",
    "Netuno": "#a5b4fc", "Plutão": "#e879f9",
};

const ASPECT_COLORS: Record<string, string> = {
    "Conjunção": "#fbbf24",
    "Sextil": "#60a5fa",
    "Quadratura": "#f87171",
    "Trígono": "#34d399",
    "Oposição": "#f472b6",
    "Quincúncio": "#a78bfa",
};

export default function MandalaChart({ data, size = 320 }: Props) {
    const [mounted, setMounted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => setMounted(true), []);

    // Se não houver dados, gera um "demo" rotativo
    const [demoRot, setDemoRot] = useState(0);
    useEffect(() => {
        if (data) return;
        let id = requestAnimationFrame(function loop() {
            setDemoRot(r => r + 0.1);
            id = requestAnimationFrame(loop);
        });
        return () => cancelAnimationFrame(id);
    }, [data]);

    if (!mounted) return <div style={{ width: size, height: size }} />;

    const renderSVG = (s: number, full: boolean = false) => {
        const cx = s / 2;
        const cy = s / 2;
        const radius = s * 0.48;

        const getPos = (totalDegrees: number, r: number) => {
            const offset = data ? (data.ascendant.degree + SIGNS_NAMES.indexOf(data.ascendant.sign) * 30) - 180 : demoRot;
            const angle = (totalDegrees - offset) * Math.PI / 180;
            return {
                x: cx + r * Math.cos(angle),
                y: cy + r * Math.sin(angle)
            };
        };

        const getPlanetDegree = (p: { sign: string; degree: number }) => {
            const signIndex = SIGNS_NAMES.indexOf(p.sign);
            return signIndex * 30 + p.degree;
        };

        return (
            <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ maxWidth: "100%", height: "auto", display: "block" }}>
                <defs>
                    <radialGradient id={`gradBg-${full}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="90%" stopColor="#020617" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </radialGradient>
                    <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>

                <circle cx={cx} cy={cy} r={radius} fill={`url(#gradBg-${full})`} stroke="#1e293b" strokeWidth="1" />

                {[0.95, 0.75, 0.45].map((rPct, i) => (
                    <circle key={i} cx={cx} cy={cy} r={radius * rPct} fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray={i === 2 ? "2 2" : ""} />
                ))}

                {SIGNS_SYMBOLS.map((symbol, i) => {
                    const startAngle = i * 30;
                    const p1 = getPos(startAngle, radius * 0.75);
                    const p2 = getPos(startAngle, radius * 0.95);
                    const pText = getPos(startAngle + 15, radius * 0.85);

                    return (
                        <g key={i}>
                            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth="0.5" />
                            <text x={pText.x} y={pText.y + (s * 0.012)} textAnchor="middle" fontSize={s * 0.04} fill="#475569" fontWeight="bold">
                                {symbol}
                            </text>
                        </g>
                    );
                })}

                {Array.from({ length: 12 }).map((_, i) => {
                    const angle = i * 30 + 180;
                    const pCenter = getPos(angle, radius * 0.15);
                    const pEdge = getPos(angle, radius * 0.75);
                    return (
                        <line key={i} x1={pCenter.x} y1={pCenter.y} x2={pEdge.x} y2={pEdge.y} stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.5" />
                    );
                })}

                {data?.aspects.map((aspect, i) => {
                    const p1Data = data.planets.find(p => p.planet === aspect.planet1);
                    const p2Data = data.planets.find(p => p.planet === aspect.planet2);
                    if (!p1Data || !p2Data) return null;

                    const pos1 = getPos(getPlanetDegree(p1Data), radius * 0.45);
                    const pos2 = getPos(getPlanetDegree(p2Data), radius * 0.45);

                    return (
                        <line key={i} x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y}
                            stroke={ASPECT_COLORS[aspect.type] || "#334155"}
                            strokeWidth={full ? 1.2 : 0.8}
                            strokeOpacity="0.4"
                        />
                    );
                })}

                {(data?.planets || []).map((p, i) => {
                    const deg = getPlanetDegree(p);
                    const pos = getPos(deg, radius * 0.60);
                    const color = PLANET_COLORS[p.planet] || "#fff";

                    return (
                        <g key={i}>
                            <circle cx={pos.x} cy={pos.y} r={s * 0.035} fill="#020617" stroke={color} strokeWidth="1" filter="url(#glow)" />
                            <text x={pos.x} y={pos.y + (s * 0.012)} textAnchor="middle" fontSize={s * 0.04} fill={color} fontWeight="bold">
                                {PLANET_SYMBOLS[p.planet]}
                            </text>
                            <text x={pos.x + (s * 0.04)} y={pos.y - (s * 0.02)} fontSize={s * 0.02} fill="#475569">
                                {Math.floor(p.degree)}°
                            </text>
                        </g>
                    );
                })}

                {!data && Array.from({ length: 6 }).map((_, i) => {
                    const deg = i * 60 + demoRot * 0.5;
                    const pos = getPos(deg, radius * 0.60);
                    return (
                        <circle key={i} cx={pos.x} cy={pos.y} r="4" fill="#f59e0b" filter="url(#glow)" fillOpacity="0.6" />
                    );
                })}

                <circle cx={cx} cy={cy} r={radius * 0.08} fill="#020617" stroke="#8b5cf6" strokeWidth="1" />
                <text x={cx} y={cy + (s * 0.015)} textAnchor="middle" fontSize={s * 0.05} fill="#8b5cf6" filter="url(#glow)">✦</text>
            </svg>
        );
    };

    return (
        <div style={{ position: "relative", width: size, margin: "0 auto" }}>
            {/* Botão de Ampliar */}
            <button
                onClick={() => setIsFullscreen(true)}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: "8px",
                    color: "#f59e0b",
                    padding: "6px",
                    cursor: "pointer",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(15,23,42,0.6)")}
                title="Ampliar Mapa"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
            </button>

            {renderSVG(size)}

            {/* Overlay Fullscreen */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999,
                            background: "rgba(2,6,23,0.98)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 24
                        }}
                    >
                        {/* Botão Fechar */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            style={{
                                position: "absolute",
                                top: 32,
                                right: 32,
                                background: "none",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "50%",
                                color: "#fff",
                                width: 44,
                                height: 44,
                                cursor: "pointer",
                                fontSize: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            ✕
                        </button>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
                        >
                            <h2 style={{ color: "#f59e0b", fontSize: 20, fontWeight: 700, letterSpacing: 1, margin: 0 }}>
                                {data ? "Mapa Astral Detalhado" : "Mandala Cósmica"}
                            </h2>

                            {renderSVG(Math.min(window.innerWidth - 80, window.innerHeight - 150), true)}

                            <p style={{ color: "#475569", fontSize: 13, textAlign: "center", maxWidth: 400 }}>
                                Explore as conexões planetárias e divisões de casas do seu nascimento em alta resolução.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
