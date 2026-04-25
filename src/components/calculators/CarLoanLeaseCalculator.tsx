"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, Car, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("car-loan-vs-lease-calculator")!;

const CarLoanLeaseCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [carPrice, setCarPrice] = useUrlState<number>("cp", 35000);
  const [downPayment, setDownPayment] = useUrlState<number>("dp", 5000);
  const [loanRate, setLoanRate] = useUrlState<number>("lr", 5.5);
  const [loanTerm, setLoanTerm] = useUrlState<number>("lt", 60);
  const [leasePayment, setLeasePayment] = useUrlState<number>("lp", 450);
  const [leaseTerm, setLeaseTerm] = useUrlState<number>("lst", 36);
  const [dueAtSigning, setDueAtSigning] = useUrlState<number>("ds", 2500);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const principal = carPrice - downPayment;
    const i = loanRate / 100 / 12;
    const loanMonthly = principal * (i * Math.pow(1 + i, loanTerm)) / (Math.pow(1 + i, loanTerm) - 1);
    const totalLoanCost = (loanMonthly * loanTerm) + downPayment;
    const totalLeaseCost = (leasePayment * leaseTerm) + dueAtSigning;
    
    let insight = "";
    if (loanMonthly > leasePayment * 1.5) insight = "Cash-Flow Warning: Buying requires 50% more monthly liquidity than leasing. This builds equity but strains short-term monthly budgets.";
    else if (totalLoanCost < totalLeaseCost * 1.2) insight = "Ownership Advantage: Buying is significantly cheaper over the long horizon. You are paying a small premium for full asset ownership.";
    else insight = "Leasing Strategy: Your lease terms are aggressive. At the end of the term, you will have zero equity. Consider this if you prefer upgrading your vehicle every 3 years.";

    return { loanMonthly, totalLoanCost, totalLeaseCost, insight };
  }, [carPrice, downPayment, loanRate, loanTerm, leasePayment, leaseTerm, dueAtSigning]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={<SeoBlock title="Lease vs Loan Analysis" intro="Decide between vehicle ownership and flexible leasing using real-world financing math." />}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="surface-card p-6 space-y-4 border-signal/10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[10px] uppercase tracking-widest text-signal">Loan Parameters</h3>
              <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-signal hover:text-white transition flex items-center gap-1">
                {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
                {copied ? "COPIED" : "SHARE"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price</Label><Input type="number" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
              <div><Label>Down</Label><Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value) || 0)} className="mt-2" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div><Label>Rate %</Label><Input type="number" value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value) || 0)} className="mt-2" /></div>
               <div><Label>Months</Label><Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value) || 0)} className="mt-2" /></div>
            </div>
          </div>

          <div className="surface-card p-6 space-y-4 border-business/10">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-business">Lease Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Monthly</Label><Input type="number" value={leasePayment} onChange={(e) => setLeasePayment(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
              <div><Label>Due at Signing</Label><Input type="number" value={dueAtSigning} onChange={(e) => setDueAtSigning(Number(e.target.value) || 0)} className="mt-2" /></div>
            </div>
            <div><Label>Months</Label><Input type="number" value={leaseTerm} onChange={(e) => setLeaseTerm(Number(e.target.value) || 0)} className="mt-2" /></div>
          </div>
        </div>

        <div className="space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Loan Monthly" value={formatCurrency(stats.loanMonthly)} accent />
            <ResultStat label="Lease Monthly" value={formatCurrency(leasePayment)} className="bg-business text-white border-business" />
          </ResultGrid>
          
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-signal-soft border-signal text-signal">
            <div className="shrink-0 mt-0.5"><Car className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Vehicle Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{stats.insight}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <ResultStat label="Total Payable (Loan)" value={formatCurrency(stats.totalLoanCost)} />
            <ResultStat label="Total Payable (Lease)" value={formatCurrency(stats.totalLeaseCost)} />
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default CarLoanLeaseCalculator;
