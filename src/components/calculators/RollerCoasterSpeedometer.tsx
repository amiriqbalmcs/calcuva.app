"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Zap, Navigation, MapPin, Monitor, RotateCcw, Play, Square, Activity, Info, AlertCircle, TrendingUp } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CALCULATORS } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const GPS_OPTIONS = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

const RollerCoasterSpeedometer = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const calc = useMemo(() => CALCULATORS.find(c => c.slug === "roller-coaster-speed-tracker"), []);
  if (!calc) return null;

  const [unit, setUnit] = useState<"mph" | "kmh" | "knots" | "fpm">("mph");
  const [hudMode, setHudMode] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState(0); // m/s
  const [maxSpeed, setMaxSpeed] = useState(0); // m/s
  const [maxG, setMaxG] = useState(0);
  const [distance, setDistance] = useState(0); // meters
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [error, setError] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);
  const wakeLock = useRef<any>(null);
  const lastPos = useRef<{ lat: number; lng: number; time: number } | null>(null);

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

  // G-Force Logic
  useEffect(() => {
    if (!isTracking) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (acc) {
        const g = Math.sqrt((acc.x || 0)**2 + (acc.y || 0)**2 + (acc.z || 0)**2) / 9.81;
        setMaxG(prev => Math.max(prev, g));
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [isTracking]);

  const toggleTracking = useCallback(async () => {
    if (isTracking) {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      if (wakeLock.current) wakeLock.current.release();
      setIsTracking(false);
      setSpeed(0);
    } else {
      if (!navigator.geolocation) { setError("GPS not supported."); return; }
      if ('wakeLock' in navigator) wakeLock.current = await (navigator as any).wakeLock.request('screen');
      setIsTracking(true);
      setError(null);
      watchId.current = navigator.geolocation.watchPosition((position) => {
        const rawSpeed = position.coords.speed || 0;
        const accuracy = position.coords.accuracy || 0;
        if (accuracy > 60) return;

        const filteredSpeed = rawSpeed > 0.3 ? rawSpeed : 0;
        setSpeed(filteredSpeed);
        if (filteredSpeed > 0) setMaxSpeed(prev => Math.max(prev, filteredSpeed));
        setAltitude(position.coords.altitude);

        if (lastPos.current && filteredSpeed > 0.3) {
          const R = 6371e3;
          const φ1 = lastPos.current.lat * Math.PI/180;
          const φ2 = position.coords.latitude * Math.PI/180;
          const Δφ = (position.coords.latitude-lastPos.current.lat) * Math.PI/180;
          const Δλ = (position.coords.longitude-lastPos.current.lng) * Math.PI/180;
          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          setDistance(prev => prev + (R * c));
        }
        lastPos.current = { lat: position.coords.latitude, lng: position.coords.longitude, time: position.timestamp };
      }, (err) => { setError(err.message); setIsTracking(false); }, GPS_OPTIONS);
    }
  }, [isTracking]);

  const convertSpeed = (ms: number) => {
    switch (unit) {
      case "kmh": return ms * 3.6;
      case "knots": return ms * 1.94384;
      case "fpm": return ms * 196.85;
      default: return ms * 2.23694; // mph
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
  const displayDistance = unit === "knots" ? distance * 0.000539957 : unit === "kmh" ? distance / 1000 : unit === "fpm" ? distance * 3.28084 : distance * 0.000621371;
  const distanceUnit = unit === "knots" ? "nm" : unit === "kmh" ? "km" : unit === "fpm" ? "ft" : "mi";

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className={cn("max-w-6xl mx-auto space-y-8 transition-all duration-500", hudMode && "rotate-x-180 scale-x-[-1] opacity-90 brightness-150")}>
        <div className="surface-card p-6 md:p-12 bg-secondary/5 border-border/40 relative overflow-hidden shadow-sm flex flex-col items-center justify-between min-h-[500px] md:min-h-[600px] rounded-2xl">
          <Zap className="absolute inset-0 size-96 text-muted-foreground opacity-[0.03] -rotate-12 m-auto" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <Navigation className={cn("size-3", isTracking && "animate-pulse text-blue-500")} />
              {isTracking ? "Coaster Telemetry Active" : "Roller Coaster Tracker"}
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center py-4 w-full">
            <div className="flex items-baseline justify-center w-full">
              <span className={cn("text-[10rem] md:text-[18rem] font-mono font-bold tracking-tighter leading-none tabular-nums transition-all duration-150", speed > 0 ? "text-foreground" : "text-muted-foreground/20")}>{Math.round(displaySpeed)}</span>
              <div className="flex flex-col gap-2 ml-2 md:ml-4 self-center mb-10 md:mb-16">
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest text-muted-foreground/30">{unit}</span>
                <div className="grid grid-cols-2 gap-1">
                  {["mph", "kmh", "knots", "fpm"].map((u) => (
                    <button key={u} onClick={() => setUnit(u as any)} className={cn("px-2 py-1 text-[8px] font-bold uppercase rounded border", unit === u ? "bg-foreground text-background border-foreground" : "border-border/40 text-muted-foreground")}>{u}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-20 flex items-center justify-center gap-2 md:gap-8 w-full border-t border-border/10 pt-8">
            <button onClick={() => setHudMode(!hudMode)} className={cn("h-10 md:h-12 px-3 md:px-6 rounded-xl border flex items-center gap-2 font-bold text-[10px] uppercase", hudMode ? "bg-blue-500 text-white shadow-md border-blue-600" : "bg-background text-muted-foreground")}><Monitor className="size-3 md:size-4" /><span className="hidden sm:inline">HUD Mode</span></button>
            <button onClick={toggleTracking} className={cn("h-12 md:h-16 px-6 md:px-14 rounded-xl border flex items-center gap-3 font-bold text-xs uppercase shadow-lg", isTracking ? "bg-red-500 text-white border-red-600" : "bg-foreground text-background border-foreground")}>{isTracking ? <Square className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}<span>{isTracking ? "STOP" : "START GPS"}</span></button>
            <button onClick={() => { setMaxSpeed(0); setDistance(0); setElapsedTime(0); setMaxG(0); }} className="h-10 md:h-12 px-3 md:px-6 rounded-xl border border-border/60 bg-background text-muted-foreground flex items-center gap-2 font-bold text-[10px] uppercase"><RotateCcw className="size-3 md:size-4" /><span className="hidden sm:inline">Reset</span></button>
          </div>
          {error && <div className="absolute top-6 w-full flex justify-center px-6"><div className="bg-red-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold flex items-center gap-2 shadow-lg"><AlertCircle className="size-3" />{error}</div></div>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Max Velocity", value: Math.round(displayMaxSpeed), unit: unit, icon: TrendingUp, color: "text-red-500" },
            { label: "Peak G-Force", value: maxG.toFixed(2), unit: "G", icon: Activity, color: "text-blue-500" },
            { label: "Trip Timer", value: formatTime(elapsedTime), unit: "H:M:S", icon: Activity, color: "text-green-500" },
            { label: "Total Distance", value: displayDistance.toFixed(2), unit: distanceUnit, icon: MapPin, color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="surface-card p-4 md:p-6 border-border/40 bg-secondary/5 rounded-2xl shadow-sm relative overflow-hidden group">
              <stat.icon className="absolute -bottom-2 -right-2 size-12 text-muted-foreground/5 transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{stat.label}</span>
              <div className="flex items-baseline gap-2 relative z-10"><span className="text-2xl md:text-3xl font-mono font-bold tracking-tighter tabular-nums">{stat.value}</span><span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{stat.unit}</span></div>
            </div>
          ))}
        </div>
        <div className="surface-card p-6 border-border/30 bg-background rounded-2xl shadow-sm"><div className="flex items-center gap-3"><Info className="size-4 text-muted-foreground" /><h4 className="text-[10px] font-bold uppercase tracking-widest">Coaster Ride Telemetry</h4></div><p className="text-xs text-muted-foreground leading-relaxed">This specialized tracker measures both your GPS velocity and the physical G-forces during a roller coaster ride. For best results, keep your phone secure in a zipped pocket or hold it firmly to record peak intensity.</p></div>
      </div>
    </CalculatorPage>
  );
};

export default RollerCoasterSpeedometer;
