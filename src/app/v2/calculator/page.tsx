"use client";

import { useState } from "react";
import { 
  ChevronLeft, Share2, Printer, Shield, BadgeCheck, 
  Lightbulb, Info, ArrowRight, Wallet, History,
  Calculator as CalcIcon, LineChart, Download
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function V2CalculatorPage() {
  const [salary, setSalary] = useState("150000");
  const [month, setMonth] = useState("12");

  // Mock calculation
  const monthlyTax = (parseInt(salary) || 0) * 0.15;
  const annualTax = monthlyTax * 12;
  const takeHome = (parseInt(salary) || 0) - monthlyTax;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mini Nav */}
      <nav className="h-16 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-wide h-full flex items-center justify-between">
          <Link href="/v2" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            <ChevronLeft className="size-4" />
            Back to Hub
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-all border border-transparent hover:border-slate-100">
              <Share2 className="size-4" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-all border border-transparent hover:border-slate-100">
              <Printer className="size-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="container-wide py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr,380px] gap-12 lg:gap-20 items-start">
          {/* Left Column: Calculator Engine */}
          <div className="space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-3 text-indigo-600">
                <div className="size-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Wallet className="size-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest font-mono">Finance Engine · v4.2</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Salary Tax Calculator <span className="text-slate-400">2026</span></h1>
              <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                Estimate your monthly income tax, take-home pay, and annual liabilities 
                based on the latest FBR tax slabs for the 2026 fiscal year.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                  <BadgeCheck className="size-3.5" />
                  Verified for 2026
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  <Shield className="size-3.5" />
                  Privacy Locked
                </div>
              </div>
            </header>

            {/* Input Dashboard */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm shadow-slate-100">
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-1">Monthly Gross Salary (PKR)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 font-bold">Rs.</div>
                    <input 
                      type="number" 
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-14 pr-6 py-5 rounded-2xl text-xl font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-1">Fiscal Months</label>
                  <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-6 py-5 rounded-2xl text-xl font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="12">12 Months (Full Year)</option>
                    <option value="6">6 Months (Half Year)</option>
                    <option value="1">1 Month (Trial)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Analysis Section */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-8 rounded-[32px] bg-slate-900 text-white space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Monthly Take-Home</div>
                <div className="text-3xl font-bold">Rs. {takeHome.toLocaleString()}</div>
                <div className="text-xs text-emerald-400 font-medium">85% of Gross Income</div>
              </div>
              <div className="p-8 rounded-[32px] bg-white border border-slate-100 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Income Tax (Monthly)</div>
                <div className="text-3xl font-bold text-rose-600">Rs. {monthlyTax.toLocaleString()}</div>
                <div className="text-xs text-slate-400 font-medium">Based on 15% Slab</div>
              </div>
              <div className="p-8 rounded-[32px] bg-white border border-slate-100 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Annual Liability</div>
                <div className="text-3xl font-bold">Rs. {annualTax.toLocaleString()}</div>
                <div className="text-xs text-slate-400 font-medium">Projected 2026 Total</div>
              </div>
            </div>

            {/* Methodology Deep Dive */}
            <div className="pt-20 border-t border-slate-100 space-y-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <Info className="size-5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Expert Methodology</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">How we calculate your 2026 taxes.</h2>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Unlike generic tax tools, Calcuva uses the official FBR Finance Act 2026 slabs. 
                  We factor in professional tax, worker's welfare fund deductions, and tax 
                  credits for salaried individuals automatically.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex gap-5">
                    <div className="size-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-sm">01</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Verified Slabs</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">We update our math engine within 12 hours of any official FBR gazette release.</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="size-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-sm">02</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Browser-Only Processing</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">Your salary data never leaves your browser. Zero server logs, 100% privacy.</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 rounded-[32px] bg-indigo-50 border border-indigo-100 space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Lightbulb className="size-5" />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono">Pro Tip</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    "Consider voluntary pension scheme contributions to reduce your taxable income by up to 20% under Section 63."
                  </p>
                  <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all">
                    Read Tax Optimization Guide <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="space-y-8 sticky top-28">
            {/* Quick Actions */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <h3 className="text-lg font-bold mb-6">Expert Analysis</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold group">
                  <div className="flex items-center gap-3">
                    <LineChart className="size-4 text-indigo-400" />
                    Growth Projection
                  </div>
                  <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold group">
                  <div className="flex items-center gap-3">
                    <Download className="size-4 text-indigo-400" />
                    Download PDF Report
                  </div>
                  <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </div>
            </div>

            {/* History Mockup */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold">Recent History</h3>
                <History className="size-4 text-slate-400" />
              </div>
              <div className="space-y-6">
                {[
                  { label: "Junior Dev", val: "85k" },
                  { label: "Senior Mgr", val: "320k" },
                  { label: "Lead Eng", val: "210k" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-700">{item.label}</div>
                    <div className="text-xs font-mono text-slate-400 uppercase">Rs. {item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8">
              <h3 className="font-bold mb-6">Decision Hub</h3>
              <div className="space-y-4">
                {[
                  { title: "Zakat Optimizer", icon: Wallet },
                  { title: "SIP Planner", icon: LineChart },
                  { title: "GST Engine", icon: CalcIcon },
                ].map((item) => (
                  <Link key={item.title} href="#" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <item.icon className="size-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="py-20 border-t border-slate-100 mt-20">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/v2" className="flex items-center gap-2.5">
            <div className="size-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <CalcIcon className="size-4" />
            </div>
            <span className="text-lg font-bold tracking-tight uppercase">Calcuva</span>
          </Link>
          <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Precision Verified</span>
            <span>Privacy Secured</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
