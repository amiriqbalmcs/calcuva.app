"use client";

import { useState, useMemo } from "react";
import { Receipt, Landmark, TrendingUp, Info, DollarSign, Wallet, PieChart as PieIcon, ArrowRight } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ResultStat from "@/components/ResultStat";
import { cn } from "@/lib/utils";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface TaxBracketCalculatorProps {
  calc: any;
  guideHtml?: string;
}

const brackets2024 = {
  single: [
    { rate: 0.10, min: 0, max: 11600 },
    { rate: 0.12, min: 11601, max: 47150 },
    { rate: 0.22, min: 47151, max: 100525 },
    { rate: 0.24, min: 100526, max: 191950 },
    { rate: 0.32, min: 191951, max: 243725 },
    { rate: 0.35, min: 243726, max: 609350 },
    { rate: 0.37, min: 609351, max: Infinity },
  ],
  married: [
    { rate: 0.10, min: 0, max: 23200 },
    { rate: 0.12, min: 23201, max: 94300 },
    { rate: 0.22, min: 94301, max: 201050 },
    { rate: 0.24, min: 201051, max: 383900 },
    { rate: 0.32, min: 383901, max: 487450 },
    { rate: 0.35, min: 487451, max: 731200 },
    { rate: 0.37, min: 731201, max: Infinity },
  ]
};

export default function TaxBracketCalculator({ calc, guideHtml }: TaxBracketCalculatorProps) {
  const [income, setIncome] = useState<number>(75000);
  const [filingStatus, setFilingStatus] = useState<string>("single");

  const results = useMemo(() => {
    const selectedBrackets = filingStatus === "married" ? brackets2024.married : brackets2024.single;
    let totalTax = 0;
    const bracketBreakdown = [];

    for (const b of selectedBrackets) {
      if (income > b.min) {
        const taxableInThisBracket = Math.min(income, b.max) - b.min;
        const taxInThisBracket = taxableInThisBracket * b.rate;
        totalTax += taxInThisBracket;
        
        bracketBreakdown.push({
          rate: (b.rate * 100).toFixed(0) + "%",
          amount: taxInThisBracket,
          taxable: taxableInThisBracket,
        });
      }
    }

    const effectiveRate = totalTax / income;
    const takeHome = income - totalTax;

    return {
      totalTax,
      effectiveRate,
      takeHome,
      bracketBreakdown,
      pieData: [
        { name: "Take Home", value: takeHome, color: "hsl(var(--finance))" },
        { name: "Total Tax", value: totalTax, color: "hsl(var(--destructive))" },
      ]
    };
  }, [income, filingStatus]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-finance/10 flex items-center justify-center text-finance shadow-inner">
                <Receipt className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Income Data</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">2024 US Federal Estimates</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Annual Income */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="income">Gross Annual Income</Label>
                  <span className="text-sm font-mono font-bold text-finance">{formatCurrency(income)}</span>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="pl-9 h-12 bg-background border-border"
                  />
                </div>
                <Slider
                  value={[income]}
                  min={10000}
                  max={1000000}
                  step={5000}
                  onValueChange={([v]) => setIncome(v)}
                />
              </div>

              {/* Filing Status */}
              <div className="space-y-3">
                <Label htmlFor="status">Filing Status</Label>
                <Select value={filingStatus} onValueChange={setFilingStatus}>
                  <SelectTrigger id="status" className="h-12 bg-background border-border rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Filer</SelectItem>
                    <SelectItem value="married">Married Filing Jointly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <ResultStat
               label="Effective Tax Rate"
               value={(results.effectiveRate * 100).toFixed(1) + "%"}
               description="Your weighted average tax burden"
               className="bg-finance/5 border-finance/20"
               icon={TrendingUp}
               valueClassName="text-finance text-4xl"
             />
             <ResultStat
               label="Total Federal Tax"
               value={formatCurrency(results.totalTax)}
               description="Estimated annual liability"
               className="bg-finance/5 border-finance/10 text-destructive"
               icon={Landmark}
               valueClassName="text-destructive font-bold"
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="surface-card p-6 flex flex-col items-center">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase self-start mb-4">Take Home Breakdown</h3>
                <div className="size-48 sm:size-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results.pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {results.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                   <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-finance" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Net Pay</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-destructive" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tax</span>
                   </div>
                </div>
             </div>

             <div className="surface-card p-6 overflow-hidden">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-6">Progressive Bracket Impact</h3>
                <div className="space-y-4">
                   {results.bracketBreakdown.map((b, i) => (
                      <div key={i} className="group">
                         <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-bold font-mono text-muted-foreground">Bracket: {b.rate}</span>
                            <span className="text-[10px] font-bold text-foreground">{formatCurrency(b.amount)}</span>
                         </div>
                         <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                             <div 
                               className="bg-finance h-full transition-all duration-500" 
                               style={{ width: `${(b.amount / results.totalTax) * 100}%` }}
                             />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="p-4 bg-secondary/20 rounded-2xl border border-border/50">
             <div className="flex gap-3">
                <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This calculator assumes the **Standard Deduction** ($14,600 for single, $29,200 for married) is not yet removed from gross income. This is a simplified estimator and does not include State Taxes, FICA, or specific tax credits.
                </p>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
