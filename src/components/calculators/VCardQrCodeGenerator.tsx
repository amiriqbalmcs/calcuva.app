"use client";

import { useState, useRef } from "react";
import {
  Contact2, Download, Link as LinkIcon, User, Briefcase, Mail, Phone, Globe,
  Settings2, Shield, Zap, Sparkles, Smartphone, Camera, Target, FileText, Check, QrCode, Palette,
  Upload, ShieldCheck, FileCode, Info, Grid, Circle, Square as SquareIcon, Hexagon, Droplets, Layout
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { PremiumQrRenderer } from "@/components/PremiumQrRenderer";
import { HowToGuide } from "@/components/HowToGuide";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const calc = calculatorBySlug("vcard-qr-code-generator")!;

const LOGO_PRESETS = [
  { id: "none", label: "None", src: null },
  { id: "profile", label: "Profile", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==" },
  { id: "contact2", label: "Contact", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTcgMjF2LTJhNCA0IDAgMCAwLTQtNEg1YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI3IiByPSI0Ii8+PHBhdGggZD0iTTIzIDIxdi0yYTQgNCAwIDAgMC0zLTMuODciLz48cGF0aCBkPSJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1Ii8+PC9zdmc+" },
  { id: "mail", label: "Email", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCA0aDE2YzEuMSAwIDIgLjkgMiAydjEyYzAgMS4xLS45IDItMiAySDRjLTEuMSAwLTItLjktMi0yVjZjMC0xLjEuOS0yIDItMnoiLz48cG9seWxpbmUgcG9pbnRzPSIyMiw2IDEyLDEzIDIsNiIvPjwvc3ZnPg==" },
  { id: "phone", label: "Phone", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjIgMTYuOTJ2M2EyIDIgMCAwIDEtMi4xOCAyIDE5Ljc5IDE5Ljc5IDAgMCAxLTguNjMtMy4wN0ExOS41IDE5LjUgMCAwIDEgNC42OSAxMiAxOS43OSAxOS43OSAwIDAgMSAxLjYxIDMuNDEgMiAyIDAgMCAxIDMuNiAxaDNhMiAyIDAgMCAxIDIgMS43MmMuMTI3Ljk2LjM2MSAxLjkwMy43IDIuODFhMiAyIDAgMCAxLS40NSAyLjExTDcuOTEgOC42YTE2IDE2IDAgMCAwIDYuMjkgNi4yOWwuOTQtLjk0YTIgMiAwIDAgMSAyLjExLS40NWMuOTA3LjMzOSAxLjg1LjU3MyAyLjgxLjdBMiAyIDAgMCAxIDIyIDE2LjkyeiIvPjwvc3ZnPg==" },
  { id: "globe", label: "Globe", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIyIiB5MT0iMTIiIHgyPSIyMiIgeTI9IjEyIi8+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ii8+PC9zdmc+" },
  { id: "lock", label: "Lock", src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIxMSIgd2lkdGg9IjE4IiBoZWlnaHQ9IjExIiByeD0iMiIgcnk9IjIiLz48cGF0aCBkPSJNNyAxMVY3YTUgNSAwIDAgMSAxMCAwdjQiLz48L3N2Zz4=" },
];

const FRAMES = [
  { id: "none", label: "None" },
  { id: "modern", label: "Modern" },
  { id: "badge", label: "Scan Badge" },
  { id: "minimal", label: "Minimal" },
  { id: "phone", label: "Phone" },
  { id: "ribbon", label: "Ribbon" },
  { id: "industrial", label: "Industrial" },
  { id: "glass", label: "Glass" },
  { id: "polaroid", label: "Polaroid" },
  { id: "neon", label: "Neon" },
  { id: "ticket", label: "Ticket" },
  { id: "label", label: "Label" },
];

const DOT_STYLES = [
  { id: "square", label: "Square", icon: SquareIcon },
  { id: "rounded", label: "Rounded", icon: Circle },
  { id: "dots", label: "Dots", icon: Grid },
  { id: "classy", label: "Classy", icon: Sparkles },
  { id: "classy-rounded", label: "Classy-R", icon: Sparkles },
  { id: "extra-rounded", label: "Smooth", icon: Circle },
];

const EYE_STYLES = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "extra-rounded", label: "Smooth" },
];

const PATTERNS = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "waves", label: "Waves" },
];

const PRESETS = [
  { id: "pro-contact", label: "Executive", config: { fgColor: "#0f172a", gradientColor: "#334155", dotStyle: "classy-rounded", eyeStyle: "extra-rounded", pattern: "grid", holographic: true } },
  { id: "creative", label: "Creative", config: { fgColor: "#d946ef", gradientColor: "#8b5cf6", dotStyle: "dots", eyeStyle: "rounded", pattern: "waves", holographic: true } },
  { id: "neon", label: "Neon Cyber", config: { fgColor: "#f0abfc", gradientColor: "#818cf8", dotStyle: "classy", eyeStyle: "extra-rounded", pattern: "grid", holographic: true } },
  { id: "royal", label: "Royal Gold", config: { fgColor: "#fbbf24", gradientColor: "#d97706", dotStyle: "rounded", eyeStyle: "rounded", pattern: "dots", holographic: true } },
  { id: "ocean", label: "Ocean", config: { fgColor: "#0ea5e9", gradientColor: "#6366f1", dotStyle: "dots", eyeStyle: "extra-rounded", pattern: "dots", holographic: true } },
  { id: "eco", label: "Eco Leaf", config: { fgColor: "#22c55e", gradientColor: "#15803d", dotStyle: "extra-rounded", eyeStyle: "rounded", pattern: "waves", holographic: false } },
];

const VCardQrCodeGenerator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [org, setOrg] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientColor, setGradientColor] = useState("#4f46e5");
  const [logo, setLogo] = useState("profile");
  const [logoSize, setLogoSize] = useState(0.22);
  const [logoColor, setLogoColor] = useState('#000000');
  const [logoBgColor, setLogoBgColor] = useState('#ffffff');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">("H");
  const [frame, setFrame] = useState("none");
  const [dotStyle, setDotStyle] = useState<any>("square");
  const [eyeStyle, setEyeStyle] = useState<any>("square");
  const [pattern, setPattern] = useState<any>("none");
  const [holographic, setHolographic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(280);
  const [gradientAngle, setGradientAngle] = useState(45);
  const [gradientType, setGradientType] = useState<'linear'|'radial'>('linear');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [frameText, setFrameText] = useState('Scan My Card');
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id);
    setFgColor(preset.config.fgColor);
    setGradientColor(preset.config.gradientColor);
    setGradientMode(true);
    setDotStyle(preset.config.dotStyle);
    setEyeStyle(preset.config.eyeStyle);
    setPattern(preset.config.pattern);
    setHolographic(preset.config.holographic);
  };

  const payload = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};

  // Payload Density Calculation
  const density = payload.length;
  const densityPct = Math.min(100, Math.round((density / 500) * 100));
  const densityStatus = density < 100 ? "Low" : density < 300 ? "Medium" : "High";
  const densityColor = density < 100 ? "text-emerald-500" : density < 300 ? "text-amber-500" : "text-rose-500";
  const densityBarColor = density < 100 ? "bg-emerald-500" : density < 300 ? "bg-amber-500" : "bg-rose-500";${firstName};;;\nFN:${firstName} ${lastName}\nORG:${org}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nURL:${website}\nEND:VCARD`;

  const handleDownload = async (format: 'png' | 'svg' | 'jpeg') => {
    if (!qrRef.current) return;
    try {
      if (format === 'svg') {
        const svgElement = qrRef.current.querySelector('svg');
        if (!svgElement) return;
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(svgBlob);
        link.download = `vcard-qr-${firstName || 'contact'}.svg`;
        link.click();
      } else {
        const { toPng: toPngFn, toJpeg } = await import('html-to-image');
        const fn = format === 'jpeg' ? toJpeg : toPngFn;
        const dataUrl = await fn(qrRef.current, { quality: 0.95, pixelRatio: 3, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qr-code-${Date.now()}.${format}`;
        link.click();
      }
    } catch (err) { console.error(err); }
  };

  const handleShare = async () => {
    if (!qrRef.current) return;
    try {
      const { toPng: toPngFn } = await import('html-to-image');
      const dataUrl = await toPngFn(qrRef.current, { quality: 1, pixelRatio: 3, backgroundColor: '#ffffff' });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'vcard-qr.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Contact Card', text: 'Scan to save contact' });
      }
    } catch {}
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
        setLogo("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;
  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Control Architecture */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Contact2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            {/* Contact Details */}
            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">1. Contact Data</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Identity Payload</p>
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

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website / Portfolio</Label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourlink.com"
                    className="h-9 text-sm bg-background border-border/60 rounded-xl"
                  />
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

            {/* Aesthetic Configuration */}
            <div className="space-y-6 relative z-10 pt-4 border-t border-border/40">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">2. Aesthetic</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Style & Branding</p>
              </div>

              {/* Presets Row */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Premium Themes</Label>
                <div className="flex gap-4 overflow-x-auto px-1 py-4 no-scrollbar scroll-smooth">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      className="flex-shrink-0 flex flex-col items-center gap-2"
                    >
                      <div className={`size-12 rounded-xl border-2 transition-all flex items-center justify-center bg-slate-50 overflow-hidden shadow-sm ${activePreset === p.id ? 'border-foreground shadow-md scale-110' : 'border-transparent hover:border-foreground/40'}`}>
                        <div className="size-8 rounded-full shadow-inner" style={{ background: `linear-gradient(135deg, ${p.config.fgColor}, ${p.config.gradientColor})` }} />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-tighter ${activePreset === p.id ? 'opacity-100' : 'opacity-50'}`}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid grid-cols-3 h-10 bg-background/50 border border-border/40 p-1 rounded-xl mb-6">
                  <TabsTrigger value="colors" className="text-[9px] font-bold uppercase tracking-widest">Colors</TabsTrigger>
                  <TabsTrigger value="shapes" className="text-[9px] font-bold uppercase tracking-widest">Shapes</TabsTrigger>
                  <TabsTrigger value="frames" className="text-[9px] font-bold uppercase tracking-widest">Frames</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-5">
                  {/* Color Mode */}
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Color Mode</Label>
                    <div className="flex gap-1">
                      {(['solid', 'gradient'] as const).map((m) => (
                        <button key={m} onClick={() => setGradientMode(m === 'gradient')} className={cn("px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all border", gradientMode === (m === 'gradient') ? "bg-foreground text-background border-foreground" : "bg-background border-border/60 text-muted-foreground")}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Pickers — always show all 3 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{gradientMode ? 'From' : 'Dots'}</Label>
                      <div className="flex gap-1.5 items-center">
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="size-8 rounded-lg cursor-pointer bg-transparent flex-shrink-0" />
                        <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-8 text-[9px] font-mono p-1 text-center w-full" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className={cn("text-[10px] font-bold uppercase tracking-wider", gradientMode ? "text-muted-foreground" : "text-muted-foreground/30")}>To</Label>
                      <div className="flex gap-1.5 items-center">
                        <input type="color" value={gradientColor} onChange={(e) => setGradientColor(e.target.value)} disabled={!gradientMode} className="size-8 rounded-lg cursor-pointer bg-transparent flex-shrink-0 disabled:opacity-30" />
                        <Input value={gradientColor} onChange={(e) => setGradientColor(e.target.value)} disabled={!gradientMode} className="h-8 text-[9px] font-mono p-1 text-center w-full disabled:opacity-30" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">BG</Label>
                      <div className="flex gap-1.5 items-center">
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="size-8 rounded-lg cursor-pointer bg-transparent flex-shrink-0" />
                        <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-[9px] font-mono p-1 text-center w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Gradient Controls */}
                  {gradientMode && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Direction</Label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['linear','radial'] as const).map((t) => (
                            <button key={t} onClick={() => setGradientType(t)} className={cn("py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all", gradientType === t ? "bg-foreground text-background border-foreground" : "bg-background border-border/60")}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      {gradientType === 'linear' && (
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Angle: {gradientAngle}°</Label>
                          <input type="range" min="0" max="360" value={gradientAngle} onChange={(e) => setGradientAngle(Number(e.target.value))} className="w-full accent-foreground" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* QR Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">QR Size</Label>
                      <span className="text-[9px] font-mono font-bold text-muted-foreground">{size}px</span>
                    </div>
                    <input type="range" min="160" max="400" step="20" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-foreground" />
                  </div>

                  {/* Background Pattern */}
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Background Pattern</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {PATTERNS.map((p) => (
                        <button key={p.id} onClick={() => setPattern(p.id)} className={cn("px-2 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-tight transition-all", pattern === p.id ? "bg-foreground text-background border-foreground shadow-sm" : "bg-background border-border/60")}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shapes" className="space-y-6">
                  {/* Module Styles */}
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Module Shape</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {DOT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setDotStyle(style.id)}
                          className={cn(
                            "flex items-center justify-center gap-1.5 h-10 rounded-xl border text-[9px] font-bold uppercase transition-all",
                            dotStyle === style.id ? "bg-foreground text-background border-foreground shadow-md" : "bg-background border-border/60 hover:border-foreground/20"
                          )}
                        >
                          <style.icon className="size-3" />
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Eye Styles */}
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Eye Style</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {EYE_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setEyeStyle(style.id)}
                          className={cn(
                            "h-10 rounded-xl border text-[9px] font-bold uppercase transition-all",
                            eyeStyle === style.id ? "bg-foreground text-background border-foreground shadow-md" : "bg-background border-border/60 hover:border-foreground/20"
                          )}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Effects Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/60">
                    <div className="space-y-0.5">
                      <Label className="text-[10px] font-bold uppercase flex items-center gap-1.5">
                        <Sparkles className="size-3 text-indigo-500" /> Holographic
                      </Label>
                      <p className="text-[8px] text-muted-foreground font-medium">Shine effect on hover</p>
                    </div>
                    <button
                      onClick={() => setHolographic(!holographic)}
                      className={cn(
                        "w-10 h-5 rounded-full transition-all relative",
                        holographic ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 size-3 rounded-full bg-white transition-all",
                        holographic ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="frames" className="space-y-6">
                  {/* Branding Overlays */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Logo Overlay</Label>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-finance hover:text-finance/80 transition-colors"
                      >
                        <Upload className="size-3" /> Upload Custom
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {LOGO_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { setLogo(p.id); setCustomLogo(null); }}
                          className={cn(
                            "size-10 rounded-xl border flex items-center justify-center transition-all",
                            logo === p.id && !customLogo ? "bg-foreground text-background border-foreground shadow-lg scale-110" : "bg-background border-border/60 hover:border-foreground/20"
                          )}
                          title={p.label}
                        >
                          {p.src ? <img src={p.src} alt={p.label} className="size-4" style={{filter: logo === p.id && !customLogo ? "brightness(0) invert(1)" : "brightness(0)"}} /> : <QrCode className="size-4" style={{opacity: logo === p.id && !customLogo ? 1 : 0.6}} />}
                        </button>
                      ))}
                      {customLogo && (
                        <button
                          onClick={() => setLogo("custom")}
                          className={cn(
                            "size-10 rounded-xl border flex items-center justify-center transition-all overflow-hidden",
                            logo === "custom" ? "border-finance shadow-lg scale-110 ring-2 ring-finance/20" : "border-border/60"
                          )}
                        >
                          <img src={customLogo} alt="Custom" className="size-full object-cover" />
                        </button>
                      )}
                    </div>

                    {/* Logo Options */}
                    {(logo !== 'none' || customLogo) && (
                      <div className="space-y-3 pt-3 border-t border-border/20">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Logo Options</Label>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-muted-foreground">Size</span>
                            <span className="text-[9px] font-mono font-bold text-muted-foreground">{Math.round(logoSize * 100)}%</span>
                          </div>
                          <input type="range" min="0.10" max="0.38" step="0.02" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full accent-foreground" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Icon Color</Label>
                            <div className="flex gap-1.5 items-center">
                              <input type="color" value={logoColor} onChange={(e) => setLogoColor(e.target.value)} className="size-8 rounded-lg cursor-pointer bg-transparent flex-shrink-0" />
                              <Input value={logoColor} onChange={(e) => setLogoColor(e.target.value)} className="h-8 text-[9px] font-mono p-1 text-center w-full" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Badge BG</Label>
                            <div className="flex gap-1.5 items-center">
                              <input type="color" value={logoBgColor} onChange={(e) => setLogoBgColor(e.target.value)} className="size-8 rounded-lg cursor-pointer bg-transparent flex-shrink-0" />
                              <Input value={logoBgColor} onChange={(e) => setLogoBgColor(e.target.value)} className="h-8 text-[9px] font-mono p-1 text-center w-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Frame Selection */}
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Custom Frame</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {FRAMES.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFrame(f.id)}
                          className={cn(
                            "h-10 rounded-xl border text-[9px] font-bold uppercase tracking-tight transition-all",
                            frame === f.id ? "bg-foreground text-background border-foreground shadow-md" : "bg-background border-border/60 hover:border-foreground/20"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Frame Text */}
                  {frame !== 'none' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Frame Text</Label>
                      <Input
                        value={frameText}
                        onChange={(e) => setFrameText(e.target.value)}
                        placeholder="e.g. Scan Me, Visit Menu..."
                        className="h-9 text-sm bg-background border-border/60 rounded-xl"
                        maxLength={30}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* ECC Control */}
              <div className="flex justify-between items-center pt-2 border-t border-border/20">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Error Correction</Label>
                  <p className="text-[8px] text-muted-foreground leading-none">Higher ECC = Better for vCards</p>
                </div>
                <div className="flex bg-background border border-border/60 rounded-lg p-1">
                  {(["L", "M", "Q", "H"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setEcc(l)}
                      className={cn(
                        "px-2.5 py-1 text-[9px] font-black rounded-md transition-all",
                        ecc === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-5 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 relative overflow-hidden group shadow-sm">
            <div className="flex gap-4 items-center relative z-10">
              <ShieldCheck className="size-5" />
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Privacy First</h4>
                <p className="text-[9px] font-medium leading-relaxed opacity-80">
                  Your contact data is processed entirely in-browser.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Guide */}
          {calc.howTo && (
            <HowToGuide 
              id="how-to-use"
              steps={calc.howTo!.steps} 
              proTip={calc.howTo!.proTip} 
              variant="sidebar" 
            />
          )}
        </div>

        {/* Asset Dashboard */}
        <div className="lg:col-span-8 space-y-8 min-w-0 order-1 lg:order-2">

          {/* Asset Preview */}
          <div className="surface-card w-full p-8 md:p-14 flex flex-col items-center justify-center space-y-12 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Contact2 className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="absolute top-8 left-8 flex items-center gap-3">
              <Sparkles className="size-4 text-finance/60 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">Premium Asset View</span>
            </div>

            <div className="w-full max-w-full min-w-0 overflow-hidden rounded-[3rem]">
              <div className="w-full overflow-x-auto pb-8 no-scrollbar touch-pan-x">
                <div className="w-max mx-auto">
                <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-sm border border-black/[0.02]" ref={qrRef}>
              <div className="relative">
              {/* Dynamic Frame Wrapper */}
              <div className={cn(
                "relative transition-all duration-700 bg-white group/frame overflow-hidden",
                frame === 'none' && "p-2 rounded-2xl",
                frame === 'modern' && "p-10 rounded-[3.5rem] border-[14px] shadow-2xl shadow-black/10",
                frame === 'badge' && "p-8 pb-32 rounded-[4rem] shadow-[0_35px_80px_-15px_rgba(0,0,0,0.15)] bg-gradient-to-b from-white to-slate-50",
                frame === 'minimal' && "p-4 rounded-[2.5rem] ring-1 ring-black/5 shadow-2xl shadow-black/5",
                frame === 'phone' && "p-6 pt-16 pb-20 rounded-[3.5rem] border-[10px] border-slate-900 shadow-2xl bg-slate-950",
                frame === 'ribbon' && "p-8 pb-24 rounded-3xl shadow-2xl border-t-[12px]",
                frame === 'industrial' && "p-8 pb-14 rounded-lg border-2 border-slate-400 bg-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]",
                frame === 'glass' && "p-8 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl",
                frame === 'polaroid' && "p-6 pb-24 rounded-sm bg-white shadow-xl border border-black/5",
                frame === 'neon' && "p-8 rounded-3xl bg-slate-950 border-2 border-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.5)]",
                frame === 'ticket' && "p-8 pb-28 rounded-3xl border-2 border-dashed bg-white shadow-xl",
                frame === 'label' && "p-8 pt-16 pb-16 rounded-xl border bg-white shadow-lg"
              )}
              style={
                frame === 'modern' ? { borderColor: fgColor } : 
                frame === 'ribbon' ? { borderTopColor: fgColor } : 
                frame === 'industrial' ? { borderColor: fgColor + '40' } : 
                frame === 'neon' ? { borderColor: fgColor + '40', boxShadow: `0 0 50px -12px ${fgColor}80` } : {}
              }
              >
                {/* Industrial Frame Corners */}
                {frame === 'industrial' && (
                  <>
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: fgColor }} />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: fgColor }} />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: fgColor }} />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: fgColor }} />
                  </>
                )}

                {/* Glass Frame Overlay */}
                {frame === 'glass' && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-md border border-white/20" />
                )}

                <div className={cn(
                  "bg-white p-6 rounded-[2rem] shadow-inner border border-black/[0.03] relative z-10",
                  frame === 'glass' && "bg-white/80 backdrop-blur-sm",
                  frame === 'phone' && "rounded-[2.5rem]"
                )}>
                  <PremiumQrRenderer
                    value={payload}
                    size={size}
                    level={ecc}
                    fgColor={fgColor}
                    gradientColor={gradientMode ? gradientColor : undefined}
                    gradientType={gradientType}
                    gradientAngle={gradientAngle}
                    bgColor={bgColor}
                    dotStyle={dotStyle}
                    eyeStyle={eyeStyle}
                    eyeDotStyle={eyeStyle === "extra-rounded" ? "dot" : "square"}
                    pattern={pattern}
                    holographic={holographic}
                    logo={customLogo || (logo !== "none" ? LOGO_PRESETS.find(p => p.id === logo)?.src || undefined : undefined)}
                    logoSize={logoSize}
                    logoColor={logoColor}
                    logoBgColor={logoBgColor}
                  />
                </div>
                
                {/* Frame CTA Overlays */}
                {frame === 'badge' && (
                  <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
                      <User className="size-4" style={{ color: fgColor }} />
                    </div>
                    <p className="text-[16px] font-black uppercase tracking-[0.4em] leading-none" style={{ color: fgColor }}>{frameText}</p>
                    <div className="flex gap-2 items-center opacity-30 mt-0.5">
                      <div className="h-[2px] w-8 rounded-full" style={{ backgroundColor: fgColor }} />
                      <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: fgColor }}>SCAN TO VIEW</span>
                      <div className="h-[2px] w-8 rounded-full" style={{ backgroundColor: fgColor }} />
                    </div>
                  </div>
                )}

                {frame === 'industrial' && (
                  <div className="absolute bottom-6 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] pl-[0.6em]" style={{ color: fgColor }}>{frameText}</p>
                  </div>
                )}

                {frame === 'ribbon' && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center" style={{ backgroundColor: fgColor }}>
                    <p className="text-white text-[12px] font-black uppercase tracking-[0.5em] pl-[0.5em]">{frameText}</p>
                  </div>
                )}

                {frame === 'polaroid' && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-[13px] font-bold tracking-tight" style={{ color: fgColor, fontFamily: 'Georgia, serif' }}>{frameText}</p>
                  </div>
                )}
                {frame === 'ticket' && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 flex flex-col items-center justify-center gap-1">
                    <div className="w-full border-t border-dashed" style={{ borderColor: fgColor + '80' }} />
                    <p className="text-[14px] font-black uppercase tracking-[0.5em] pl-[0.5em]" style={{ color: fgColor }}>{frameText}</p>
                    <p className="text-[9px] font-mono opacity-40">ADMIT ONE · SCAN TO ENTER</p>
                  </div>
                )}
                {frame === 'label' && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center" style={{ backgroundColor: fgColor }}>
                      <p className="text-white text-[9px] font-black uppercase tracking-[0.5em]">{frameText}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center border-t border-slate-200">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">SCAN QR CODE</p>
                    </div>
                  </>
                )}
                {frame === 'neon' && (
                  <div className="absolute bottom-6 left-0 right-0 text-center animate-pulse">
                    <p className="text-[11px] font-black uppercase tracking-[0.8em] pl-[0.8em]" style={{ color: fgColor, textShadow: `0 0 10px ${fgColor}` }}>{frameText}</p>
                  </div>
                )}
                {frame === 'minimal' && (
                  <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-12 pointer-events-none" />
                )}
              </div>

              {/* Hover Glow */}
              <div className="absolute -inset-24 bg-finance/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
            </div>
          </div>
              </div>
            </div>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-lg relative z-10">
              <div className="flex gap-2">
                <button onClick={() => handleDownload('png')} className="flex-1 bg-foreground text-background h-12 min-h-[48px] rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-xl shadow-foreground/10 hover:translate-y-[-2px] active:translate-y-0 transition-all">
                  <Download className="size-4" /> PNG
                </button>
                <button onClick={() => handleDownload('jpeg')} className="flex-1 bg-foreground/80 text-background h-12 min-h-[48px] rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all">
                  <Download className="size-4" /> JPEG
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopyLink} className="flex-1 bg-background border border-border/60 h-11 min-h-[48px] rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-95">
                  {copied ? <><Check className="size-4 text-emerald-500" /> Copied</> : <><LinkIcon className="size-4" /> Copy vCard</>}
                </button>
                <button onClick={handleShare} className="flex-1 bg-background border border-border/60 h-11 min-h-[48px] rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-95" title="Share QR">
                  <Smartphone className="size-4" /> Share
                </button>
              </div>
            </div>
          </div>
  
          {/* Detailed Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Type", v: "vCard 3.0", i: FileText },
              { l: "Format", v: "Vector SVG", i: FileCode },
              { l: "ECC", v: ecc === 'H' ? 'High' : 'Optimal', i: ShieldCheck },
              { l: "Payload", v: `${firstName} ${lastName}`, i: User }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                </div>
                <div className="text-sm font-mono font-bold uppercase truncate leading-tight">{item.v}</div>
              </div>
            ))}
          </div>

          <div className="surface-card p-6 border-border/20 bg-secondary/10 flex gap-5 items-start">
            <Info className="size-5 text-muted-foreground mt-1 shrink-0" />
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider">Professional Networking</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A vCard QR code on your business card or digital portfolio allows anyone to instantly save your contact details with a single scan. No more manual data entry or missed connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default VCardQrCodeGenerator;
