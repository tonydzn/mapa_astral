"use client";

import dynamic from "next/dynamic";
import type { ChartData } from "@/lib/astro-engine";

// These imports are 100% client-only — no SSR pass should touch them
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false, loading: () => <span>⌛</span> }
);
const ChartPDF = dynamic(
    () => import("@/components/astro/ChartPDF"),
    { ssr: false }
);

interface Props {
    data: ChartData;
    userName: string;
    interpretation: string;
    birthTitle: string;
    chartName: string;
    isPremium: boolean;
    onShowPremium: () => void;
}

export default function PDFDownloadButton({ data, userName, interpretation, birthTitle, chartName, isPremium, onShowPremium }: Props) {
    if (isPremium) {
        return (
            <PDFDownloadLink
                document={<ChartPDF data={data} userName={userName} interpretation={interpretation} birthTitle={birthTitle} />}
                fileName={`mapa-astral-${chartName || "meu-mapa"}.pdf`}
                style={{ textDecoration: "none" }}
            >
                {/* @ts-ignore */}
                {({ loading }) => (
                    <button className="btn-secondary" style={{ padding: "9px 18px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                        {loading ? "⌛ Preparando..." : "📥 Baixar PDF"}
                    </button>
                )}
            </PDFDownloadLink>
        );
    }

    return (
        <button onClick={onShowPremium} className="btn-secondary" style={{ padding: "9px 18px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            📥 Baixar PDF <span style={{ fontSize: 10, background: "rgba(245,158,11,.2)", color: "#f59e0b", padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>Premium</span>
        </button>
    );
}
