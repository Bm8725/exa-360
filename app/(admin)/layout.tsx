// app/(admin)/layout.tsx
import "../globals.css";

export const metadata = {
  title: "EXA 360 // GLOBAL ADMINISTRATION",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-mono antialiased m-0 p-0">
        {/* Warning Header for Critical Root Actions */}
        <div className="w-full h-7 bg-amber-500 text-slate-950 text-[10px] font-black tracking-widest flex items-center justify-center uppercase select-none">
          ⚠️ WARNING // GLOBAL CONFIGURATION PROTOCOL ACTIVE // CRITICAL ACCESS ONLY
        </div>
        <main className="flex-1 w-full m-0 p-0 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
