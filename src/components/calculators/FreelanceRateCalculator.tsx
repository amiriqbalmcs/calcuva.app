"use client";

import { useState, useMemo } from "react";
import { BadgeDollarSign, Wallet, Calendar, Clock, TrendingUp, Landmark, Calculator as CalcIcon, HardHat, Coffee } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ResultStat from "@/components/ResultStat";
import { cn } from "@/lib/utils";

interface FreelanceRateCalculatorProps {
  calc: any;
  guideHtml?: string;
}

export default function FreelanceRateCalculator({ calc, guideHtml }: FreelanceRateCalculatorProps) {
  // Annual Costs
  const [personalSalary, setPersonalSalary] = useState<number>(60000);
  const [businessExpenses, setBusinessExpenses] = useState<number>(5000);
  const [taxRate, setTaxRate] = useState<number>(25);
  
  // Working Time
  const [vacationWeeks, setVacationWeeks] = useState<number>(4);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number>(25);

  const results = useMemo(() => {
    // Total required gross income to reach net "salary" after expenses and tax
    // Formula: Salary = (Gross - Expenses) * (1 - TaxRate)
    // Thus: Gross = (Salary / (1 - TaxRate)) + Expenses
    const requiredGross = (personalSalary / (1 - (taxRate / 100))) + businessExpenses;
    
    // Total billable weeks and hours
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

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-business/10 flex items-center justify-center text-business shadow-inner">
                <BadgeDollarSign className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Business Canvas</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">Target & Costs</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Target Salary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="salary" className="flex items-center gap-2">
                    Desired Net Salary <Coffee className="size-3 text-muted-foreground" />
                  </Label>
                  <span className="text-sm font-mono font-bold text-business">{formatCurrency(personalSalary)}</span>
                </div>
                <Input
                  id="salary"
                  type="number"
                  value={personalSalary}
                  onChange={(e) => setPersonalSalary(Number(e.target.value))}
                  className="h-12 bg-background border-border/50 rounded-xl font-bold text-lg"
                />
                <p className="text-[10px] text-muted-foreground italic">Your "Take-Home" target after tax and expenses.</p>
              </div>

              {/* Annual Expenses */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="expenses">Business Expenses</Label>
                  <span className="text-sm font-mono font-bold text-business">{formatCurrency(businessExpenses)}</span>
                </div>
                <Input
                  id="expenses"
                  type="number"
                  value={businessExpenses}
                  onChange={(e) => setBusinessExpenses(Number(e.target.value))}
                  className="h-12 bg-background border-border/50 rounded-xl"
                />
              </div>

              {/* Tax Rate */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="tax">Tax %</Label>
                  <span className="text-sm font-mono font-bold text-business">{taxRate}%</span>
                </div>
                <Slider
                  value={[taxRate]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={([v]) => setTaxRate(v)}
                />
              </div>

              <div className="h-px bg-border/50" />

              {/* Billable Time */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="vacation">Vacation Weeks</Label>
                  <span className="text-sm font-mono font-bold text-business">{vacationWeeks} weeks</span>
                </div>
                <Slider
                  value={[vacationWeeks]}
                  min={0}
                  max={12}
                  step={1}
                  onValueChange={([v]) => setVacationWeeks(v)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="hours">Billable Hours / Week</Label>
                  <span className="text-sm font-mono font-bold text-business">{billableHoursPerWeek} hrs</span>
                </div>
                <Slider
                  value={[billableHoursPerWeek]}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={([v]) => setBillableHoursPerWeek(v)}
                />
                <p className="text-[10px] text-muted-foreground italic">Actual hours worked on clients only (not admin/marketing).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultStat
              label="Minimum Hourly Rate"
              value={formatCurrency(results.hourlyRate) + "/hr"}
              description="Your professional worth per billable hour"
              className="bg-business/5 border-business/20"
              icon={Clock}
              valueClassName="text-business text-4xl"
            />
            <ResultStat
              label="Daily Income Target"
              value={formatCurrency(results.hourlyRate * (billableHoursPerWeek/5))}
              description="Target revenue per working day"
              className="bg-business/5 border-business/10"
              icon={TrendingUp}
              valueClassName="text-business"
            />
          </div>

          <div className="surface-card p-8 bg-gradient-to-br from-business/5 to-transparent border-business/10">
             <div className="flex items-center gap-3 mb-10">
                <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-business">
                  <Landmark className="size-5" />
                </div>
                <div>
                   <h3 className="text-lg font-bold">Annual Financial Requirement</h3>
                   <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest leading-none">Your Revenue Goal</p>
                </div>
             </div>

             <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <span className="text-sm text-muted-foreground">Total Annual Revenue Needed</span>
                    <span className="text-2xl font-bold font-mono tracking-tight">{formatCurrency(results.requiredGross)}</span>
                 </div>
                 <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-business h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(var(--business),0.3)]" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 pt-4">
                    <div>
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Time Budget</div>
                       <div className="text-sm font-semibold">{results.totalBillableHoursPerYear} Billable Hours / Year</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Goal</div>
                       <div className="text-sm font-semibold">{formatCurrency(results.monthlyRate)} Revenue / Mo</div>
                    </div>
                 </div>
             </div>
          </div>
          
          <div className="p-5 bg-secondary/20 rounded-2xl border border-border/50 flex gap-4">
             <div className="size-10 rounded-full bg-background flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                <HardHat className="size-5" />
             </div>
             <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Expert's Pro-Tip</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Always add a **20-30% buffer** to your calculated hourly rate to account for sick days, client acquisition time, and unexpected downturns. This calculator finds your absolute survival floor.
                </p>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
