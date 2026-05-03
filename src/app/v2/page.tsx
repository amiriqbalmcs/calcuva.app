"use client";

import { useState } from "react";
import { Search, Shield, BadgeCheck, GraduationCap, Coins, Activity, Zap, ArrowRight, Calculator, Landmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HUBS = [
  {
    id: "finance",
    label: "Finance & Tax",
    icon: Coins,
    desc: "Salary tax, GST, and investment ROI verified by professionals.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    tools: ["Salary Tax 2026", "GST Calculator", "SIP Planner", "Zakat Optimizer"]
  },
  {
    id: "student",
    label: "Student Gateway",
    icon: GraduationCap,
    desc: "University merit, GPA, and grade calculations for PK students.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    tools: ["NUST Merit", "GPA to %", "Attendance Tracker", "Study Planner"]
  },
  {
    id: "health",
    label: "Health & Vitality",
    icon: Activity,
    desc: "Medical-grade BMI, BMR, and nutrition tools.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    tools: ["BMI Pro", "Calorie Deficit", "Due Date", "Water Intake"]
  }
];

export default function V2LandingPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Premium Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container-wide h-20 flex items-center justify-between">
          <Link href="/v2" className="flex items-center gap-2.5 group">
            <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:rotate-6 transition-transform duration-300">
              <Calculator className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">CALCUVA <span className="text-indigo-600">PRO</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Tools</Link>
            <Link href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Insights</Link>
            <Link href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white hover:border-indigo-200 transition-all">
              <Shield className="size-4" />
              Privacy First
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
          
          <div className="container-wide text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in">
              <BadgeCheck className="size-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Precision Verified Math Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-8 leading-[1.1]">
              Calculations you can <span className="text-indigo-600 italic">bank on.</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Dependable tools for money, health, and education. Verified by experts, 
              designed for speed, and 100% private.
            </p>

            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-indigo-600/5 blur-2xl group-hover:bg-indigo-600/10 transition-all" />
              <div className="relative flex items-center bg-white border border-slate-200 p-2 rounded-2xl shadow-xl shadow-slate-200/50">
                <Search className="ml-4 size-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="What do you want to calculate today?"
                  className="w-full px-4 py-3 bg-transparent text-lg focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all flex items-center gap-2">
                  Search
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="border-y border-slate-100 bg-white py-12">
          <div className="container-wide flex flex-wrap justify-center gap-12 md:gap-24 grayscale opacity-60">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Shield className="size-5" />
              <span>NO DATA STORAGE</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <BadgeCheck className="size-5" />
              <span>EXPERT VERIFIED</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Landmark className="size-5" />
              <span>FBR COMPLIANT</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Zap className="size-5" />
              <span>LIVE 2026 RATES</span>
            </div>
          </div>
        </section>

        {/* Specialized Hubs */}
        <section className="py-32 container-wide">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">Decision Hubs</h2>
              <p className="text-lg text-slate-500">Every tool is grouped into a focused ecosystem to help you move from a number to a better decision.</p>
            </div>
            <Link href="#" className="text-sm font-bold text-indigo-600 flex items-center gap-2 hover:gap-3 transition-all">
              Browse All 249+ Tools <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HUBS.map((hub) => (
              <div key={hub.id} className="group bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-indigo-600/5 hover:border-indigo-100 transition-all duration-500">
                <div className={cn("size-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500", hub.bg)}>
                  <hub.icon className={cn("size-7", hub.color)} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{hub.label}</h3>
                <p className="text-slate-500 mb-8 line-clamp-2 leading-relaxed">{hub.desc}</p>
                
                <div className="space-y-4 mb-10">
                  {hub.tools.map((tool) => (
                    <Link key={tool} href="/v2/calculator" className="flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors py-2 border-b border-slate-50 last:border-0">
                      {tool}
                      <ArrowRight className="size-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>

                <Link 
                  href="#" 
                  className={cn("w-full py-4 rounded-2xl text-center text-sm font-bold transition-all block", 
                    "bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  Explore Hub
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* The "Thinking Behind the Numbers" Section */}
        <section className="bg-slate-950 py-32 overflow-hidden">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-6 font-mono">Expert Methodology</div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-8">
                  Numbers your accountant <br /> will agree with.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-12">
                  Every Calcuva tool goes through a rigorous verification process. 
                  We don't just calculate; we research the underlying policies, 
                  tariffs, and formulas to ensure 100% accuracy.
                </p>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-bold text-white mb-2">3.1M+</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Calculations Solved</div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-2xl font-bold text-white mb-2">0</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Data Points Stored</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-10 bg-indigo-500/20 blur-3xl -z-10" />
                <div className="bg-white rounded-[40px] p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="size-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">IQ</div>
                    <div>
                      <div className="font-bold">Irfan Qasim, PhD</div>
                      <div className="text-xs text-slate-500 font-semibold">Chief of Math Verification</div>
                    </div>
                  </div>
                  <blockquote className="text-xl text-slate-700 font-medium italic leading-relaxed">
                    "Accuracy isn't an option; it's our core product. We verify every formula against official 2026 gazettes before a tool ever goes live."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="py-20 border-t border-slate-100">
          <div className="container-wide text-center">
            <Link href="/v2" className="inline-flex items-center gap-2.5 mb-8">
              <div className="size-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <Calculator className="size-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">CALCUVA</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm font-semibold text-slate-500">
              <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Sitemap</Link>
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              © 2026 CALCUVA · BUILT FOR PRECISION
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
