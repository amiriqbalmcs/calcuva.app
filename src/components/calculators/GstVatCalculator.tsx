"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, Receipt, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("gst-vat-tax-calculator")!;

const COMMON_RATES = [5, 12, 18, 20, 25];

const GstVatCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [mode, setMode] = useUrlState<"add" | "remove">("m", "add");
  const [amount, setAmount] = useUrlState<number>("iv", 1000);
  const [rate, setRate] = useUrlState<number>("r", 18);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100;
    if (mode === "add") {
      const tax = amount * r;
      return { net: amount, tax, total: amount + tax };
    } else {
      const net = amount / (1 + r);
      const tax = amount - net;
      return { net, tax, total: amount };
    }
  }, [mode, amount, rate]);

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
      seoContent={<SeoBlock title="Global Tax Arithmetic" intro="Calculate Sales Tax, GST, or VAT for any business transaction globally." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Tax Rules</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-finance hover:text-white transition flex items-center gap-1 font-mono">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="add">Inclusive (+)</TabsTrigger>
              <TabsTrigger value="remove">Exclusive (-)</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4 pt-2">
            <div><Label>{mode === "add" ? "Original Price" : "Stated Total"}</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
            <div>
              <Label>Tax Rate (%)</Label>
              <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} className="mt-2" />
              <div className="flex flex-wrap gap-2 mt-4">
                {COMMON_RATES.map((r) => (
                  <button key={r} onClick={() => setRate(r)} className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold transition", rate === r ? "bg-finance text-white" : "bg-secondary text-muted-foreground")}>{r}%</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={1}>
            <ResultStat label={mode === "add" ? "Total Price (Tax Included)" : "Net Price (Before Tax)"} value={formatCurrency(mode === "add" ? result.total : result.net, currency)} accent />
          </ResultGrid>
          <div className="grid grid-cols-2 gap-4">
            <ResultStat label="Tax Portion" value={formatCurrency(result.tax, currency)} sub={`${rate}% ${mode === "add" ? "surcharge" : "extraction"}`} />
            <ResultStat label="Anchor Amount" value={formatCurrency(amount, currency)} />
          </div>

          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-finance-soft border-finance text-finance">
            <div className="shrink-0 mt-0.5"><Receipt className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Fiscal Note</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">
                {mode === "add" ? `Applying a ${rate}% tax results in a total increase of ${formatCurrency(result.tax, currency)}.` : `Removing ${rate}% tax from the total reveals a base price of ${formatCurrency(result.net, currency)}.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default GstVatCalculator;
