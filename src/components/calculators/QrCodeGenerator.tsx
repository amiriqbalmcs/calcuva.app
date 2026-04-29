"use client";

import { useState } from "react";
import {
  QrCode, Download, Link as LinkIcon, Type, Smartphone, Share2,
  Copy, Check, Zap, Globe, Shield, Activity, Target, History,
  Landmark, Share, Settings2, ChevronRight, Calculator, Scale,
  RefreshCcw, Watch, CheckCircle2, FileText, Camera, Sparkles
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SITE_URL, SITE_DOMAIN } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";

const calc = calculatorBySlug("qr-code-generator");

const QrCodeGenerator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [content, setContent] = useState<string>(SITE_URL);
  const [size, setSize] = useState<number>(300);
  const [margin, setMargin] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}&margin=${margin}&bgcolor=ffffff`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calcuva-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR code", err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShare = () => {
    let text = `Generate custom QR assets instantly at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Strategy Architecture */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-4 relative z-10">
              <div className="space-y-1 relative z-10">
                <h3 className="text-sm font-bold tracking-tight">Create Your Code</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">What to Store</p>
              </div>
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid grid-cols-2 h-11 bg-background/50 border border-border/40 p-1 rounded-xl">
                  <TabsTrigger value="url" className="rounded-lg text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">URL Link</TabsTrigger>
                  <TabsTrigger value="text" className="rounded-lg text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Raw Text</TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="pt-6 space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Destination URI</Label>
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 font-bold text-base rounded-xl shadow-sm"
                    placeholder="https://..."
                  />
                </TabsContent>

                <TabsContent value="text" className="pt-6 space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payload Data</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[120px] bg-background border-border/60 focus:border-foreground/20 font-bold text-base rounded-xl shadow-sm resize-none"
                    placeholder="Enter alphanumeric payload..."
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-8 relative z-10 pt-4 border-t border-border/40">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Image Size</Label>
                  <span className="text-[10px] font-bold">{size}px</span>
                </div>
                <Slider value={[size]} min={100} max={1000} step={50} onValueChange={([v]) => setSize(v)} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Border Size (Margin)</Label>
                  <span className="text-[10px] font-bold">{margin}</span>
                </div>
                <Slider value={[margin]} min={0} max={10} step={1} onValueChange={([v]) => setMargin(v)} />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Zap className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">How It Works</h4>
                <p className="text-xs leading-relaxed font-medium">
                  Generated assets utilize high-fidelity Reed-Solomon error correction to ensure terminal readability across all modern vision systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-14 flex flex-col items-center justify-center space-y-12 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <QrCode className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="absolute top-8 left-8 flex items-center gap-3">
              <Smartphone className="size-4 text-muted-foreground/40" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">Static Asset Engine</span>
            </div>

            <div className="relative">
              <div className="absolute -inset-12 bg-foreground/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl border border-border/20 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-1">
                <img src={qrUrl} alt="Generated QR" className="size-56 md:size-64 object-contain mix-blend-multiply" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg relative z-10">
              <button
                onClick={handleDownload}
                className="flex-1 bg-foreground text-background h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-foreground/10 hover:translate-y-[-2px] active:translate-y-0 transition-all"
              >
                <Download className="size-4" /> Save as PNG
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 bg-background border border-border/60 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-secondary transition-all active:scale-95"
              >
                {copied ? <><Check className="size-4 text-finance" /> Link Copied</> : <><LinkIcon className="size-4" /> Copy QR Link</>}
              </button>
            </div>
          </div>
 
          {/* Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Format", v: "PNG", i: FileText },
              { l: "Size", v: `${size}px`, i: Target, unit: "" },
              { l: "Error Check", v: "High", i: Shield, unit: "" },
              { l: "Status", v: "Ready", i: Camera }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                </div>
                <div className="text-xl font-mono font-bold tabular-nums leading-tight">
                  {item.v}
                  {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                </div>
              </div>
            ))}
          </div>
 
          {/* QR Usage Cards */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Globe className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Digital Bridge</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                QR codes help you connect physical items (like business cards or posters) to digital websites instantly and easily.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <History className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Activity className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Static QR</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                These QR codes are permanent. Once created, they will always point to the same content without needing a server to work.
              </p>
            </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default QrCodeGenerator;
