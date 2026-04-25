"use client";

import { useMemo, useState } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";

const calc = calculatorBySlug("water-intake-sleep-calculator")!;

const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const WaterSleepCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [tab, setTab] = useState<"water" | "sleep">("water");

  // Water
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = useState(70);
  const [weightLb, setWeightLb] = useState(155);
  const [activityMin, setActivityMin] = useState(30);
  const [climate, setClimate] = useState<"normal" | "hot">("normal");

  // Sleep
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("07:00");

  const water = useMemo(() => {
    const w = units === "metric" ? weightKg : weightLb * 0.453592;
    let ml = w * 33; // 33 ml per kg baseline
    ml += (activityMin / 30) * 350;
    if (climate === "hot") ml *= 1.15;
    const liters = ml / 1000;
    const cups = ml / 240;
    return { ml: Math.round(ml), liters, cups: Math.round(cups) };
  }, [units, weightKg, weightLb, activityMin, climate]);

  const sleep = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const fall = 15; // min to fall asleep
    const cycles = [6, 5, 4, 3]; // recommended cycle counts
    return cycles.map((c) => {
      const offsetMin = (mode === "wake" ? -1 : 1) * (c * 90 + fall);
      const t = new Date(target.getTime() + offsetMin * 60 * 1000);
      return { cycles: c, hours: c * 1.5, time: t };
    });
  }, [time, mode]);

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={
        <SeoBlock
          title="Hydration and sleep — two pillars of health"
          intro="Most adults need 2–3 litres of water and 7–9 hours of sleep per day, but exact targets depend on body weight, activity, climate and individual rhythm. This tool gives you science-based numbers to start from."
          sections={[
            { heading: "Water intake formula", body: <p>A reliable baseline is 33 ml per kg of body weight (≈0.5 oz per pound). Add 350 ml for every 30 minutes of moderate exercise, and increase by 10–20% in hot climates.</p> },
            { heading: "Sleep cycles explained", body: <p>Sleep moves through 90-minute cycles of light, deep and REM stages. Waking at the end of a cycle leaves you refreshed; waking mid-cycle causes grogginess. The calculator targets cycle boundaries plus a 15-minute fall-asleep buffer.</p> },
            { heading: "How many cycles do I need?", body: <ul><li><strong>5–6 cycles (7.5–9h):</strong> ideal for adults.</li><li><strong>4 cycles (6h):</strong> survival mode — okay occasionally.</li><li><strong>3 cycles (4.5h):</strong> emergency only — expect cognitive impact.</li></ul> },
          ]}
          faqs={[
            { q: "Does coffee count as water?", a: "Yes, mildly. Caffeine is a weak diuretic but the net hydration of coffee/tea is positive. Plain water is still better." },
            { q: "Can I undo missed sleep?", a: "Partially. Recovery sleep helps but cognitive performance from chronic deprivation takes days to fully restore." },
          ]}
        />
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="grid grid-cols-2 max-w-sm">
          <TabsTrigger value="water">💧 Water intake</TabsTrigger>
          <TabsTrigger value="sleep">🌙 Sleep cycles</TabsTrigger>
        </TabsList>

        <TabsContent value="water" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 surface-card p-6 space-y-5">
              <Tabs value={units} onValueChange={(v) => setUnits(v as typeof units)}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="metric">Metric</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial</TabsTrigger>
                </TabsList>
              </Tabs>
              {units === "metric" ? (
                <div><Label>Weight (kg)</Label><Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value) || 0)} className="mt-2" /></div>
              ) : (
                <div><Label>Weight (lb)</Label><Input type="number" value={weightLb} onChange={(e) => setWeightLb(Number(e.target.value) || 0)} className="mt-2" /></div>
              )}
              <div><Label>Daily exercise (minutes)</Label><Input type="number" value={activityMin} onChange={(e) => setActivityMin(Number(e.target.value) || 0)} className="mt-2" /></div>
              <div>
                <Label>Climate</Label>
                <Select value={climate} onValueChange={(v) => setClimate(v as typeof climate)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="hot">Hot / Humid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <ResultGrid cols={3}>
                <ResultStat label="Daily target" value={`${water.liters.toFixed(2)} L`} accent sub={`${water.ml} ml`} />
                <ResultStat label="In cups" value={`${water.cups} cups`} sub="240 ml each" />
                <ResultStat label="Hourly average" value={`${Math.round(water.ml / 16)} ml`} sub="Across 16 waking hours" />
              </ResultGrid>
              <div className="surface-card p-6">
                <h3 className="text-sm font-semibold mb-4">Suggested schedule</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { time: "Morning", pct: 0.3 },
                    { time: "Midday", pct: 0.3 },
                    { time: "Afternoon", pct: 0.25 },
                    { time: "Evening", pct: 0.15 },
                  ].map((s) => (
                    <div key={s.time} className="bg-secondary/50 rounded-lg p-4">
                      <div className="text-xs text-muted-foreground mb-1">{s.time}</div>
                      <div className="text-xl font-semibold tabular-nums">{Math.round(water.ml * s.pct)} ml</div>
                      <div className="text-xs text-muted-foreground">{Math.round(water.cups * s.pct)} cups</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sleep" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 surface-card p-6 space-y-5">
              <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="wake">I want to wake at...</TabsTrigger>
                  <TabsTrigger value="sleep">I'll sleep at...</TabsTrigger>
                </TabsList>
              </Tabs>
              <div><Label>Time</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-2" /></div>
              <p className="text-xs text-muted-foreground border-t border-border pt-4">Includes a 15-minute buffer to fall asleep.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="surface-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold">{mode === "wake" ? "Go to bed at:" : "Wake up at:"}</h3>
                  <p className="text-sm text-muted-foreground">Choose the option that gives you the most cycles you can spare.</p>
                </div>
                <div className="divide-y divide-border">
                  {sleep.map((s, i) => (
                    <div key={s.cycles} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <div className="text-2xl font-semibold tabular-nums">{formatTime(s.time)}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.cycles} cycles · {s.hours}h sleep</div>
                      </div>
                      {i === 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-health-soft text-health">Recommended</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorPage>
  );
};

export default WaterSleepCalculator;
