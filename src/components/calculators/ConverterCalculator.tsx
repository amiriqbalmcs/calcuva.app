"use client";

"use client";

import { useState } from "react";

export default function ConverterCalculator() {
  const [val, setVal] = useState<number>(1);
  const [type, setType] = useState<"km-mi" | "mi-km" | "kg-lb" | "lb-kg">("km-mi");

  const convert = () => {
    if (type === "km-mi") return { result: (val * 0.621371).toFixed(2), unit: "Miles" };
    if (type === "mi-km") return { result: (val * 1.60934).toFixed(2), unit: "Kilometers" };
    if (type === "kg-lb") return { result: (val * 2.20462).toFixed(2), unit: "Pounds" };
    return { result: (val * 0.453592).toFixed(2), unit: "Kilograms" };
  };

  const res = convert();

  return (
    <div className="glass-card">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="form-group">
          <span className="input-label">Conversion Type</span>
          <select 
            className="modern-input" 
            value={type} 
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="km-mi">Km to Miles</option>
            <option value="mi-km">Miles to Km</option>
            <option value="kg-lb">Kg to Lbs</option>
            <option value="lb-kg">Lbs to Kg</option>
          </select>
        </div>
        <div className="form-group">
          <span className="input-label">Value to Convert</span>
          <input 
            type="number" 
            className="modern-input" 
            value={val || ""} 
            onChange={(e) => setVal(Number(e.target.value))} 
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box primary" style={{ gridColumn: "span 2", textAlign: "center" }}>
          <span className="stat-label">Result</span>
          <div className="stat-value" style={{ fontSize: "2.5rem", marginTop: "0.25rem" }}>
            {res.result} <span style={{ fontSize: "1.2rem", fontWeight: "normal", opacity: 0.8 }}>{res.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
