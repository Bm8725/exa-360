// app/(infopanel)/infopanel/main/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfoPanelMainDemo() {
  const states = [
    { title: "POSITIONING VEHICLE", desc: "Drive forward until the laser crosshair turns green.", color: "text-amber-400" },
    { title: "SCANNING GAP PROFILE", desc: "EXA 360 LiDAR arrays are capturing volumetric data.", color: "text-cyan-400" },
    { title: "HIGH PRESSURE RINSE", desc: "Brațul robotic v1 execută ciclul de spălare la 120 bari.", color: "text-blue-400" },
    { title: "ACTIVE FOAM BLANKET", desc: "Chemical compound formulation injection in progress.", color: "text-purple-400" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % states.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center p-8 max-w-4xl w-full flex flex-col justify-center items-center gap-6">
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }} className="space-y-4">
          <div className="text-xs font-mono tracking-[0.4em] text-slate-500 uppercase">CURRENT PROCESS STEP</div>
          <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase ${states[index].color}`}>{states[index].title}</h1>
          <p className="text-slate-400 text-lg sm:text-2xl font-medium max-w-2xl mx-auto tracking-tight pt-2">{states[index].desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
