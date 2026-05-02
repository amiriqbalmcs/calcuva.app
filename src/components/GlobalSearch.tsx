"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Search,
  TrendingUp,
  FileText,
  Sparkles,
  PiggyBank, Coins, Percent, Flame, Home, Heart, Banknote, Receipt,
  ArrowLeftRight, ReceiptSwissFranc, TrendingDown, Lock, Car, Activity,
  Weight, Utensils, Timer, Beer, Cigarette, Baby, Droplet, Target, CreditCard, CalendarPlus, CalendarCheck, Ruler, FileType,
  GraduationCap, Dumbbell, BadgeDollarSign, QrCode, BadgeCheck, Droplets,
  Leaf, Sun, Wallet, Zap, Battery, Grid3X3, Share, Moon, Landmark, Globe,
} from "lucide-react";

const ICONS: Record<string, any> = {
  Calculator, PiggyBank, Coins, Percent, Flame, Home, Heart, Banknote, Receipt,
  TrendingUp, ArrowLeftRight, ReceiptSwissFranc, TrendingDown, Lock, Car,
  ActivitySquare: Activity, Weight, Utensils, Timer, Beer, Cigarette, Baby,
  Droplet, Target, Clock, CreditCard, CalendarPlus, CalendarCheck, Ruler,
  FileType, GraduationCap, Dumbbell, BadgeDollarSign, QrCode, BadgeCheck,
  Droplets, Leaf, Sun, Wallet, Zap, Battery, Grid3X3, Share, FileText, Moon, Globe,
  Activity, Landmark,
  "file-text": FileText, "book-open": GraduationCap
};
import { CALCULATORS } from "@/lib/calculators";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('calc_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) { }
    }
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all ring-1 ring-border/20 md:w-32 lg:w-48"
      >
        <Search className="size-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline-block">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden h-4 select-none items-center gap-1 rounded bg-background px-1 font-mono text-[9px] font-medium opacity-100 lg:flex">
          K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for calculators, guides, or categories..." />
        <CommandList className="max-h-[450px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {history.length > 0 && (
            <CommandGroup
              heading={
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span className="sr-only">History</span>
                </div>
              }
            >
              {history.map((slug) => {
                const t = CALCULATORS.find(c => c.slug === slug);
                if (!t) return null;
                return (
                  <CommandItem
                    key={`history-${t.slug}`}
                    value={`history-${t.slug}-${t.title}`}
                    onSelect={() => runCommand(() => router.push(`/calculators/${t.slug}`))}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      {(() => {
                        const ToolIcon = ICONS[t.icon] || Calculator;
                        return <ToolIcon className="size-4 text-muted-foreground" />;
                      })()}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-xs font-bold">{t.title}</span>
                      <span className="text-[10px] text-muted-foreground group-data-[selected=true]:text-accent-foreground/70 uppercase font-black tracking-tighter">{t.category}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          <CommandSeparator />

          <CommandGroup heading="Popular Tools">
            {CALCULATORS.slice(0, 4).map((t) => (
              <CommandItem
                key={`popular-${t.slug}`}
                value={`popular-${t.slug}-${t.title}`}
                onSelect={() => runCommand(() => router.push(`/calculators/${t.slug}`))}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {(() => {
                    const ToolIcon = ICONS[t.icon] || Calculator;
                    return <ToolIcon className="size-4 text-muted-foreground" />;
                  })()}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground group-data-[selected=true]:text-accent-foreground/70 uppercase font-black tracking-tighter">{t.category}</span>
                </div>
                <Badge variant="secondary" className="text-[9px] font-black uppercase bg-primary/5 text-primary border-primary/10">Tool</Badge>
              </CommandItem>
            ))}
          </CommandGroup>


          <CommandSeparator />

          <CommandGroup heading="All Calculators">
            {CALCULATORS.map((t) => (
              <CommandItem
                key={`all-${t.slug}`}
                value={`all-${t.slug}-${t.title}`}
                onSelect={() => runCommand(() => router.push(`/calculators/${t.slug}`))}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {(() => {
                    const ToolIcon = ICONS[t.icon] || Calculator;
                    return <ToolIcon className="size-4 text-muted-foreground" />;
                  })()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground group-data-[selected=true]:text-accent-foreground/70 line-clamp-1">{t.short}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => runCommand(() => router.push('/blog'))} className="gap-3 p-3">
              <FileText className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold">Expert Strategy Blog</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/guides'))} className="gap-3 p-3">
              <Sparkles className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold">Comprehensive Guides</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
