import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import type { DataMode } from "@/hooks/useRealtimeData";
import { SensorCard } from "@/components/SensorCard";
import { LiveChart } from "@/components/LiveChart";
import { DataTable } from "@/components/DataTable";
import { StatusBar } from "@/components/StatusBar";
import { ChatBox } from "@/components/ChatBox";
import { DataSourceSettings } from "@/components/DataSourceSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ALERT_COOLDOWN_MS = 5_000; // 5s cooldown between alerts
type AlertDeliveryState = "idle" | "sending" | "sent" | "failed" | "cooldown";

const Index = () => {
  const [dataMode, setDataMode] = useState<DataMode>("mock");
  const { sensors, history, isConnected, isLoading, error, activeMode, getAggregated } = useRealtimeData(2000, dataMode);
  const lastAlertTime = useRef<number>(0);
  const [alertDeliveryState, setAlertDeliveryState] = useState<AlertDeliveryState>("idle");

  const fall = getAggregated("fall_status");
  const accel = getAggregated("acceleration");
  const gyro = getAggregated("gyro");

  const warningCount = sensors.filter((s) => s.status === "warning").length;
  const criticalCount = sensors.filter((s) => s.status === "critical").length;
  const activeFalls = sensors.filter((s) => s.type === "fall_status" && s.value >= 1).length;

  const fallWearers = sensors
    .filter((s) => s.type === "fall_status" && s.value >= 1)
    .map((s) => s.location);
  const fallAlertKey = fallWearers.join("|");

  const sendFallAlert = useCallback(async (wearers: string[]) => {
    const now = Date.now();
    if (now - lastAlertTime.current < ALERT_COOLDOWN_MS) {
      setAlertDeliveryState("cooldown");
      return;
    }
    setAlertDeliveryState("sending");

    const randomWearer = wearers[Math.floor(Math.random() * wearers.length)];
    const patientId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    const message = `🚨 SafeStep FALL ALERT!\n\nPatient: ${randomWearer}\nPatient ID: ${patientId}\nTime: ${new Date().toLocaleString()}\n\nPlease check on them immediately.`;

    try {
      const { data, error } = await supabase.functions.invoke("send-whatsapp", {
        body: { message },
      });
      if (error) throw error;
      if (!data?.success || !data?.messageSid) {
        const detail = data?.errorMessage || data?.error || data?.status;
        throw new Error(detail ? `WhatsApp not delivered: ${detail}` : "Twilio did not confirm the WhatsApp alert");
      }
      if (data.status === "failed" || data.status === "undelivered") {
        throw new Error(data.errorMessage || `Twilio marked this message as ${data.status}`);
      }
      lastAlertTime.current = Date.now();
      setAlertDeliveryState("sent");
      toast.success(`WhatsApp alert ${data.status || "queued"} for ${randomWearer} (${patientId})`);
    } catch (err) {
      console.error("Failed to send WhatsApp alert:", err);
      setAlertDeliveryState("failed");
      toast.error(err instanceof Error ? err.message : "Failed to send WhatsApp alert");
    }
  }, []);

  // Auto-trigger alert when fall is detected
  useEffect(() => {
    if (fallAlertKey && !isLoading) {
      sendFallAlert(fallWearers);
    }
  }, [fallAlertKey, isLoading, sendFallAlert]);

  useEffect(() => {
    if (!fallAlertKey) setAlertDeliveryState("idle");
  }, [fallAlertKey]);

  const alertStatusText = {
    idle: "Press Shift to send WhatsApp alert",
    sending: "Sending WhatsApp alert…",
    sent: "WhatsApp alert sent/queued by Twilio ✓",
    failed: "WhatsApp delivery failed — check WhatsApp sandbox join/number",
    cooldown: "WhatsApp alert recently sent ✓",
  }[alertDeliveryState];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 grid-bg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center breathing-ring">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-foreground font-display font-semibold text-lg">SafeStep</p>
          <p className="text-muted-foreground font-mono text-xs mt-1 flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            {dataMode === "realtime" ? "Connecting to Firebase…" : "Loading mock data…"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Top bar */}
      <div className="border-b border-border/50 glass-card sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight text-foreground">
                SafeStep
              </h1>
              <p className="text-muted-foreground text-[11px] font-mono -mt-0.5 hidden sm:block">
                Wristband fall detection & motion monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBar
              isConnected={isConnected}
              sensorCount={sensors.length}
              warningCount={warningCount}
              criticalCount={criticalCount}
            />
            <DataSourceSettings
              mode={dataMode}
              activeMode={activeMode}
              onModeChange={setDataMode}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Alert banner when fall detected */}
      {activeFalls > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-2">
          <div className="container max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-destructive font-semibold">
              FALL DETECTED — {fallWearers.join(", ")}
            </span>
            <span className="text-muted-foreground ml-auto">
              {alertStatusText}
            </span>
          </div>
        </div>
      )}

      <div className="container py-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensorCard label="Fall Status" value={activeFalls} unit="" type="fall_status"
            status={activeFalls > 0 ? "critical" : "normal"}
            displayValue={activeFalls > 0 ? `${activeFalls} DETECTED` : "ALL SAFE"}
            subtext={`${fall.count} wristbands monitored`}
          />
          <SensorCard label="Acceleration" value={accel.avg} unit="g" type="acceleration"
            status={accel.avg >= 2.5 ? "warning" : "normal"}
            subtext={`Peak: ${accel.max} g`}
          />
          <SensorCard label="Gyroscope" value={gyro.avg} unit="°/s" type="gyro"
            status={gyro.avg >= 150 ? "warning" : "normal"}
            subtext={`Peak: ${gyro.max} °/s`}
          />
        </div>

        {/* Chart */}
        <div>
          <LiveChart data={history} title="Live Motion Trends" />
        </div>

        {/* Data Table */}
        <div>
          <DataTable sensors={sensors} />
        </div>
      </div>

      <ChatBox sensors={sensors} />
    </div>
  );
};

export default Index;
