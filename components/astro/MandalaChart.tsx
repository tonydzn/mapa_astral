"use client";

import { useEffect, useState } from "react";
import type { ChartData } from "@/lib/astro-engine";

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
    useEffect(() => setMounted(true), []);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.48;

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

    // Helper para converter graus astronômicos em coordenadas SVG (ajustado para o Ascendente à esquerda)
    const getPos = (totalDegrees: number, r: number) => {
        // Na astrologia, 0° Áries é o ponto inicial, mas visualmente o Ascendente (casa 1) costuma ficar no lado esquerdo (180°)
        // O motor retorna graus de 0 a 360 começando em Áries.
        // Se temos o Ascendente, rotacionamos o mapa para que ele fique em 180° (esquerda).
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
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: "100%", height: "auto" }}>
            <defs>
                <radialGradient id="gradBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="90%" stopColor="#020617" />
                    <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            {/* Fundo */}
            <circle cx={cx} cy={cy} r={radius} fill="url(#gradBg)" stroke="#1e293b" strokeWidth="1" />

            {/* Anéis de divisão */}
            {[0.95, 0.75, 0.45].map((rPct, i) => (
                <circle key={i} cx={cx} cy={cy} r={radius * rPct} fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray={i === 2 ? "2 2" : ""} />
            ))}

            {/* Divisões dos Signos */}
            {SIGNS_SYMBOLS.map((symbol, i) => {
                const startAngle = i * 30;
                const p1 = getPos(startAngle, radius * 0.75);
                const p2 = getPos(startAngle, radius * 0.95);
                const pText = getPos(startAngle + 15, radius * 0.85);

                return (
                    <g key={i}>
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth="0.5" />
                        <text x={pText.x} y={pText.y + 4} textAnchor="middle" fontSize={size * 0.04} fill="#475569" fontWeight="bold">
                            {symbol}
                        </text>
                    </g>
                );
            })}

            {/* Linhas das Casas (Cuspides) */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30 + 180; // Simplificado: casas iguais a partir do Asc em 180°
                const pCenter = getPos(angle, radius * 0.15);
                const pEdge = getPos(angle, radius * 0.75);
                return (
                    <line key={i} x1={pCenter.x} y1={pCenter.y} x2={pEdge.x} y2={pEdge.y} stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.5" />
                );
            })}

            {/* Aspectos (Somente se houver dados reais) */}
            {data?.aspects.map((aspect, i) => {
                const p1Data = data.planets.find(p => p.planet === aspect.planet1);
                const p2Data = data.planets.find(p => p.planet === aspect.planet2);
                if (!p1Data || !p2Data) return null;

                const pos1 = getPos(getPlanetDegree(p1Data), radius * 0.45);
                const pos2 = getPos(getPlanetDegree(p2Data), radius * 0.45);

                return (
                    <line key={i} x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y}
                        stroke={ASPECT_COLORS[aspect.type] || "#334155"}
                        strokeWidth="0.8"
                        strokeOpacity="0.4"
                    />
                );
            })}

            {/* Planetas */}
            {(data?.planets || []).map((p, i) => {
                const deg = getPlanetDegree(p);
                const pos = getPos(deg, radius * 0.60);
                const color = PLANET_COLORS[p.planet] || "#fff";

                return (
                    <g key={i}>
                        <circle cx={pos.x} cy={pos.y} r={size * 0.035} fill="#020617" stroke={color} strokeWidth="1" filter="url(#glow)" />
                        <text x={pos.x} y={pos.y + (size * 0.012)} textAnchor="middle" fontSize={size * 0.04} fill={color} fontWeight="bold">
                            {PLANET_SYMBOLS[p.planet]}
                        </text>
                        {/* Grau pequeno ao lado do planeta */}
                        <text x={pos.x + (size * 0.04)} y={pos.y - (size * 0.02)} fontSize={size * 0.02} fill="#475569">
                            {Math.floor(p.degree)}°
                        </text>
                    </g>
                );
            })}

            {/* Se for Demo e não tiver dados, mostra alguns planetas fictícios rodando */}
            {!data && Array.from({ length: 6 }).map((_, i) => {
                const deg = i * 60 + demoRot * 0.5;
                const pos = getPos(deg, radius * 0.60);
                return (
                    <circle key={i} cx={pos.x} cy={pos.y} r="4" fill="#f59e0b" filter="url(#glow)" fillOpacity="0.6" />
                );
            })}

            {/* Centro */}
            <circle cx={cx} cy={cy} r={radius * 0.08} fill="#020617" stroke="#8b5cf6" strokeWidth="1" />
            <text x={cx} y={cy + (size * 0.015)} textAnchor="middle" fontSize={size * 0.05} fill="#8b5cf6" filter="url(#glow)">✦</text>

        </svg>
    );
}
