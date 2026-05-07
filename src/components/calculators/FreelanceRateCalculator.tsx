"use client";

import { useState, useMemo } from "react";
import {
  BadgeDollarSign, Wallet, Calendar, Clock, TrendingUp,
  Landmark, Calculator as CalcIcon, HardHat, Coffee,
  Share, CheckCircle2, Copy, LayoutDashboard, Settings2,
  Banknote, ShieldCheck, ChevronRight, Target, Activity,
  Zap, Scale, Ruler, Sparkles, Briefcase
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { calculatorBySlug } from "@/lib/calculators";
import { SITE_DOMAIN } from "@/lib/constants";

const calc = calculatorBySlug("freelance-rate-calculator")!;

export default function FreelanceRateCalculator({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) {
  if (!calc) return null;
  const { currency } = useCurrency();

  // Annual Costs
  const [personalSalary, setPersonalSalary] = useUrlState<number>("s", 60000);
  const [businessExpenses, setBusinessExpenses] = useUrlState<number>("e", 5000);
  const [taxRate, setTaxRate] = useUrlState<number>("t", 25);

  // Working Time
  const [vacationWeeks, setVacationWeeks] = useUrlState<number>("v", 4);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useUrlState<number>("h", 25);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const requiredGross = (personalSalary / (1 - (taxRate / 100))) + businessExpenses;
    const workingWeeks = 52 - vacationWeeks;
    const totalBillableHoursPerYear = workingWeeks * billableHoursPerWeek;
    const hourlyRate = requiredGross / totalBillableHoursPerYear;

    return {
      requiredGross,
      totalBillableHoursPerYear,
      hourlyRate,
      monthlyRate: requiredGross / 12,
    };
  }, [personalSalary, businessExpenses, taxRate, vacationWeeks, billableHoursPerWeek]);

  const handleCopy = () => {
    let text = `Professional Rate: ${formatCurrency(results.hourlyRate, currency.code)}/hr | Annual Goal: ${formatCurrency(results.requiredGross, currency.code)}. Audit at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Clock className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Target className="size-3" />
                    Lowest Rate to Charge
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-finance">
                    {formatCurrency(results.hourlyRate, currency.code)}<span className="text-xl md:text-2xl opacity-40 uppercase tracking-widest font-sans">/hr</span>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-3 rounded-xl transition-all border shadow-sm",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Zap className="size-3 text-health" />
                    Annual Income Goal
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(results.requiredGross, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Banknote className="size-3" />
                    Monthly Goal
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(results.monthlyRate, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Requirement Bar */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -top-4 -right-4 size-48 text-muted-foreground/5 opacity-40 group-hover:rotate-12 transition-transform duration-1000" />
            <div className="flex items-center gap-3 mb-10 relative z-10">
              <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-lg">
                <BadgeDollarSign className="size-4" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total Yearly Earnings Needed</h3>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-muted-foreground opacity-60">Total Needed Before Taxes</span>
                <span className="text-4xl font-mono font-bold tracking-tighter">{formatCurrency(results.requiredGross, currency.code)}</span>
              </div>
              <div className="w-full bg-background border border-border/40 h-4 rounded-full overflow-hidden shadow-inner">
                <div className="bg-foreground h-full rounded-full transition-all duration-1000" style={{ width: '100%' }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-background border border-border/40 p-6 rounded-2xl group/item hover:border-foreground/20 transition-all shadow-sm">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 opacity-60 flex items-center gap-2">
                    <Calendar className="size-3" /> Yearly Hours Worked
                  </div>
                  <div className="text-2xl font-mono font-bold tabular-nums">
                    {results.totalBillableHoursPerYear} <span className="text-[10px] opacity-40 uppercase tracking-widest">Hrs / Yr</span>
                  </div>
                </div>
                <div className="bg-background border border-border/40 p-6 rounded-2xl group/item hover:border-foreground/20 transition-all shadow-sm">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 opacity-60 flex items-center gap-2">
                    <Scale className="size-3" /> What You Keep
                  </div>
                  <div className="text-2xl font-mono font-bold tabular-nums">
                    {(100 - taxRate).toFixed(1)} <span className="text-[10px] opacity-40 uppercase tracking-widest">% Post-Tax</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Full-Time Ratio", v: ((billableHoursPerWeek / 40) * 100).toFixed(1), i: Activity, unit: "%" },
              { l: "Tax Buffer", v: formatCurrency(results.requiredGross * (taxRate / 100), currency.code), i: Landmark, unit: "" },
              { l: "Weekly Floor", v: formatCurrency(results.requiredGross / 52, currency.code), i: Ruler, unit: "" },
              { l: "Market Level", v: results.hourlyRate > 50 ? "Premium" : "Standard", i: Zap, unit: "" }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                </div>
                <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                  {item.v}
                  {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Earnings Goals</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Yearly Money Goals</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Target Salary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Take-Home Pay You Want</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(personalSalary, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={personalSalary}
                    onChange={(e) => setPersonalSalary(Number(e.target.value) || 0)}
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[personalSalary]} min={10000} max={500000} step={1000} onValueChange={([v]) => setPersonalSalary(v)} />
              </div>

              {/* Annual Expenses */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Yearly Business Costs</Label>
                  <span className="text-[10px] font-bold text-destructive">{formatCurrency(businessExpenses, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={businessExpenses}
                    onChange={(e) => setBusinessExpenses(Number(e.target.value) || 0)}
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-base rounded-lg shadow-sm pr-12"
                  />
                  <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[businessExpenses]} min={0} max={100000} step={500} onValueChange={([v]) => setBusinessExpenses(v)} />
              </div>

              {/* Tax & Time Grid */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                    className="h-10 bg-background border-border/60 font-bold rounded-lg shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vacation (Wks)</Label>
                  <Input
                    type="number"
                    value={vacationWeeks}
                    onChange={(e) => setVacationWeeks(Number(e.target.value) || 0)}
                    className="h-10 bg-background border-border/60 font-bold rounded-lg shadow-sm"
                  />
                </div>
              </div>

              {/* Billable Hours */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hours Worked per Week</Label>
                  <span className="text-[10px] font-bold text-finance">{billableHoursPerWeek} Hrs</span>
                </div>
                <Slider value={[billableHoursPerWeek]} min={1} max={60} step={1} onValueChange={([v]) => setBillableHoursPerWeek(v)} />
              </div>
            </div>
          </div>

          {/* Insight Panel */}
          <div className="surface-card p-6 border-border/30 bg-health/5 text-health relative overflow-hidden group">
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <HardHat className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Pro Tip</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  Always add a <span className="font-bold">25-30% buffer</span> to your minimum needed to survive to account for admin and unbilled time, paperwork, and planning.
                </p>
              </div>
            </div>
          </div>

          {calc.howTo && (
            <HowToGuide
              id='how-to-use'
              steps={calc.howTo!.steps}
              proTip={calc.howTo!.proTip}
            />
          )}
        </div>
      </div>
    </CalculatorPage>
  );
}
