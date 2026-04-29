"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";

/**
 * Returns Recharts-compatible style objects that automatically adapt
 * to the current light/dark theme.
 */
export function useChartStyle() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return useMemo(() => ({
    tooltipStyle: {
      backgroundColor: isDark ? "hsl(222 47% 12%)" : "hsl(0 0% 100%)",
      borderColor: isDark ? "hsl(217 33% 22%)" : "hsl(214 32% 91%)",
      borderRadius: "12px",
      border: "1px solid",
      boxShadow: isDark
        ? "0 8px 32px -8px rgba(0,0,0,0.5)"
        : "0 4px 16px -4px rgba(0,0,0,0.1)",
      color: isDark ? "hsl(210 40% 98%)" : "hsl(222 47% 11%)",
      fontSize: "12px",
      fontWeight: "600",
    } as React.CSSProperties,

    axisStroke: isDark ? "hsl(215 20% 45%)" : "hsl(215 16% 60%)",
    gridStroke: isDark ? "hsl(217 33% 17%)" : "hsl(214 32% 91%)",
    
    /** Use this for linear gradient stop colours */
    gradientOpacity: isDark ? { start: 0.3, end: 0.04 } : { start: 0.2, end: 0 },
  }), [isDark]);
}
