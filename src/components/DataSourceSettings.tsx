import { Settings, Wifi, Database, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DataMode } from "@/hooks/useRealtimeData";

interface DataSourceSettingsProps {
  mode: DataMode;
  activeMode: DataMode;
  onModeChange: (mode: DataMode) => void;
  error: string | null;
}

export function DataSourceSettings({ mode, activeMode, onModeChange, error }: DataSourceSettingsProps) {
  const [open, setOpen] = useState(false);

  const fellBack = mode === "realtime" && activeMode === "mock";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative h-8 w-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
      >
        <Settings className="h-4 w-4" />
        {fellBack && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-yellow-500 border-2 border-card" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Data Source</span>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Options */}
              <div className="p-5 space-y-3">
                <button
                  onClick={() => { onModeChange("realtime"); setOpen(false); }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                    mode === "realtime"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    mode === "realtime" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Wifi className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Realtime (Firebase)</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Live data from Firebase RTDB. Auto-falls back to mock if connection fails.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => { onModeChange("mock"); setOpen(false); }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                    mode === "mock"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    mode === "mock" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Mock Data</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Simulated sensor data for testing and demos. No Firebase needed.
                    </p>
                  </div>
                </button>

                {/* Status */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className={`h-2 w-2 rounded-full ${
                      activeMode === "realtime" ? "bg-emerald-500" : "bg-yellow-500"
                    }`} />
                    <span className="text-muted-foreground">
                      Active: <span className="text-foreground font-medium">{activeMode === "realtime" ? "Firebase Realtime" : "Mock Data"}</span>
                    </span>
                  </div>
                  {fellBack && (
                    <p className="text-[10px] text-yellow-500 mt-1.5 font-mono">
                      ⚠ Firebase unavailable — automatically switched to mock data
                    </p>
                  )}
                  {error && !fellBack && (
                    <p className="text-[10px] text-destructive mt-1.5 font-mono truncate">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
