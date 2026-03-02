import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ChartView from "./ChartView";

export default async function ChartPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: chart, error } = await supabase
        .from("birth_charts")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error || !chart) return notFound();

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, is_premium")
        .eq("id", user.id)
        .single();

    return <ChartView chart={chart as any} profile={profile as any} />;
}
