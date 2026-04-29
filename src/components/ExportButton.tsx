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
    // Create a hidden wrapper for the mockup
    const wrapper = document.createElement('div');
    // Important: Include the theme class (dark/light)
    wrapper.className = document.documentElement.className;
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '1200px';
    wrapper.style.zIndex = '-9999';
    wrapper.style.opacity = '0.01'; // Slightly visible to ensure browser paints it
    wrapper.style.pointerEvents = 'none';
    wrapper.style.padding = '80px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    
    // Background and Base Styles
    wrapper.style.backgroundColor = 'hsl(var(--background))';
    wrapper.style.backgroundImage = 'linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.05) 100%)';
    wrapper.style.fontFamily = 'var(--font-sans)';

    // 1. Browser Frame
    const frame = document.createElement('div');
    frame.style.width = '100%';
    frame.style.backgroundColor = 'hsl(var(--background))';
    frame.style.borderRadius = '24px';
    frame.style.boxShadow = '0 30px 60px -12px rgba(0, 0, 0, 0.4)';
    frame.style.overflow = 'hidden';
    frame.style.border = '1px solid hsl(var(--border))';

    // 2. Browser Header
    const header = document.createElement('div');
    header.style.height = '52px';
    header.style.backgroundColor = 'hsl(var(--secondary) / 0.8)';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '0 24px';
    header.style.gap = '10px';
    header.style.borderBottom = '1px solid hsl(var(--border))';

    ['#ff5f56', '#ffbd2e', '#27c93f'].forEach(color => {
      const dot = document.createElement('div');
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = color;
      header.appendChild(dot);
    });

    const urlBar = document.createElement('div');
    urlBar.style.flex = '1';
    urlBar.style.height = '34px';
    urlBar.style.backgroundColor = 'hsl(var(--background))';
    urlBar.style.borderRadius = '10px';
    urlBar.style.marginLeft = '24px';
    urlBar.style.display = 'flex';
    urlBar.style.alignItems = 'center';
    urlBar.style.justifyContent = 'center';
    urlBar.style.fontSize = '12px';
    urlBar.style.fontWeight = '600';
    urlBar.style.color = 'hsl(var(--muted-foreground))';
    urlBar.style.border = '1px solid hsl(var(--border) / 0.5)';
    // Use the real current URL but clean it up for the mockup
    const cleanUrl = window.location.href
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');
    urlBar.innerText = cleanUrl;
    header.appendChild(urlBar);
    frame.appendChild(header);

    // 3. Clone Content
    const clone = mainContent.cloneNode(true) as HTMLElement;
    clone.style.padding = '48px';
    clone.style.margin = '0';
    clone.style.animation = 'none'; // CRITICAL: Stop fade-in animations
    clone.style.opacity = '1';      // CRITICAL: Ensure it's visible
    clone.style.transform = 'none';
    clone.style.width = '100%';
    clone.style.visibility = 'visible';
    frame.appendChild(clone);
    wrapper.appendChild(frame);

    // 4. Attribution
    const footer = document.createElement('div');
    footer.style.marginTop = '40px';
    footer.style.display = 'flex';
    footer.style.gap = '16px';
    
    const badgeStyle = "padding: 12px 28px; border-radius: 99px; background: hsl(var(--background)); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.15); font-size: 14px; font-weight: 800; color: hsl(var(--foreground)); border: 1px solid hsl(var(--border)); display: flex; align-items: center; gap: 12px;";
    
    footer.innerHTML = `
      <div style="${badgeStyle}">
        <span style="color: hsl(var(--primary)); font-size: 20px;">❖</span> ${SITE_DOMAIN}
      </div>
      <div style="${badgeStyle}">
        <span style="font-size: 20px;">𝕏</span> ${TWITTER_HANDLE}
      </div>
    `;
    wrapper.appendChild(footer);

    document.body.appendChild(wrapper);

    try {
      // Wait for everything to settle
      await new Promise(r => setTimeout(r, 400));

      const options = {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: format === 'jpeg' ? '#ffffff' : undefined,
        style: {
          opacity: '1',
          visibility: 'visible',
        },
        cacheBust: true, // Prevent cached assets from failing
      };

      const dataUrl = format === 'png' 
        ? await toPng(wrapper, options) 
        : await toJpeg(wrapper, options);
      
      document.body.removeChild(wrapper);

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, '-')}-mockup.${format}`, { type: `image/${format}` });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${SITE_NAME} Report: ${title}`,
          text: `Check out my ${title} calculation on ${SITE_NAME}!`,
        });
        toast.success("Shared successfully!");
      } else {
        const link = document.createElement('a');
        link.download = file.name;
        link.href = dataUrl;
        link.click();
        toast.success(`${format.toUpperCase()} mockup saved!`);
      }
    } catch (err) {
      console.error("Failed to generate image", err);
      toast.error("Failed to generate or share image");
      if (document.body.contains(wrapper)) document.body.removeChild(wrapper);
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
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95",
              loading 
                ? "bg-secondary text-muted-foreground border-border cursor-wait" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20"
            )}
          >
            {loading ? <CheckCircle2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            {loading ? "Exporting..." : "Download Report"}
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

