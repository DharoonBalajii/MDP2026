import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export type DataMode = "realtime" | "mock";

export interface SensorReading {
  id: string;
  sensorName: string;
  type: "fall_status" | "acceleration" | "gyro";
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  timestamp: Date;
  location: string;
}

export interface SensorHistory {
  time: string;
  acceleration: number;
  gyro: number;
  fallEvents: number;
}

const SENSOR_CONFIG = {
  fall_status: { min: 0, max: 1, unit: "", warningThreshold: 1, criticalThreshold: 1 },
  acceleration: { min: 0, max: 4, unit: "g", warningThreshold: 2.5, criticalThreshold: 3.5 },
  gyro: { min: 0, max: 250, unit: "°/s", warningThreshold: 150, criticalThreshold: 200 },
};

const WEARERS = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona"];
const SENSOR_TYPES: SensorReading["type"][] = ["fall_status", "acceleration", "gyro"];

function getStatus(type: SensorReading["type"], value: number): SensorReading["status"] {
  const config = SENSOR_CONFIG[type];
  if (type === "fall_status") return value >= 1 ? "critical" : "normal";
  if (value >= config.criticalThreshold) return "critical";
  if (value >= config.warningThreshold) return "warning";
  return "normal";
}

function labelFor(type: SensorReading["type"]): string {
  return type === "fall_status" ? "Fall Detect" : type === "acceleration" ? "Accelerometer" : "Gyroscope";
}

