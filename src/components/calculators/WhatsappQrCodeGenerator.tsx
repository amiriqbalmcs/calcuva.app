"use client";

import { useState } from "react";
import {
  MessageSquare, Download, Link as LinkIcon, Phone, MessageCircle,
  Settings2, Shield, Zap, Sparkles, Smartphone, Camera, Target, FileText, Check, QrCode
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";

const calc = calculatorBySlug("whatsapp-qr-code-generator");

const WhatsappQrCodeGenerator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(1);
  const [copied, setCopied] = useState(false);

  const cleanPhone = phone.replace(/\D/g, '');
  const payload = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&margin=${margin}&bgcolor=ffffff`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `whatsapp-qr-code-${cleanPhone || 'chat'}.png`;
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

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <MessageCircle className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">WhatsApp Settings</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Chat Configuration</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number (with Country Code)</Label>
                  <div className="relative">
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 bg-background border-border/60 focus:border-foreground/20 font-bold text-sm rounded-xl pl-10"
                      placeholder="e.g. 1234567890"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 italic ml-1">Do not include +, -, or spaces.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pre-filled Message (Optional)</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] bg-background border-border/60 focus:border-foreground/20 font-bold text-sm rounded-xl resize-none"
                    placeholder="Hello! I'm interested in..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 relative z-10 pt-6 border-t border-border/40">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resolution</Label>
                  <span className="text-[10px] font-bold">{size}px</span>
                </div>
                <Slider value={[size]} min={100} max={1000} step={50} onValueChange={([v]) => setSize(v)} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Margin</Label>
                  <span className="text-[10px] font-bold">{margin}</span>
                </div>
                <Slider value={[margin]} min={0} max={10} step={1} onValueChange={([v]) => setMargin(v)} />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Shield className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Zap className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Direct Connection</h4>
                <p className="text-xs leading-relaxed font-medium">
                  This QR code uses the official WhatsApp API link to ensure reliable chat opens across all devices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="surface-card p-8 md:p-14 flex flex-col items-center justify-center space-y-12 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <MessageSquare className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="absolute top-8 left-8 flex items-center gap-3">
              <Smartphone className="size-4 text-muted-foreground/40" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">Scan to Open Chat</span>
            </div>

            <div className="relative">
              <div className="absolute -inset-12 bg-foreground/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl border border-border/20 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-1">
                <img src={qrUrl} alt="WhatsApp QR Code" className="size-56 md:size-64 object-contain mix-blend-multiply" />
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
                {copied ? <><Check className="size-4 text-finance" /> Link Copied</> : <><LinkIcon className="size-4" /> Copy Image URL</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Platform", v: "WhatsApp", i: MessageSquare },
              { l: "Protocol", v: "wa.me", i: FileText },
              { l: "Status", v: "Encrypted", i: Shield },
              { l: "Speed", v: "Instant", i: Zap }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                </div>
                <div className="text-xs font-mono font-bold uppercase leading-tight">{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default WhatsappQrCodeGenerator;
