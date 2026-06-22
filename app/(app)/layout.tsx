// app/(app)/layout.tsx
import "../globals.css"; // Încarcă stilurile din rădăcină

export const metadata = {
  title: "EXA 360 | web application",
  description: "Isolated control matrix for LiDAR and STM32",
};

export default function AppIsolatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="m-0 p-0 overflow-x-hidden bg-slate-950">
      <body className="bg-slate-950 text-white flex flex-col min-h-screen m-0 p-0 font-sans antialiased w-full">
        {/* Navbar-ul public a dispărut. Aici ești complet în aplicația securizată */}
        <main className="flex-1 w-full m-0 p-0">
          {children}
        </main>
      </body>
    </html>
  );
}
