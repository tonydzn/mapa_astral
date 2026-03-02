import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import type { ChartData } from "@/lib/astro-engine";

interface Props {
    data: ChartData;
    userName: string;
    interpretation: string;
    birthTitle: string; // "Local, Data e Hora"
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: "#020617",
        color: "#f8fafc",
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 30,
        borderBottom: "2px solid #fbbf24",
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fbbf24",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#94a3b8",
        marginBottom: 4,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#8b5cf6",
        marginBottom: 15,
        marginTop: 10,
        borderLeft: "4px solid #8b5cf6",
        paddingLeft: 10,
    },
    text: {
        fontSize: 11,
        lineHeight: 1.7,
        color: "#cbd5e1",
        textAlign: "justify",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 10,
    },
    card: {
        width: "30%",
        padding: 12,
        backgroundColor: "#0f172a",
        borderRadius: 8,
        border: "1px solid #1e293b",
    },
    cardLabel: {
        fontSize: 9,
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 6,
        letterSpacing: 1,
    },
    cardValue: {
        fontSize: 13,
        color: "#fff",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #0f172a",
        paddingVertical: 6,
        alignItems: "center",
    },
    tableLabel: {
        fontSize: 10,
        color: "#fbbf24",
        width: "30%",
        fontWeight: "bold"
    },
    tableValue: {
        fontSize: 10,
        color: "#fff",
        width: "40%",
    },
    tableHouse: {
        fontSize: 9,
        color: "#475569",
        width: "30%",
        textAlign: "right",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: "1px solid #1e293b",
        paddingTop: 15,
        textAlign: "center",
        fontSize: 9,
        color: "#475569",
    },
    moonInfo: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "rgba(139, 92, 246, 0.05)",
        borderRadius: 10,
        border: "1px solid rgba(139, 92, 246, 0.2)",
    }
});

export default function ChartPDF({ data, userName, interpretation, birthTitle }: Props) {
    const sun = data.planets.find(p => p.planet === "Sol");
    const moon = data.planets.find(p => p.planet === "Lua");

    return (
        <Document>
            {/* CAPA E RESUMO */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mapa Astral Natal</Text>
                    <Text style={styles.subtitle}>Relatório Premium preparado para {userName}</Text>
                    <Text style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{birthTitle}</Text>
                </View>

                {/* Pilares */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Os Três Pilares da Alma</Text>
                    <View style={styles.grid}>
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Sol (Essência)</Text>
                            <Text style={styles.cardValue}>{sun?.sign || "—"}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Lua (Emoção)</Text>
                            <Text style={styles.cardValue}>{moon?.sign || "—"}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Ascendente</Text>
                            <Text style={styles.cardValue}>{data.ascendant.sign}</Text>
                        </View>
                    </View>
                    <View style={{ ...styles.grid, marginTop: 15 }}>
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Meio do Céu</Text>
                            <Text style={styles.cardValue}>{data.midheaven.sign}</Text>
                        </View>
                        <View style={{ ...styles.card, width: "63%" }}>
                            <Text style={styles.cardLabel}>Fase Lunar de Nascimento</Text>
                            <Text style={styles.cardValue}>{data.moonPhase.emoji} {data.moonPhase.name}</Text>
                        </View>
                    </View>
                </View>

                {/* Tabela de Planetas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Distribuição Planetária</Text>
                    <View style={{ borderTop: "1px solid #1e293b", marginTop: 5 }}>
                        {data.planets.map((p, i) => (
                            <View key={i} style={styles.tableRow}>
                                <Text style={styles.tableLabel}>{p.planet}</Text>
                                <Text style={styles.tableValue}>{p.sign} {Math.floor(p.degree)}° {p.retrograde ? "℞" : ""}</Text>
                                <Text style={styles.tableHouse}>Casa {p.house}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>© {new Date().getFullYear()} AstroSaaS — Seu Guia Estelar Personalizado · www.astrosass.com</Text>
                </View>
            </Page>

            {/* INTERPRETAÇÃO (Pode ocupar várias páginas) */}
            <Page size="A4" style={styles.page} wrap>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Interpretação Estelar Profunda</Text>
                    <View>
                        {interpretation.split('\n\n').map((para, i) => (
                            <Text key={i} style={[styles.text, { marginBottom: 12 }]}>
                                {para.trim().replace(/^###? /gm, '').replace(/\*\*/g, '')}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>Explore sua jornada cósmica com AstroSaaS</Text>
                </View>
            </Page>
        </Document>
    );
}
