"use client";

import { useState } from "react";
import { QrCode, Download, Link as LinkIcon, Type, Smartphone, Share2, Copy, Check } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface QrCodeGeneratorProps {
  calc: any;
  guideHtml?: string;
}

export default function QrCodeGenerator({ calc, guideHtml }: QrCodeGeneratorProps) {
  const [content, setContent] = useState<string>("https://calcuva.app");
  const [size, setSize] = useState<number>(300);
  const [margin, setMargin] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}&margin=${margin}&bgcolor=ffffff`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calcuva-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR code", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-6 space-y-8">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-utility/10 flex items-center justify-center text-utility shadow-inner">
                <QrCode className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">QR Content</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">Data Input</p>
              </div>
            </div>

            <Tabs defaultValue="url" className="space-y-6">
              <TabsList className="grid grid-cols-2 h-10 w-full max-w-[300px]">
                <TabsTrigger value="url" className="text-xs flex items-center gap-2">
                  <LinkIcon className="size-3" /> URL
                </TabsTrigger>
                <TabsTrigger value="text" className="text-xs flex items-center gap-2">
                  <Type className="size-3" /> Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website Address</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-12 bg-background border-border/50 rounded-xl font-medium"
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Custom Message</Label>
                  <Textarea
                    id="text"
                    placeholder="Enter the text or data for your QR code..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[120px] bg-background border-border/50 rounded-xl resize-none"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 space-y-8 pt-8 border-t border-border/50">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <Label>Image Size</Label>
                  <span className="font-mono text-muted-foreground">{size}px × {size}px</span>
                </div>
                <Slider
                  value={[size]}
                  min={100}
                  max={1000}
                  step={50}
                  onValueChange={([v]) => setSize(v)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <Label>Quiet Zone (Margin)</Label>
                  <span className="font-mono text-muted-foreground">{margin}</span>
                </div>
                <Slider
                  value={[margin]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={([v]) => setMargin(v)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="surface-card p-12 flex flex-col items-center justify-center space-y-8 border-utility/20 bg-gradient-to-br from-utility/5 to-transparent relative">
            <div className="absolute top-6 left-6 flex items-center gap-2">
               <Smartphone className="size-4 text-utility" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Preview</span>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-utility/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-white/50">
                 <img 
                    src={qrUrl} 
                    alt="Custom QR Code" 
                    className="size-48 sm:size-64 object-contain"
                 />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
               <button 
                  onClick={handleDownload}
                  className="flex-1 bg-utility text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-utility/20 hover:bg-utility/90 transition-all active:scale-95"
               >
                 <Download className="size-4" /> Download PNG
               </button>
               <button 
                  onClick={handleCopy}
                  className="flex-1 bg-background border border-border h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-95"
               >
                 {copied ? (
                   <> <Check className="size-4 text-green-500" /> Copied! </>
                 ) : (
                   <> <Copy className="size-4" /> Copy Link </>
                 )}
               </button>
            </div>
            
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] font-bold">Safe • Instant • Anonymous</p>
          </div>

          <div className="surface-card p-6 bg-secondary/20 border-dotted">
             <div className="flex items-center gap-3 text-muted-foreground">
                <Share2 className="size-5" />
                <p className="text-xs leading-relaxed">
                  QR codes are a universal way to share data with smartphones. Use them on business cards, posters, or digital displays to link users to your content without typing.
                </p>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
