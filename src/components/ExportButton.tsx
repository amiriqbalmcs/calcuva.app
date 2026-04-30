"use client";

import { Download, FileText, CheckCircle2, Image as ImageIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toPng, toJpeg } from "html-to-image";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { SITE_NAME, SITE_DOMAIN, TWITTER_HANDLE } from "@/lib/constants";

interface Props {
  title: string;
}

export const ExportButton = ({ title }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePrint = () => {
    setLoading(true);
    setTimeout(() => {
      window.print();
      setLoading(false);
    }, 600);
  };

  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    const mainContent = document.querySelector('section.animate-fade-up');
    if (!mainContent) {
      toast.error("Could not find content to capture");
      return;
    }

    setLoading(true);
    // NEW APPROACH: Using a hidden iframe to provide a true desktop viewport
    const iframe = document.createElement('iframe');
    // Hide it but keep it in DOM so it can be captured
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '1200px'; // Desktop Width
    iframe.style.height = '1200px';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      toast.error("Failed to initialize capture environment");
      return;
    }

    // 1. Copy all styles from the main document to the iframe safely
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    styles.forEach(s => {
      try {
        const clone = s.cloneNode(true) as HTMLElement;
        if (clone.tagName === 'LINK') {
          const href = (clone as HTMLLinkElement).href;
          if (href && !href.startsWith(window.location.origin) && !href.startsWith('/')) {
            // For external stylesheets (like Google Fonts), set crossOrigin to avoid SecurityError
            (clone as HTMLLinkElement).crossOrigin = "anonymous";
          }
        }
        iframeDoc.head.appendChild(clone);
      } catch (e) {
        console.warn("Skipped a stylesheet due to security constraints", e);
      }
    });

    // 2. Set the base theme and structure
    iframeDoc.documentElement.className = document.documentElement.className;
    iframeDoc.body.style.margin = '0';
    iframeDoc.body.style.padding = '0';
    iframeDoc.body.style.backgroundColor = 'hsl(var(--background))';
    iframeDoc.body.style.overflow = 'hidden';

    // 3. Create the mockup structure inside the iframe
    const wrapper = iframeDoc.createElement('div');
    wrapper.id = 'export-wrapper';
    wrapper.style.width = '1200px';
    wrapper.style.padding = '60px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.backgroundColor = 'hsl(var(--background))';
    wrapper.style.backgroundImage = 'linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 100%)';
    wrapper.style.fontFamily = 'Inter, sans-serif';

    // Browser Frame
    const frame = iframeDoc.createElement('div');
    frame.style.width = '1000px';
    frame.style.backgroundColor = 'hsl(var(--background))';
    frame.style.borderRadius = '24px';
    frame.style.boxShadow = '0 30px 60px -12px rgba(0, 0, 0, 0.4)';
    frame.style.overflow = 'hidden';
    frame.style.border = '1px solid hsl(var(--border))';

    // Browser Header
    const header = iframeDoc.createElement('div');
    header.style.height = '52px';
    header.style.backgroundColor = 'hsl(var(--secondary) / 0.8)';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '0 24px';
    header.style.gap = '10px';
    header.style.borderBottom = '1px solid hsl(var(--border))';
    ['#ff5f56', '#ffbd2e', '#27c93f'].forEach(color => {
      const dot = iframeDoc.createElement('div');
      dot.style.width = '12px'; dot.style.height = '12px';
      dot.style.borderRadius = '50%'; dot.style.backgroundColor = color;
      header.appendChild(dot);
    });
    const urlBar = iframeDoc.createElement('div');
    urlBar.style.flex = '1'; urlBar.style.height = '34px';
    urlBar.style.backgroundColor = 'hsl(var(--background))';
    urlBar.style.borderRadius = '10px'; urlBar.style.marginLeft = '24px';
    urlBar.style.display = 'flex'; urlBar.style.alignItems = 'center';
    urlBar.style.justifyContent = 'center'; urlBar.style.fontSize = '12px';
    urlBar.style.fontWeight = '600'; urlBar.style.color = 'hsl(var(--muted-foreground))';
    urlBar.style.border = '1px solid hsl(var(--border) / 0.5)';
    urlBar.innerText = window.location.href.replace(/^https?:\/\//, '').replace(/^www\./, '');
    header.appendChild(urlBar);
    frame.appendChild(header);

    // Clone and Append Content
    const clone = mainContent.cloneNode(true) as HTMLElement;
    clone.style.padding = '40px';
    clone.style.margin = '0';
    clone.style.animation = 'none';
    clone.style.width = '1000px';
    // Remove sticky positions for capture
    const stickies = clone.querySelectorAll('.sticky, .lg\\:sticky');
    stickies.forEach((s: any) => s.style.position = 'relative');
    
    frame.appendChild(clone);
    wrapper.appendChild(frame);

    // Attribution
    const attribution = iframeDoc.createElement('div');
    attribution.style.marginTop = '40px';
    attribution.style.display = 'flex';
    attribution.style.flexDirection = 'column';
    attribution.style.alignItems = 'center';
    attribution.style.gap = '16px';
    const badgeStyle = "padding: 12px 28px; border-radius: 99px; background: hsl(var(--background)); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1); font-size: 14px; font-weight: 800; color: hsl(var(--foreground)); border: 1px solid hsl(var(--border)); display: flex; align-items: center; gap: 12px;";
    attribution.innerHTML = `
      <div style="display: flex; gap: 16px;">
        <div style="${badgeStyle}"><span style="color: hsl(var(--primary));">❖</span> ${SITE_NAME}</div>
        <div style="${badgeStyle}">𝕏 ${TWITTER_HANDLE}</div>
      </div>
      <div style="font-family: monospace; font-size: 12px; color: hsl(var(--muted-foreground)); opacity: 0.6;">
        URL: ${window.location.origin}${window.location.pathname}
      </div>
    `;
    wrapper.appendChild(attribution);
    iframeDoc.body.appendChild(wrapper);

    try {
      // Wait for fonts and styles to load in the iframe
      await new Promise(r => setTimeout(r, 1200));

      const options = {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: format === 'jpeg' ? '#ffffff' : undefined,
        // Add a filter to prevent the library from trying to read rules it shouldn't
        filter: (node: HTMLElement) => {
          if (node.tagName === 'LINK' || node.tagName === 'STYLE') return false;
          return true;
        },
      };

      const dataUrl = format === 'png' 
        ? await toPng(wrapper, options) 
        : await toJpeg(wrapper, options);
      
      document.body.removeChild(iframe);

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, '-')}-report.${format}`, { type: `image/${format}` });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${SITE_NAME} Report: ${title}`,
          text: `Check out my ${title} calculation on ${SITE_NAME}!`,
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } else {
        const link = document.createElement('a');
        link.download = file.name;
        link.href = dataUrl;
        link.click();
        toast.success(`${format.toUpperCase()} report saved!`);
      }
    } catch (err) {
      console.error("Capture failed", err);
      toast.error("Export failed. Please try again.");
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-print">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            disabled={loading}
            aria-label="Share Analysis"
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95",
              loading 
                ? "bg-secondary text-muted-foreground border-border cursor-wait" 
                : "bg-foreground text-background hover:bg-foreground/90 hover:shadow-black/10"
            )}
          >
            {loading ? <CheckCircle2 className="size-4 animate-spin" /> : <div className="size-4 flex items-center justify-center"><svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></div>}
            {loading ? "Exporting..." : "Share Analysis"}
            <ChevronDown className="size-3 opacity-50 ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-border/50 backdrop-blur-xl">
          <div className="px-2 py-1.5 mb-1 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Select Format</div>
          <DropdownMenuItem onClick={handlePrint} className="gap-3 py-3 cursor-pointer rounded-xl hover:bg-finance-soft hover:text-finance focus:bg-finance-soft focus:text-finance transition-colors">
            <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <FileText className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs">Print / PDF</span>
              <span className="text-[9px] opacity-70">Best for documents</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownloadImage('png')} className="gap-3 py-3 cursor-pointer rounded-xl hover:bg-health-soft hover:text-health focus:bg-health-soft focus:text-health transition-colors">
            <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <ImageIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs">Save as PNG</span>
              <span className="text-[9px] opacity-70">Best for WhatsApp/Social</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownloadImage('jpeg')} className="gap-3 py-3 cursor-pointer rounded-xl hover:bg-utility-soft hover:text-utility focus:bg-utility-soft focus:text-utility transition-colors">
            <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <ImageIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs">Save as JPEG</span>
              <span className="text-[9px] opacity-70">Standard image format</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

