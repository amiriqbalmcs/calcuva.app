"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ResultStat = ({
  label, value, sub, accent, className, valueClassName
}: { label: string; value: ReactNode; sub?: ReactNode; accent?: boolean; className?: string; valueClassName?: string; }) => (
  <div className={cn("surface-card p-5", accent && "bg-primary text-primary-foreground border-primary", className)}>
    <div className={cn("text-xs font-mono uppercase tracking-widest mb-2", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>
      {label}
    </div>
    <div className={cn("text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight", valueClassName)}>{value}</div>
    {sub && (
      <div className={cn("text-xs mt-1.5", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>{sub}</div>
    )}
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
