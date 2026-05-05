"use client";

import { useState } from "react";
import {
  Contact2, Download, Link as LinkIcon, User, Briefcase, Mail, Phone, Globe,
  Settings2, Shield, Zap, Sparkles, Smartphone, Camera, Target, FileText, Check, QrCode
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";

const calc = calculatorBySlug("vcard-qr-code-generator");

const VCardQrCodeGenerator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(1);
  const [copied, setCopied] = useState(false);

  const payload = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName};;;\nFN:${firstName} ${lastName}\nORG:${org}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nEND:VCARD`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&margin=${margin}&bgcolor=ffffff`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vcard-qr-code-${firstName || 'contact'}.png`;
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
            <Contact2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">Contact Details</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Identity Info</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 bg-background border-border/60 focus:border-foreground/20 font-bold text-sm rounded-xl"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 bg-background border-border/60 focus:border-foreground/20 font-bold text-sm rounded-xl"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                  <div className="relative">
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 bg-background border-border/60 focus:border-foreground/20 font-bold text-sm rounded-xl pl-10"
                      placeholder="+1 234 567 890"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <div className="relative">
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-background border-border/60 focus:border-foreground/20 font-bold text-sm rounded-xl pl-10"
                      placeholder="jane@example.com"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Organization</Label>
                  <div className="relative">
                    <Input
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      className="h-12 bg-background border-border/60 focus:border-foreground/20 font-bold text-sm rounded-xl pl-10"
                      placeholder="Company Name"
                    />
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  </div>
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
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="surface-card p-8 md:p-14 flex flex-col items-center justify-center space-y-12 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Contact2 className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="absolute top-8 left-8 flex items-center gap-3">
              <Smartphone className="size-4 text-muted-foreground/40" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">Scan to Save Contact</span>
            </div>

            <div className="relative">
              <div className="absolute -inset-12 bg-foreground/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl border border-border/20 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-1">
                <img src={qrUrl} alt="vCard QR Code" className="size-56 md:size-64 object-contain mix-blend-multiply" />
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
              { l: "Format", v: "vCard 3.0", i: FileText },
              { l: "Security", v: "Static", i: Shield },
              { l: "Privacy", v: "Local", i: Zap },
              { l: "Type", v: "Digital Card", i: Sparkles }
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

export default VCardQrCodeGenerator;
