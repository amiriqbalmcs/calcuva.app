"use client";

import { useState, useMemo } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Info, Zap, Sparkles, AlertCircle, BarChart3, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { calculatorBySlug, type CalcMeta } from "@/lib/calculators";

const calc = calculatorBySlug("ai-api-token-cost-calculator");

const MODELS = [
  { id: "claude-4-7-opus", name: "Claude 4.7 Opus", provider: "Anthropic", input: 5.00, output: 25.00 },
  { id: "claude-4-6-sonnet", name: "Claude 4.6 Sonnet", provider: "Anthropic", input: 3.00, output: 15.00 },
  { id: "claude-4-5-haiku", name: "Claude 4.5 Haiku", provider: "Anthropic", input: 1.00, output: 5.00 },
  { id: "gpt-5-4-omni", name: "GPT-5.4 Omni", provider: "OpenAI", input: 2.50, output: 15.00 },
  { id: "gpt-5-4-pro", name: "GPT-5.4 Pro", provider: "OpenAI", input: 30.00, output: 180.00 },
  { id: "gemini-3-1-pro", name: "Gemini 3.1 Pro", provider: "Google", input: 2.00, output: 12.00 },
  { id: "gemini-3-1-flash", name: "Gemini 3.1 Flash", provider: "Google", input: 0.30, output: 2.50 },
  { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro (Legacy)", provider: "Google", input: 1.25, output: 10.00 },
  { id: "gemini-2-5-flash", name: "Gemini 2.5 Flash", provider: "Google", input: 0.30, output: 2.50 },
  { id: "gemini-2-5-flash-lite", name: "Gemini 2.5 Flash-Lite", provider: "Google", input: 0.10, output: 0.40 },
  { id: "llama-4-405b", name: "Llama 4 405B (Groq)", provider: "Meta", input: 0.79, output: 0.79 },
  { id: "custom", name: "Custom Model", provider: "User", input: 0, output: 0 },
];

export default function AiTokenCalculator({ 
  calc, 
  guideHtml, 
  faqs, 
  relatedArticles 
}: { 
  calc: CalcMeta;
  guideHtml?: string;
  faqs?: any[];
  relatedArticles?: any[];
}) {
  const [modelId, setModelId] = useState("");
  const [inputTokens, setInputTokens] = useState<string>("1000000"); // 1M
  const [outputTokens, setOutputTokens] = useState<string>("500000"); // 500K
  const [useBatch, setUseBatch] = useState(false);
  const [useCaching, setUseCaching] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState<string>("0");
  const [customOutputPrice, setCustomOutputPrice] = useState<string>("0");

  const selectedModel = useMemo(() => {
    return MODELS.find(m => m.id === modelId) || null;
  }, [modelId]);

  const results = useMemo(() => {
    if (!selectedModel) {
      return { total: 0, inputCost: 0, outputCost: 0, inputPriceUsed: 0, outputPriceUsed: 0 };
    }

    const input = parseFloat(inputTokens) || 0;
    const output = parseFloat(outputTokens) || 0;
    
    let inputPricePerM = selectedModel.id === "custom" ? parseFloat(customInputPrice) : selectedModel.input;
    let outputPricePerM = selectedModel.id === "custom" ? parseFloat(customOutputPrice) : selectedModel.output;

    // Apply Caching Discount (Input only)
    if (useCaching) inputPricePerM *= 0.5;

    // Apply Batch Discount (Input and Output)
    if (useBatch) {
      inputPricePerM *= 0.5;
      outputPricePerM *= 0.5;
    }

    const inputCost = (input / 1000000) * inputPricePerM;
    const outputCost = (output / 1000000) * outputPricePerM;
    const totalCost = inputCost + outputCost;

    return {
      total: totalCost,
      inputCost,
      outputCost,
      inputPriceUsed: inputPricePerM,
      outputPriceUsed: outputPricePerM,
    };
  }, [selectedModel, inputTokens, outputTokens, useBatch, useCaching, customInputPrice, customOutputPrice]);

  const stats = [
    {
      label: "Total Estimated Cost",
      value: `$${results.total.toFixed(2)}`,
      description: "Based on total tokens",
      trend: results.total > 10 ? "up" : "down",
    },
    {
      label: "Input Cost",
      value: `$${results.inputCost.toFixed(2)}`,
      description: `@ $${results.inputPriceUsed.toFixed(2)} / 1M`,
    },
    {
      label: "Output Cost",
      value: `$${results.outputCost.toFixed(2)}`,
      description: `@ $${results.outputPriceUsed.toFixed(2)} / 1M`,
    },
  ];

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="surface-card p-8 bg-background border-border/40 shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-border/40 pb-6 mb-6">
               <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Sparkles className="size-5 text-foreground" />
               </div>
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">API Configuration</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Select model and token volume</p>
               </div>
            </div>
        {/* Model Selection */}
        <div className="space-y-2">
          <Label>Select AI Model</Label>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger className="h-12 border-slate-200 focus:ring-primary/20">
              <SelectValue placeholder="Choose a model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest bg-secondary px-1.5 py-0.5 rounded ml-2">{m.provider}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {modelId === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Input Price ($ per 1M)</Label>
              <Input
                type="number"
                value={customInputPrice}
                onChange={(e) => setCustomInputPrice(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Output Price ($ per 1M)</Label>
              <Input
                type="number"
                value={customOutputPrice}
                onChange={(e) => setCustomOutputPrice(e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        )}

        {/* Token Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Input Tokens (Prompt)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>How many tokens you send to the model.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(e.target.value)}
              className="h-12 border-slate-200"
            />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{(parseFloat(inputTokens)/1000000).toFixed(2)}M Tokens</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Output Tokens (Completion)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>How many tokens the model generates.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(e.target.value)}
              className="h-12 border-slate-200"
            />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{(parseFloat(outputTokens)/1000000).toFixed(2)}M Tokens</p>
          </div>
        </div>

        {/* Features / Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:border-primary/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Zap className="size-3.5 text-amber-500 fill-amber-500" />
                Batch API Mode
              </Label>
              <p className="text-[11px] text-muted-foreground">Process within 24h for 50% discount.</p>
            </div>
            <Switch checked={useBatch} onCheckedChange={setUseBatch} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:border-primary/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="size-3.5 text-blue-500" />
                Prompt Caching
              </Label>
              <p className="text-[11px] text-muted-foreground">Reuse context for 50% input discount.</p>
            </div>
            <Switch checked={useCaching} onCheckedChange={setUseCaching} />
          </div>
        </div>

        {/* Savings Tip */}
        {selectedModel && (selectedModel.id.includes("pro") || selectedModel.id.includes("opus") || selectedModel.id === "gpt-5-4-omni") ? (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
            <TrendingDown className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900">Cost Optimization Tip</p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                You are using a flagship model. Switching to <strong>{selectedModel.provider} {selectedModel.id.includes("gpt") ? "Flash-Lite" : "Flash"}</strong> could save you up to <strong>90%</strong> on this workload while maintaining high performance for simple tasks.
              </p>
            </div>
          </div>
        ) : null}

          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-xl space-y-8 sticky top-28 overflow-hidden">
            <div className="space-y-6 border-b border-border/40 pb-10">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. Total Cost</p>
                  <p className="text-5xl font-black tracking-tighter text-foreground">${results.total.toFixed(2)}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Input</p>
                    <p className="text-sm font-bold text-foreground/60">${results.inputCost.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Output</p>
                    <p className="text-sm font-bold text-foreground/60">${results.outputCost.toFixed(2)}</p>
                  </div>
               </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Projection</h4>
                <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest text-white border-white/20">2026</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">${(results.total * 30).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">30 Days @ Current Volume</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
              <p className="text-[10px] font-bold text-blue-900 uppercase flex items-center gap-2">
                <Info className="size-3" /> Efficiency Tip
              </p>
              <p className="text-[9px] text-blue-700 leading-relaxed font-medium">
                Tokens per $1: {(1 / (results.total / (parseFloat(inputTokens) + parseFloat(outputTokens)))).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
