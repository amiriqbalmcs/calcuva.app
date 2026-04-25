"use client";

import { useMemo, useState } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";

const calc = calculatorBySlug("hourly-to-salary-calculator")!;

const HourlySalaryCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [hourly, setHourly] = useState(40);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const results = useMemo(() => {
    const daily = hourly * hoursPerDay;
    const weekly = daily * daysPerWeek;
    const monthly = (weekly * weeksPerYear) / 12;
    const annual = weekly * weeksPerYear;

    return { daily, weekly, monthly, annual };
  }, [hourly, hoursPerDay, daysPerWeek, weeksPerYear]);

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={
        <SeoBlock
          title="Comparing Hourly Wages and Salaried Income"
          intro="Understanding your true compensation requires looking beyond the hourly rate. Converting to annual or monthly benchmarks helps you compare job offers and plan your cost of living more effectively."
          sections={[
            {
              heading: "The Standard Year",
              icon: "info",
              body: <p>A standard full-time work year is typically considered 2,080 hours (40 hours per week × 52 weeks). However, if you take 2 weeks of unpaid vacation, your actual annual income will be based on 2,000 hours.</p>,
            },
            {
              heading: "Gross vs. Net Pay",
              icon: "book",
              body: <p>Important: This calculator provides <strong>Gross Income</strong> (income before taxes). Your actual take-home pay will be lower after federal, state, and local taxes, insurance premiums, and retirement contributions are deducted.</p>,
            },
          ]}
          faqs={[
            { q: "What is a living wage?", a: "A living wage is the minimum income necessary for a worker to meet their basic needs, which varies significantly by city and family size." },
            { q: "Are holidays paid?", a: "This depends on your employment contract. Some hourly roles pay only for hours worked, while 'Salaried-Exempt' roles provide a fixed annual sum regardless of minor hour fluctuations." },
          ]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div>
            <Label>Hourly Wage</Label>
            <Input
              type="number"
              value={hourly}
              onChange={(e) => setHourly(Number(e.target.value) || 0)}
              className="mt-2 text-lg font-semibold"
            />
            <Slider value={[hourly]} min={7} max={500} step={0.5} onValueChange={([v]) => setHourly(v)} className="mt-4" />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <Label>Hours per Day</Label>
                <span className="font-mono text-xs font-bold text-signal">{hoursPerDay}h</span>
              </div>
              <Slider value={[hoursPerDay]} min={1} max={24} step={0.5} onValueChange={([v]) => setHoursPerDay(v)} />
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <Label>Days per Week</Label>
                <span className="font-mono text-xs font-bold text-signal">{daysPerWeek}d</span>
              </div>
              <Slider value={[daysPerWeek]} min={1} max={7} step={1} onValueChange={([v]) => setDaysPerWeek(v)} />
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <Label>Weeks per Year</Label>
                <span className="font-mono text-xs font-bold text-signal">{weeksPerYear}w</span>
              </div>
              <Slider value={[weeksPerYear]} min={1} max={52} step={1} onValueChange={([v]) => setWeeksPerYear(v)} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat
              label="Annual Salary"
              value={formatCurrency(results.annual)}
              sub={`Full-time equivalent`}
              accent
            />
            <ResultStat
              label="Monthly Income"
              value={formatCurrency(results.monthly)}
              sub="Before taxes"
            />
          </ResultGrid>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <ResultStat
              label="Weekly Pay"
              value={formatCurrency(results.weekly)}
              sub={`${daysPerWeek} days/week`}
            />
            <ResultStat
              label="Daily Pay"
              value={formatCurrency(results.daily)}
              sub={`${hoursPerDay} hours/day`}
            />
          </div>

          <div className="surface-card p-6 flex flex-col items-center text-center">
            <div className="size-12 rounded-full bg-business-soft text-business flex items-center justify-center mb-4">
              <span className="font-bold text-sm">H</span>
            </div>
            <h3 className="font-semibold mb-2">Time is Money</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              At your current rate, you earn <strong>{formatCurrency(hourly)}</strong> every hour. 
              In a single year, you will work approximately <strong>{formatNumber(hoursPerDay * daysPerWeek * weeksPerYear)}</strong> hours.
            </p>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default HourlySalaryCalculator;
