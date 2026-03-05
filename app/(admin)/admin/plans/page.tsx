import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import Link from "next/link";

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

export default async function PlansPage() {
    const admin = createAdminClient();
    const { data: coupons } = await admin.from("coupons").select("*").order("created_at", { ascending: false });

    const plans = [
        { id: "premium_monthly", label: "Premium Mensal", priceEnvKey: "NEXT_PUBLIC_PREMIUM_PRICE_MONTHLY", defaultPrice: "29.90", period: "mês" },
        { id: "premium_yearly", label: "Premium Anual", priceEnvKey: "NEXT_PUBLIC_PREMIUM_PRICE_YEARLY", defaultPrice: "249.90", period: "ano" },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100dvh" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 22 }}>Planos & Cupons</h1>
                    <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Gerencie preços e cupons de desconto</p>
                </div>

                {/* Plans info section */}
                <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>💎 Planos Disponíveis</h2>
                    <p style={{ color: "#475569", fontSize: 13, marginBottom: 20 }}>
                        Para alterar os preços, edite as variáveis de ambiente no Vercel ou no <code style={{ color: "#94a3b8", background: "rgba(255,255,255,.06)", padding: "1px 6px", borderRadius: 4 }}>.env.local</code>.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                        {plans.map(plan => (
                            <div key={plan.id} style={{ background: "rgba(139,92,246,.07)", border: "1px solid rgba(139,92,246,.2)", borderRadius: 12, padding: "20px 24px" }}>
                                <div style={{ color: "#c4b5fd", fontSize: 12, marginBottom: 8, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{plan.label}</div>
                                <div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 32 }}>
                                    R$ {process.env[plan.priceEnvKey] ?? plan.defaultPrice}
                                    <span style={{ color: "#475569", fontSize: 14, fontWeight: 400 }}>/{plan.period}</span>
                                </div>
                                <div style={{ marginTop: 12, color: "#475569", fontSize: 12 }}>
                                    Variável: <code style={{ color: "#94a3b8" }}>{plan.priceEnvKey}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create coupon form */}
                <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🎟️ Criar Cupom de Desconto</h2>
                    <form action={async (formData: FormData) => {
                        "use server";
                        const admin = createAdminClient();
                        const code = (formData.get("code") as string).toUpperCase();
                        const discount = parseFloat(formData.get("discount") as string);
                        const maxUsesRaw = formData.get("max_uses") as string;
                        const expiresAtRaw = formData.get("expires_at") as string;
                        await admin.from("coupons").insert({
                            code,
                            discount_percent: discount,
                            max_uses: maxUsesRaw ? parseInt(maxUsesRaw) : null,
                            expires_at: expiresAtRaw || null,
                            active: true,
                        });
                        revalidatePath("/admin/plans");
                    }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, alignItems: "end" }}>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Código do cupom*</label>
                            <input name="code" required placeholder="PROMO10" className="input-dark" style={{ fontSize: 13, textTransform: "uppercase" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Desconto (%)*</label>
                            <input name="discount" type="number" required min={1} max={100} placeholder="10" className="input-dark" style={{ fontSize: 13 }} />
                        </div>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Máx. usos (opcional)</label>
                            <input name="max_uses" type="number" min={1} placeholder="100" className="input-dark" style={{ fontSize: 13 }} />
                        </div>
                        <div>
                            <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 6 }}>Expira em (opcional)</label>
                            <input name="expires_at" type="date" className="input-dark" style={{ fontSize: 13 }} />
                        </div>
                        <div>
                            <button type="submit" className="btn-gold" style={{ width: "100%", padding: "11px" }}>+ Criar Cupom</button>
                        </div>
                    </form>
                </div>

                {/* Coupons list */}
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>🗓️ Cupons Cadastrados</h2>
                        <span style={{ color: "#475569", fontSize: 12 }}>{coupons?.length ?? 0} cupons</span>
                    </div>

                    {(!coupons || coupons.length === 0) ? (
                        <p style={{ color: "#334155", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Nenhum cupom cadastrado.</p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: "rgba(0,0,0,.2)" }}>
                                        {["Código", "Desconto", "Usos", "Expira", "Status", "Ações"].map(h => (
                                            <th key={h} style={{ color: "#475569", fontWeight: 500, textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #1a2540" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((c: any) => (
                                        <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                                            <td style={{ padding: "10px 14px" }}>
                                                <code style={{ color: "#f59e0b", background: "rgba(245,158,11,.08)", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>{c.code}</code>
                                            </td>
                                            <td style={{ padding: "10px 14px", color: "#10b981", fontWeight: 600 }}>{c.discount_percent}%</td>
                                            <td style={{ padding: "10px 14px", color: "#94a3b8" }}>{c.uses_count ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ""}</td>
                                            <td style={{ padding: "10px 14px", color: "#475569", fontSize: 12 }} suppressHydrationWarning>
                                                {c.expires_at ? new Date(c.expires_at).toLocaleDateString("pt-BR") : "—"}
                                            </td>
                                            <td style={{ padding: "10px 14px" }}>
                                                <span style={{
                                                    background: c.active ? "rgba(16,185,129,.12)" : "rgba(71,85,105,.15)",
                                                    color: c.active ? "#10b981" : "#475569",
                                                    borderRadius: 99, fontSize: 11, padding: "2px 10px", fontWeight: 600
                                                }}>{c.active ? "Ativo" : "Inativo"}</span>
                                            </td>
                                            <td style={{ padding: "10px 14px" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <form action={async () => {
                                                        "use server";
                                                        const admin = createAdminClient();
                                                        await admin.from("coupons").update({ active: !c.active }).eq("id", c.id);
                                                        revalidatePath("/admin/plans");
                                                    }}>
                                                        <button type="submit" className="btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}>
                                                            {c.active ? "Desativar" : "Ativar"}
                                                        </button>
                                                    </form>
                                                    <form action={async () => {
                                                        "use server";
                                                        const admin = createAdminClient();
                                                        await admin.from("coupons").delete().eq("id", c.id);
                                                        revalidatePath("/admin/plans");
                                                    }}>
                                                        <button type="submit" className="btn-danger" style={{ padding: "4px 10px", fontSize: 11 }}>🗑</button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
