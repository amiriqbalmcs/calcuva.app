"use client";

import { useState, useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CreditCard, Info, RefreshCcw, DollarSign, Calendar, Percent, TrendingDown } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ResultStat from "@/components/ResultStat";
import { cn } from "@/lib/utils";

interface CreditCardPayoffCalculatorProps {
  calc: any;
  guideHtml?: string;
}

export default function CreditCardPayoffCalculator({ calc, guideHtml }: CreditCardPayoffCalculatorProps) {
  const [balance, setBalance] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(18.9);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(200);

  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    
    // Check if payment covers at least the interest
    const interestCharge = balance * monthlyRate;
    if (monthlyPayment <= interestCharge && balance > 0) {
      return {
        monthsToPayoff: Infinity,
        totalInterest: Infinity,
        totalPaid: Infinity,
        chartData: []
      };
    }

    let currentBalance = balance;
    let months = 0;
    let totalInterest = 0;
    const chartData = [];

    // Limit to 30 years to avoid infinite loop
    while (currentBalance > 0 && months < 360) {
      const charge = currentBalance * monthlyRate;
      totalInterest += charge;
      currentBalance = currentBalance + charge - monthlyPayment;
      
      months++;
      
      if (months % 6 === 0 || currentBalance <= 0) {
        chartData.push({
          month: months,
          balance: Math.max(0, currentBalance),
        });
      }
    }

    return {
      monthsToPayoff: months,
      totalInterest,
      totalPaid: balance + totalInterest,
      chartData
    };
  }, [balance, interestRate, monthlyPayment]);

  const years = Math.floor(results.monthsToPayoff / 12);
  const remainingMonths = results.monthsToPayoff % 12;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="surface-card p-6 sm:p-8 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-finance/10 flex items-center justify-center text-finance shadow-inner">
                <CreditCard className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Debt Details</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">Input Variables</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Card Balance */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="balance">Current Balance</Label>
                  <span className="text-sm font-mono font-bold text-finance">{formatCurrency(balance)}</span>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="balance"
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="pl-9 h-12 bg-background/50 border-border/50 focus:border-finance/50 focus:ring-finance/10 transition-all rounded-xl"
                  />
                </div>
                <Slider
                  value={[balance]}
                  min={0}
                  max={50000}
                  step={100}
                  onValueChange={([v]) => setBalance(v)}
                  className="pt-2"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rate">Interest Rate (APR)</Label>
                  <span className="text-sm font-mono font-bold text-finance">{interestRate}%</span>
                </div>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="rate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="pl-9 h-12 bg-background/50 border-border/50 focus:border-finance/50 focus:ring-finance/10 transition-all rounded-xl"
                  />
                </div>
                <Slider
                  value={[interestRate]}
                  min={0}
                  max={35}
                  step={0.1}
                  onValueChange={([v]) => setInterestRate(v)}
                  className="pt-2"
                />
              </div>

              {/* Monthly Payment */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="payment">Monthly Payment</Label>
                  <span className="text-sm font-mono font-bold text-finance">{formatCurrency(monthlyPayment)}</span>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="payment"
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    className="pl-9 h-12 bg-background/50 border-border/50 focus:border-finance/50 focus:ring-finance/10 transition-all rounded-xl"
                  />
                </div>
                <Slider
                  value={[monthlyPayment]}
                  min={50}
                  max={5000}
                  step={10}
                  onValueChange={([v]) => setMonthlyPayment(v)}
                  className="pt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {results.monthsToPayoff === Infinity ? (
            <div className="surface-card p-12 flex flex-col items-center justify-center text-center space-y-4 border-destructive/20 bg-destructive/5">
              <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive animate-pulse">
                <Info className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Negative Amortization</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                  Your monthly payment of {formatCurrency(monthlyPayment)} is less than the interest charge. Your debt will grow forever. Increase your payment to at least {formatCurrency(balance * (interestRate/100/12) + 1)}.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultStat
                  label="Time to Debt Free"
                  value={results.monthsToPayoff < 12 
                    ? `${results.monthsToPayoff} Months` 
                    : `${years}y ${remainingMonths}m`}
                  description="Total duration to zero balance"
                  className="bg-finance/5 border-finance/10"
                  icon={Calendar}
                  valueClassName="text-finance"
                />
                <ResultStat
                  label="Total Interest"
                  value={formatCurrency(results.totalInterest)}
                  description="Extra cost of borrowing"
                  className="bg-finance/5 border-finance/10"
                  icon={RefreshCcw}
                  valueClassName="text-finance"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <ResultStat
                  label="Total Amount Paid"
                  value={formatCurrency(results.totalPaid)}
                  description="Principal + Total Interest"
                  className="bg-finance/5 border-finance/10"
                  icon={DollarSign}
                  valueClassName="text-finance text-3xl"
                />
              </div>

              <div className="surface-card p-6 h-[300px]">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingDown className="size-4 text-finance" />
                  <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Balance Projection</h3>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--finance))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--finance))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(v) => `Mo ${v}`}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                      formatter={(v: any) => [formatCurrency(v), "Balance"]}
                      labelFormatter={(l) => `Month ${l}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="hsl(var(--finance))" 
                      fillOpacity={1} 
                      fill="url(#colorBalance)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
}
