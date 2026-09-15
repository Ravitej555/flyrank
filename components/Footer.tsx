import Link from "next/link";
import { Plane, Github, Twitter, ShieldCheck, Activity, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-navy-800/80 bg-navy-950/90 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 text-white shadow-glow">
                <Plane className="h-4 w-4 -rotate-45" />
              </div>
              <span>FlyRank</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation multi-criteria flight ranking utility. Quantifying flight comfort, duration, pricing, carrier reliability, and carbon emissions into a single transparent utility score.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <Link
                href="/health"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                All Systems Operational
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/flights" className="hover:text-cyan-400 transition-colors">
                  Flight Search & Ranking
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-cyan-400 transition-colors">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-cyan-400 transition-colors">
                  Saved Itineraries
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-cyan-400 transition-colors">
                  Scoring Matrix Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Methodology & Rigor
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/philosophy" className="hover:text-cyan-400 transition-colors">
                  Rigor & Math Formula
                </Link>
              </li>
              <li>
                <Link href="/philosophy#sandbox" className="hover:text-cyan-400 transition-colors">
                  Interactive Scoring Sandbox
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-cyan-400 transition-colors">
                  Schedule Product Demo
                </Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-cyan-400 transition-colors">
                  System Health & Telemetry
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Engineered With Care
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built with Next.js 15, React 19, TypeScript strict mode, Tailwind CSS, Zod runtime validation, and Vitest test suite.
            </p>
            <div className="rounded-lg border border-navy-800 bg-navy-900/60 p-3 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">FlyRank v0.1 W3</span> &bull; Production Preview
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} FlyRank Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/philosophy" className="hover:text-slate-300">
              Scoring Philosophy
            </Link>
            <Link href="/health" className="hover:text-slate-300">
              Uptime Telemetry
            </Link>
            <Link href="/schedule" className="hover:text-slate-300">
              Book Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
