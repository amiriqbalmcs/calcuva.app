"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Lock, Shield, RefreshCw, Copy, Check, Info, Settings2, Fingerprint, Eye, EyeOff } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import ResultStat from "@/components/ResultStat";
import { cn } from "@/lib/utils";

interface PasswordGeneratorProps {
  calc: any;
  guideHtml?: string;
}

export default function PasswordGenerator({ calc, guideHtml }: PasswordGeneratorProps) {
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
    // Cryptographically strong random values
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(array[i] % n);
    }
    
    setPassword(retVal);
    setCopied(false);
  }, [length, useUppercase, useNumbers, useSymbols]);

  // Initial generation
  useEffect(() => {
    generatePassword();
  }, []); // Only on mount

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = useMemo(() => {
    let entropy = length * Math.log2(26);
    if (useUppercase) entropy = length * Math.log2(52);
    if (useNumbers) entropy = length * Math.log2(62);
    if (useSymbols) entropy = length * Math.log2(94);

    if (entropy < 40) return { label: "Weak", color: "text-destructive", score: 25 };
    if (entropy < 60) return { label: "Fair", color: "text-orange-500", score: 50 };
    if (entropy < 80) return { label: "Strong", color: "text-green-500", score: 75 };
    return { label: "Very Strong", color: "text-signal", score: 100 };
  }, [length, useUppercase, useNumbers, useSymbols, password]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Panel */}
        <div className="lg:col-span-7 space-y-8">
           <div className="surface-card p-4 sm:p-6 bg-secondary/10 border-border/50 relative overflow-hidden">
              {/* Password Display Box */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-background border border-border/40 rounded-3xl p-4 pr-4 sm:pr-2 shadow-inner group">
                 <div className="flex-1 w-full flex items-center gap-3 px-2">
                    <Fingerprint className="size-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0 font-mono text-xl sm:text-2xl font-bold tracking-tight break-all overflow-hidden h-9 flex items-center">
                       {showPassword ? password : "•".repeat(password.length)}
                    </div>
                    <button 
                       onClick={() => setShowPassword(!showPassword)}
                       className="p-3 text-muted-foreground hover:text-foreground transition-colors rounded-xl"
                    >
                       {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                 </div>
                 
                 <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={generatePassword}
                      className="flex-1 sm:size-12 rounded-2xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all active:scale-90"
                      title="Generate New"
                    >
                      <RefreshCw className="size-5 text-foreground" />
                    </button>
                    <button 
                      onClick={handleCopy}
                      className="flex-[2] sm:px-6 h-12 rounded-2xl bg-signal text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-signal/20 hover:bg-signal/90 transition-all active:scale-95"
                    >
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                 </div>
              </div>

              {/* Strength Bar */}
              <div className="mt-8 flex items-center justify-between px-2 mb-2">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Calculated Entropy</span>
                 <span className={cn("text-[10px] font-bold uppercase tracking-widest", strength.color)}>{strength.label}</span>
              </div>
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-6">
                 <div 
                    className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]", 
                       strength.score <= 25 ? "bg-destructive" : 
                       strength.score <= 50 ? "bg-orange-500" : 
                       strength.score <= 75 ? "bg-green-500" : "bg-signal"
                    )}
                    style={{ width: `${strength.score}%` }}
                 />
              </div>
           </div>

           {/* Expert Tips */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="surface-card p-6 border-dotted flex gap-4">
                 <div className="size-10 rounded-xl bg-secondary/30 flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                    <Shield className="size-5" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Local Generation</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Passwords are generated strictly in your browser using the **Web Crypto API**. Your secrets never leave your device.
                    </p>
                 </div>
              </div>
              <div className="surface-card p-6 border-dotted flex gap-4">
                 <div className="size-10 rounded-xl bg-secondary/30 flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                    <Info className="size-5" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Passphrase Tip</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Length is more important than complexity. A 20-character lowercase password is often stronger than an 8-character complex one.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-5">
           <div className="surface-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="size-10 rounded-xl bg-utility/10 flex items-center justify-center text-utility shadow-inner">
                  <Settings2 className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Security Policy</h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">Rule Configuration</p>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <Label className="text-sm font-semibold">Password Length</Label>
                       <span className="font-mono text-lg font-bold text-utility">{length}</span>
                    </div>
                    <Slider 
                       value={[length]}
                       min={4}
                       max={64}
                       step={1}
                       onValueChange={([v]) => {
                          setLength(v);
                          generatePassword();
                       }}
                    />
                 </div>

                 <div className="h-px bg-border/50" />

                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <Label className="text-sm font-semibold cursor-pointer" htmlFor="upper">Uppercase Characters</Label>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">A-Z</p>
                       </div>
                       <Switch 
                          id="upper"
                          checked={useUppercase} 
                          onCheckedChange={(c) => { setUseUppercase(c); generatePassword(); }}
                       />
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <Label className="text-sm font-semibold cursor-pointer" htmlFor="nums">Numbers</Label>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">0-9</p>
                       </div>
                       <Switch 
                          id="nums"
                          checked={useNumbers} 
                          onCheckedChange={(c) => { setUseNumbers(c); generatePassword(); }}
                       />
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <Label className="text-sm font-semibold cursor-pointer" htmlFor="syms">Special Symbols</Label>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">!@#$%</p>
                       </div>
                       <Switch 
                          id="syms"
                          checked={useSymbols} 
                          onCheckedChange={(c) => { setUseSymbols(c); generatePassword(); }}
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </CalculatorPage>
  );
}

