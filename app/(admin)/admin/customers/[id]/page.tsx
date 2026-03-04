import { getProfileById, updateProfile, deleteProfile, upgradeToPremium, downgradePlan, deleteOrder } from "@/actions/admin.actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];


function AdminSidebar() {
    return (
        <aside style={{
            width: 220, background: "rgba(10,16,31,0.95)", borderRight: "1px solid #1a2540",
            display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0,
            position: "sticky", top: 0, height: "100dvh"
        }}>
            <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1a2540" }}>
                <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>⚙️ Admin Panel</span>
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
                        <span>{item.emoji}</span><span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #1a2540" }}>
                <Link href="/dashboard" style={{ color: "#475569", fontSize: 12, textDecoration: "none" }}>← Voltar ao app</Link>
            </div>
        </aside>
    );
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { profile: profileRaw, charts, orders } = await getProfileById(id);
    const profile = profileRaw as ProfileRow | null;

    if (!profile) redirect("/admin/customers");

    const statusColor: Record<string, string> = {
        approved: "#10b981", pending: "#f59e0b", rejected: "#ef4444", cancelled: "#475569",
    };

    return (
        <div style={{ display: "flex", minHeight: "100dvh" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                    <Link href="/admin/customers" style={{ color: "#475569", textDecoration: "none", fontSize: 20 }}>←</Link>
                    <div>
                        <h1 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22 }}>{profile.full_name ?? "Sem nome"}</h1>
                        <p style={{ color: "#475569", fontSize: 13, marginTop: 2 }}>{profile.email}</p>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                        {!profile.is_admin && (
                            <form action={async () => {
                                "use server";
                                if (profile.is_premium) await downgradePlan(id);
                                else await upgradeToPremium(id);
                            }}>
                                <button type="submit" className="btn-gold" style={{ padding: "8px 18px", fontSize: 13 }}>
                                    {profile.is_premium ? "⬇ Rebaixar para Free" : "⬆ Fazer Premium"}
                                </button>
                            </form>
                        )}
                        <form action={async () => {
                            "use server";
                            await deleteProfile(id);
                            redirect("/admin/customers");
                        }}>
                            <button type="submit" className="btn-danger"
                                onClick={(e) => { if (!confirm("Tem certeza? Esta ação é irreversível.")) e.preventDefault(); }}>
                                🗑 Deletar conta
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {/* Edit form */}
                    <div className="card" style={{ padding: 24 }}>
                        <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>✏️ Editar Dados</h2>
                        <form action={async (formData: FormData) => {
                            "use server";
                            await updateProfile(id, {
                                full_name: formData.get("full_name") as string,
                                maps_limit: parseInt(formData.get("maps_limit") as string ?? "1"),
                                maps_count: parseInt(formData.get("maps_count") as string ?? "0"),
                                is_premium: formData.get("plan") === "premium",
                            });
                        }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Nome completo</label>
                                    <input name="full_name" defaultValue={profile.full_name ?? ""} className="input-dark" style={{ fontSize: 13 }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Plano do usuário</label>
                                    <select name="plan" defaultValue={profile.is_premium ? "premium" : "free"} className="input-dark" style={{ fontSize: 13, width: "100%" }}>
                                        <option value="free">🆓 Free</option>
                                        <option value="premium">✨ Premium</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Mapas gerados</label>
                                    <input name="maps_count" type="number" min={0} defaultValue={profile.maps_count} className="input-dark" style={{ fontSize: 13 }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Limite de mapas</label>
                                    <input name="maps_limit" type="number" min={1} defaultValue={profile.maps_limit} className="input-dark" style={{ fontSize: 13 }} />
                                </div>
                            </div>
                            <button type="submit" className="btn-violet" style={{ padding: "10px", marginTop: 4 }}>💾 Salvar alterações</button>
                        </form>
                    </div>

                    {/* Profile info */}
                    <div className="card" style={{ padding: 24 }}>
                        <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>ℹ️ Informações</h2>
                        {[
                            { label: "Plano", value: profile.is_premium ? "✨ Premium" : "🆓 Free" },
                            { label: "Mapas", value: `${profile.maps_count} / ${profile.maps_limit}` },
                            { label: "Cadastrado em", value: profile.created_at ? new Date(profile.created_at).toLocaleDateString("pt-BR") : "—" },
                            { label: "Última atualização", value: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString("pt-BR") : "—" },
                            { label: "ID", value: id.slice(0, 12) + "..." },
                        ].map(row => (
                            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                                <span style={{ color: "#475569", fontSize: 13 }}>{row.label}</span>
                                <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts */}
                {charts.length > 0 && (
                    <div className="card" style={{ padding: 24, marginTop: 20 }}>
                        <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🌌 Mapas Natais ({charts.length})</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {charts.map((c: any) => (
                                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,.03)", borderRadius: 8 }}>
                                    <div>
                                        <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500 }}>{c.name ?? "Sem nome"}</div>
                                        <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{c.birth_date} · {c.birth_place ?? "—"}</div>
                                    </div>
                                    <span style={{ color: "#475569", fontSize: 11 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "—"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders */}
                {orders.length > 0 && (
                    <div className="card" style={{ padding: 24, marginTop: 20 }}>
                        <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🧾 Pedidos ({orders.length})</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {orders.map((o: any) => (
                                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,.03)", borderRadius: 8 }}>
                                    <div>
                                        <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500 }}>{o.plan}</div>
                                        <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "—"}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ color: "#10b981", fontWeight: 600, fontSize: 13 }}>R$ {(o.amount ?? 0).toFixed(2)}</div>
                                            <div style={{ color: statusColor[o.status] ?? "#475569", fontSize: 11 }}>{o.status}</div>
                                        </div>
                                        <form action={async () => {
                                            "use server";
                                            await deleteOrder(o.id);
                                        }}>
                                            <button type="submit" className="btn-ghost" style={{ padding: "4px 8px", fontSize: 13, color: "#ef4444" }}
                                                onClick={(e) => { if (!confirm("Apagar pedido permanentemente?")) e.preventDefault(); }}>
                                                🗑
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
