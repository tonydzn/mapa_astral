"use client";

import { useState, useEffect } from "react";

const SIGNS_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const PLANETS_DEMO = [
    { symbol: "☀", color: "#fbbf24" },
    { symbol: "☽", color: "#c4b5fd" },
    { symbol: "☿", color: "#67e8f9" },
    { symbol: "♀", color: "#f9a8d4" },
    { symbol: "♂", color: "#fca5a5" },
    { symbol: "♃", color: "#86efac" },
    { symbol: "♄", color: "#94a3b8" },
    { symbol: "♅", color: "#7dd3fc" },
];

// Pre-calcula posições estáticas do zodíaco (constantes — mesmas em SSR e cliente)
const ZODIAC_POSITIONS = SIGNS_SYMBOLS.map((s, i) => {
    const a = (i * 30 - 90) * Math.PI / 180;
    return { s, x1: 130 + 115 * Math.cos(a), y1: 130 + 115 * Math.sin(a), x2: 130 + 126 * Math.cos(a), y2: 130 + 126 * Math.sin(a), tx: 130 + 108 * Math.cos(a), ty: 130 + 108 * Math.sin(a) + 4 };
});

export default function MandalaChart() {
    const [mounted, setMounted] = useState(false);
    const [rot, setRot] = useState(0);

    useEffect(() => {
        setMounted(true);
        let id: number;
        const loop = () => {
            setRot(r => r + 0.04);
            id = requestAnimationFrame(loop);
        };
        id = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(id);
    }, []);

    const cx = 130, cy = 130;

    // Usa rot=0 no SSR; animação só começa após montagem no cliente
    const rotVal = mounted ? rot : 0;

    const planetPositions = PLANETS_DEMO.map((p, i) => {
        const angle = ((i * 360 / PLANETS_DEMO.length) + rotVal * 0.25) * Math.PI / 180;
        return { ...p, x: cx + 90 * Math.cos(angle), y: cy + 90 * Math.sin(angle) };
    });

    return (
        <svg width="260" height="260" viewBox="0 0 260 260" suppressHydrationWarning>
            <defs>
                <radialGradient id="mBg" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="glow2"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            <circle cx={cx} cy={cy} r="128" fill="url(#mBg)" />
            <circle cx={cx} cy={cy} r="126" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3" />

            {/* Zodiac ring — usa transform CSS para animação, posições são estáticas */}
            <g style={{ transform: `rotate(${rotVal * 0.08}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
                {ZODIAC_POSITIONS.map((z, i) => (
                    <g key={i}>
                        <line x1={z.x1} y1={z.y1} x2={z.x2} y2={z.y2} stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.4" />
                        <text x={z.tx} y={z.ty} textAnchor="middle" fontSize="8" fill="#f59e0b" fillOpacity="0.6">{z.s}</text>
                    </g>
                ))}
            </g>

            {[115, 90, 60, 35].map((r, i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                    stroke={i === 0 ? "#8b5cf6" : "#1e293b"} strokeWidth={i === 0 ? 1 : 0.5} strokeOpacity={i === 0 ? 0.6 : 0.5} />
            ))}

            {planetPositions.map((p1, i) => planetPositions.slice(i + 1).map((p2, j) => (
                <line key={`${i}${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke="#8b5cf6" strokeWidth="0.3" strokeOpacity="0.15" />
            )))}

            {planetPositions.map((p, i) => (
                <g key={i} filter="url(#glow)">
                    <circle cx={p.x} cy={p.y} r="11" fill="#020617" stroke={p.color} strokeWidth="1.2" />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill={p.color}>{p.symbol}</text>
                </g>
            ))}

            <circle cx={cx} cy={cy} r="18" fill="#0a0f1a" stroke="#8b5cf6" strokeWidth="1" filter="url(#glow2)" />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="18" fill="#8b5cf6">✦</text>
        </svg>
    );
}
