"use client";

import { useState } from "react";
import { 
  ChevronLeft, Share2, Printer, Shield, BadgeCheck, 
  Lightbulb, Info, ArrowRight, Calculator as CalcIcon, 
  History, Users, Heart, Ruler, Scale, Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function V2CalculatorPage() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Header (Same as Landing) */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container-wide h-16 flex items-center justify-between">
          <Link href="/v2" className="flex items-center gap-2">
            <div className="size-8 bg-[#2D3436] rounded-lg flex items-center justify-center text-white">
              <CalcIcon className="size-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#2D3436]">calciva</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2 rounded-full bg-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-200 transition-all">
              All Calculators
            </button>
            <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center"><ChevronLeft className="size-4 text-slate-500" /></div>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container-wide max-w-6xl">
          <div className="grid lg:grid-cols-[1fr,400px] gap-12">
            
            {/* Left Column: Calculator */}
            <div className="space-y-10">
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Link href="/v2" className="hover:text-rose-500 transition-colors">Home</Link>
                <span>/</span>
                <Link href="#" className="hover:text-rose-500 transition-colors">Health</Link>
                <span>/</span>
                <span className="text-slate-900">BMI Calculator</span>
              </nav>

              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">BMI Calculator</h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                  Calculate your Body Mass Index (BMI) to determine if you are at a healthy weight for your height. 
                  Includes weight status category.
                </p>
              </div>

              {/* Calculator UI */}
              <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-10 mb-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Height (cm)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-xl font-black focus:bg-white focus:border-rose-500 outline-none transition-all"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">CM</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Weight (kg)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-xl font-black focus:bg-white focus:border-rose-500 outline-none transition-all"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">KG</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] rounded-[24px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-1 text-center md:text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Body Mass Index</div>
                    <div className="text-6xl font-black">{bmi}</div>
                  </div>
                  <div className="text-center md:text-right space-y-4">
                    <div className="px-6 py-2 rounded-full bg-emerald-500 text-white text-xs font-black uppercase tracking-wider">
                      Normal Weight
                    </div>
                    <p className="text-sm text-slate-400 font-medium max-w-[200px]">Healthy weight range for your height: 58kg - 78kg</p>
                  </div>
                </div>
              </div>

              {/* Guide Section */}
              <div className="pt-12 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black tracking-tight">How BMI is calculated</h2>
                  <p className="text-lg text-slate-500 leading-relaxed">
                    BMI is a person's weight in kilograms divided by the square of height in meters. 
                    A high BMI can be an indicator of high body fatness. BMI can be used to screen 
                    for weight categories that may lead to health problems.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-white border border-slate-100 space-y-4">
                    <div className="size-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><Shield className="size-5" /></div>
                    <h4 className="font-black">Private & Secure</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Your measurements are never saved or sent to any server. Everything happens in your browser.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-white border border-slate-100 space-y-4">
                    <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><BadgeCheck className="size-5" /></div>
                    <h4 className="font-black">Expert Verified</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Formula verified against WHO (World Health Organization) standards for global accuracy.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="space-y-8">
              <div className="bg-white border border-slate-100 rounded-[32px] p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Related Tools</h3>
                <div className="space-y-4">
                  {[
                    { title: "BMR Calculator", icon: Heart },
                    { title: "TDEE Calculator", icon: Scale },
                    { title: "Ideal Weight", icon: Ruler },
                  ].map((tool, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                        <tool.icon className="size-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">{tool.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-4">Want more insights?</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">Join 50,000+ users who receive our weekly health & finance deep dives.</p>
                  <button className="w-full py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider">
                    Read Insights
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="container-wide py-20 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4 text-center">Common Questions</div>
          <h2 className="text-3xl font-black tracking-tight mb-12 text-center">About BMI Calculation</h2>
          <div className="space-y-4">
            {[
              "Is BMI accurate for everyone?",
              "What is a healthy BMI range?",
              "How often should I check my BMI?",
            ].map((q, i) => (
              <div key={i} className="border-b border-slate-100 pb-4">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {q}
                  <Plus className={cn("size-4 text-rose-500 transition-transform", openFaq === i && "rotate-45")} />
                </button>
                {openFaq === i && (
                  <div className="py-4 text-sm text-slate-500 leading-relaxed animate-fade-in">
                    While BMI is a useful screening tool, it does not account for muscle mass or body composition. Consult a professional for a detailed health analysis.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Trust Bar */}
      <section className="bg-[#1A1A1A] py-12 border-t border-white/5">
        <div className="container-wide flex flex-wrap justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="text-rose-500"><History className="size-6" /></div>
            <div>
              <div className="text-white text-lg font-black leading-none">249</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Calculators</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-rose-500"><Users className="size-6" /></div>
            <div>
              <div className="text-white text-lg font-black leading-none">3</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expert Authors</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-rose-500"><Shield className="size-6" /></div>
            <div>
              <div className="text-white text-lg font-black leading-none">100%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Free, No signup</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-rose-500"><BadgeCheck className="size-6" /></div>
            <div>
              <div className="text-white text-lg font-black leading-none">PHD</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expert Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Same as Landing) */}
      <footer className="bg-[#121212] text-white pt-24 pb-12 border-t border-white/5">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <Link href="/v2" className="flex items-center gap-2 mb-8">
                <div className="size-8 bg-white/10 rounded-lg flex items-center justify-center text-white">
                  <CalcIcon className="size-4" />
                </div>
                <span className="text-2xl font-black tracking-tight">calciva</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[300px]">
                Free online calculators for finance, health, math, science and more. 
                Built in India for users worldwide.
              </p>
            </div>

            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-6">Money</h5>
              <ul className="space-y-3 text-slate-400 text-[13px] font-bold">
                <li className="hover:text-white transition-colors cursor-pointer">EMI Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">SIP Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">FD Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">PPF Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">NPS Calculator</li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-6">Tax & Planning</h5>
              <ul className="space-y-3 text-slate-400 text-[13px] font-bold">
                <li className="hover:text-white transition-colors cursor-pointer">Income Tax</li>
                <li className="hover:text-white transition-colors cursor-pointer">GST Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">TDS Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">HRA Exemption</li>
                <li className="hover:text-white transition-colors cursor-pointer">Capital Gains</li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-6">Health & Fitness</h5>
              <ul className="space-y-3 text-slate-400 text-[13px] font-bold">
                <li className="hover:text-white transition-colors cursor-pointer">BMI Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">BMR Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">TDEE Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">Macro Calculator</li>
                <li className="hover:text-white transition-colors cursor-pointer">Sleep Calculator</li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-6">About Calciva</h5>
              <ul className="space-y-3 text-slate-400 text-[13px] font-bold">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Insights / Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">All Calculators</li>
                <li className="hover:text-white transition-colors cursor-pointer">Sitemap</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <div>© 2026 CALCIVA · A PRODUCT OF AVINTA DIGITAL</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Disclaimer</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
              <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
