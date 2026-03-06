const supabaseUrl = "https://dluxyefqwcywaidwksxu.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verify() {
    const userId = "36268e56-89e6-4d4d-b3c2-f8ae565ee543"; // tony.ananias@gmail.com
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Count user charts created in the last 30 days
    const res = await fetch(`${supabaseUrl}/rest/v1/birth_charts?select=id&user_id=eq.${userId}&created_at=gte.${thirtyDaysAgo}`, {
        headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Prefer": "count=exact"
        }
    });

    const count = parseInt(res.headers.get("content-range").split("/")[1]);
    console.log(`User has ${count} charts created in the last 30 days.`);

    if (count < 3) {
        console.log("Verification SUCCESS: User should now be able to create a new chart (Limit is 3).");
    } else {
        console.log("Verification: User has reached the limit of 3. They will see the new error message.");
    }
}

verify();
