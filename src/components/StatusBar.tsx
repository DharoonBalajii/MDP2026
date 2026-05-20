import { Wifi, WifiOff, Activity, AlertTriangle, ShieldAlert } from "lucide-react";

interface StatusBarProps {
  isConnected: boolean;
  sensorCount: number;
  warningCount: number;
  criticalCount: number;
}

export function StatusBar({ isConnected, sensorCount, warningCount, criticalCount }: StatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Connection pill */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
        isConnected
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      }`}>
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? "LIVE" : "OFFLINE"}
        {isConnected && <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />}
      </div>

      {/* Sensor count */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-border bg-secondary/50 text-muted-foreground">
        <Activity className="h-3 w-3" />
        {sensorCount}
      </div>

      {/* Warnings */}
      {warningCount > 0 && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono border border-warning/30 bg-warning/10 text-warning">
          <AlertTriangle className="h-3 w-3" />
          {warningCount}
        </div>
      )}

      {/* Critical */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono border border-destructive/30 bg-destructive/10 text-destructive animate-pulse">
          <ShieldAlert className="h-3 w-3" />
          {criticalCount}
        </div>
      )}
    </div>
  );
}