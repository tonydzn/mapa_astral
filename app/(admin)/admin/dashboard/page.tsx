import { getAdminStats, getOrders } from "@/actions/admin.actions";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function AdminSidebarItem({ href, label, emoji }: { href: string; label: string; emoji: string }) {
    return null; // handled inline
}

export default async function AdminDashboardPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");

    const [stats, orders] = await Promise.all([
        getAdminStats(),
        getOrders(20),
    ]);

    const freeUsers = stats.totalUsers - stats.premiumUsers;
    const conversionRate = stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : "0";

    const statusColor: Record<string, string> = {
        approved: "#10b981",
        pending: "#f59e0b",
        rejected: "#ef4444",
        cancelled: "#475569",
    };

    const statusLabel: Record<string, string> = {
        approved: "Aprovado",
        pending: "Pendente",
        rejected: "Rejeitado",
        cancelled: "Cancelado",
    };

    const maxRevenue = Math.max(...stats.salesChart.map(d => d.revenue), 1);

    return (
        <div style={{ display: "flex", minHeight: "100dvh" }}>
            {/* Sidebar */}
            <aside style={{
                width: 220, background: "rgba(10,16,31,0.95)", borderRight: "1px solid #1a2540",
                display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0, position: "sticky", top: 0, height: "100dvh"
            }}>
                <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1a2540" }}>
                    <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>⚙️ Admin Panel</span>
                    <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>Mapa Astral</div>
                </div>

                <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {[
                        { href: "/admin/dashboard", emoji: "📊", label: "Dashboard" },
                        { href: "/admin/customers", emoji: "👥", label: "Clientes" },
                        { href: "/admin/plans", emoji: "💎", label: "Planos & Cupons" },
                    ].map(item => (
                        <Link key={item.href} href={item.href} style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                            borderRadius: 8, textDecoration: "none", color: "#94a3b8", fontSize: 14, transition: "all .2s"
                        }}>
                            <span>{item.emoji}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #1a2540" }}>
                    <Link href="/dashboard" style={{ color: "#475569", fontSize: 12, textDecoration: "none" }}>
                        ← Voltar ao app
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22 }}>Dashboard</h1>
                    <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Visão geral do negócio</p>
                </div>

                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {[
                        { label: "Total Clientes", value: stats.totalUsers, emoji: "👥", color: "#8b5cf6" },
                        { label: "Usuários Premium", value: stats.premiumUsers, emoji: "✨", color: "#f59e0b" },
                        { label: "Usuários Free", value: freeUsers, emoji: "🆓", color: "#475569" },
                        { label: "Conversão", value: `${conversionRate}%`, emoji: "📈", color: "#10b981" },
                        { label: "Receita Total", value: `R$ ${stats.totalRevenue.toFixed(2)}`, emoji: "💰", color: "#10b981" },
                        { label: "Receita do Mês", value: `R$ ${stats.monthRevenue.toFixed(2)}`, emoji: "📅", color: "#f59e0b" },
                    ].map(stat => (
                        <div key={stat.label} className="card" style={{ padding: "20px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <span style={{ fontSize: 22 }}>{stat.emoji}</span>
                                <span style={{ color: "#475569", fontSize: 12 }}>{stat.label}</span>
                            </div>
                            <div style={{ color: stat.color, fontWeight: 800, fontSize: 26 }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Sales chart (last 30 days) */}
                <div className="card" style={{ padding: 24, marginBottom: 28 }}>
                    <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>📊 Receita — Últimos 30 dias</h2>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120 }}>
                        {stats.salesChart.map((d, i) => (
                            <div key={i} title={`${d.date}: R$ ${d.revenue.toFixed(2)}`} style={{
                                flex: 1,
                                height: `${Math.round((d.revenue / maxRevenue) * 100)}%`,
                                minHeight: d.revenue > 0 ? 4 : 2,
                                background: d.revenue > 0
                                    ? "linear-gradient(180deg, #f59e0b, #d97706)"
                                    : "rgba(255,255,255,.05)",
                                borderRadius: "3px 3px 0 0",
                                cursor: "help",
                                transition: "filter .2s",
                            }} />
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                        <span style={{ color: "#334155", fontSize: 11 }}>{stats.salesChart[0]?.date}</span>
                        <span style={{ color: "#334155", fontSize: 11 }}>{stats.salesChart[stats.salesChart.length - 1]?.date}</span>
                    </div>
                </div>

                {/* Recent orders */}
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>🧾 Pedidos Recentes</h2>
                        <span style={{ color: "#475569", fontSize: 12 }}>{orders.length} pedidos</span>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr>
                                    {["Cliente", "Plano", "Valor", "Status", "Data"].map(h => (
                                        <th key={h} style={{ color: "#475569", fontWeight: 500, textAlign: "left", padding: "6px 12px", borderBottom: "1px solid #1a2540" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: "20px 12px", color: "#334155", textAlign: "center" }}>Nenhum pedido encontrado.</td></tr>
                                )}
                                {orders.map((order: any) => (
                                    <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                                        <td style={{ padding: "10px 12px" }}>
                                            <div style={{ color: "#f1f5f9" }}>{order.profiles?.full_name ?? "—"}</div>
                                            <div style={{ color: "#475569", fontSize: 11 }}>{order.profiles?.email ?? "—"}</div>
                                        </td>
                                        <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{order.plan}</td>
                                        <td style={{ padding: "10px 12px", color: "#10b981", fontWeight: 600 }}>R$ {(order.amount ?? 0).toFixed(2)}</td>
                                        <td style={{ padding: "10px 12px" }}>
                                            <span style={{
                                                background: `${statusColor[order.status] ?? "#475569"}20`,
                                                color: statusColor[order.status] ?? "#475569",
                                                borderRadius: 99, fontSize: 11, padding: "2px 10px", fontWeight: 600
                                            }}>{statusLabel[order.status] ?? order.status}</span>
                                        </td>
                                        <td style={{ padding: "10px 12px", color: "#475569", fontSize: 12 }}>{new Date(order.created_at).toLocaleDateString("pt-BR")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
