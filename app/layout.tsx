import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "FlyRank | Intelligent Multi-Criteria Flight Ranking Utility",
  description:
    "FlyRank evaluates flight itineraries across price, duration, layover friction, airline reliability, and carbon emissions into a transparent, multi-dimensional utility score.",
  keywords: [
    "flight ranking",
    "flight utility",
    "best flights",
    "flight comparison",
    "layover optimizer",
    "carbon flight score",
    "airline reliability",
  ],
  authors: [{ name: "FlyRank AI Engineering" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-navy-950 text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
