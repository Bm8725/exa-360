"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Zap, Compass, Activity, Terminal, ShieldAlert, Cpu } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function MarketingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Parallax layers for depth effect
  const robotX = useTransform(mouseX, [-300, 300], [-15, 15]);
  const robotY = useTransform(mouseY, [-300, 300], [-15, 15]);
  
  // Floating cards move differently to enhance 3D feel
  const leftCardX = useTransform(mouseX, [-300, 300], [-35, 35]);
  const leftCardY = useTransform(mouseY, [-300, 300], [-20, 20]);
  
  const rightCardX = useTransform(mouseX, [-300, 300], [25, -25]);
  const rightCardY = useTransform(mouseY, [-300, 300], [30, -30]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  const features = [
    { icon: Zap, label: "Smart Stations", desc: "Complete monitoring and real-time control for your station network.", color: "from-amber-300 to-yellow-400" },
    { icon: Compass, label: "Eco Sensors", desc: "Precise telemetry data streams collected from all edge sensors.", color: "from-sky-300 to-blue-400" },
    { icon: Activity, label: "Live Dashboard", desc: "Instantaneous data streaming with zero latency straight to browsers.", color: "from-emerald-300 to-teal-400" },
  ];

  return (
    <div className="bg-slate-950 min-h-screen overflow-x-hidden w-full text-white font-sans antialiased m-0 p-0">
      
      {/* 🌌 HERO SCREEN - ENTIRE ENVIRONMENT RENDER WITH FLOATING TECH CARD BOXES */}
      <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove} 
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }} 
        className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden border-b border-slate-900 shadow-2xl px-6"
      >
        
        {/* MASSIVE BG IMAGE DEVICE */}
        <motion.div 
          style={{ x: robotX, y: robotY, scale: 1.05 }} 
          className="absolute inset-0 z-0 opacity-45 select-none pointer-events-none transition-all duration-300 ease-out"
        >
          <Image 
            src="/exa360.png" 
            alt="EXA 360 Robotic Framework Core" 
            fill 
            priority 
            className="object-cover object-center filter saturate-125" 
          />
        </motion.div>

        {/* Industrial Shading Mask overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/75 to-slate-950 z-0 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] z-0 pointer-events-none animate-pulse" />

        {/* 🎛️ FLOATING TACTICAL CARD LEFT (LIDAR MATRIX STATS) */}
        <motion.div 
          style={{ x: leftCardX, y: leftCardY }}
          className="hidden lg:flex absolute left-12 top-1/4 w-72 p-5 bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 rounded-xl flex-col items-start text-left font-mono text-[11px] shadow-[0_0_30px_rgba(6,182,212,0.15)] z-20"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-3 border-b border-cyan-500/20 w-full pb-2">
            <Terminal className="w-4 h-4" />
            <span>LIDAR_FEED // LIVE</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div>• FRAME_RATE: <span className="text-white font-bold">60 FPS</span></div>
            <div>• MATRIX_SIZE: <span className="text-white font-bold">160x60 Px</span></div>
            <div>• EDGE_COMPUTE: <span className="text-green-400 font-bold">ACTIVE</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
              <div className="bg-cyan-500 h-full w-[82%] animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* 🎛️ FLOATING TACTICAL CARD RIGHT (STM32 CAN STATUS) */}
        <motion.div 
          style={{ x: rightCardX, y: rightCardY }}
          className="hidden lg:flex absolute right-12 bottom-1/4 w-72 p-5 bg-slate-950/70 backdrop-blur-md border border-amber-500/30 rounded-xl flex-col items-start text-left font-mono text-[11px] shadow-[0_0_30px_rgba(245,158,11,0.15)] z-20"
        >
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-3 border-b border-amber-500/20 w-full pb-2">
            <Cpu className="w-4 h-4" />
            <span>STM32_COMS // CAN_BUS</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div>• HARDWARE: <span className="text-white font-bold">EXA_V1_CORE</span></div>
            <div>• VALIDATION: <span className="text-emerald-400 font-bold">0x55_VERIFIED</span></div>
            <div>• LATENCY: <span className="text-green-400 font-bold">&lt; 1.2ms</span></div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-500 bg-amber-950/30 px-2 py-0.5 border border-amber-500/20 rounded">
              <ShieldAlert className="w-3 h-3" />
              <span>DRIVERS HOTREADY</span>
            </div>
          </div>
        </motion.div>

        {/* CENTER INTERACTION PANEL */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-6xl mx-auto">
          
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6 bg-slate-900/80 backdrop-blur-xl p-2.5 px-4 border border-white/10 rounded-xl shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-slate-300 uppercase">
              EXA_360_V1
            </span>
          </div>



          {/* CTA Action Trigger */}
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.04, y: -2 }} 
              whileTap={{ scale: 0.98 }} 
              className="relative flex items-center gap-3.5 px-14 py-5.5 bg-white text-slate-950 font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(34,211,238,0.3)] border border-slate-950 transition-all group"
            >
              <span>Discover exa 360 system</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </motion.button>
          </Link>

        </div>
      </div>

      {/* 📊 CORE PRESENTATION GRID */}
      <div className="max-w-6xl mx-auto px-6 mt-28 bg-slate-950 text-center">
        
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Unified Hardware Management
        </h2>
        
        <p className="text-slate-400 max-w-xl mx-auto text-base mb-20">
          Take full control of your physical automation loop using ultra-low latency frameworks.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {features.map((feat, i) => (
            <div 
              key={i} 
              className="p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300 shadow-xl"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-slate-950 bg-gradient-to-br ${feat.color}`}>
                <feat.icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feat.label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
