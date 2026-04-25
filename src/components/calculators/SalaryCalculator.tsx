"use client";

"use client";

import { useState } from "react";

export default function SalaryCalculator() {
  const [salary, setSalary] = useState<number>(75000);
  const [payFreq, setPayFreq] = useState<"annual" | "monthly" | "biweekly" | "weekly">("annual");
  const [taxRate, setTaxRate] = useState<number>(20); // simplified flat tax for MVP

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  };

  const calculateTakeHome = () => {
    let annualGross = salary;
    if (!salary) return { gross: 0, tax: 0, net: 0, monthlyNet: 0 };

    if (payFreq === "monthly") annualGross = salary * 12;
    if (payFreq === "biweekly") annualGross = salary * 26;
    if (payFreq === "weekly") annualGross = salary * 52;

    const annualTax = annualGross * (taxRate / 100);
    const annualNet = annualGross - annualTax;
    const monthlyNet = annualNet / 12;
    const biweeklyNet = annualNet / 26;
    const weeklyNet = annualNet / 52;

    return {
      gross: annualGross,
      tax: annualTax,
      annual: annualNet,
      monthly: monthlyNet,
      biweekly: biweeklyNet,
      weekly: weeklyNet
    };
  };

  const results = calculateTakeHome();

  return (
    <div className="glass-card">
      <div className="form-group" style={{ marginBottom: "2rem" }}>
        <span className="input-label">Gross Salary Amount</span>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "1.2rem" }}>$</span>
          <input 
            type="number" 
            className="modern-input" 
            style={{ paddingLeft: "2.5rem" }}
            value={salary || ""} 
            onChange={(e) => setSalary(Number(e.target.value))} 
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="form-group">
          <span className="input-label">Pay Frequency</span>
          <select 
            className="modern-input" 
            value={payFreq} 
            onChange={(e) => setPayFreq(e.target.value as any)}
          >
            <option value="annual">Annually</option>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="form-group">
          <span className="input-label">Est. Tax Rate (%)</span>
          <input 
              type="number" 
              className="modern-input" 
              value={taxRate || ""} 
              onChange={(e) => setTaxRate(Number(e.target.value))} 
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box primary" style={{ gridColumn: "span 2", textAlign: "center" }}>
          <span className="stat-label">Monthly Take Home</span>
          <div className="stat-value" style={{ fontSize: "2.5rem", marginTop: "0.25rem" }}>{formatCurrency(results.monthly || 0)}</div>
        </div>
        <div className="stat-box">
          <span className="stat-label">Annual Net</span>
          <div className="stat-value">{formatCurrency(results.annual || 0)}</div>
        </div>
        <div className="stat-box">
          <span className="stat-label">Paid in Taxes</span>
          <div className="stat-value" style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>{formatCurrency(results.tax || 0)}</div>
        </div>
      </div>
    </div>
  );
}
