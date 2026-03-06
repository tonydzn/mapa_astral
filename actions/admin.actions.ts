"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Profile mutations ───────────────────────────────────────────────────────

export async function updateProfileAction(id: string, formData: FormData) {
    const admin = createAdminClient();
    await admin.from("profiles").update({
        full_name: formData.get("full_name") as string,
        maps_limit: parseInt((formData.get("maps_limit") as string) || "1"),
        maps_count: parseInt((formData.get("maps_count") as string) || "0"),
        is_premium: formData.get("plan") === "premium",
        updated_at: new Date().toISOString(),
    }).eq("id", id);
    revalidatePath(`/admin/customers/${id}`);
    revalidatePath("/admin/customers");
}

export async function togglePremiumAction(id: string) {
    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("is_premium, maps_limit").eq("id", id).maybeSingle();
    if (!profile) return;
    const newVal = !profile.is_premium;
    await admin.from("profiles").update({
        is_premium: newVal,
        maps_limit: newVal ? 999 : 1,
        updated_at: new Date().toISOString(),
    }).eq("id", id);
    revalidatePath(`/admin/customers/${id}`);
    revalidatePath("/admin/customers");
}

export async function deleteProfileAction(id: string) {
    const admin = createAdminClient();
    await Promise.all([
        admin.from("birth_charts").delete().eq("user_id", id),
        admin.from("mood_logs").delete().eq("user_id", id),
        admin.from("synastry_links").delete().eq("owner_id", id),
        admin.from("orders").delete().eq("user_id", id),
    ]);
    await admin.from("profiles").delete().eq("id", id);
    await admin.auth.admin.deleteUser(id);
    revalidatePath("/admin/customers");
    redirect("/admin/customers");
}

export async function deleteOrderAction(orderId: string, userId: string) {
    const admin = createAdminClient();
    await admin.from("orders").delete().eq("id", orderId);
    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath("/admin/dashboard");
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export async function createCouponAction(formData: FormData) {
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
}

export async function toggleCouponAction(id: string) {
    const admin = createAdminClient();
    const { data } = await admin.from("coupons").select("active").eq("id", id).maybeSingle();
    if (!data) return;
    await admin.from("coupons").update({ active: !data.active }).eq("id", id);
    revalidatePath("/admin/plans");
}

export async function deleteCouponAction(id: string) {
    const admin = createAdminClient();
    await admin.from("coupons").delete().eq("id", id);
    revalidatePath("/admin/plans");
}

// ─── Orders dashboard ─────────────────────────────────────────────────────────

export async function deleteDashboardOrderAction(orderId: string) {
    const admin = createAdminClient();
    await admin.from("orders").delete().eq("id", orderId);
    revalidatePath("/admin/dashboard");
}