function randomInRange(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function drift(current: number, min: number, max: number, maxDelta: number): number {
  const delta = (Math.random() - 0.5) * 2 * maxDelta;
  return Math.round(Math.min(max, Math.max(min, current + delta)) * 10) / 10;
}

function firebaseSensorToReading(
  wearer: string,
  type: SensorReading["type"],
  data: { value: number; ts?: number }
): SensorReading {
  return {
    id: `${type}-${wearer.toLowerCase()}`,
    sensorName: `${labelFor(type)} — ${wearer}`,
    type,
    value: data.value,
    unit: SENSOR_CONFIG[type].unit,
    status: getStatus(type, data.value),
    timestamp: data.ts ? new Date(data.ts) : new Date(),
    location: wearer,
  };
}

function generateInitialSensors(): SensorReading[] {
  const sensors: SensorReading[] = [];
  SENSOR_TYPES.forEach((type) => {
    WEARERS.forEach((wearer) => {
      const config = SENSOR_CONFIG[type];
      const value = type === "fall_status" ? 0 : randomInRange(config.min, config.min + (config.max - config.min) * 0.4);
      sensors.push({
        id: `${type}-${wearer.toLowerCase()}`,
        sensorName: `${labelFor(type)} — ${wearer}`,
        type, value,
        unit: config.unit,
        status: getStatus(type, value),
        timestamp: new Date(),
        location: wearer,
      });
    });
  });
  return sensors;
}

function generateHistoryPoint(prev?: SensorHistory): SensorHistory {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
  if (!prev) return { time, acceleration: randomInRange(0.8, 1.2), gyro: randomInRange(5, 30), fallEvents: 0 };
  return { time, acceleration: drift(prev.acceleration, 0, 4, 0.15), gyro: drift(prev.gyro, 0, 250, 8), fallEvents: 0 };
}

export function useRealtimeData(updateIntervalMs = 2000, mode: DataMode = "realtime") {
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [history, setHistory] = useState<SensorHistory[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<DataMode>(mode);
  const prevValues = useRef<Map<string, number>>(new Map());
  const modeRef = useRef(mode);

  // Track requested mode
  useEffect(() => {
    modeRef.current = mode;
    setActiveMode(mode);
  }, [mode]);

  // ─── MOCK MODE ───
  useEffect(() => {
    if (activeMode !== "mock") return;

    // Immediately initialize mock data
    const initial = generateInitialSensors();
    setSensors(initial);
    initial.forEach((s) => prevValues.current.set(s.id, s.value));

    const hist: SensorHistory[] = [];
    for (let i = 0; i < 20; i++) hist.push(generateHistoryPoint(hist[hist.length - 1]));
    setHistory(hist);
    setIsConnected(true);
    setIsLoading(false);

    // Tick interval for updating mock data (no random falls — only Shift key triggers falls)
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          const config = SENSOR_CONFIG[sensor.type];
          const currentVal = prevValues.current.get(sensor.id) ?? sensor.value;
          let newValue: number;
          if (sensor.type === "fall_status") {
            // Keep current value — falls only triggered by Shift key
            newValue = currentVal;
          } else {
            newValue = drift(currentVal, config.min, config.max, sensor.type === "gyro" ? 8 : 0.12);
          }
          prevValues.current.set(sensor.id, newValue);
          return { ...sensor, value: newValue, status: getStatus(sensor.type, newValue), timestamp: new Date() };
        })
      );
      setHistory((prev) => {
        const newPoint = generateHistoryPoint(prev[prev.length - 1]);
        const updated = [...prev, newPoint];
        return updated.length > 30 ? updated.slice(-30) : updated;
      });
    }, updateIntervalMs);

    // Shift key triggers all fall sensors to critical
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setSensors((prev) =>
          prev.map((sensor) => {
            if (sensor.type === "fall_status") {
              prevValues.current.set(sensor.id, 1);
              return { ...sensor, value: 1, status: "critical" as const, timestamp: new Date() };
            }
            return sensor;
          })
        );
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setSensors((prev) =>
          prev.map((sensor) => {
            if (sensor.type === "fall_status") {
              prevValues.current.set(sensor.id, 0);
              return { ...sensor, value: 0, status: "normal" as const, timestamp: new Date() };
            }
            return sensor;
          })
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeMode, updateIntervalMs]);

  // ─── REALTIME (Firebase) MODE ───
  useEffect(() => {
    if (activeMode !== "realtime") return;

    setIsLoading(true);
    setIsConnected(false);
    setError(null);
    let gotData = false;

    const wristbandsRef = ref(db, "wristbands");
    const unsubWristbands = onValue(
      wristbandsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          // No data in Firebase — don't seed, just wait or fallback
          return;
        }

        gotData = true;
        const readings: SensorReading[] = [];
        for (const wearer of Object.keys(data)) {
          const wearerData = data[wearer];
          for (const type of SENSOR_TYPES) {
            if (wearerData[type] !== undefined) {
              const sensorData = typeof wearerData[type] === "object" ? wearerData[type] : { value: Number(wearerData[type]) };
              readings.push(firebaseSensorToReading(wearer, type, sensorData));
            }
          }
        }
        if (readings.length > 0) {
          setSensors(readings);
          setIsConnected(true);
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Firebase error:", err);
        setError(err.message);
        // Auto-fallback to mock on error
        if (modeRef.current === "realtime") {
          console.warn("Firebase error — falling back to mock data");
          setActiveMode("mock");
          setError("Firebase error — switched to mock data");
        }
      }
    );

    const historyRef = ref(db, "history");
    const unsubHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const entries: SensorHistory[] = Array.isArray(data) ? data : Object.values(data);
      setHistory(entries.slice(-30));
    });

    // Timeout fallback: if no data after 6s, switch to mock
    const timeout = setTimeout(() => {
      if (!gotData && modeRef.current === "realtime") {
        console.warn("Firebase timed out — falling back to mock data");
        setActiveMode("mock");
        setError("Firebase timed out — switched to mock data");
      }
    }, 6000);

    return () => {
      unsubWristbands();
      unsubHistory();
      clearTimeout(timeout);
    };
  }, [activeMode]);

  const getAggregated = useCallback(
    (type: SensorReading["type"]) => {
      const typed = sensors.filter((s) => s.type === type);
      if (typed.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };
      const values = typed.map((s) => s.value);
      return {
        avg: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
        min: Math.min(...values),
        max: Math.max(...values),
        count: typed.length,
      };
    },
    [sensors]
  );

  return { sensors, history, isConnected, isLoading, error, activeMode, getAggregated };
}
