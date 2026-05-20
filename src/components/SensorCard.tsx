import { motion } from "framer-motion";
import { TriangleAlert, Zap, RotateCw } from "lucide-react";
import type { SensorReading } from "@/hooks/useRealtimeData";

const ICONS: Record<SensorReading["type"], React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>> = {
  fall_status: TriangleAlert,
  acceleration: Zap,
  gyro: RotateCw,
};

const STATUS_STYLES = {
  normal: "border-primary/20 hover:border-primary/40 glow-primary",
  warning: "border-warning/30 hover:border-warning/50 glow-warning",
  critical: "border-destructive/40 glow-destructive",
};

const ICON_BG = {
  fall_status: "bg-destructive/10 text-destructive",
  acceleration: "bg-primary/10 text-primary",
  gyro: "bg-chart-4/10 text-[hsl(280,68%,58%)]",
};

interface SensorCardProps {
  label: string;
  value: number;
  unit: string;
  type: SensorReading["type"];
  status: SensorReading["status"];
  subtext?: string;
  displayValue?: string;
}

export function SensorCard({ label, value, unit, type, status, subtext, displayValue }: SensorCardProps) {
  const Icon = ICONS[type];
  const isCritical = status === "critical";

  return (
    <div
      className={`sensor-card-gradient rounded-xl border p-5 transition-all duration-300 ${STATUS_STYLES[status]} ${isCritical ? "animate-pulse" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${ICON_BG[type]}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-lg text-warning font-sans font-bold">{label}</span>
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full pulse-dot ${
            status === "normal" ? "bg-primary" : status === "warning" ? "bg-warning" : "bg-destructive"
          }`}
        />
      </div>

      <motion.div
        key={String(value)}
        initial={{ scale: 1.04, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="font-mono text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
      >
        {displayValue ?? value}
        {unit && <span className="text-base text-muted-foreground ml-1 font-medium">{unit}</span>}
      </motion.div>

      {subtext && (
        <p className="text-xs text-muted-foreground mt-3 font-mono border-t border-border/50 pt-2 font-bold">
          {subtext}
        </p>
      )}
    </div>
  );
}