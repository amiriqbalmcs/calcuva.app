"use client";

"use client";

import { useState } from "react";

export default function HealthUtilityCalculator() {
  const [weight, setWeight] = useState<number>(70);
  
  const waterIntake = (weight * 0.033).toFixed(1); 
  
  return (
    <div className="glass-card">
      <div className="form-group">
        <span className="input-label">Body Weight (kg)</span>
        <input 
          type="number" 
          className="modern-input" 
          value={weight || ""} 
          onChange={(e) => setWeight(Number(e.target.value))} 
        />
      </div>

      <div className="stats-grid">
        <div className="stat-box primary" style={{ textAlign: "center" }}>
          <span className="stat-label">Daily Water Goal</span>
          <div className="stat-value" style={{ fontSize: "2rem", marginTop: "0.25rem" }}>
             {waterIntake} <span style={{ fontSize: "1rem", fontWeight: "normal", opacity: 0.8 }}>Liters</span>
          </div>
        </div>
        <div className="stat-box" style={{ textAlign: "center" }}>
          <span className="stat-label">Ideal Sleep Range</span>
          <div className="stat-value" style={{ fontSize: "2rem", marginTop: "0.25rem" }}>
            7 - 9 <span style={{ fontSize: "1rem", fontWeight: "normal", opacity: 0.8 }}>Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
