"use client";

import { Share, Bookmark } from "lucide-react";

interface ShareProps {
  title: string;
  excerpt: string;
  slug: string;
  variant?: "inline" | "sidebar";
}

export const BlogShareAction = ({ title, excerpt, slug, variant = "inline" }: ShareProps) => {
  const handleShare = () => {
    const url = `https://calcuva.app/blog/${slug}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, text: excerpt, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (variant === "sidebar") {
    return (
      <div className="flex gap-3 pt-2">
        <button 
          onClick={handleShare} 
          className="flex-1 h-12 rounded-xl bg-background border border-border/60 hover:border-foreground transition-all flex items-center justify-center text-foreground"
          title="Share article"
        >
          <Share className="size-4" />
        </button>
        <button 
          className="flex-1 h-12 rounded-xl bg-background border border-border/60 hover:border-foreground transition-all flex items-center justify-center text-foreground"
          title="Bookmark article"
        >
          <Bookmark className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleShare} 
      className="flex items-center gap-2 hover:text-foreground transition-colors ml-auto"
    >
      <Share className="size-3.5" /> Share
    </button>
  );
};
