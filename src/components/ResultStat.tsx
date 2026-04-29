"use client";

import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

export const ResultStat = ({
  label, value, sub, accent, className, valueClassName, icon: Icon
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: boolean;
  className?: string;
  valueClassName?: string;
  icon?: ElementType;
}) => (
  <div className={cn(
    "surface-card p-5 relative overflow-hidden",
    accent
      ? "bg-signal border-signal/40 dark:bg-signal/15 dark:border-signal/30"
      : "dark:bg-card",
    className
  )}>
    {accent && (
      <div className="absolute inset-0 bg-gradient-to-br from-signal/20 to-transparent pointer-events-none" />
    )}
    <div className="relative z-10">
      <div className={cn(
        "text-[10px] font-mono font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5",
        accent ? "text-white/70 dark:text-signal/80" : "text-muted-foreground"
      )}>
        {Icon && <Icon className="size-3 shrink-0" />}
        {label}
      </div>
      <div className={cn(
        "text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight leading-none",
        accent ? "text-white dark:text-signal" : "text-foreground",
        valueClassName
      )}>
        {value}
      </div>
      {sub && (
        <div className={cn(
          "text-[11px] font-medium mt-2 leading-normal",
          accent ? "text-white/60 dark:text-signal/60" : "text-muted-foreground"
        )}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

export const ResultGrid = ({ children, cols = 3 }: { children: ReactNode; cols?: 1 | 2 | 3 | 4 }) => (
  <div className={cn("grid gap-4", {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[cols])}>
    {children}
  </div>
);
