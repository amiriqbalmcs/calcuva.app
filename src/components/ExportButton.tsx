"use client";

import { Download, FileText, CheckCircle2, Image as ImageIcon, ChevronDown, FileCode } from "lucide-react";
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
  onEmbedClick?: () => void;
}

export const ExportButton = ({ title, onEmbedClick }: Props) => {
  const [loading, setLoading] = useState(false);

  const generateMockupEnvironment = async () => {
    const mainContent = document.querySelector('section.animate-fade-up');
    if (!mainContent) {
      toast.error("Could not find content to capture");
      return null;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '1200px';
    iframe.style.height = '1200px';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return null;

    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    styles.forEach(s => {
      try {
        const clone = s.cloneNode(true) as HTMLElement;
        if (clone.tagName === 'LINK') {
          const href = (clone as HTMLLinkElement).href;
          if (href && !href.startsWith(window.location.origin) && !href.startsWith('/')) {
            (clone as HTMLLinkElement).crossOrigin = "anonymous";
          }
        }
        iframeDoc.head.appendChild(clone);
      } catch (e) { }
    });

    iframeDoc.documentElement.className = document.documentElement.className;
    iframeDoc.body.style.margin = '0';
    iframeDoc.body.style.padding = '0';
    iframeDoc.body.style.backgroundColor = 'hsl(var(--background))';

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

    const frame = iframeDoc.createElement('div');
    frame.style.width = '1000px';
    frame.style.backgroundColor = 'hsl(var(--background))';
    frame.style.borderRadius = '24px';
    frame.style.boxShadow = '0 30px 60px -12px rgba(0, 0, 0, 0.4)';
    frame.style.overflow = 'hidden';
    frame.style.border = '1px solid hsl(var(--border))';

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

    const clone = mainContent.cloneNode(true) as HTMLElement;
    clone.style.padding = '40px';
    clone.style.margin = '0';
    clone.style.animation = 'none';
    clone.style.width = '1000px';
    const stickies = clone.querySelectorAll('.sticky, .lg\\:sticky');
    stickies.forEach((s: any) => s.style.position = 'relative');

    frame.appendChild(clone);
    wrapper.appendChild(frame);

    const attribution = iframeDoc.createElement('div');
    attribution.style.marginTop = '40px';
    attribution.style.display = 'flex';
    attribution.style.flexDirection = 'column';
    attribution.style.alignItems = 'center';
    attribution.style.gap = '16px';
    attribution.style.width = '100%';
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
    return { iframe, wrapper, iframeDoc };
  };

  const handlePrint = async () => {
    setLoading(true);
    const env = await generateMockupEnvironment();
    if (!env) {
      setLoading(false);
      return;
    }

    try {
      await new Promise(r => setTimeout(r, 1500));

      // Capture as high-quality image first
      // Temporarily disable cross-origin stylesheets to avoid SecurityError
      const taintedSheets = Array.from(document.styleSheets).filter(s => {
        try { return !s.cssRules; } catch (e) { return true; }
      });
      taintedSheets.forEach(s => s.disabled = true);

      const dataUrl = await toPng(env.wrapper, {
        quality: 1,
        pixelRatio: 3, // Higher ratio for crisp PDF
        filter: (node: HTMLElement) => {
          if (node.tagName === 'LINK' || node.tagName === 'STYLE') return false;
          return true;
        },
      });

      taintedSheets.forEach(s => s.disabled = false);

      // Replace document content with the captured image for printing
      env.iframeDoc.body.innerHTML = `
        <style>
          @media print {
            @page { margin: 0; size: auto; }
            body { margin: 0; padding: 0; overflow: hidden; height: 100vh; }
            img { width: 100vw; height: 100vh; object-fit: contain; }
          }
          body { margin: 0; display: flex; justify-content: center; background: #fff; }
          img { max-width: 100%; height: auto; }
        </style>
        <img src="${dataUrl}" />
      `;

      // Small delay to ensure the image is loaded in the iframe
      await new Promise(r => setTimeout(r, 500));
      env.iframe.contentWindow?.print();
    } catch (err) {
      console.error("Print failed", err);
      toast.error("Failed to generate PDF preview");
    } finally {
      if (document.body.contains(env.iframe)) {
        document.body.removeChild(env.iframe);
      }
      setLoading(false);
    }
  };

  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    setLoading(true);
    const env = await generateMockupEnvironment();
    if (!env) {
      setLoading(false);
      return;
    }

    try {
      await new Promise(r => setTimeout(r, 1200));
      const options = {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: format === 'jpeg' ? '#ffffff' : undefined,
        filter: (node: HTMLElement) => {
          if (node.tagName === 'LINK' || node.tagName === 'STYLE') return false;
          return true;
        },
      };

      // Temporarily disable cross-origin stylesheets to avoid SecurityError
      const taintedSheets = Array.from(document.styleSheets).filter(s => {
        try { return !s.cssRules; } catch (e) { return true; }
      });
      taintedSheets.forEach(s => s.disabled = true);

      const dataUrl = format === 'png'
        ? await toPng(env.wrapper, options)
        : await toJpeg(env.wrapper, options);

      taintedSheets.forEach(s => s.disabled = false);

      document.body.removeChild(env.iframe);

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
      if (document.body.contains(env.iframe)) document.body.removeChild(env.iframe);
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
            aria-label="Share"
            className={cn(
              "flex items-center gap-2 px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95",
              loading
                ? "bg-secondary text-muted-foreground border-border cursor-wait"
                : "bg-foreground text-background hover:bg-foreground/90 hover:shadow-black/10"
            )}
          >
            {loading ? <CheckCircle2 className="size-4 animate-spin" /> : <div className="size-4 flex items-center justify-center"><svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></div>}
            {loading ? "Exporting..." : "Share"}
            <ChevronDown className="size-3 opacity-50 ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-border/50 backdrop-blur-xl z-50">
          <div className="px-2 py-1.5 mb-1 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] ">Select Format</div>

          {onEmbedClick && (
            <DropdownMenuItem onClick={onEmbedClick} className="gap-3 py-3 cursor-pointer rounded-xl hover:bg-signal/10 hover:text-signal focus:bg-signal/10 focus:text-signal transition-colors">
              <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <FileCode className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">Embed Tool</span>
                <span className="text-[9px] opacity-70">Add to your website</span>
              </div>
            </DropdownMenuItem>
          )}

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
