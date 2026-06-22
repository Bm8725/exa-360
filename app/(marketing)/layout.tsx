/**
 * project: EXA Ecosystem, intelligent robot system for automatic washing caR
 * author: BM26
 * copyright: all rights reserved for exa-360.com
 * technology: full stack dev react-next.js, C/C++ embedded, real-time data processing robotics
 * hardware: ARM Cortex M1 exa robot, server ARM AMPERA AWS, vercel.com, github.com/repo , postgresql, , tailwindcss, framer-motion
 * license: proprietary, all rights reserved, no redistribution, no resale, no reverse engineering, no modification, 
 * no derivative works, no commercial use without permission, CAN comm, USB comm
 * version: 1.0.0
 * date: 2026-06-15
 * description: EXA Ecosystem web application layout for marketing pages with responsive design and interactive features, business landing page, SaaS product showcase, and user engagement elements. This layout serves as the foundation for the marketing section of the EXA Ecosystem web application, providing a consistent structure and styling across all marketing pages.
 * versions history: 
 */


import "@/app/globals.css"; 
import Navbar from "@/components/NavBar"; 

export const metadata = {
  title: "EXA Ecosystem | Premium SaaS",
  description: "Real-time LiDAR automated wash station network web app",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) 

{
  return (
    <html lang="en" className="m-0 p-0 overflow-x-hidden bg-slate-950">
      <body className="bg-slate-950 text-white flex flex-col min-h-screen m-0 p-0 font-sans antialiased overflow-x-hidden w-full">
        {/* Meniul principal */}
        <Navbar />

        {/* Am eliminat p-8 pentru ca pagina neagră să atingă marginile fizice ale ecranului */}
        <main className="flex-1 w-full m-0 p-0">
          {children}
        </main>
      </body>
    </html>
  );
}
