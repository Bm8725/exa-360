"use client";

import { useState, useEffect } from "react";

export default function DashboardClientDemo() {
  const [liveVolume, setLiveVolume] = useState<number>(11.45);
  const [totalWash, setTotalWash] = useState<number>(42);
  const [earnings, setEarnings] = useState<number>(1340);

  useEffect(() => {
    // Simulăm primirea de date noi din Cloud la fiecare 3 secunde
    const interval = setInterval(() => {
      const mockVol = parseFloat((8 + Math.random() * 8).toFixed(2));
      setLiveVolume(mockVol);
      setTotalWash((prev) => prev + 1);
      setEarnings((prev) => prev + (mockVol > 12 ? 40 : 30));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-mono flex flex-col items-center justify-center p-6 gap-6 select-none">
      <div className="text-center space-y-1"><h1 className="text-sm font-bold tracking-[0.3em] text-cyan-400">EXA360 // CENTRAL MANAGEMENT</h1><p className="text-[10px] text-slate-500">LIVE CLOUD TELEMETRY FEED</p></div>
      <div className="grid grid-cols-3 gap-4 max-w-lg w-full text-center">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-[9px] text-slate-500 font-bold uppercase">Live Volume</div>
          <div className="text-xl font-black text-cyan-400">{liveVolume} <span className="text-[10px] text-slate-600">m³</span></div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-[9px] text-slate-500 font-bold uppercase">Total Wash</div>
          <div className="text-xl font-black text-white">{totalWash}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-[9px] text-slate-500 font-bold uppercase">Earnings</div>
          <div className="text-xl font-black text-emerald-400">${earnings}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[9px] text-emerald-500 bg-emerald-950/30 px-3 py-1 border border-emerald-500/20 rounded-full animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />STREAMING_FROM_VERCEL_EDGE</div>
    </div>
  );
}
