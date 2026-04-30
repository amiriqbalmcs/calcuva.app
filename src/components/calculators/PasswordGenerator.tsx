"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  Lock, Shield, RefreshCw, Copy, Check, Info, Settings2, Fingerprint, 
  Eye, EyeOff, ShieldCheck, Zap, Server, Globe, History, Target, 
  Activity, Cpu, Terminal, ShieldAlert, Sparkles, LayoutDashboard,
  ChevronRight, Calculator, Scale, RefreshCcw, Watch, CheckCircle2,
  FileText, Landmark
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { calculatorBySlug } from "@/lib/calculators";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("password-generator");

interface PasswordGeneratorProps {
  guideHtml?: string;
  faqs?: any[];
  relatedArticles?: any[];
}

export default function PasswordGenerator({ guideHtml, faqs, relatedArticles }: PasswordGeneratorProps) {
  if (!calc) return null;
  const [length, setLength] = useState<number>(16);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const generatePassword = useCallback(() => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charset = lowercase;
    if (useUppercase) charset += uppercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    let retVal = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(array[i] % n);
    }
    
    setPassword(retVal);
    setCopied(false);
  }, [length, useUppercase, useNumbers, useSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = useMemo(() => {
    let charsetSize = 26;
    if (useUppercase) charsetSize += 26;
    if (useNumbers) charsetSize += 10;
    if (useSymbols) charsetSize += 32;

    const entropy = length * Math.log2(charsetSize);

    if (entropy < 40) return { label: "Very Weak", color: "bg-red-500", score: 25, hint: "This password is easy to guess. Try making it longer." };
    if (entropy < 60) return { label: "Good Security", color: "bg-amber-500", score: 50, hint: "Good for basic websites and personal accounts." };
    if (entropy < 80) return { label: "Strong Security", color: "bg-emerald-500", score: 75, hint: "Very secure. Great for banking or important email accounts." };
    return { label: "Maximum Security", color: "bg-foreground", score: 100, hint: "The strongest possible password for your most important files." };
  }, [length, useUppercase, useNumbers, useSymbols]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Password Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/10 border-border/40 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Generator Options</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Customize Your Password</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Length */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password Length</Label>
                  <span className="text-[10px] font-bold text-foreground">{length} Characters</span>
                </div>
                <Slider value={[length]} min={8} max={64} step={1} onValueChange={([v]) => setLength(v)} />
              </div>

              {/* Include */}
              <div className="space-y-5 pt-6 border-t border-border/40">
                {[
                  { id: "upper", label: "Uppercase", sub: "A-Z Letters", state: useUppercase, setter: setUseUppercase },
                  { id: "nums", label: "Numbers", sub: "0-9 Digits", state: useNumbers, setter: setUseNumbers },
                  { id: "syms", label: "Symbols", sub: "Special Characters", state: useSymbols, setter: setUseSymbols }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between group/row">
                    <div className="space-y-0.5">
                      <Label className="text-[11px] font-bold uppercase tracking-tight cursor-pointer" htmlFor={item.id}>{item.label}</Label>
                      <p className="text-[9px] text-muted-foreground/60 font-mono uppercase font-medium">{item.sub}</p>
                    </div>
                    <Switch id={item.id} checked={item.state} onCheckedChange={item.setter} />
                  </div>
                ))}
              </div>

              <button 
                onClick={generatePassword} 
                className="w-full h-11 rounded-xl bg-background border border-border/60 hover:bg-foreground hover:text-background transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCcw className="size-3" /> Generate New
              </button>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <ShieldAlert className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Privacy Check</h4>
                <p className="text-xs leading-relaxed font-medium">
                  Your password is created right here on your computer. Nothing is sent over the internet or saved by us.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="p-8 md:p-10 space-y-10 bg-[#09090b] text-[#fafafa] border border-white/10 rounded-2xl relative overflow-hidden group shadow-2xl">
            <Terminal className="absolute -top-12 -right-12 size-64 text-white/5 -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2 flex-1 mr-4">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/60">
                    <Cpu className="size-3" />
                    New Generated Password
                  </div>
                  <div className={cn(
                    "font-mono font-bold break-all tracking-tight tabular-nums select-all leading-tight pt-4 text-white",
                    length > 40 ? "text-xl md:text-2xl" : length > 24 ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"
                  )}>
                    {showPassword ? password : "•".repeat(password.length)}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff className="size-5 opacity-80" /> : <Eye className="size-5 opacity-80" />}
                  </button>
                  <button 
                    onClick={handleCopy} 
                    className={cn(
                      "p-3 rounded-xl transition-all border shadow-sm",
                      copied ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    )}
                    title="Copy Password"
                  >
                    {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                  </button>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    <ShieldCheck className="size-3" />
                    Security Strength
                  </div>
                  <div className={cn(
                    "text-3xl md:text-4xl font-mono font-bold tabular-nums",
                    strength.score >= 75 ? "text-emerald-400" : strength.score >= 50 ? "text-amber-400" : "text-rose-400"
                  )}>
                    {strength.label}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    <Fingerprint className="size-3" />
                    Entropy Score
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold tabular-nums text-white">
                    {strength.score}<span className="text-[10px] ml-1 opacity-40 uppercase tracking-widest font-sans font-bold text-white">Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrity Monitoring */}
          <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-muted-foreground/60" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Password Strength</h3>
              </div>
              <div className={cn("text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-secondary shadow-inner", strength.score >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground')}>
                {strength.label}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000 ease-out", strength.color)} 
                  style={{ width: `${strength.score}%` }} 
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center opacity-40">
                {strength.hint}
              </p>
            </div>
          </div>

          {/* Precision Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Strength", v: (length * 6).toFixed(0), i: Activity, unit: "Level" },
               { l: "Platform", v: "Local", i: Globe },
               { l: "Privacy", v: "Zero", i: Shield, unit: "Leak" },
               { l: "Status", v: "Verified", i: Zap }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-medium">{item.l}</span>
                 </div>
                 <div className="text-xl font-mono font-bold tabular-nums leading-tight text-foreground">
                    {item.v}
                    {item.unit && <span className="text-[10px] ml-1 opacity-60 uppercase">{item.unit}</span>}
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Strategy Cards */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Lock className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Security Tip</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Creating a strong password is the first step to staying safe online. A long password with letters and numbers is much harder to guess.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Fingerprint className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Server className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">How it Works</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  This tool works completely offline in your browser. We never see or store any of the passwords you create, keeping your data private.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
}
