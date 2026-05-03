"use client";

import { useState } from "react";
import { X, Download, Check, CheckCircle2, Zap, FileCode, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";

interface EmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slug?: string;
  title?: string;
  isWholeSite?: boolean;
}

export function EmbedDialog({ isOpen, onClose, slug, title, isWholeSite }: EmbedDialogProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const path = slug ? `/calculators/${slug}` : "";
  const embedUrl = `${SITE_URL}${path}?embed=true`;
  const mainUrl = `${SITE_URL}${path}`;
  const displayTitle = title || "Calcuva Toolkit";

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="700" frameborder="0" loading="lazy"></iframe>\n<p style="text-align:center;font-size:12px;font-family:sans-serif;color:#666;">Powered by <a href="${mainUrl}" target="_blank" style="color:#000;font-weight:bold;text-decoration:none;">${displayTitle}</a></p>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{isWholeSite ? "Embed Calcuva" : "Embed this Tool"}</h2>
              <p className="text-sm text-muted-foreground font-medium">Copy the code below to add this {isWholeSite ? "toolkit" : "calculator"} to your website.</p>
            </div>
            <button onClick={onClose} className="size-10 rounded-full hover:bg-secondary flex items-center justify-center transition-colors">
              <X className="size-5" />
            </button>
          </div>

          <div className="relative group">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={copyToClipboard}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider transition-all",
                  copied ? "bg-emerald-500 text-white" : "bg-black text-white hover:bg-black/80"
                )}
              >
                {copied ? <Check className="size-3" /> : <Download className="size-3" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <textarea
              readOnly
              value={embedCode}
              className="w-full h-40 p-6 pt-12 rounded-2xl bg-secondary/30 border border-border/50 font-mono text-xs leading-relaxed focus:outline-none focus:border-signal/50 resize-none"
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Fully Responsive</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Adapts perfectly to any screen size (mobile, tablet, or desktop).</p>
            </div>
            <div className="p-4 rounded-2xl bg-signal/5 border border-signal/10 space-y-2">
              <div className="flex items-center gap-2 text-signal">
                <Shield className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Safe & Secure</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">No ads or tracking scripts. A private, premium experience for your users.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
