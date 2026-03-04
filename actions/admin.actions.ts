"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

// ─── Auth guard ────────────────────────────────────────────────────────────
async function requireAdmin() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

    if (!profile?.is_admin) redirect("/admin/login");
    return user;
}

// ─── Stats ─────────────────────────────────────────────────────────────────
export async function getAdminStats() {
    await requireAdmin();
    const admin = createAdminClient();

    const [profilesRes, premiumRes, ordersRes, monthOrdersRes] = await Promise.all([
        admin.from("profiles").select("*", { count: "exact", head: true }),
        admin.from("profiles").select("*", { count: "exact", head: true }).eq("is_premium", true),
        admin.from("orders").select("amount, status, created_at").eq("status", "approved"),
        admin.from("orders")
            .select("amount, created_at")
            .eq("status", "approved")
            .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    ]);

    const totalRevenue = (ordersRes.data || []).reduce((s, o) => s + (o.amount || 0), 0);
    const monthRevenue = (monthOrdersRes.data || []).reduce((s, o) => s + (o.amount || 0), 0);

    // Build last 30 days chart data
    const now = new Date();
    const days: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const revenue = (ordersRes.data || [])
            .filter(o => o?.created_at && o.created_at.slice(0, 10) === dateStr)
            .reduce((s, o) => s + (o.amount || 0), 0);
        days.push({ date: dateStr, revenue });
    }

    return {
        totalUsers: profilesRes.count ?? 0,
        premiumUsers: premiumRes.count ?? 0,
        totalRevenue,
        monthRevenue,
        salesChart: days,
    };
}

// ─── Profiles / Customers ──────────────────────────────────────────────────
export async function getAllProfiles(search = "", filter: "all" | "free" | "premium" = "all") {
    await requireAdmin();
    const admin = createAdminClient();

    let query = admin
        .from("profiles")
        .select("id, email, full_name, is_premium, is_admin, maps_count, maps_limit, created_at")
        .order("created_at", { ascending: false });

    if (filter === "premium") query = query.eq("is_premium", true);
    if (filter === "free") query = query.eq("is_premium", false);
    if (search) query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getProfileById(id: string) {
    await requireAdmin();
    const admin = createAdminClient();

    const [profileRes, chartsRes, ordersRes] = await Promise.all([
        admin.from("profiles").select("*").eq("id", id).maybeSingle(),
        admin.from("birth_charts").select("id, name, birth_date, birth_place, created_at").eq("user_id", id).order("created_at", { ascending: false }),
        admin.from("orders").select("*").eq("user_id", id).order("created_at", { ascending: false }),
    ]);

    return {
        profile: profileRes.data,
        charts: chartsRes.data ?? [],
        orders: ordersRes.data ?? [],
    };
}

export async function updateProfile(id: string, updates: {
    full_name?: string;
    is_premium?: boolean;
    maps_limit?: number;
    maps_count?: number;
}) {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("profiles").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${id}`);
    return { success: true };
}

export async function upgradeToPremium(id: string) {
    return updateProfile(id, { is_premium: true, maps_limit: 999 });
}

export async function downgradePlan(id: string) {
    return updateProfile(id, { is_premium: false, maps_limit: 1 });
}

export async function deleteProfile(id: string) {
    await requireAdmin();
    const admin = createAdminClient();

    // Delete related records first
    await Promise.all([
        admin.from("birth_charts").delete().eq("user_id", id),
        admin.from("mood_logs").delete().eq("user_id", id),
        admin.from("synastry_links").delete().eq("owner_id", id),
        admin.from("orders").delete().eq("user_id", id),
    ]);

    // Delete the profile record
    await admin.from("profiles").delete().eq("id", id);

    // Delete auth user
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) return { error: error.message };

    revalidatePath("/admin/customers");
    return { success: true };
}

// ─── Orders ────────────────────────────────────────────────────────────────
export async function getOrders(limit = 50) {
    await requireAdmin();
    const admin = createAdminClient();

    const { data, error } = await admin
        .from("orders")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function deleteOrder(id: string) {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("orders").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/customers");
    return { success: true };
}

// ─── Coupons ───────────────────────────────────────────────────────────────
export async function getCoupons() {
    await requireAdmin();
    const admin = createAdminClient();
    const { data } = await admin.from("coupons").select("*").order("created_at", { ascending: false });
    return data ?? [];
}

export async function createCoupon(coupon: {
    code: string;
    discount_percent: number;
    max_uses?: number;
    expires_at?: string;
}) {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("coupons").insert({
        code: coupon.code.toUpperCase(),
        discount_percent: coupon.discount_percent,
        max_uses: coupon.max_uses ?? null,
        expires_at: coupon.expires_at ?? null,
        active: true,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin/plans");
    return { success: true };
}

export async function toggleCoupon(id: string, active: boolean) {
    await requireAdmin();
    const admin = createAdminClient();
    await admin.from("coupons").update({ active }).eq("id", id);
    revalidatePath("/admin/plans");
}

export async function deleteCoupon(id: string) {
    await requireAdmin();
    const admin = createAdminClient();
    await admin.from("coupons").delete().eq("id", id);
    revalidatePath("/admin/plans");
    return { success: true };
}
