"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Zap,
  CreditCard,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const APP_HREF = "/mainapp"; // ⚠️ Next.js route groups, e.g. "(app)", are not part of the actual URL.
// If your folder is app/(app)/app/page.tsx, the visible route is /app — not /(app)/app.

export default function Navbar() {
  const pathname = usePathname();

  const mainLinks = [
    { href: "/", label: "Home Base", icon: Home },
    { href: "/stations", label: "Wash Stations", icon: Zap },
  ];

  return (
    <>
      {/* 💻 DESKTOP — Dual capsule system, not a monolithic dock */}
      <div className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center gap-3 select-none">
        {/* Main navigation capsule */}
        <nav className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/95 mr-1 shadow-inner hover:scale-105 transition-transform duration-300"
          >
            <Image src="/exa_logo.png" alt="Exa" width={22} height={22} className="object-contain" priority />
          </Link>

          <div className="w-px h-6 bg-white/10 mx-1" />

          {mainLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-full transition-colors duration-300"
              >
                {active && (
                  <motion.span
                    layoutId="dt-active-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07] border border-white/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <link.icon
                  className={`relative z-10 w-3.5 h-3.5 transition-colors ${
                    active ? "text-cyan-300" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span className={`relative z-10 tracking-tight ${active ? "text-white" : "text-slate-400"}`}>
                  {link.label}
                </span>
                {active && (
                  <motion.span
                    className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-300 to-emerald-400/0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action capsule, separate — breathes visually away from the rest of the navigation */}
        <Link href={APP_HREF}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex items-center gap-2 h-[52px] px-6 rounded-full overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          >
            <span className="absolute inset-0 bg-white/[0.04] backdrop-blur-2xl" />
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 to-emerald-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="relative z-10 w-3.5 h-3.5 text-cyan-300" />
            <span className="relative z-10 text-xs font-bold tracking-wide text-white">Action Panel</span>
          </motion.button>
        </Link>
      </div>

      {/* 📱 MOBILE — Low bar with a central layout, no flat dock */}
      <div className="md:hidden fixed bottom-5 left-0 right-0 z-50 flex justify-center select-none px-6">
        <div className="relative w-full max-w-[360px]">
          <div className="flex items-center justify-between h-16 px-3 rounded-[28px] bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            <Link
              href="/"
              className="flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-2xl transition-colors"
            >
              <Home className={`w-[18px] h-[18px] ${pathname === "/" ? "text-cyan-300" : "text-slate-500"}`} />
              <span className={`text-[9px] font-semibold ${pathname === "/" ? "text-cyan-300" : "text-slate-500"}`}>
                Home
              </span>
            </Link>

            <Link
              href="/stations"
              className="flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-2xl transition-colors"
            >
              <Zap className={`w-[18px] h-[18px] ${pathname === "/stations" ? "text-cyan-300" : "text-slate-500"}`} />
              <span
                className={`text-[9px] font-semibold ${pathname === "/stations" ? "text-cyan-300" : "text-slate-500"}`}
              >
                Stations
              </span>
            </Link>

            <Link
              href={APP_HREF}
              className="flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-2xl transition-colors"
            >
              <CreditCard className={`w-[18px] h-[18px] ${pathname === APP_HREF ? "text-cyan-300" : "text-slate-500"}`} />
              <span className={`text-[9px] font-semibold ${pathname === APP_HREF ? "text-cyan-300" : "text-slate-500"}`}>
                Action
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
