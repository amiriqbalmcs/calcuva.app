"use client";

import { useState, useEffect } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CalcMeta } from "@/lib/calculators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Share,
  Share2, 
  MessageSquare, 
  Copy, 
  Check, 
  Eye, 
  Code2,
  AlertCircle,
  Globe,
  Info,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

export const SocialSharePreviewCalculator = ({ 
  calc, 
  guideHtml, 
  faqs, 
  relatedArticles 
}: { 
  calc: CalcMeta;
  guideHtml?: string;
  faqs?: { q: string; a: string }[];
  relatedArticles?: any[];
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchMetadata = async () => {
    if (!url) return;
    setIsFetching(true);
    try {
      const res = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setTitle(data.title || "");
      setDescription(data.description || "");
      setImage(data.image || "");
      toast.success("Metadata fetched!");
    } catch (error) {
      toast.error("Failed to fetch metadata. Please enter manually.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const metaCode = `<!-- HTML Meta Tags -->
<title>${title}</title>
<meta name="description" content="${description}">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="${url.replace(/https?:\/\//, '')}">
<meta property="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">`;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">
        
        {/* Input Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="surface-card p-6 sm:p-8 space-y-6 border-border/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Page Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Site URL</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 font-medium bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl h-12"
                  />
                  <Button 
                    onClick={fetchMetadata} 
                    disabled={isFetching}
                    className="w-full sm:w-auto rounded-xl px-6 h-12 text-[10px] font-bold uppercase tracking-widest gap-2 shrink-0 shadow-lg shadow-primary/5 active:scale-95 transition-all"
                  >
                    {isFetching ? <RefreshCcw className="size-3.5 animate-spin" /> : <RefreshCcw className="size-3.5" />}
                    {isFetching ? "Fetching..." : "Fetch Meta"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Page Title</Label>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded",
                    title.length > 60 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                  )}>
                    {title.length} / 60
                  </span>
                </div>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter page title..."
                  className="font-medium bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded",
                    description.length > 155 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                  )}>
                    {description.length} / 155
                  </span>
                </div>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter meta description..."
                  className="min-h-[100px] font-medium bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OG Image URL</Label>
                <Input 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/og-image.png"
                  className="font-medium bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                />
              </div>
            </div>

            {/* SEO Health Check Summary */}
            <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Info className="size-3.5 text-primary" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider">SEO Health Check</h4>
              </div>
              
              <div className="space-y-3">
                {title.length === 0 ? (
                  <div className="flex gap-3 text-[11px] leading-relaxed">
                    <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-red-500">Title is missing:</span> Search engines and social platforms won't have a name to display. Add a title (50-60 chars) for better results.</p>
                  </div>
                ) : title.length > 60 ? (
                  <div className="flex gap-3 text-[11px] leading-relaxed">
                    <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-amber-500">Title too long:</span> Your title will likely be truncated (cut off) on most platforms. Aim for under 60 characters.</p>
                  </div>
                ) : (
                  <div className="flex gap-3 text-[11px] leading-relaxed text-green-600 dark:text-green-400">
                    <Check className="size-4 shrink-0 mt-0.5" />
                    <p>Title is looking good!</p>
                  </div>
                )}

                {description.length === 0 ? (
                  <div className="flex gap-3 text-[11px] leading-relaxed">
                    <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-red-500">Description is missing:</span> Platforms will try to scrape random text from your page, which looks unprofessional. Add a summary (150 chars).</p>
                  </div>
                ) : description.length > 155 ? (
                  <div className="flex gap-3 text-[11px] leading-relaxed">
                    <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-amber-500">Description too long:</span> Keep it under 155 characters to avoid being cut off in search results.</p>
                  </div>
                ) : (
                  <div className="flex gap-3 text-[11px] leading-relaxed text-green-600 dark:text-green-400">
                    <Check className="size-4 shrink-0 mt-0.5" />
                    <p>Description is looking good!</p>
                  </div>
                )}

                {!image ? (
                  <div className="flex gap-3 text-[11px] leading-relaxed">
                    <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-amber-500">OG Image is missing:</span> Your link will appear as a plain text block. Adding a high-quality image (1200x630px) can increase clicks by up to 40%.</p>
                  </div>
                ) : (
                  <div className="flex gap-3 text-[11px] leading-relaxed text-green-600 dark:text-green-400">
                    <Check className="size-4 shrink-0 mt-0.5" />
                    <p>Open Graph Image is set.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="surface-card p-6 bg-primary/5 border-primary/10 space-y-4">
             <div className="flex items-center gap-2 text-primary">
                <Info className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">SEO Best Practice</span>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed font-medium">
               To ensure your links stand out on WhatsApp and Facebook, keep your title under **60 characters** and your OG image around **1200x630 pixels**. This prevents your text from being truncated.
             </p>
          </div>
        </div>

        {/* Previews Area */}
        <div className="lg:col-span-7 space-y-8">
          <Tabs defaultValue="whatsapp" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Eye className="size-5 text-muted-foreground" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Live Social Preview</h3>
              </div>
              <TabsList className="bg-secondary/50 p-1 rounded-xl flex flex-wrap h-auto sm:h-10 w-full sm:w-auto">
                <TabsTrigger value="whatsapp" className="flex-1 sm:flex-none data-[state=active]:bg-background rounded-lg px-3 py-1.5 text-[11px] sm:text-xs"><MessageSquare className="size-3.5 mr-2 text-green-500" /> WhatsApp</TabsTrigger>
                <TabsTrigger value="facebook" className="flex-1 sm:flex-none data-[state=active]:bg-background rounded-lg px-3 py-1.5 text-[11px] sm:text-xs"><FacebookIcon className="size-3.5 mr-2 text-blue-600" /> Facebook</TabsTrigger>
                <TabsTrigger value="twitter" className="flex-1 sm:flex-none data-[state=active]:bg-background rounded-lg px-3 py-1.5 text-[11px] sm:text-xs"><TwitterIcon className="size-3.5 mr-2 text-sky-400" /> X / Twitter</TabsTrigger>
              </TabsList>
            </div>

            {/* WhatsApp Preview */}
            <TabsContent value="whatsapp" className="mt-0 focus-visible:outline-none">
              <div className="w-full max-w-[320px] sm:max-w-[340px] mx-auto lg:mx-0">
                <div className="bg-[#e5ddd5] dark:bg-zinc-900 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                  <div className="bg-[#dcf8c6] dark:bg-zinc-800 rounded-xl p-0.5 shadow-sm border border-black/5 overflow-hidden">
                    <div className="bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                       <img src={image} alt="Preview" className="w-full h-40 object-cover" onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80")} />
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="font-bold text-[13px] text-zinc-900 dark:text-zinc-100 line-clamp-1">{title}</h4>
                      <p className="text-[12px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-snug">{description}</p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pt-1">{url.replace(/https?:\/\//, '')}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[9px] text-zinc-500">12:00 PM ✓✓</div>
                </div>
                <p className="text-[10px] text-center mt-3 text-muted-foreground uppercase tracking-widest font-bold">Mobile Link Preview (1:1 Ratio)</p>
              </div>
            </TabsContent>

            {/* Facebook Preview */}
            <TabsContent value="facebook" className="mt-0 focus-visible:outline-none">
               <div className="w-full max-w-[500px] border border-border/40 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900 mx-auto lg:mx-0">
                  <div className="aspect-[1.91/1] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900 space-y-1 border-t border-border/40">
                    <p className="text-[10px] sm:text-[12px] uppercase text-zinc-500 font-medium truncate">{url.replace(/https?:\/\//, '')}</p>
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">{title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{description}</p>
                  </div>
               </div>
            </TabsContent>

            {/* Twitter Preview */}
            <TabsContent value="twitter" className="mt-0 focus-visible:outline-none">
              <div className="w-full max-w-[500px] border border-border/40 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900 mx-auto lg:mx-0">
                 <div className="aspect-[1.91/1] overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white text-[9px] sm:text-[11px] font-bold border border-white/10 truncate max-w-[80%]">
                      {url.replace(/https?:\/\//, '')}
                    </div>
                 </div>
                 <div className="p-4 space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{description}</p>
                 </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Generated Code Area */}
          <div className="surface-card p-6 sm:p-8 space-y-6 border-border/60">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Share className="size-4 text-orange-500" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">Meta Tags Output</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCopy(metaCode)}
                  className="rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest gap-2"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy Tags"}
                </Button>
             </div>

             <div className="bg-zinc-950 rounded-2xl p-4 sm:p-6 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
                <pre className="font-mono text-[10px] sm:text-xs text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
                   {metaCode}
                </pre>
             </div>
             
             <div className="flex items-center gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <AlertCircle className="size-4 text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-700 dark:text-amber-500 font-medium leading-normal">
                  Note: These tags should be placed inside the &lt;head&gt; section of your website to work correctly.
                </p>
             </div>
          </div>
        </div>

      </div>
    </CalculatorPage>
  );
};

export default SocialSharePreviewCalculator;
