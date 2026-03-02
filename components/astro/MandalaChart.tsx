"use client";

import { useEffect, useState, useRef } from "react";
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
    const [hoveredPlanet, setHoveredPlanet] = useState<any>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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

    // Esc key listener
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFullscreen(false);
        };
        if (isFullscreen) {
            window.addEventListener("keydown", handleEsc);
            // Bloqueia scroll do body quando em fullscreen
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [isFullscreen]);

    if (!mounted) return <div style={{ width: "100%", maxWidth: size, aspectRatio: "1", margin: "0 auto" }} />;

    const renderSVG = (s: number, full: boolean = false) => {
        const cx = s / 2;
        const cy = s / 2;
        const radius = s * 0.48;

        const getPos = (totalDegrees: number, r: number) => {
            const offset = data ? (data.ascendant.degree + SIGNS_NAMES.indexOf(data.ascendant.sign) * 30) - 180 : demoRot / 2;
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

                {/* Base Ring Group */}
                <motion.circle
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    cx={cx} cy={cy} r={radius} fill={`url(#gradBg-${full})`} stroke="#1e293b" strokeWidth="1"
                />

                {/* Internal Rings */}
                {[0.95, 0.75, 0.45].map((rPct, i) => (
                    <motion.circle
                        key={i}
                        initial={{ opacity: 0, r: 0 }}
                        animate={{ opacity: 1, r: radius * rPct }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        cx={cx} cy={cy} fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray={i === 2 ? "2 2" : ""}
                    />
                ))}

                {/* Signs divisions and symbols */}
                {SIGNS_SYMBOLS.map((symbol, i) => {
                    const startAngle = i * 30;
                    const p1 = getPos(startAngle, radius * 0.75);
                    const p2 = getPos(startAngle, radius * 0.95);
                    const pText = getPos(startAngle + 15, radius * 0.85);

                    return (
                        <g key={i}>
                            <motion.line
                                initial={{ strokeOpacity: 0 }}
                                animate={{ strokeOpacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth="0.5"
                            />
                            <text x={pText.x} y={pText.y + (s * 0.012)} textAnchor="middle" fontSize={s * 0.04} fill="#475569" fontWeight="bold">
                                {symbol}
                            </text>
                        </g>
                    );
                })}

                {/* Houses structure */}
                {Array.from({ length: 12 }).map((_, i) => {
                    const angle = i * 30 + 180;
                    const pCenter = getPos(angle, radius * 0.15);
                    const pEdge = getPos(angle, radius * 0.75);
                    return (
                        <motion.line
                            key={i}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.5 }}
                            transition={{ delay: 1, duration: 1.5 }}
                            x1={pCenter.x} y1={pCenter.y} x2={pEdge.x} y2={pEdge.y} stroke="#1e293b" strokeWidth="0.5"
                        />
                    );
                })}

                {/* Aspect lines */}
                {data?.aspects.map((aspect, i) => {
                    const p1Data = data.planets.find(p => p.planet === aspect.planet1);
                    const p2Data = data.planets.find(p => p.planet === aspect.planet2);
                    if (!p1Data || !p2Data) return null;

                    const pos1 = getPos(getPlanetDegree(p1Data), radius * 0.45);
                    const pos2 = getPos(getPlanetDegree(p2Data), radius * 0.45);

                    return (
                        <motion.line
                            key={i}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.4 }}
                            transition={{ delay: 2 + i * 0.1, duration: 0.8 }}
                            x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y}
                            stroke={ASPECT_COLORS[aspect.type] || "#334155"}
                            strokeWidth={full ? 1.2 : 0.8}
                        />
                    );
                })}

                {/* Planets group */}
                {(data?.planets || []).map((p, i) => {
                    const deg = getPlanetDegree(p);
                    const pos = getPos(deg, radius * 0.60);
                    const color = PLANET_COLORS[p.planet] || "#fff";

                    return (
                        <motion.g
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 1.5 + i * 0.1 }}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={(e) => {
                                setHoveredPlanet(p);
                                setTooltipPos({ x: pos.x, y: pos.y });
                            }}
                            onMouseLeave={() => setHoveredPlanet(null)}
                        >
                            <circle cx={pos.x} cy={pos.y} r={s * 0.035} fill="#020617" stroke={color} strokeWidth="1" filter="url(#glow)" />
                            <text x={pos.x} y={pos.y + (s * 0.012)} textAnchor="middle" fontSize={s * 0.04} fill={color} fontWeight="bold">
                                {PLANET_SYMBOLS[p.planet]}
                            </text>

                            {/* Static display of degree (small) */}
                            <text x={pos.x + (s * 0.04)} y={pos.y - (s * 0.02)} fontSize={s * 0.02} fill="#475569">
                                {Math.floor(p.degree)}°
                            </text>
                        </motion.g>
                    );
                })}

                {/* Demo planets if no Data */}
                {!data && Array.from({ length: 6 }).map((_, i) => {
                    const deg = i * 60 + demoRot * 0.5;
                    const pos = getPos(deg, radius * 0.60);
                    return (
                        <motion.circle
                            key={i}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2 + i }}
                            cx={pos.x} cy={pos.y} r="4" fill="#f59e0b" filter="url(#glow)"
                        />
                    );
                })}

                {/* Center Star */}
                <circle cx={cx} cy={cy} r={radius * 0.08} fill="#020617" stroke="#8b5cf6" strokeWidth="1" />
                <motion.text
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    x={cx} y={cy + (s * 0.015)} textAnchor="middle" fontSize={s * 0.05} fill="#8b5cf6" filter="url(#glow)"
                >
                    ✦
                </motion.text>
            </svg>
        );
    };

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: size, margin: "0 auto" }}>
            {/* Tooltip Overlay */}
            <AnimatePresence>
                {hoveredPlanet && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "absolute",
                            left: tooltipPos.x + 15,
                            top: tooltipPos.y - 40,
                            background: "rgba(15, 23, 42, 0.95)",
                            backdropFilter: "blur(4px)",
                            border: `1px solid ${PLANET_COLORS[hoveredPlanet.planet]}40`,
                            padding: "6px 10px",
                            borderRadius: "8px",
                            zIndex: 10,
                            pointerEvents: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
                        }}
                    >
                        <div style={{ fontWeight: 700, color: PLANET_COLORS[hoveredPlanet.planet], fontSize: 12 }}>
                            {hoveredPlanet.planet}
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>
                            {hoveredPlanet.sign} {hoveredPlanet.degree.toFixed(1)}° · Casa {hoveredPlanet.house}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Button */}
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

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFullscreen(false)} // Fecha ao clicar no fundo
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999,
                            background: "rgba(2,6,23,0.98)",
                            backdropFilter: "blur(12px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 24,
                            cursor: "zoom-out"
                        }}
                    >
                        {/* Close button - more prominent */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                            style={{
                                position: "absolute",
                                top: 40,
                                right: 40,
                                background: "rgba(245, 158, 11, 0.15)",
                                border: "1px solid rgba(245, 158, 11, 0.4)",
                                borderRadius: "50%",
                                color: "#f59e0b",
                                width: 56,
                                height: 56,
                                cursor: "pointer",
                                fontSize: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                                zIndex: 10000,
                                boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)"
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(245, 158, 11, 0.3)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(245, 158, 11, 0.15)"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                        >
                            ✕
                        </button>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar na mandala
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, cursor: "default" }}
                        >
                            <h2 style={{ color: "#f59e0b", fontSize: 24, fontWeight: 800, letterSpacing: 2, margin: 0, textShadow: "0 0 20px rgba(245,158,11,0.3)" }}>
                                {data ? "MAPA ASTRAL DETALHADO" : "MANDALA CÓSMICA"}
                            </h2>

                            <div style={{ position: "relative" }}>
                                {renderSVG(Math.min(window.innerWidth - 80, window.innerHeight - 150), true)}

                                {/* Fullscreen Tooltips */}
                                <AnimatePresence>
                                    {hoveredPlanet && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{
                                                position: "absolute",
                                                left: "50%",
                                                bottom: 20,
                                                transform: "translateX(-50%)",
                                                background: "rgba(15, 23, 42, 0.9)",
                                                border: `2px solid ${PLANET_COLORS[hoveredPlanet.planet]}`,
                                                padding: "12px 20px",
                                                borderRadius: "14px",
                                                textAlign: "center",
                                                minWidth: 150,
                                                boxShadow: "0 0 30px rgba(0,0,0,0.6)"
                                            }}
                                        >
                                            <div style={{ fontSize: 18, color: PLANET_COLORS[hoveredPlanet.planet], fontWeight: 800 }}>
                                                {hoveredPlanet.planet}
                                            </div>
                                            <div style={{ fontSize: 13, color: "#fff", marginTop: 4 }}>
                                                {hoveredPlanet.sign} {hoveredPlanet.degree.toFixed(2)}°
                                            </div>
                                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                                                Casa {hoveredPlanet.house} · {hoveredPlanet.retrograde ? "Retrógrado" : "Direto"}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <p style={{ color: "#475569", fontSize: 13, textAlign: "center", maxWidth: 400 }}>
                                {data ? "Passe o mouse sobre os astros para ver seus graus e signos precisos." : "Mova o mapa para explorar as energias estelares."}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
