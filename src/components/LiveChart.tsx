import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SensorHistory } from "@/hooks/useRealtimeData";

interface LiveChartProps {
  data: SensorHistory[];
  title: string;
}

const LINES = [
  { key: "acceleration", color: "hsl(170, 85%, 48%)", label: "Accel (g)" },
  { key: "gyro", color: "hsl(280, 68%, 58%)", label: "Gyro (°/s)" },
  { key: "fallEvents", color: "hsl(0, 76%, 58%)", label: "Fall Events" },
] as const;

export function LiveChart({ data, title }: LiveChartProps) {
  return (
    <div className="sensor-card-gradient rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
          updating live
        </div>
      </div>
      <div className="h-[260px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 16%, 15%)" strokeOpacity={0.6} />
            <XAxis
              dataKey="time"
              tick={{ fill: "hsl(215, 14%, 48%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
              stroke="hsl(225, 16%, 15%)"
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "hsl(215, 14%, 48%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
              stroke="hsl(225, 16%, 15%)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(225, 22%, 9%)",
                border: "1px solid hsl(225, 16%, 15%)",
                borderRadius: "10px",
                fontFamily: "JetBrains Mono",
                fontSize: "11px",
                boxShadow: "0 8px 32px hsl(0 0% 0% / 0.4)",
              }}
              labelStyle={{ color: "hsl(210, 20%, 94%)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono" }}
            />
            {LINES.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2.5}
                dot={false}
                name={line.label}
                animationDuration={300}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}