"use client";

"use client";

import { useState, useEffect } from "react";

export default function EmiCalculator() {
  const [amount, setAmount] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(10);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    calculateEmi();
  }, [amount, rate, tenure, tenureType]);

  const calculateEmi = () => {
    if (!amount || !rate || !tenure) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    const P = amount;
    const R = rate / 12 / 100;
    const N = tenureType === "years" ? tenure * 12 : tenure;

    if (R === 0) {
      const emiVal = P / N;
      setEmi(emiVal);
      setTotalInterest(0);
      setTotalPayment(P);
      return;
    }

    const emiVal = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmount = emiVal * N;
    const infoInterest = totalAmount - P;

    setEmi(emiVal);
    setTotalPayment(totalAmount);
    setTotalInterest(infoInterest);
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
      <div className="form-group" style={{ marginBottom: "2rem" }}>
        <span className="input-label">Loan Amount</span>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "1.2rem" }}>$</span>
          <input 
            type="number" 
            className="modern-input" 
            style={{ paddingLeft: "2.5rem" }}
            value={amount || ""} 
            onChange={(e) => setAmount(Number(e.target.value))} 
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="form-group">
            <span className="input-label">Interest Rate (% p.a)</span>
            <input 
                type="number" 
                className="modern-input" 
                value={rate || ""} 
                onChange={(e) => setRate(Number(e.target.value))} 
                step="0.1"
            />
          </div>

          <div className="form-group">
            <span className="input-label">Loan Tenure</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="number" 
                className="modern-input" 
                style={{ flex: 1 }}
                value={tenure || ""} 
                onChange={(e) => setTenure(Number(e.target.value))} 
              />
              <select 
                className="modern-input" 
                style={{ width: "110px", padding: "0.5rem", fontSize: "0.9rem" }}
                value={tenureType} 
                onChange={(e) => setTenureType(e.target.value as "years" | "months")}
              >
                <option value="years">Yrs</option>
                <option value="months">Mo</option>
              </select>
            </div>
          </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box primary" style={{ gridColumn: "span 2", textAlign: "center" }}>
          <span className="stat-label">Monthly EMI</span>
          <div className="stat-value" style={{ fontSize: "2.5rem", marginTop: "0.25rem" }}>{formatCurrency(emi)}</div>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Interest</span>
          <div className="stat-value">{formatCurrency(totalInterest)}</div>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Payment</span>
          <div className="stat-value">{formatCurrency(totalPayment)}</div>
        </div>
      </div>
    </div>
  );
}
