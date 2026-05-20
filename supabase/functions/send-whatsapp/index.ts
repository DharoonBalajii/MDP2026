import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TO_WHATSAPP_NUMBER = Deno.env.get("TO_WHATSAPP_NUMBER");

    if (!TWILIO_ACCOUNT_SID) {
      throw new Error("TWILIO_ACCOUNT_SID is not configured");
    }
    if (!TWILIO_AUTH_TOKEN) {
      throw new Error("TWILIO_AUTH_TOKEN is not configured");
    }
    if (!TO_WHATSAPP_NUMBER) {
      throw new Error("TO_WHATSAPP_NUMBER is not configured");
    }

    const { message } = await req.json();
    const body = message || "⚠️ SafeStep Alert: A fall has been detected! Please check on the wearer immediately.";

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: Deno.env.get("FROM_WHATSAPP_NUMBER") || "whatsapp:+14155238886",
        To: TO_WHATSAPP_NUMBER.startsWith("whatsapp:") ? TO_WHATSAPP_NUMBER : `whatsapp:${TO_WHATSAPP_NUMBER}`,
        Body: body,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Twilio API error:", response.status, JSON.stringify(data));
      throw new Error(`Twilio API error [${response.status}]: ${data.message || JSON.stringify(data)}`);
    }

    let deliveryStatus = data.status || "queued";
    let deliveryError = data.error_message || null;
    let deliveryErrorCode = data.error_code || null;

    if (data.sid) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const statusResponse = await fetch(`${twilioUrl.replace("/Messages.json", `/Messages/${data.sid}.json`)}`, {
        headers: { "Authorization": `Basic ${credentials}` },
      });
      const statusData = await statusResponse.json();

      if (statusResponse.ok) {
        deliveryStatus = statusData.status || deliveryStatus;
        deliveryError = statusData.error_message || deliveryError;
        deliveryErrorCode = statusData.error_code || deliveryErrorCode;
      } else {
        console.error("Twilio status check error:", statusResponse.status, JSON.stringify(statusData));
      }
    }

    const deliveredToTwilio = deliveryStatus !== "failed" && deliveryStatus !== "undelivered";

    return new Response(
      JSON.stringify({
        success: deliveredToTwilio,
        messageSid: data.sid,
        status: deliveryStatus,
        errorMessage: deliveryError,
        errorCode: deliveryErrorCode,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("send-whatsapp error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
