import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "G.S. Securities Ltd. - Elite Guard & Tactical Protection Services",
  description: "Deploy background-verified, physically trained tactical guards. Tailored protection models built for banking vaults, corporate office lobbies, schools, hospital ER complexes, and VIP logistics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#050814] text-slate-100 antialiased selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
