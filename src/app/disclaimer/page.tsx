import { Seo } from "@/components/Seo";
import { AlertCircle, Landmark, Activity } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Seo 
        title="Disclaimer — For your information"
        description="Important information about using our calculators responsibly."
        canonicalPath="/disclaimer"
      />

      <header className="pt-24 pb-16 border-b border-border bg-secondary/10">
        <div className="container-wide max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            <AlertCircle className="size-3" /> Responsibility First
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Read this before you start.</h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Our tools are here to help you get numbers quickly, but they are not a replacement for professional experts.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-3xl mt-16 space-y-12">
        <div className="grid gap-8">
          
          <div className="p-8 rounded-3xl bg-secondary/30 border border-border flex gap-6 items-start">
             <div className="size-12 rounded-2xl bg-finance-soft text-finance flex items-center justify-center shrink-0">
                <Landmark className="size-6" />
             </div>
             <div>
                <h2 className="text-xl font-bold mb-3">Money & Finance</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our financial tools are estimates. Tax laws and bank interest rates change all the time. Before you sign any big loans or make tax decisions, always talk to a certified financial advisor or tax expert.
                </p>
             </div>
          </div>

          <div className="p-8 rounded-3xl bg-secondary/30 border border-border flex gap-6 items-start">
             <div className="size-12 rounded-2xl bg-health-soft text-health flex items-center justify-center shrink-0">
                <Activity className="size-6" />
             </div>
             <div>
                <h2 className="text-xl font-bold mb-3">Health & Fitness</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Health calculators are simplified guides. They don't know your specific medical history or physical condition. Never use these tools to replace advice from a real doctor or health professional.
                </p>
             </div>
          </div>

          <div className="p-10 border-t border-border mt-10">
             <h2 className="text-2xl font-bold mb-4">No Guarantees</h2>
             <p className="text-muted-foreground leading-relaxed text-lg">
                We work hard to make our math 100% accurate, but we can't guarantee that everything is perfect all the time. Using Calcuva is at your own risk. We're not responsible for any mistakes or decisions made based on our tools.
             </p>
          </div>

        </div>
      </main>
    </div>
  );
}
