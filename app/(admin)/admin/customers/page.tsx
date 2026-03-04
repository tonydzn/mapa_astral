import { getAllProfiles, upgradeToPremium, downgradePlan, deleteProfile } from "@/actions/admin.actions";
import Link from "next/link";

// Inline Sidebar for reuse
function AdminSidebar() {
    return (
        <aside style={{
            width: 220, background: "rgba(10,16,31,0.95)", borderRight: "1px solid #1a2540",
            display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0,
            position: "sticky", top: 0, height: "100dvh"
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
                        borderRadius: 8, textDecoration: "none", color: "#94a3b8", fontSize: 14
                    }}>
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #1a2540" }}>
                <Link href="/dashboard" style={{ color: "#475569", fontSize: 12, textDecoration: "none" }}>← Voltar ao app</Link>
            </div>
        </aside>
    );
}

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; filter?: string }>;
}) {
    const { search = "", filter = "all" } = await searchParams;
    const profiles = await getAllProfiles(search, filter as "all" | "free" | "premium");

    return (
        <div style={{ display: "flex", minHeight: "100dvh" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <h1 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22 }}>Clientes</h1>
                        <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>{profiles.length} usuários encontrados</p>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                    <form style={{ flex: 1, minWidth: 200 }}>
                        <input name="search" defaultValue={search}
                            placeholder="Buscar por nome ou email..."
                            className="input-dark"
                            style={{ fontSize: 13 }} />
                        {filter && filter !== "all" && <input type="hidden" name="filter" value={filter} />}
                    </form>
                    <div style={{ display: "flex", gap: 6 }}>
                        {[
                            { value: "all", label: "Todos" },
                            { value: "premium", label: "✨ Premium" },
                            { value: "free", label: "🆓 Free" },
                        ].map(f => (
                            <Link key={f.value} href={`/admin/customers?filter=${f.value}${search ? `&search=${search}` : ""}`}
                                className="btn-ghost"
                                style={{ padding: "8px 14px", fontSize: 12, background: filter === f.value ? "rgba(245,158,11,.12)" : undefined, color: filter === f.value ? "#f59e0b" : undefined }}>
                                {f.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "rgba(0,0,0,.2)" }}>
                                    {["Cliente", "Plano", "Mapas", "Cadastro", "Ações"].map(h => (
                                        <th key={h} style={{ color: "#475569", fontWeight: 500, textAlign: "left", padding: "12px 16px", borderBottom: "1px solid #1a2540" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: "24px 16px", color: "#334155", textAlign: "center" }}>Nenhum cliente encontrado.</td></tr>
                                )}
                                {profiles.map((p: any) => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                                        <td style={{ padding: "12px 16px" }}>
                                            <div style={{ color: "#f1f5f9", fontWeight: 500 }}>{p.full_name ?? "—"}</div>
                                            <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{p.email}</div>
                                        </td>
                                        <td style={{ padding: "12px 16px" }}>
                                            {p.is_premium
                                                ? <span className="badge-gold">✨ Premium</span>
                                                : <span style={{ background: "rgba(71,85,105,.15)", color: "#475569", borderRadius: 99, fontSize: 11, padding: "2px 10px", fontWeight: 600, display: "inline-block" }}>Free</span>
                                            }
                                            {p.is_admin && <span style={{ marginLeft: 6, background: "rgba(139,92,246,.15)", color: "#c4b5fd", borderRadius: 99, fontSize: 10, padding: "1px 8px", fontWeight: 600, display: "inline-block" }}>Admin</span>}
                                        </td>
                                        <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{p.maps_count} / {p.maps_limit}</td>
                                        <td style={{ padding: "12px 16px", color: "#475569", fontSize: 12 }}>{p.created_at ? new Date(p.created_at).toLocaleDateString("pt-BR") : "—"}</td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                <Link href={`/admin/customers/${p.id}`} className="btn-ghost" style={{ padding: "5px 12px", fontSize: 12 }}>
                                                    ✏️ Editar
                                                </Link>
                                                {!p.is_admin && (
                                                    <form action={async () => {
                                                        "use server";
                                                        if (p.is_premium) await downgradePlan(p.id);
                                                        else await upgradeToPremium(p.id);
                                                    }}>
                                                        <button type="submit" className="btn-ghost" style={{ padding: "5px 12px", fontSize: 12, color: p.is_premium ? "#f87171" : "#10b981" }}>
                                                            {p.is_premium ? "⬇ Rebaixar" : "⬆ Upgrade"}
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </td>
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
