"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plane,
  ArrowRight,
  Sliders,
  ShieldCheck,
  Leaf,
  Clock,
  Zap,
  CheckCircle2,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";
import { MOCK_FLIGHT_CATALOG, POPULAR_ROUTES } from "@/lib/services/flightService";
import { computeFlyRankScore, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { RankingWeights } from "@/lib/types";

export default function OverviewPage() {
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [activePreset, setActivePreset] = useState<"balanced" | "budget" | "speed" | "eco">("balanced");

  // Dynamic weights based on active preset teaser
  const weights: RankingWeights = useMemo(() => {
    switch (activePreset) {
      case "budget":
        return { price: 65, duration: 15, layover: 10, carrier: 5, eco: 5 };
      case "speed":
        return { price: 20, duration: 55, layover: 15, carrier: 5, eco: 5 };
      case "eco":
        return { price: 20, duration: 15, layover: 10, carrier: 5, eco: 50 };
      default:
        return DEFAULT_WEIGHTS;
    }
  }, [activePreset]);

  // Compute live scores for the mock catalog based on interactive weights
  const scoredSampleFlights = useMemo(() => {
    return MOCK_FLIGHT_CATALOG.slice(0, 6)
      .map((f) => {
        const { score, breakdown } = computeFlyRankScore(f, weights);
        return { ...f, flyrankScore: score, scoreBreakdown: breakdown };
      })
      .sort((a, b) => (b.flyrankScore ?? 0) - (a.flyrankScore ?? 0));
  }, [weights]);

  const activeRoute = POPULAR_ROUTES[selectedRouteIndex];

  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24 border-b border-navy-800/60 pb-16">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-brand-600/20 via-cyan-500/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-40 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>FlyRank v0.1 W3 &bull; Intelligent Multi-Criteria Utility Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
            Rank Flights by{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              True Utility
            </span>
            , Not Just Sticker Price
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Legacy engines prioritize deceptive $30 savings at the cost of grueling 14-hour overnight layovers, 35% delay risks, and poor airline reliability. FlyRank computes a mathematical composite score tailored to your personal priorities.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/flights"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition-all hover:scale-[1.02]"
            >
              <Plane className="h-4 w-4" />
              <span>Explore Flight Rankings</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-xl border border-navy-700 bg-navy-900/80 px-5 py-3.5 text-sm font-medium text-slate-200 hover:bg-navy-800 hover:text-white transition-all backdrop-blur-sm"
            >
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Customize Scoring Weights</span>
            </Link>

            <Link
              href="/philosophy"
              className="flex items-center gap-2 rounded-xl border border-navy-800 bg-navy-950/60 px-5 py-3.5 text-sm font-medium text-slate-400 hover:text-cyan-300 transition-all"
            >
              <span>Read The Rigor & Math</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Stat Pill Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl text-left">
            <div className="glass-card rounded-xl p-4 flex flex-col gap-1 border-navy-800/80">
              <span className="text-2xl font-bold text-white flex items-center gap-1.5">
                5D <span className="text-xs font-normal text-cyan-400">Utility Model</span>
              </span>
              <span className="text-xs text-slate-400">Price, Time, Layovers, Carrier, CO₂</span>
            </div>
            <div className="glass-card rounded-xl p-4 flex flex-col gap-1 border-navy-800/80">
              <span className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
                &lt; 2ms <span className="text-xs font-normal text-slate-400">Evaluation</span>
              </span>
              <span className="text-xs text-slate-400">Instantaneous client-side re-weighting</span>
            </div>
            <div className="glass-card rounded-xl p-4 flex flex-col gap-1 border-navy-800/80">
              <span className="text-2xl font-bold text-cyan-400 flex items-center gap-1.5">
                94% <span className="text-xs font-normal text-slate-400">Trap Avoidance</span>
              </span>
              <span className="text-xs text-slate-400">Identifies tight connections & fatigue traps</span>
            </div>
            <div className="glass-card rounded-xl p-4 flex flex-col gap-1 border-navy-800/80">
              <span className="text-2xl font-bold text-amber-400 flex items-center gap-1.5">
                100% <span className="text-xs font-normal text-slate-400">Zod Validated</span>
              </span>
              <span className="text-xs text-slate-400">Strict runtime schema enforcement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Algorithm Teaser */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-navy-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-2">
                <Zap className="h-3.5 w-3.5" />
                <span>Live Algorithm Demonstrator</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Watch Itineraries Re-Rank Dynamically
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Switch traveler personas to see how our normalization engine recalculates composite scores and reorders flights in real time.
              </p>
            </div>

            {/* Persona Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 bg-navy-950/70 p-1.5 rounded-xl border border-navy-800">
              {(
                [
                  { id: "balanced", label: "Balanced (Default)" },
                  { id: "budget", label: "Frugal Backpacker" },
                  { id: "speed", label: "Road Warrior (Speed)" },
                  { id: "eco", label: "Eco-Conscious" },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activePreset === preset.id
                      ? "bg-brand-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-navy-800"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Weights Bar */}
          <div className="py-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Applied Weights:</span>
            <span className="rounded bg-navy-800/80 px-2 py-0.5 border border-navy-700">
              Price: <strong className="text-cyan-400">{weights.price}%</strong>
            </span>
            <span className="rounded bg-navy-800/80 px-2 py-0.5 border border-navy-700">
              Duration: <strong className="text-cyan-400">{weights.duration}%</strong>
            </span>
            <span className="rounded bg-navy-800/80 px-2 py-0.5 border border-navy-700">
              Layover: <strong className="text-cyan-400">{weights.layover}%</strong>
            </span>
            <span className="rounded bg-navy-800/80 px-2 py-0.5 border border-navy-700">
              Carrier: <strong className="text-cyan-400">{weights.carrier}%</strong>
            </span>
            <span className="rounded bg-navy-800/80 px-2 py-0.5 border border-navy-700">
              Eco (CO₂): <strong className="text-emerald-400">{weights.eco}%</strong>
            </span>
          </div>

          {/* Live Cards Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {scoredSampleFlights.slice(0, 3).map((flight, idx) => {
              const hours = Math.floor(flight.totalDurationMinutes / 60);
              const mins = flight.totalDurationMinutes % 60;
              const isWinner = idx === 0;

              return (
                <div
                  key={flight.flightId}
                  className={`rounded-xl border p-4 transition-all ${
                    isWinner
                      ? "border-cyan-500/50 bg-gradient-to-b from-brand-950/40 to-navy-900/90 shadow-glow"
                      : "border-navy-800 bg-navy-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isWinner
                            ? "bg-cyan-500 text-navy-950"
                            : "bg-navy-800 text-slate-400"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white leading-none">
                          {flight.airline}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {flight.flightNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-base font-bold text-white leading-none">
                        ${flight.price}
                      </span>
                      <span className="text-[10px] text-slate-400">USD</span>
                    </div>
                  </div>

                  {/* Score pill */}
                  <div className="flex items-center justify-between rounded-lg bg-navy-950/80 p-2.5 border border-navy-800/80 mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-medium text-slate-300">
                        FlyRank Score
                      </span>
                    </div>
                    <span className="text-lg font-extrabold text-cyan-300">
                      {flight.flyrankScore}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </span>
                  </div>

                  {/* Flight meta */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-navy-800/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Duration</span>
                      <span>
                        {hours}h {mins}m
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Stops</span>
                      <span>
                        {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Carrier Rating</span>
                      <span className="text-amber-300">{flight.carrierRating} / 10</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Carbon CO₂</span>
                      <span className="text-emerald-400">{flight.co2EmissionsKg} kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-navy-800 text-xs text-slate-400">
            <span>Showing top 3 re-ranked itineraries under current weights</span>
            <Link
              href="/flights"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View Full Ranked Itinerary Catalog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Legacy Flight Search is Flawed
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Traditional online travel agencies optimize for affiliate commissions and sort solely by ticket price, trapping travelers in low-utility itineraries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
            <div className="h-10 w-10 rounded-xl bg-brand-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sliders className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Multi-Criteria Utility
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Price alone is not value. We balance log-normalized airfare against actual travel time, so you don&apos;t pay $20 less for 8 hours more travel.
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Layover Risk & Fatigue
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our U-curve penalizes both high-stress tight connections (&lt;60 min transfer risk) and draining multi-hour terminal layovers (&gt;4 hours).
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Carrier Reliability
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Factoring on-time flight arrival track records and passenger sentiment directly into score rankings so you avoid frequent cancellation traps.
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Leaf className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Carbon Transparency
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern aircraft (like A350s and B787s) consume significantly less fuel per seat. We benchmark estimated passenger CO₂ directly into your score.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Deep Link Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/compare"
            className="glass-card glass-card-hover rounded-2xl p-6 border border-navy-800 block group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Layers className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Side-by-Side Comparison
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect up to 4 itineraries in a granular comparison matrix with category winner badges and difference deltas.
            </p>
          </Link>

          <Link
            href="/saved"
            className="glass-card glass-card-hover rounded-2xl p-6 border border-navy-800 block group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Saved Portfolio & Analytics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bookmark preferred flights to your portfolio. View aggregate spending, flight hours, emissions, and export to CSV or JSON.
            </p>
          </Link>

          <Link
            href="/philosophy"
            className="glass-card glass-card-hover rounded-2xl p-6 border border-navy-800 block group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Rigor & Scoring Formula
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand the linear and non-linear normalization algorithms behind FlyRank with our interactive math sandbox.
            </p>
          </Link>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-900/60 via-navy-900 to-navy-950 p-8 sm:p-12 border border-cyan-500/30 overflow-hidden text-center flex flex-col items-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
          <h2 className="relative text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Experience Intelligent Flight Utility?
          </h2>
          <p className="relative mt-4 max-w-xl text-sm sm:text-base text-slate-300">
            Launch flight search, customize your ranking matrix weights, or book a live product demonstration.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/flights"
              className="rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition-all hover:scale-105"
            >
              Start Searching Flights
            </Link>
            <Link
              href="/schedule"
              className="rounded-xl border border-navy-700 bg-navy-900/80 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-navy-800 transition-all"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
