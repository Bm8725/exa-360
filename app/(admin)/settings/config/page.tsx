// app/(admin)/settings/page.tsx
"use client";

import { useState } from "react";

export default function AdminSettingsDemo() {
  const [lidarLimit, setLidarLimit] = useState<number>(12.0);
  const [suvPrice, setSuvPrice] = useState<number>(40);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 max-w-md mx-auto w-full text-center">
      <div className="space-y-1">
        <h1 className="text-sm font-bold tracking-[0.3em] text-amber-500">EXA360 // GLOBAL REGULATION</h1>
        <p className="text-[9px] text-slate-500">TUNING HARDWARE INTERACTION COEFFICIENTS</p>
      </div>
      <div className="w-full bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4 text-left text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400">LiDAR SUV Threshold Boundary (m³):</label>
          <input type="number" step="0.1" value={lidarLimit} onChange={(e) => setLidarLimit(parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-amber-400 font-bold font-mono outline-none focus:border-amber-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400">SUV Premium Recipe Price ($):</label>
          <input type="number" value={suvPrice} onChange={(e) => setSuvPrice(parseInt(e.target.value))} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-emerald-400 font-bold font-mono outline-none focus:border-emerald-500" />
        </div>
      </div>
      <button onClick={() => alert(`Config updated! Limits: ${lidarLimit}m³, SUV: $${suvPrice}`)} className="w-full py-3.5 bg-amber-500 text-slate-950 font-black text-xs tracking-widest rounded-xl uppercase hover:bg-amber-400 transition-all active:scale-95">Save System Defaults</button>
    </div>
  );
}
