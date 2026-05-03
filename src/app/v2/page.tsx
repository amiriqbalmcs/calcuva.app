"use client";

import { useState } from "react";
import { 
  Search, Shield, BadgeCheck, GraduationCap, Coins, Activity, Zap, 
  ArrowRight, Calculator, Landmark, Plus, ChevronDown, 
  Heart, Percent, Ruler, FlaskConical, Globe, BookOpen,
  Apple, Beef, PieChart, Clock, Stethoscope, Microscope,
  Brain, Plane, ShoppingCart, User, Users, Settings, MapPin,
  TrendingUp, Dna, Waves, HeartPulse, Dumbbell, LineChart, 
  BarChart3, Gauge, Moon, Sun, Target, History
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = ["Income Tax", "GST", "EMI Calculator", "Home Loan EMI", "Car Loan EMI", "Personal Loan", "Business Loan"];

export default function V2LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container-wide h-16 flex items-center justify-between">
          <Link href="/v2" className="flex items-center gap-2">
            <div className="size-8 bg-[#2D3436] rounded-lg flex items-center justify-center text-white">
              <Calculator className="size-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#2D3436]">calciva</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map(link => (
              <Link key={link} href="#" className="text-[13px] font-bold text-slate-500 hover:text-blue-600 whitespace-nowrap transition-colors">
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-200 transition-all">
              Insights
            </button>
            <button className="size-9 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="size-4 text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-12 py-12">
        {/* Section: Health */}
        <section className="container-wide">
          <div className="grid lg:grid-cols-[450px,1fr] gap-6">
            <div className="relative h-[400px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#E91E63] to-[#880E4F] p-10 flex flex-col justify-center text-white">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Heart className="size-32" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">27+ Tools</div>
                <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight">Health Numbers <br /> You Can Act On</h2>
                <p className="text-lg opacity-80 mb-10 max-w-[300px]">Find your BMI, BMR and daily calorie need. Track pregnancy week by week.</p>
                <button className="px-8 py-3 rounded-full bg-white text-rose-600 text-sm font-black uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">
                  Explore Health <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "BMI Calculator", sub: "Body & Weight", icon: Heart },
                { title: "Ideal Weight Calculator", sub: "Body & Weight", icon: User },
                { title: "Body Fat Calculator", sub: "Body & Weight", icon: Activity },
                { title: "Lean Body Mass Calculator", sub: "Body & Weight", icon: Dumbbell },
                { title: "Waist-Hip Ratio Calculator", sub: "Body & Weight", icon: Ruler },
                { title: "Body Surface Area Calculator", sub: "Body & Weight", icon: MapPin },
              ].map((tool, i) => (
                <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="size-12 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                    <tool.icon className="size-5 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{tool.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tool.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Math */}
        <section className="container-wide">
          <div className="grid lg:grid-cols-[1fr,450px] gap-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Percentage Calculator", sub: "Basic Math", icon: Percent },
                { title: "Scientific Calculator", sub: "Basic Math", icon: Calculator },
                { title: "Fraction Calculator", sub: "Basic Math", icon: Ruler },
                { title: "Ratio Calculator", sub: "Basic Math", icon: Gauge },
                { title: "Average Calculator", sub: "Basic Math", icon: BarChart3 },
                { title: "Long Division Calculator", sub: "Basic Math", icon: DivideIcon },
                { title: "Square Root Calculator", sub: "Basic Math", icon: LineChart },
                { title: "Exponent Calculator", sub: "Basic Math", icon: TrendingUp },
              ].map((tool, i) => (
                <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <tool.icon className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{tool.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tool.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative h-[400px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#3F51B5] to-[#1A237E] p-10 flex flex-col justify-center text-white">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Percent className="size-32" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">37+ Tools</div>
                <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight">Math With the <br /> Working Shown</h2>
                <p className="text-lg opacity-80 mb-10 max-w-[300px]">Solve geometry, algebra, statistics and calculus problems. Every answer comes with steps.</p>
                <button className="px-8 py-3 rounded-full bg-white text-indigo-600 text-sm font-black uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">
                  Solve a Problem <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Science */}
        <section className="container-wide">
          <div className="grid lg:grid-cols-[450px,1fr] gap-6">
            <div className="relative h-[400px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#009688] to-[#004D40] p-10 flex flex-col justify-center text-white">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <FlaskConical className="size-32" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">16+ Tools</div>
                <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight">Science Formulas <br /> Ready to Use</h2>
                <p className="text-lg opacity-80 mb-10 max-w-[300px]">Calculate Ohm’s law, density, energy and half life. Physics, chemistry and biology.</p>
                <button className="px-8 py-3 rounded-full bg-white text-teal-600 text-sm font-black uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">
                  Discover More <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Ohm's Law Calculator", sub: "Physics", icon: Zap },
                { title: "Density Calculator", sub: "Physics", icon: Gauge },
                { title: "Speed Calculator", sub: "Physics", icon: TimerIcon },
                { title: "Force Calculator", sub: "Physics", icon: Target },
                { title: "Work and Energy Calculator", sub: "Physics", icon: Zap },
                { title: "Power Calculator (Physics)", sub: "Physics", icon: Zap },
              ].map((tool, i) => (
                <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="size-12 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <tool.icon className="size-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{tool.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tool.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ & About Section */}
        <section className="container-wide py-20">
          <div className="grid lg:grid-cols-[1fr,550px] gap-20">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4 text-center lg:text-left">Frequently Asked</div>
              <h2 className="text-4xl font-black tracking-tight mb-12 text-center lg:text-left">About Calciva</h2>
              <div className="space-y-4">
                {[
                  "Are all Calciva calculators free?",
                  "Do I need to sign up or share my email?",
                  "How accurate are the calculator results?",
                  "Are my numbers stored or shared with anyone?",
                  "Do these calculators work on mobile?",
                  "Which currencies and regions are supported?",
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
                        Every calculator on Calciva is 100% free with no sign-up required. Your data stays in your browser and is never stored on our servers.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-[40px] p-12 text-white relative overflow-hidden group">
              <div className="absolute -bottom-20 -right-20 text-[200px] font-black text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 select-none">249</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Our Story</div>
              <h3 className="text-3xl font-black tracking-tight mb-8 leading-tight">
                Calciva started with one EMI calculator. Today it has 249 live calculator pages and a growing roadmap.
              </h3>
              <p className="text-slate-400 mb-10 leading-relaxed text-sm">
                Calciva began in 2024 as a single EMI calculator built by Dinakaran L. Today it is growing into a broader calculator platform across finance, tax, health, math and science. All free. All private. Built by a small team in India for users worldwide.
              </p>
              
              <div className="grid grid-cols-3 gap-8 mb-10">
                <div>
                  <div className="text-2xl font-black">249</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Pages</div>
                </div>
                <div>
                  <div className="text-2xl font-black">Global</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Audience</div>
                </div>
                <div>
                  <div className="text-2xl font-black">3</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Authors</div>
                </div>
              </div>

              <button className="px-8 py-3 rounded-full bg-white text-black text-sm font-black uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">
                Read Our Story <ArrowRight className="size-4" />
              </button>
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

        {/* Large Dark Footer */}
        <footer className="bg-[#121212] text-white pt-24 pb-12 border-t border-white/5">
          <div className="container-wide">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
              <div className="col-span-2">
                <Link href="/v2" className="flex items-center gap-2 mb-8">
                  <div className="size-8 bg-white/10 rounded-lg flex items-center justify-center text-white">
                    <Calculator className="size-4" />
                  </div>
                  <span className="text-2xl font-black tracking-tight">calciva</span>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[300px]">
                  Free online calculators for finance, health, math, science and more. 
                  Built in India for users worldwide.
                </p>
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <FacebookIcon className="size-4" />
                  </div>
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <TwitterIcon className="size-4" />
                  </div>
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <InstagramIcon className="size-4" />
                  </div>
                </div>
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
      </main>
    </div>
  );
}

function DivideIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="1" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  );
}

function TimerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="2" x2="14" y2="2" />
      <line x1="12" y1="14" x2="15" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function TwitterIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
}
function InstagramIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
