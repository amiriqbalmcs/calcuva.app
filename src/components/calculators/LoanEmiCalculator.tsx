"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { 
  Share, CheckCircle2, AlertCircle, Info, Landmark, Calculator, 
  Receipt, TrendingDown, Wallet, History, Target, Activity, 
  Zap, Globe, Ruler, Gauge, Sparkles, LayoutDashboard, Copy, Settings2,
  TrendingUp, Banknote, Calendar
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("loan-emi-calculator")!;

const PIE_COLORS = ["hsl(var(--foreground))", "hsl(var(--muted-foreground) / 0.15)"];

// Internal icon helpers for redesign
const PieChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

const BarChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const LoanEmiCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [principal, setPrincipal] = useUrlState<number>("p", 250000);
  const [rate, setRate] = useUrlState<number>("r", 7.5);
  const [years, setYears] = useUrlState<number>("y", 20);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = Math.max(1, years * 12);
    const r = rate / 12 / 100;
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - principal;

    let balance = principal;
    const yearly: { year: number; principal: number; interest: number; balance: number }[] = [];
    for (let y = 1; y <= years; y++) {
      let pPaid = 0, iPaid = 0;
      for (let m = 0; m < 12; m++) {
        const interestM = balance * r;
        const principalM = emi - interestM;
        balance -= principalM;
        pPaid += principalM;
        iPaid += interestM;
      }
      yearly.push({ year: y, principal: pPaid, interest: iPaid, balance: Math.max(0, balance) });
    }
    return { emi, total, interest, yearly };
  }, [principal, rate, years]);

  const insights = useMemo(() => {
    const interestRatio = result.interest / principal;
    let rank: "good" | "warning" | "risk" = "good";
    let text = "";

    if (interestRatio > 1.5) {
      rank = "risk";
      text = "High Interest Warning: You're paying much more in interest than the actual loan amount. Try to pay off the loan faster or look for a lower rate to save money.";
    } else if (interestRatio > 0.8) {
      rank = "warning";
      text = "High Interest Cost: You're paying a lot in interest. Even a small extra payment each month could save you a lot of money over time.";
    } else {
      rank = "good";
      text = "Good Loan Balance: You're paying off the loan amount quickly compared to the interest, which helps you own your home or car sooner.";
    }

    return { rank, text };
  }, [result.interest, principal]);

  const handleCopy = () => {
    const resultText = `Loan Details: ${formatCurrency(result.emi, currency.code)} Monthly | Total Cost ${formatCurrency(result.total, currency.code)}. Calculate yours at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pieData = [{ name: "Loan Amount", value: principal }, { name: "Interest", value: result.interest }];

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-20">
              <h3 className="text-sm font-bold tracking-tight">Loan Settings</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Loan Terms</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Principal */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Loan Amount</Label>
                  <span className="text-xs font-mono font-medium">{formatCurrency(principal, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={principal} 
                    onChange={(e) => setPrincipal(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-medium text-base rounded-lg shadow-sm"
                  />
                  <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-20" />
                </div>
                <Slider 
                  value={[principal]} 
                  min={1000} 
                  max={2000000} 
                  step={5000} 
                  onValueChange={([v]) => setPrincipal(v)} 
                  className="pt-2"
                />
              </div>

              {/* Rate and Tenure */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={rate} 
                    onChange={(e) => setRate(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/40 focus:border-foreground/20 transition-all font-medium text-base rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Loan Years</Label>
                  <Input 
                    type="number" 
                    value={years} 
                    onChange={(e) => setYears(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/40 focus:border-foreground/20 transition-all font-medium text-base rounded-lg"
                  />
                </div>
              </div>
              <Slider 
                value={[years]} 
                min={1} 
                max={40} 
                step={1} 
                onValueChange={([v]) => setYears(v)} 
                className="pt-2"
              />
            </div>
          </div>

          {/* Quick Analysis */}
          <div className={cn("surface-card p-6 border-border/30 relative overflow-hidden",
            insights.rank === "good" ? "bg-health/5 border-health/20" : 
            insights.rank === "warning" ? "bg-amber-500/5 border-amber-500/20" : 
            "bg-signal/5 border-signal/20"
          )}>
            <div className="flex gap-4 items-start relative z-10">
              <div className={cn("mt-1", 
                insights.rank === "good" ? "text-health" : 
                insights.rank === "warning" ? "text-amber-500" : 
                "text-signal"
              )}>
                {insights.rank === "good" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Loan Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {insights.text}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <TrendingUp className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Monthly Payment</span>
                  <div className="text-6xl md:text-7xl font-mono font-medium tracking-tighter tabular-nums">
                    {formatCurrency(result.emi, currency.code)}
                  </div>
                </div>
                <button 
                  onClick={handleCopy} 
                  className={cn(
                    "p-3 rounded-xl transition-all border",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                  title="Copy Results"
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border/40">
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-tight">
                  <Banknote className="size-3" />
                  <span>Total Interest: {formatCurrency(result.interest, currency.code)}</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                  Total Amount to Pay: {formatCurrency(result.total, currency.code)}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-6 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <PieChartIcon className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 relative z-10">Money Breakdown</h4>
              <div className="h-[200px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={8} stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip 
                      formatter={(v: any) => formatCurrency(v, currency.code)} 
                      contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 justify-center text-[9px] font-bold uppercase tracking-widest mt-4 relative z-10">
                <div className="flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-foreground" /> Loan Amount</div>
                <div className="flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-muted-foreground/20" /> Interest</div>
              </div>
            </div>

            <div className="surface-card p-6 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <BarChartIcon className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 relative z-10">Loan Progress</h4>
              <div className="h-[200px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.yearly.filter((_, i) => i % (years > 20 ? 3 : 1) === 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.1} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(v: any) => formatCurrency(v, currency.code)} 
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} 
                    />
                    <Bar dataKey="principal" stackId="a" fill="hsl(var(--foreground))" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="interest" stackId="a" fill="hsl(var(--muted-foreground) / 0.1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[9px] text-center text-muted-foreground uppercase font-bold tracking-widest mt-4 opacity-40 relative z-10">Yearly Principal vs Interest</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Total Cost Ratio", v: (result.total / principal).toFixed(2), i: Activity, unit: "x" },
               { l: "Total Months", v: years * 12, i: History, unit: "Mth" },
               { l: "Loan Share", v: (principal / result.total * 100).toFixed(1), i: Target, unit: "%" },
               { l: "Cost Per Day", v: (result.emi / 30).toFixed(0), i: Zap, unit: currency.code }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-xl font-mono font-medium tabular-nums leading-tight">
                    {item.v}
                    <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="surface-card p-6 border-border/30 space-y-3 bg-background/50 relative overflow-hidden group">
              <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-2 relative z-10">
                <Landmark className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Monthly Budget Tip</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                Try to keep your loan payments under 40% of your monthly income to stay financially safe and handle unexpected costs.
              </p>
            </div>
            <div className="surface-card p-6 border-border/30 space-y-3 bg-background/50 relative overflow-hidden group">
              <Zap className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-2 relative z-10">
                <Zap className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Pay Off Faster</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                Paying just one extra month's payment each year can cut years off your loan and save you thousands in interest.
              </p>
            </div>
          </div>


        </div>
      </div>
    </CalculatorPage>
  );
};


export default LoanEmiCalculator;
