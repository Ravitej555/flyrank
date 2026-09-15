"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Clock,
  DollarSign,
  ShieldCheck,
  Leaf,
  Sliders,
  ChevronRight,
  ArrowRight,
  Zap,
  Calculator,
} from "lucide-react";
import { computeFlyRankScore, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { FlightItinerary, RankingWeights } from "@/lib/types";

export default function PhilosophyPage() {
  // Interactive Sandbox state
  const [sandboxPrice, setSandboxPrice] = useState<number>(450);
  const [sandboxDuration, setSandboxDuration] = useState<number>(420); // 7h
  const [sandboxStops, setSandboxStops] = useState<number>(1);
  const [sandboxLayover, setSandboxLayover] = useState<number>(120); // 2h
  const [sandboxCarrier, setSandboxCarrier] = useState<number>(8.5);
  const [sandboxCo2, setSandboxCo2] = useState<number>(220);

  const [sandboxWeights, setSandboxWeights] = useState<RankingWeights>(DEFAULT_WEIGHTS);

  const mockSandboxFlight: FlightItinerary = useMemo(() => {
    return {
      flightId: "SANDBOX-001",
      airline: "Custom Itinerary",
      flightNumber: "CY 999",
      price: sandboxPrice,
      currency: "USD",
      totalDurationMinutes: sandboxDuration,
      stops: sandboxStops,
      layoverDurationMinutes: sandboxStops === 0 ? 0 : sandboxLayover,
      carrierRating: sandboxCarrier,
      co2EmissionsKg: sandboxCo2,
    };
  }, [
    sandboxPrice,
    sandboxDuration,
    sandboxStops,
    sandboxLayover,
    sandboxCarrier,
    sandboxCo2,
  ]);

  const { score: liveScore, breakdown: liveBreakdown } = useMemo(() => {
    return computeFlyRankScore(mockSandboxFlight, sandboxWeights);
  }, [mockSandboxFlight, sandboxWeights]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-12 pb-32">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-400 font-medium">Rigor & Math</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            The FlyRank Utility Formulation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic multi-attribute utility theory applied to modern commercial aviation.
          </p>
        </div>

        <Link
          href="/flights"
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-500 transition-colors shadow-md self-start sm:self-auto"
        >
          <span>Test in Flight Search</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Section 1: The Core Philosophy */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          The Multi-Criteria Decision Paradigm
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Online Travel Agencies (OTAs) optimize for conversion rates and gross merchandise value. By defaulting to &quot;Price: Low to High&quot;, they routinely recommend itineraries where saving $35 forces a traveler into an 11-hour overnight layover, a carrier with a 40% cancellation record, or an obsolete, high-emission aircraft.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          FlyRank replaces this single-dimensional sorting with an evaluated <strong>Multi-Attribute Utility Function</strong>. Every flight itinerary is transformed into a composite score from 0 to 100:
        </p>

        {/* Math Block */}
        <div className="rounded-xl bg-navy-950 p-5 border border-navy-800 text-center flex flex-col items-center justify-center my-2">
          <div className="text-lg sm:text-2xl font-mono font-bold text-cyan-300 tracking-wide">
            FlyRank Score = &sum;(w<sub>i</sub> &times; S<sub>i</sub>) &divide; &sum;w<sub>i</sub>
          </div>
          <span className="text-xs text-slate-400 mt-2">
            Where w<sub>i</sub> represents user preference weight and S<sub>i</sub> &isin; [0, 100] is the normalized sub-utility.
          </span>
        </div>
      </section>

      {/* Section 2: Sub-Score Normalization Functions */}
      <section className="flex flex-col gap-6">
        <div className="border-b border-navy-800 pb-2">
          <h2 className="text-xl font-bold text-white">
            Mathematical Normalization Functions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            How raw real-world data points are normalized to standard [0, 100] utility bounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <DollarSign className="h-4 w-4" />
              <span>1. Price Utility (S_price)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Normalized against international benchmark fares ($200 ideal baseline, $1,000 ceiling):
            </p>
            <div className="rounded-lg bg-navy-950 p-3 font-mono text-[11px] text-cyan-300 border border-navy-800">
              S_price = clamp(0, 100, 100 - ((fare - 200) / 800) * 100)
            </div>
            <span className="text-[11px] text-slate-400">
              Every $100 decrease improves utility by +12.5 points within the benchmark envelope.
            </span>
          </div>

          {/* Duration */}
          <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <Clock className="h-4 w-4" />
              <span>2. Duration Efficiency (S_duration)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Normalized between 2 hours (direct short-haul = 100) and 18 hours (long-haul multi-stop = 0):
            </p>
            <div className="rounded-lg bg-navy-950 p-3 font-mono text-[11px] text-cyan-300 border border-navy-800">
              S_duration = clamp(0, 100, 100 - ((minutes - 120) / 960) * 100)
            </div>
            <span className="text-[11px] text-slate-400">
              Penalizes excess travel duration linearly relative to non-stop airtime.
            </span>
          </div>

          {/* Layover */}
          <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Zap className="h-4 w-4" />
              <span>3. Layover Comfort (S_layover)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Non-linear piecewise model penalizing both gate sprint risk (&lt;60m) and fatigue (&gt;3h):
            </p>
            <div className="rounded-lg bg-navy-950 p-3 font-mono text-[11px] text-cyan-300 border border-navy-800">
              layover &lt; 60m: S=40 (sprint risk)
              <br />
              60m &ndash; 180m: S=85 (optimal transfer)
              <br />
              &gt; 180m: S = max(10, 85 - ((mins - 180) / 300) * 60)
            </div>
          </div>

          {/* Carrier Rating & Eco */}
          <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>4. Carrier Reliability &amp; Carbon Impact</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Carrier rating scales 0&ndash;10 directly to 0&ndash;100. Carbon CO₂ is benchmarked from 50kg (100) to 500kg (0):
            </p>
            <div className="rounded-lg bg-navy-950 p-3 font-mono text-[11px] text-cyan-300 border border-navy-800">
              S_carrier = rating * 10
              <br />
              S_eco = clamp(0, 100, 100 - ((kgCO2 - 50) / 450) * 100)
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Math Sandbox */}
      <section id="sandbox" className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-1">
              <Calculator className="h-3.5 w-3.5" />
              <span>Live Algorithm Sandbox</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Interactive Formula Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tweak flight metrics below to observe how the mathematical engine normalizes values and calculates the composite FlyRank score.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Computed Score</span>
            <span className="text-3xl font-black text-cyan-300">
              {liveScore}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Price */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Ticket Price ($ USD)</span>
              <span className="font-bold text-emerald-400">${sandboxPrice}</span>
            </div>
            <input
              type="range"
              min="200"
              max="1200"
              step="10"
              value={sandboxPrice}
              onChange={(e) => setSandboxPrice(Number(e.target.value))}
              className="accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400">
              Sub-Score S_price: <strong className="text-slate-200">{liveBreakdown.priceScore}</strong>
            </span>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Duration (Hours)</span>
              <span className="font-bold text-white">
                {Math.floor(sandboxDuration / 60)}h {sandboxDuration % 60}m
              </span>
            </div>
            <input
              type="range"
              min="120"
              max="1080"
              step="30"
              value={sandboxDuration}
              onChange={(e) => setSandboxDuration(Number(e.target.value))}
              className="accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400">
              Sub-Score S_duration: <strong className="text-slate-200">{liveBreakdown.durationScore}</strong>
            </span>
          </div>

          {/* Stops & Layover */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Stops &amp; Layover</span>
              <span className="font-bold text-white">
                {sandboxStops === 0 ? "Non-stop" : `${sandboxLayover} min layover`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSandboxStops(sandboxStops === 0 ? 1 : 0)}
                className={`rounded px-2 py-1 text-xs font-semibold ${
                  sandboxStops === 0 ? "bg-cyan-500 text-navy-950" : "bg-navy-800 text-slate-300"
                }`}
              >
                {sandboxStops === 0 ? "Direct" : "1 Stop"}
              </button>
              {sandboxStops > 0 && (
                <input
                  type="range"
                  min="40"
                  max="420"
                  step="10"
                  value={sandboxLayover}
                  onChange={(e) => setSandboxLayover(Number(e.target.value))}
                  className="accent-cyan-400 flex-1"
                />
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              Sub-Score S_layover: <strong className="text-slate-200">{liveBreakdown.layoverScore}</strong>
            </span>
          </div>

          {/* Carrier Rating */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Carrier Rating (0-10)</span>
              <span className="font-bold text-amber-300">{sandboxCarrier} / 10</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.1"
              value={sandboxCarrier}
              onChange={(e) => setSandboxCarrier(Number(e.target.value))}
              className="accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400">
              Sub-Score S_carrier: <strong className="text-slate-200">{liveBreakdown.carrierScore}</strong>
            </span>
          </div>

          {/* Carbon CO2 */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Carbon Emissions (kg CO₂)</span>
              <span className="font-bold text-emerald-400">{sandboxCo2} kg</span>
            </div>
            <input
              type="range"
              min="100"
              max="500"
              step="10"
              value={sandboxCo2}
              onChange={(e) => setSandboxCo2(Number(e.target.value))}
              className="accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400">
              Sub-Score S_eco: <strong className="text-slate-200">{liveBreakdown.ecoScore}</strong>
            </span>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="rounded-xl bg-navy-950 p-4 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-400">Current Formula Output:</span>
            <span className="rounded bg-navy-900 px-2 py-1 border border-navy-700 text-slate-200">
              Fare ({liveBreakdown.priceScore}) &times; 40% = {(liveBreakdown.priceScore * 0.4).toFixed(1)}
            </span>
            <span className="rounded bg-navy-900 px-2 py-1 border border-navy-700 text-slate-200">
              Speed ({liveBreakdown.durationScore}) &times; 25% = {(liveBreakdown.durationScore * 0.25).toFixed(1)}
            </span>
            <span className="rounded bg-navy-900 px-2 py-1 border border-navy-700 text-slate-200">
              Layover ({liveBreakdown.layoverScore}) &times; 15% = {(liveBreakdown.layoverScore * 0.15).toFixed(1)}
            </span>
            <span className="rounded bg-navy-900 px-2 py-1 border border-navy-700 text-slate-200">
              Carrier ({liveBreakdown.carrierScore}) &times; 10% = {(liveBreakdown.carrierScore * 0.1).toFixed(1)}
            </span>
            <span className="rounded bg-navy-900 px-2 py-1 border border-navy-700 text-slate-200">
              Eco ({liveBreakdown.ecoScore}) &times; 10% = {(liveBreakdown.ecoScore * 0.1).toFixed(1)}
            </span>
          </div>

          <Link
            href="/flights"
            className="rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-glow hover:opacity-95 whitespace-nowrap"
          >
            Apply to Real Flights
          </Link>
        </div>
      </section>
    </div>
  );
}
