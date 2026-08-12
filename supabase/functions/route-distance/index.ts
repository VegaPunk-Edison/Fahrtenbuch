// Edge Function: berechnet die Fahrstrecke zwischen zwei Koordinaten über
// OpenRouteService. Der API-Key liegt nur hier als Server-Secret (ORS_API_KEY),
// nie im Client. Nur eingeloggte User dürfen sie aufrufen.
//
// Deploy: supabase functions deploy route-distance
// Secret:  supabase secrets set ORS_API_KEY=dein-key

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad Request" }, 400);
  }
  const { start, end } = body || {};
  if (!start || !end || typeof start.lat !== "number" || typeof start.lon !== "number" ||
      typeof end.lat !== "number" || typeof end.lon !== "number") {
    return json({ error: "start/end mit lat/lon erforderlich" }, 400);
  }

  const orsKey = Deno.env.get("ORS_API_KEY");
  if (!orsKey) {
    return json({ error: "ORS_API_KEY nicht konfiguriert" }, 500);
  }

  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${encodeURIComponent(orsKey)}&start=${start.lon},${start.lat}&end=${end.lon},${end.lat}`;
  const orsRes = await fetch(url);
  if (!orsRes.ok) {
    return json({ error: "OpenRouteService-Fehler" }, 502);
  }
  const data = await orsRes.json();
  const meters = data?.features?.[0]?.properties?.summary?.distance;
  const km = meters != null ? Math.round(meters / 100) / 10 : null;
  return json({ km });
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
