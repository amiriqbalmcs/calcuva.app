"use client";

"use client";

import { useState } from "react";

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  
  // Metric
  const [cm, setCm] = useState<number>(175);
  const [kg, setKg] = useState<number>(70);
  
  // Imperial
  const [ft, setFt] = useState<number>(5);
  const [inches, setInches] = useState<number>(9);
  const [lbs, setLbs] = useState<number>(154);

  const calculateBMI = () => {
    let bmiValue = 0;
    
    if (unit === "metric") {
      if (!cm || !kg) return 0;
      const meters = cm / 100;
      bmiValue = kg / (meters * meters);
    } else {
      if (!ft || (!inches && inches !== 0) || !lbs) return 0;
      const totalInches = (ft * 12) + inches;
      if (totalInches === 0) return 0;
      bmiValue = 703 * (lbs / (totalInches * totalInches));
    }
    
    return Number(bmiValue.toFixed(1));
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi === 0) return { label: "-", color: "var(--text-secondary)" };
    if (bmi < 18.5) return { label: "Underweight", color: "#eab308" };
    if (bmi >= 18.5 && bmi < 25) return { label: "Normal weight", color: "#22c55e" };
    if (bmi >= 25 && bmi < 30) return { label: "Overweight", color: "#f97316" };
    return { label: "Obese", color: "#ef4444" };
  };

  const bmi = calculateBMI();
  const category = getBmiCategory(bmi);

  return (
    <div className="glass-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <span className="input-label" style={{ margin: 0 }}>Select System</span>
        <select 
          className="modern-input" 
          style={{ width: "auto", padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          value={unit} 
          onChange={(e) => setUnit(e.target.value as "metric" | "imperial")}
        >
          <option value="metric">Metric (cm/kg)</option>
          <option value="imperial">Imperial (ft/in/lb)</option>
        </select>
      </div>

      {unit === "metric" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="form-group">
            <span className="input-label">Height (cm)</span>
            <input 
              type="number" 
              className="modern-input" 
              value={cm || ""} 
              onChange={(e) => setCm(Number(e.target.value))} 
            />
          </div>
          <div className="form-group">
            <span className="input-label">Weight (kg)</span>
            <input 
              type="number" 
              className="modern-input" 
              value={kg || ""} 
              onChange={(e) => setKg(Number(e.target.value))} 
            />
          </div>
        </div>
      ) : (
        <>
          <div className="form-group">
            <span className="input-label">Height</span>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input 
                  type="number" 
                  className="modern-input" 
                  style={{ paddingRight: "2.5rem" }}
                  value={ft || ""} 
                  onChange={(e) => setFt(Number(e.target.value))} 
                />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>ft</span>
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <input 
                  type="number" 
                  className="modern-input" 
                  style={{ paddingRight: "2.5rem" }}
                  value={inches || ""} 
                  onChange={(e) => setInches(Number(e.target.value))} 
                />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>in</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <span className="input-label">Weight (lbs)</span>
            <input 
              type="number" 
              className="modern-input" 
              value={lbs || ""} 
              onChange={(e) => setLbs(Number(e.target.value))} 
            />
          </div>
        </>
      )}

      <div className="stats-grid">
        <div className="stat-box primary" style={{ textAlign: "center" }}>
          <span className="stat-label">Your BMI</span>
          <div className="stat-value" style={{ fontSize: "2rem" }}>{bmi > 0 ? bmi : "-"}</div>
        </div>
        <div className="stat-box" style={{ textAlign: "center" }}>
          <span className="stat-label">Category</span>
          <div className="stat-value" style={{ color: category.color, fontSize: "1.25rem" }}>{category.label}</div>
        </div>
      </div>
    </div>
  );
}
