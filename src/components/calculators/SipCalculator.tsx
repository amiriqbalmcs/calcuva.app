"use client";

"use client";

import { useState, useEffect } from "react";

export default function SipCalculator() {
  const [investment, setInvestment] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [type, setType] = useState<"sip" | "lumpsum">("sip");

  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);

  useEffect(() => {
    calculateSip();
  }, [investment, rate, years, type]);

  const calculateSip = () => {
    if (!investment || !rate || !years) {
      setTotalInvested(0);
      setEstimatedReturns(0);
      setTotalValue(0);
      return;
    }

    const i = rate / 100 / 12;
    const n = years * 12;
    let total = 0;
    let invested = 0;

    if (type === "sip") {
      invested = investment * n;
      total = investment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      invested = investment;
      total = investment * Math.pow(1 + rate / 100, years);
    }

    setTotalInvested(invested);
    setTotalValue(total);
    setEstimatedReturns(total - invested);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="glass-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <span className="input-label" style={{ margin: 0 }}>Investment Type</span>
        <select 
          className="modern-input" 
          style={{ width: "auto", padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          value={type} 
          onChange={(e) => setType(e.target.value as "sip" | "lumpsum")}
        >
          <option value="sip">Monthly SIP</option>
          <option value="lumpsum">Lump Sum</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <span className="input-label">{type === "sip" ? "Monthly Investment" : "Total Investment"}</span>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "1.2rem" }}>$</span>
          <input 
            type="number" 
            className="modern-input" 
            style={{ paddingLeft: "2.5rem" }}
            value={investment || ""} 
            onChange={(e) => setInvestment(Number(e.target.value))} 
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="form-group">
          <span className="input-label">Exp. Return Rate (%)</span>
          <input 
              type="number" 
              className="modern-input" 
              value={rate || ""} 
              onChange={(e) => setRate(Number(e.target.value))} 
              step="0.1"
          />
        </div>
        <div className="form-group">
          <span className="input-label">Time Period (Yrs)</span>
          <input 
              type="number" 
              className="modern-input" 
              value={years || ""} 
              onChange={(e) => setYears(Number(e.target.value))} 
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box primary" style={{ gridColumn: "span 2", textAlign: "center" }}>
          <span className="stat-label">Estimated Total Value</span>
          <div className="stat-value" style={{ fontSize: "2.5rem", marginTop: "0.25rem" }}>{formatCurrency(totalValue)}</div>
        </div>
        <div className="stat-box">
          <span className="stat-label">Invested Amount</span>
          <div className="stat-value">{formatCurrency(totalInvested)}</div>
        </div>
        <div className="stat-box">
          <span className="stat-label">Est. Returns</span>
          <div className="stat-value" style={{ color: "var(--success)" }}>{formatCurrency(estimatedReturns)}</div>
        </div>
      </div>
    </div>
  );
}
