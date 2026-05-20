import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SensorReading } from "@/hooks/useRealtimeData";

interface DataTableProps {
  sensors: SensorReading[];
}

const STATUS_BADGE = {
  normal: "bg-primary/15 text-primary border border-primary/20",
  warning: "bg-warning/15 text-warning border border-warning/20",
  critical: "bg-destructive/15 text-destructive border border-destructive/20",
};

/** Derive the worst status from a set of readings */
function worstStatus(statuses: SensorReading["status"][]): SensorReading["status"] {
  if (statuses.includes("critical")) return "critical";
  if (statuses.includes("warning")) return "warning";
  return "normal";
}

interface WearerRow {
  name: string;
  acceleration: number | null;
  accelUnit: string;
  gyro: number | null;
  gyroUnit: string;
  status: SensorReading["status"];
  timestamp: Date;
}

export function DataTable({ sensors }: DataTableProps) {
  const rows = useMemo<WearerRow[]>(() => {
    // Group sensors by wearer name (location field)
    const grouped = new Map<string, SensorReading[]>();
    for (const s of sensors) {
      const list = grouped.get(s.location) ?? [];
      list.push(s);
      grouped.set(s.location, list);
    }

    return Array.from(grouped.entries()).map(([name, readings]) => {
      const accel = readings.find((r) => r.type === "acceleration");
      const gyro = readings.find((r) => r.type === "gyro");
      const allStatuses = readings.map((r) => r.status);
      const latest = readings.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));

      return {
        name,
        acceleration: accel?.value ?? null,
        accelUnit: accel?.unit ?? "g",
        gyro: gyro?.value ?? null,
        gyroUnit: gyro?.unit ?? "°/s",
        status: worstStatus(allStatuses),
        timestamp: latest.timestamp,
      };
    });
  }, [sensors]);

  return (
    <div className="sensor-card-gradient rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground">Wristband Overview</h3>
        <span className="text-[10px] text-muted-foreground font-mono px-2 py-1 rounded-md bg-secondary/50 border border-border/50">
          {rows.length} wearers
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-[10px] uppercase tracking-wider">
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-right py-3 px-2">Acceleration</th>
              <th className="text-right py-3 px-2">Gyroscope</th>
              <th className="text-center py-3 px-2">Status</th>
              <th className="text-right py-3 px-2 hidden sm:table-cell">Updated</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {rows.map((row) => (
                <motion.tr
                  key={row.name}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-border/30 hover:bg-secondary/40 transition-colors"
                >
                  <td className="py-2.5 px-2 font-medium text-foreground text-xs">{row.name}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-semibold text-foreground">
                    {row.acceleration !== null ? row.acceleration : "—"}{" "}
                    <span className="text-muted-foreground text-[10px]">{row.accelUnit}</span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono font-semibold text-foreground">
                    {row.gyro !== null ? row.gyro : "—"}{" "}
                    <span className="text-muted-foreground text-[10px]">{row.gyroUnit}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${STATUS_BADGE[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-muted-foreground font-mono text-[10px] hidden sm:table-cell">
                    {row.timestamp.toLocaleTimeString()}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
