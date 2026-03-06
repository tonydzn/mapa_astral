import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserCharts } from "@/actions/chart.actions";
import { getMoodHistory } from "@/actions/mood.actions";
import { currentMoonPhase } from "@/lib/astro-engine";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const charts = await getUserCharts();
    const moodLogs = await getMoodHistory(14);
    const moonPhase = currentMoonPhase();

    return (
        <DashboardClient
            profile={profile as any}
            charts={charts as any}
            moodLogs={moodLogs as any}
            moonPhase={moonPhase}
        />
    );
}
