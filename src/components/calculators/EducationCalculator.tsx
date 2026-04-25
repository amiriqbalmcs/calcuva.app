"use client";

"use client";

import { useState } from "react";

export default function EducationCalculator() {
  const [marks, setMarks] = useState<number>(85);
  const [total, setTotal] = useState<number>(100);

  const percentage = total > 0 ? ((marks / total) * 100).toFixed(1) : "0";
  const gpa = (Number(percentage) / 25).toFixed(1); 

  return (
    <div className="glass-card">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="form-group">
          <span className="input-label">Total Marks Possible</span>
          <input 
            type="number" 
            className="modern-input" 
            value={total || ""} 
            onChange={(e) => setTotal(Number(e.target.value))} 
          />
        </div>
        <div className="form-group">
          <span className="input-label">Obtained Marks</span>
          <input 
            type="number" 
            className="modern-input" 
            value={marks || ""} 
            onChange={(e) => setMarks(Number(e.target.value))} 
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box primary" style={{ textAlign: "center" }}>
          <span className="stat-label">Percentage</span>
          <div className="stat-value" style={{ fontSize: "2rem" }}>{percentage}%</div>
        </div>
        <div className="stat-box" style={{ textAlign: "center" }}>
          <span className="stat-label">Estimated GPA (4.0 Scale)</span>
          <div className="stat-value" style={{ fontSize: "2rem" }}>{gpa}</div>
        </div>
      </div>
    </div>
  );
}
