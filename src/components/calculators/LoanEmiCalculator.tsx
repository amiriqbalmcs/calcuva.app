"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Share, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("loan-emi-calculator")!;

const PIE_COLORS = ["hsl(var(--signal))", "hsl(var(--muted-foreground) / 0.4)"];

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
      text = "Critical Interest Burdon: You are paying over 1.5x your loan amount in interest alone. Consider increasing your monthly EMI or reducing the tenure to avoid wealth drain.";
    } else if (interestRatio > 0.8) {
      rank = "warning";
      text = "High Debt Cost: Interest accounts for nearly half of your total payout. Even a 10% increase in your monthly EMI could save years of interest payments.";
    } else {
      text = "Efficient Financing: Your interest-to-principal ratio is healthy. This suggests a well-structured loan that prioritizes equity building.";
    }

    return { rank, text };
  }, [result.interest, principal, result.emi]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pieData = [{ name: "Principal", value: principal }, { name: "Interest", value: result.interest }];

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={
        <SeoBlock 
          title="Global Loan & EMI Analysis" 
          intro="Use the standard reducing-balance method to forecast any loan or mortgage worldwide." 
          faqs={[
            { q: "What is an Equated Monthly Installment (EMI)?", a: "An EMI is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month, so that over a specified number of years, the loan is paid off in full." },
            { q: "How is loan interest calculated?", a: "Most loans use the 'Reducing Balance' method, where interest is calculated on the remaining principal amount at the end of every month. As you pay off your principal, the interest component of your EMI decreases." },
            { q: "Does making pre-payments save money?", a: "Yes, significantly. Because interest is calculated on the outstanding balance, any extra principal payment reduces the balance immediately, preventing future interest from accruing on that amount. Early-tenure pre-payments are the most effective." },
            { q: "What is an Amortization Schedule?", a: "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term." }
          ]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Loan Structure</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-signal hover:text-white transition flex items-center gap-1 font-mono">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <div className="space-y-6">
            <div><div className="flex justify-between mb-2"><Label>Loan Amount</Label><span className="font-mono text-xs font-bold">{formatCurrency(principal, currency)}</span></div>
              <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} className="text-lg font-bold" />
              <Slider value={[principal]} min={1000} max={2000000} step={1000} onValueChange={([v]) => setPrincipal(v)} className="mt-4" />
            </div>
            <div><div className="flex justify-between mb-2"><Label>Interest Rate (%)</Label><span className="font-mono text-xs font-bold text-signal">{rate}%</span></div>
              <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
              <Slider value={[rate]} min={0.1} max={25} step={0.1} onValueChange={([v]) => setRate(v)} className="mt-4" />
            </div>
            <div><div className="flex justify-between mb-2"><Label>Tenure (Years)</Label><span className="font-mono text-xs font-bold text-signal">{years} yr</span></div>
              <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} />
              <Slider value={[years]} min={1} max={40} step={1} onValueChange={([v]) => setYears(v)} className="mt-4" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Monthly EMI" value={formatCurrency(result.emi, currency, 2)} accent />
            <ResultStat label="Total Interest" value={formatCurrency(result.interest, currency)} sub="Over full tenure" />
          </ResultGrid>

          <div className={cn("p-5 rounded-xl flex gap-4 items-start border-l-4",
            insights.rank === "good" && "bg-health-soft border-health text-health",
            insights.rank === "warning" && "bg-amber-500/10 border-amber-500 text-amber-500",
            insights.rank === "risk" && "bg-destructive/10 border-destructive text-destructive"
          )}>
            <div className="shrink-0 mt-0.5">{insights.rank === "good" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}</div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Mortgage Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{insights.text}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-6">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-6">Payment Composition</h3>
              <div className="h-[180px]"><ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(v, currency)} />
                </PieChart>
              </ResponsiveContainer></div>
              <div className="flex justify-around text-[9px] uppercase font-bold tracking-widest text-muted-foreground pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-signal" />Principal</div>
                <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground/40" />Interest</div>
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-6">Amortization Overview</h3>
              <div className="h-[180px]"><ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.yearly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => formatCurrency(v, currency)} contentStyle={{ borderRadius: "12px", border: "none" }} />
                  <Bar dataKey="principal" stackId="a" fill="hsl(var(--signal))" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="interest" stackId="a" fill="hsl(var(--muted-foreground) / 0.2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer></div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default LoanEmiCalculator;
