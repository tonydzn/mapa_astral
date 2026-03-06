const supabaseUrl = "https://dluxyefqwcywaidwksxu.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
    const today = new Date().toISOString().split('T')[0];

    // Check daily_horoscopes
    const res = await fetch(`${supabaseUrl}/rest/v1/daily_horoscopes?select=*,profiles(email)&date=eq.${today}`, {
        headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`
        }
    });

    const records = await res.json();
    console.log("Horoscope records found for today:", JSON.stringify(records, null, 2));

    // Check premium users
    const pRes = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id,email,is_premium&is_premium=eq.true`, {
        headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`
        }
    });

    const premium = await pRes.json();
    console.log("Premium users found:", JSON.stringify(premium, null, 2));
}

check();
