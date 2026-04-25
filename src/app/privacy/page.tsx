import { Seo } from "@/components/Seo";
import { Lock, EyeOff, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Seo 
        title="Privacy — Safe and Private Math"
        description="Learn how Calcuva keeps your data safe by processing everything locally on your device."
        canonicalPath="/privacy"
      />

      <header className="pt-24 pb-16 border-b border-border bg-secondary/10">
        <div className="container-wide max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/20 text-signal text-[10px] font-bold uppercase tracking-widest mb-6">
            <Lock className="size-3" /> Secure Technology
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Your data is yours.</h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            We don't collect what you type into our calculators. Ever.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-3xl mt-16">
        <div className="space-y-12 prose prose-slate dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed">
          
          <section>
            <h2 className="flex items-center gap-3">
              <EyeOff className="size-6 text-signal" /> 1. How we protect you
            </h2>
            <p>
              When you use a calculator on Calcuva, the math happens <strong>inside your browser</strong>. Your numbers (like your salary, your debt, or your weight) are never sent to our servers. We never see them, so we can't sell them or lose them.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3">
              <ShieldCheck className="size-6 text-signal" /> 2. What we "see"
            </h2>
            <p>
              To make the site better, we only look at "big picture" numbers, such as:
            </p>
            <ul className="text-muted-foreground text-lg list-none space-y-4 pl-0">
              <li className="flex gap-3"><span className="text-signal font-bold">·</span> <strong>Popularity:</strong> Which tools are used the most.</li>
              <li className="flex gap-3"><span className="text-signal font-bold">·</span> <strong>Performance:</strong> How fast the site loads for you.</li>
              <li className="flex gap-3"><span className="text-signal font-bold">·</span> <strong>Device Type:</strong> If you're on a phone or a computer.</li>
            </ul>
          </section>

          <section className="p-8 rounded-3xl bg-secondary/30 border border-border mt-20">
            <h2 className="mt-0">Ads & Cookies</h2>
            <p>
              We use Google AdSense to show ads. This helps keep Calcuva free for everyone. Google may use "cookies" to show you ads that matches your interests. You can turn this off in your <a href="https://www.google.com/settings/ads" className="text-signal underline hover:text-signal/80">Google Ad Settings</a>.
            </p>
          </section>

          <section className="pt-12 border-t border-border">
            <h2>Questions?</h2>
            <p>
              Privacy shouldn't be complicated. If you're worried about how anything on this site works, just send us an email at <strong>hello@calcuva.app</strong>.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
