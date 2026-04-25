"use client";

import { Download, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
}

export const ExportButton = ({ title }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    // Give it a tiny delay for visual feedback
    setTimeout(() => {
      window.print();
      setLoading(false);
    }, 600);
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border",
        loading 
          ? "bg-secondary border-border text-muted-foreground animate-pulse" 
          : "bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-sm active:scale-95"
      )}
    >
      {loading ? (
        <CheckCircle2 className="size-4 animate-spin" />
      ) : (
        <FileText className="size-4" />
      )}
      {loading ? "PREPARING REPORT..." : "DOWNLOAD REPORT"}
    </button>
  );
};
