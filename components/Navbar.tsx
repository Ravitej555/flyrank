"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Plane,
  Layers,
  Sliders,
  Bookmark,
  Activity,
  Calendar,
  BookOpen,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Overview", icon: Plane },
    { href: "/demo", label: "Live Demo", icon: Sparkles },
    { href: "/flights", label: "Flights", icon: Plane },
    { href: "/compare", label: "Compare", icon: Layers },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/settings", label: "Scoring Matrix", icon: Sliders },
    { href: "/philosophy", label: "Rigor & Math", icon: BookOpen },
    { href: "/schedule", label: "Schedule", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-800/80 bg-navy-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 xl:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 text-white shadow-glow">
            <Plane className="h-5 w-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              FlyRank
              <span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/30">
                v0.1 W3
              </span>
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 -mt-0.5 hidden xs:block">
              Intelligent Flight Utility
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-brand-600/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-navy-800 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/demo"
            className="flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-gradient-to-r from-brand-600/30 to-cyan-500/25 px-3 py-1 text-xs font-semibold text-cyan-300 transition-all hover:scale-105 shadow-glow"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Live Demo</span>
          </Link>
          <Link
            href="/health"
            className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <Activity className="h-3.5 w-3.5" />
            <span>Health Check</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/health"
            aria-label="Health Check"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-800 bg-navy-900 text-emerald-400"
          >
            <Activity className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-800 bg-navy-900 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-navy-800 bg-navy-950/95 px-4 pt-2 pb-6 backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-600/25 text-cyan-400 border border-cyan-500/30 font-semibold"
                      : "text-slate-300 hover:bg-navy-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-navy-800/80 flex flex-col gap-2">
              <Link
                href="/health"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm font-medium text-emerald-400"
              >
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  System Health & Uptime
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
