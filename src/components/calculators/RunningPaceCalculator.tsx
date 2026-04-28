"use client";

import { useState, useMemo } from "react";
import { Timer, Ruler, Clock, Activity, TrendingUp, Info, ChevronRight, Gauge } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ResultStat from "@/components/ResultStat";
import { cn } from "@/lib/utils";

interface RunningPaceCalculatorProps {
  calc: any;
  guideHtml?: string;
}

const standardDistances = [
  { label: "5K", distance: 5.0, unit: "km" },
  { label: "10K", distance: 10.0, unit: "km" },
  { label: "Half Marathon", distance: 21.0975, unit: "km" },
  { label: "Marathon", distance: 42.195, unit: "km" },
  { label: "1 Mile", distance: 1.0, unit: "mile" },
];

export default function RunningPaceCalculator({ calc, guideHtml }: RunningPaceCalculatorProps) {
  const [distance, setDistance] = useState<number>(5);
  const [distanceUnit, setDistanceUnit] = useState<string>("km");
  
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);

  const results = useMemo(() => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    if (distance === 0 || totalSeconds === 0) return null;

    const totalDistanceKm = distanceUnit === "km" ? distance : distance * 1.60934;
    const totalDistanceMiles = distanceUnit === "mile" ? distance : distance / 1.60934;

    const pacePerKmTotal = totalSeconds / totalDistanceKm;
    const pacePerMileTotal = totalSeconds / totalDistanceMiles;

    const formatPace = (totalSecs: number) => {
      const min = Math.floor(totalSecs / 60);
      const sec = Math.round(totalSecs % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    // Split times (every 1k or every 5k depending on length)
    const splits = [];
    const splitCount = distance > 10 ? 5 : 1;
    for (let i = splitCount; i <= distance; i += splitCount) {
      const splitTime = (totalSeconds / distance) * i;
      const h = Math.floor(splitTime / 3600);
      const m = Math.floor((splitTime % 3600) / 60);
      const s = Math.round(splitTime % 60);
      splits.push({
        label: `${i}${distanceUnit}`,
        time: `${h > 0 ? h + ':' : ''}${m.toString().padStart(h > 0 ? 2 : 1, '0')}:${s.toString().padStart(2, '0')}`
      });
    }

    return {
      pacePerKm: formatPace(pacePerKmTotal),
      pacePerMile: formatPace(pacePerMileTotal),
      speedKph: (totalDistanceKm / (totalSeconds / 3600)).toFixed(1),
      speedMph: (totalDistanceMiles / (totalSeconds / 3600)).toFixed(1),
      splits
    };
  }, [distance, distanceUnit, hours, minutes, seconds]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-health/10 flex items-center justify-center text-health shadow-inner">
                <Timer className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Race Parameters</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">Distance & Goal Time</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Distance Section */}
              <div className="space-y-4">
                <Label>Distance</Label>
                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <Input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="h-12 bg-background border-border/50 rounded-xl font-bold text-lg"
                  />
                  <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                    <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">KM</SelectItem>
                      <SelectItem value="mile">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                   {standardDistances.map(sd => (
                     <button
                        key={sd.label}
                        onClick={() => {
                          setDistance(sd.distance);
                          setDistanceUnit(sd.unit);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-[10px] font-bold uppercase tracking-widest hover:bg-health hover:text-white transition-colors"
                     >
                       {sd.label}
                     </button>
                   ))}
                </div>
              </div>

              {/* Time Section */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <Label>Required Time (h:m:s)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                     <span className="text-[9px] font-bold text-muted-foreground uppercase">Hours</span>
                     <Input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="h-12 bg-background border-border shadow-inner text-center font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <span className="text-[9px] font-bold text-muted-foreground uppercase">Minutes</span>
                     <Input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))}
                        className="h-12 bg-background border-border shadow-inner text-center font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <span className="text-[9px] font-bold text-muted-foreground uppercase">Seconds</span>
                     <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(Number(e.target.value))}
                        className="h-12 bg-background border-border shadow-inner text-center font-bold"
                     />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <div className="surface-card p-12 flex flex-col items-center justify-center text-center opacity-50 border-dashed">
               <Activity className="size-12 mb-4 text-muted-foreground" />
               <p className="text-sm font-medium">Enter your distance and time to see your pace splits.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultStat
                  label={`Pace per ${distanceUnit === 'km' ? 'Kilometer' : 'Mile'}`}
                  value={`${distanceUnit === 'km' ? results.pacePerKm : results.pacePerMile} / ${distanceUnit}`}
                  description="Average pace required"
                  className="bg-health/5 border-health/20"
                  icon={Clock}
                  valueClassName="text-health text-4xl"
                />
                <ResultStat
                  label="Average Speed"
                  value={`${distanceUnit === 'km' ? results.speedKph + ' km/h' : results.speedMph + ' mph'}`}
                  description="Continuous linear velocity"
                  className="bg-health/5 border-health/10"
                  icon={Gauge}
                  valueClassName="text-health"
                />
              </div>

              <div className="surface-card p-8 bg-gradient-to-br from-health/5 to-transparent">
                 <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="size-4 text-health" />
                    <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Suggested Split Times</h3>
                 </div>

                 <div className="space-y-2">
                    {results.splits.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors rounded-lg px-3">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-muted-foreground font-mono w-8">{idx + 1}.</span>
                            <span className="text-sm font-bold">{s.label}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-bold text-health">{s.time}</span>
                            <ChevronRight className="size-3 text-muted-foreground" />
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase opacity-70">
                       <span>Total Distance: {distance} {distanceUnit}</span>
                       <span>Time: {hours}h {minutes}m {seconds}s</span>
                    </div>
                 </div>
              </div>
            </>
          )}

          <div className="surface-card p-6 border-health/10">
             <div className="flex gap-4">
                <div className="size-10 rounded-full bg-health/10 flex items-center justify-center text-health shrink-0">
                   <Info className="size-4" />
                </div>
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Pacing Science</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                     To hit your goal time, maintaining a consistent pace is often more efficient than starting fast and slowing down. Professional runners aim for "Even Splits" or "Negative Splits" (where the second half is slightly faster).
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
