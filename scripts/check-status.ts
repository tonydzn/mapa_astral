import { createAdminClient } from "../lib/supabase/admin";

async function check() {
    const admin = createAdminClient();
    const today = new Date().toISOString().split('T')[0];

    console.log("Checking for date:", today);

    // Check daily_horoscopes
    const { data: records, error: err } = await admin
        .from("daily_horoscopes")
        .select(`
            *,
            profiles (email)
        `)
        .eq("date", today);

    if (err) console.error("Error fetching records:", err);
    else console.log("Horoscope records found for today:", JSON.stringify(records, null, 2));

    // Check premium users
    const { data: premium, error: pErr } = await admin
        .from("profiles")
        .select("id, email, is_premium")
        .eq("is_premium", true);

    if (pErr) console.error("Error fetching premium users:", pErr);
    else console.log("Premium users found:", JSON.stringify(premium, null, 2));
}

check();
