"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  Navigation, MapPin, Monitor, RotateCcw, Play, Square,
  Activity, Map, Info, Train, Plane, Bike, Anchor,
  Snowflake, Footprints, Dna, ArrowUpCircle, AlertCircle, TrendingUp, Zap
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CALCULATORS } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

const GPS_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

const GpsSpeedometer = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const params = useParams();
  const slug = params?.slug as string;
  const calc = useMemo(() => CALCULATORS.find(c => c.slug === slug), [slug]);

  if (!calc) return null;

  const context = useMemo(() => {
    switch (slug) {
      case "train-speed-test-live":
        return { icon: Train, label: "Train Trip", unit: "kmh" };
      case "flight-speed-tracker-gps":
        return { icon: Plane, label: "Flight Info", unit: "kmh", showAltitude: true };
      case "roller-coaster-speed-tracker":
        return { icon: Zap, label: "Coaster Ride", unit: "mph", showGForce: true };
      case "high-speed-elevator-test":
        return { icon: ArrowUpCircle, label: "Elevator Test", unit: "fpm", showGForce: true };
      case "cycling-speedometer-online":
        return { icon: Bike, label: "Bike Trip", unit: "mph" };
      case "boat-speed-tracker-knots":
        return { icon: Anchor, label: "Sea Voyage", unit: "knots" };
      case "ski-snowboard-speed-tracker":
        return { icon: Snowflake, label: "Ski Run", unit: "mph" };
      case "running-speedometer-test":
        return { icon: Footprints, label: "Running Session", unit: "mph" };
      case "horse-riding-speed-tracker":
        return { icon: Dna, label: "Equestrian", unit: "mph" };
      case "e-scooter-speedometer":
        return { icon: Zap, label: "Scooter Ride", unit: "mph" };
      default:
        return { icon: Navigation, label: "GPS Speedometer", unit: "mph" };
    }
  }, [slug]);

  const [unit, setUnit] = useState<string>(context.unit);
  const [hudMode, setHudMode] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [speed, setSpeed] = useState(0); // m/s
  const [maxSpeed, setMaxSpeed] = useState(0); // m/s
  const [distance, setDistance] = useState(0); // meters
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [altitude, setAltitude] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gForce, setGForce] = useState(1.0);
  const [maxG, setMaxG] = useState(1.0);

  const watchId = useRef<number | null>(null);
  const wakeLock = useRef<any>(null);
  const lastPos = useRef<{ lat: number; lng: number; time: number } | null>(null);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (err: any) { console.warn(err); }
  };

  const releaseWakeLock = () => {
    if (wakeLock.current) {
      wakeLock.current.release();
      wakeLock.current = null;
    }
  };

  // Motion sensor logic for real-time G-Force
  useEffect(() => {
    if (!isTracking) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
        const totalAccel = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
        const g = totalAccel / 9.80665;
        // Apply light smoothing
        setGForce(prev => (prev * 0.7) + (g * 0.3));
        setMaxG(prev => Math.max(prev, g));
      }
    };

    if (typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isTracking]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const toggleTracking = useCallback(async () => {
    if (isTracking) {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      releaseWakeLock();
      setIsTracking(false);
      setSpeed(0);
      setGForce(1.0);
    } else {
      if (!navigator.geolocation) {
        setError("GPS not supported.");
        return;
      }

      await requestWakeLock();
      setIsTracking(true);
      setError(null);

      watchId.current = navigator.geolocation.watchPosition((position) => {
        const rawSpeed = position.coords.speed || 0;
        const accuracy = position.coords.accuracy || 0;

        // Drift Protection: Ignore points with bad accuracy (> 60m)
        if (accuracy > 60) return;

        // Only update speed if it's above a minimal jitter threshold
        const filteredSpeed = rawSpeed > 0.3 ? rawSpeed : 0;
        setSpeed(filteredSpeed);
        setAltitude(position.coords.altitude);
        setHeading(position.coords.heading);
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        
        if (filteredSpeed > 0) {
          setMaxSpeed(prev => Math.max(prev, filteredSpeed));
        }

        // Distance accumulation only if moving (Speed > 0.3 m/s)
        if (lastPos.current && filteredSpeed > 0.3) {
          const d = calculateDistance(
            lastPos.current.lat, lastPos.current.lng,
            position.coords.latitude, position.coords.longitude
          );
          setDistance(prev => prev + d);
        }
        lastPos.current = { lat: position.coords.latitude, lng: position.coords.longitude, time: position.timestamp };
      }, (err) => { setError(err.message); setIsTracking(false); releaseWakeLock(); }, GPS_OPTIONS);
    }
  }, [isTracking]);

  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      releaseWakeLock();
    };
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const resetStats = () => {
    setMaxSpeed(0);
    setDistance(0);
    setElapsedTime(0);
    setMaxG(1.0);
    lastPos.current = null;
  };

  const convertSpeed = (ms: number) => {
    switch (unit) {
      case "kmh": return ms * 3.6;
      case "mph": return ms * 2.23694;
      case "knots": return ms * 1.94384;
      case "fpm": return ms * 196.85;
      default: return ms;
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  };

  const displaySpeed = convertSpeed(speed);
  const displayMaxSpeed = convertSpeed(maxSpeed);
  const displayAvgSpeed = elapsedTime > 0 ? convertSpeed(distance / elapsedTime) : 0;
  const displayDistance = unit === "knots" ? distance * 0.000539957 : unit === "kmh" ? distance / 1000 : unit === "fpm" ? distance * 3.28084 : distance * 0.000621371;
  const distanceUnit = unit === "knots" ? "nm" : unit === "kmh" ? "km" : unit === "fpm" ? "ft" : "mi";

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className={cn("max-w-6xl mx-auto space-y-8 transition-all duration-500", hudMode && "rotate-x-180 scale-x-[-1] opacity-90 brightness-150")}>

        {/* Universal Speed Display */}
        <div className="surface-card p-6 md:p-12 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm flex flex-col items-center justify-between min-h-[500px] md:min-h-[600px] rounded-2xl">

          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <context.icon className="size-96 text-muted-foreground -rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <Navigation className={cn("size-3", isTracking && "animate-pulse text-blue-500")} />
              {isTracking ? `Live ${context.label} Tracking` : "GPS Speedometer"}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center py-4 w-full">
            <div className="flex items-baseline justify-center w-full">
              <span className={cn("text-[10rem] md:text-[18rem] font-mono font-bold tracking-tighter leading-none tabular-nums transition-all duration-150", speed > 0 ? "text-foreground" : "text-muted-foreground/20")}>
                {Math.round(displaySpeed)}
              </span>
              <div className="flex flex-col gap-2 ml-2 md:ml-4 self-center mb-10 md:mb-16">
                <span className="text-xl md:text-3xl font-bold uppercase tracking-widest text-muted-foreground/30">{unit}</span>
                <div className="flex flex-wrap gap-1 max-w-[80px] md:max-w-[120px]">
                  {["mph", "kmh", "knots", "fpm"].map((u) => (
                    <button key={u} onClick={() => setUnit(u as any)} className={cn("px-1.5 py-0.5 md:px-2 md:py-1 text-[7px] md:text-[8px] font-bold uppercase tracking-tighter rounded border", unit === u ? "bg-foreground text-background border-foreground" : "border-border/40 text-muted-foreground")}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {context.showGForce && (
              <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
                <Activity className={cn("size-3 text-blue-500", isTracking && "animate-pulse")} />
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">
                  G-Force: <span className="text-foreground">{gForce.toFixed(2)}G</span>
                </span>
              </div>
            )}
          </div>

          <div className="relative z-20 flex items-center justify-center gap-2 md:gap-8 w-full border-t border-border/10 pt-8">
            <button onClick={() => setHudMode(!hudMode)} className={cn("h-10 md:h-12 px-3 md:px-6 rounded-xl border flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest", hudMode ? "bg-blue-500 text-white border-blue-600 shadow-md" : "bg-background border-border/60 text-muted-foreground")}>
              <Monitor className="size-3 md:size-4" />
              <span className="hidden sm:inline">{hudMode ? "HUD ON" : "HUD Mode"}</span>
            </button>

            <button onClick={toggleTracking} className={cn("h-12 md:h-16 px-6 md:px-14 rounded-xl border flex items-center gap-3 font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all", isTracking ? "bg-red-500 text-white border-red-600" : "bg-foreground text-background border-foreground")}>
              {isTracking ? <Square className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              <span>{isTracking ? "STOP" : "START GPS"}</span>
            </button>

            <button onClick={resetStats} className="h-10 md:h-12 px-3 md:px-6 rounded-xl border border-border/60 bg-background text-muted-foreground flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
              <RotateCcw className="size-3 md:size-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {error && (
            <div className="absolute top-6 flex justify-center z-20 w-full px-6">
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold flex items-center gap-2 shadow-lg">
                <AlertCircle className="size-3" />
                {error}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Max Speed", value: Math.round(displayMaxSpeed), unit: unit, icon: TrendingUp, color: "text-red-500" },
            { label: context.showGForce ? "Peak G-Force" : context.showAltitude ? "Altitude" : "Avg Speed", value: context.showGForce ? maxG.toFixed(2) + "G" : context.showAltitude ? (altitude ? Math.round(altitude) : "---") : Math.round(displayAvgSpeed), unit: context.showGForce ? "" : context.showAltitude ? "m" : unit, icon: context.showGForce ? Activity : context.showAltitude ? Plane : Activity, color: "text-blue-500" },
            { label: "Trip Timer", value: formatTime(elapsedTime), unit: "H:M:S", icon: Activity, color: "text-green-500" },
            { label: "Distance", value: typeof displayDistance === 'number' ? displayDistance.toFixed(2) : displayDistance, unit: distanceUnit, icon: MapPin, color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="surface-card p-4 md:p-6 border-border/40 bg-secondary/5 rounded-2xl shadow-sm relative overflow-hidden group">
              <stat.icon className="absolute -bottom-2 -right-2 size-12 text-muted-foreground/5 transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{stat.label}</span>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-2xl md:text-3xl font-mono font-bold tracking-tighter tabular-nums">{stat.value}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="surface-card p-6 border-border/30 bg-background space-y-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Info className="size-4 text-muted-foreground" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">GPS Tracking Accuracy</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            For the most accurate speed and distance tracking, ensure your device has a clear line of sight to the sky. GPS performance can be affected by tall buildings, heavy tree cover, or being indoors.
          </p>
        </div>

      </div>
    </CalculatorPage>
  );
};

export default GpsSpeedometer;
