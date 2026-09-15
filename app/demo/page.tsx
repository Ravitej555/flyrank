"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Plane,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  DollarSign,
  ShieldCheck,
  Leaf,
  Layers,
  Zap,
  Play,
  RotateCcw,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { computeFlyRankScore, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { FlightItinerary, RankingWeights } from "@/lib/types";

interface Scenario {
  id: string;
  title: string;
  tagline: string;
  description: string;
  weights: RankingWeights;
  flights: {
    flightA: FlightItinerary & { otaRank: number; flaw: string };
    flightB: FlightItinerary & { otaRank: number; strength: string };
  };
}

const DEMO_SCENARIOS: Scenario[] = [
  {
    id: "savings-trap",
    title: "The $30 Savings Trap",
    tagline: "14-Hour Overnight Layover vs. Direct Flight",
    description:
      "Legacy search engines sort by sticker price alone, pushing an agonizing 14-hour itinerary to #1 to save just $30. FlyRank detects layover friction, carrier unreliability, and fatigue to award the direct flight top utility.",
    weights: { price: 35, duration: 30, layover: 20, carrier: 10, eco: 5 },
    flights: {
      flightA: {
        flightId: "TRAP-01",
        airline: "TransBudget Air",
        flightNumber: "TB 409",
        price: 340,
        currency: "USD",
        totalDurationMinutes: 840, // 14h
        stops: 1,
        layoverDurationMinutes: 480, // 8h overnight layover
        carrierRating: 6.2,
        co2EmissionsKg: 320,
        otaRank: 1,
        flaw: "8-hour overnight terminal layover & 38% delay rate",
      },
      flightB: {
        flightId: "OPT-01",
        airline: "Virgin Atlantic",
        flightNumber: "VS 26",
        price: 370,
        currency: "USD",
        totalDurationMinutes: 430, // 7h 10m
        stops: 0,
        layoverDurationMinutes: 0,
        carrierRating: 9.1,
        co2EmissionsKg: 195,
        otaRank: 2,
        strength: "Direct non-stop flight, modern A350, 91% on-time reliability",
      },
    },
  },
  {
    id: "tight-connection",
    title: "The Tight Connection Sprint",
    tagline: "45-Minute Gate Sprint Risk vs. Relaxed Transfer",
    description:
      "Online travel agencies treat a 45-minute international connection the same as a 90-minute connection. FlyRank's piecewise layover U-curve penalizes the sprint risk to protect travelers from missed connections.",
    weights: { price: 25, duration: 25, layover: 35, carrier: 10, eco: 5 },
    flights: {
      flightA: {
        flightId: "RISK-02",
        airline: "QuickTransfer Express",
        flightNumber: "QT 812",
        price: 410,
        currency: "USD",
        totalDurationMinutes: 510,
        stops: 1,
        layoverDurationMinutes: 45, // <60m sprint risk
        carrierRating: 7.5,
        co2EmissionsKg: 280,
        otaRank: 1,
        flaw: "45m terminal transfer: 65% baggage delay & misconnect risk",
      },
      flightB: {
        flightId: "SAFE-02",
        airline: "British Airways",
        flightNumber: "BA 178",
        price: 435,
        currency: "USD",
        totalDurationMinutes: 560,
        stops: 1,
        layoverDurationMinutes: 95, // 1h35m comfortable
        carrierRating: 8.8,
        co2EmissionsKg: 250,
        otaRank: 2,
        strength: "Optimal 95-minute connection dwell time with zero sprint anxiety",
      },
    },
  },
  {
    id: "eco-impact",
    title: "The Sustainable Traveler",
    tagline: "High-Emission Quad-Jet vs. Next-Gen Twin-Engine",
    description:
      "Legacy sites completely obscure carbon emissions. FlyRank benchmarks passenger CO₂ against seat efficiency, elevating next-gen composite aircraft (A350/787) over fuel-guzzling older jets.",
    weights: { price: 20, duration: 15, layover: 10, carrier: 5, eco: 50 },
    flights: {
      flightA: {
        flightId: "HEAVY-03",
        airline: "Legacy Airways",
        flightNumber: "LA 99",
        price: 490,
        currency: "USD",
        totalDurationMinutes: 440,
        stops: 0,
        layoverDurationMinutes: 0,
        carrierRating: 7.8,
        co2EmissionsKg: 380, // Heavy fuel burn
        otaRank: 1,
        flaw: "High-burn older aircraft producing 380 kg CO₂ per seat",
      },
      flightB: {
        flightId: "GREEN-03",
        airline: "Singapore Airlines",
        flightNumber: "SQ 025",
        price: 520,
        currency: "USD",
        totalDurationMinutes: 425,
        stops: 0,
        layoverDurationMinutes: 0,
        carrierRating: 9.7,
        co2EmissionsKg: 190, // Ultra efficient
        otaRank: 2,
        strength: "50% lower carbon footprint (190 kg CO₂) + 9.7 carrier rating",
      },
    },
  },
  {
    id: "corporate-warrior",
    title: "Corporate Road Warrior",
    tagline: "Time Efficiency & Carrier Punctuality Priority",
    description:
      "When business deliverables are on the line, saving $80 on a ticket is irrelevant compared to arriving on time and well-rested. FlyRank prioritizes non-stop airtime and carrier punctuality.",
    weights: { price: 10, duration: 55, layover: 15, carrier: 15, eco: 5 },
    flights: {
      flightA: {
        flightId: "CHEAP-04",
        airline: "Budget Hopper",
        flightNumber: "BH 110",
        price: 320,
        currency: "USD",
        totalDurationMinutes: 780, // 13h multi-stop
        stops: 2,
        layoverDurationMinutes: 240,
        carrierRating: 6.0,
        co2EmissionsKg: 340,
        otaRank: 1,
        flaw: "Two stops, 13 hours total travel, unpredictable schedule",
      },
      flightB: {
        flightId: "SPEED-04",
        airline: "Delta Air Lines",
        flightNumber: "DL 001",
        price: 520,
        currency: "USD",
        totalDurationMinutes: 440, // 7h 20m direct
        stops: 0,
        layoverDurationMinutes: 0,
        carrierRating: 9.2,
        co2EmissionsKg: 220,
        otaRank: 2,
        strength: "Non-stop transatlantic, Wi-Fi equipped, 93% on-time guarantee",
      },
    },
  },
];

export default function DemoPage() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("savings-trap");
  const [liveStep, setLiveStep] = useState<number>(1);
  const [isPlayingAutoDemo, setIsPlayingAutoDemo] = useState<boolean>(false);

  const activeScenario = useMemo(() => {
    return (
      DEMO_SCENARIOS.find((s) => s.id === activeScenarioId) || DEMO_SCENARIOS[0]
    );
  }, [activeScenarioId]);

  // Compute FlyRank scores for both flights in the scenario
  const scoredFlightA = useMemo(() => {
    const { score, breakdown } = computeFlyRankScore(
      activeScenario.flights.flightA,
      activeScenario.weights
    );
    return { ...activeScenario.flights.flightA, flyrankScore: score, scoreBreakdown: breakdown };
  }, [activeScenario]);

  const scoredFlightB = useMemo(() => {
    const { score, breakdown } = computeFlyRankScore(
      activeScenario.flights.flightB,
      activeScenario.weights
    );
    return { ...activeScenario.flights.flightB, flyrankScore: score, scoreBreakdown: breakdown };
  }, [activeScenario]);

  // Determine FlyRank ranks
  const flyrankWinner =
    (scoredFlightB.flyrankScore ?? 0) >= (scoredFlightA.flyrankScore ?? 0)
      ? "flightB"
      : "flightA";

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-10 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-400 font-medium">Live Demo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            Interactive Live Demonstration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare traditional price-only ranking against FlyRank&apos;s multi-criteria utility engine across real-world scenarios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/flights"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plane className="h-4 w-4" />
            <span>Launch Live Flight Search</span>
          </Link>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="glass-card rounded-2xl p-4 border border-navy-800 flex flex-col gap-3">
        <span className="text-xs font-semibold text-slate-300">
          Select Simulation Scenario:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_SCENARIOS.map((s) => {
            const isSel = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScenarioId(s.id);
                  setLiveStep(1);
                }}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                  isSel
                    ? "bg-brand-600/25 border-cyan-400/60 shadow-glow text-white"
                    : "bg-navy-900/60 border-navy-800 text-slate-400 hover:text-slate-200 hover:bg-navy-800/80"
                }`}
              >
                <span className="text-xs font-bold text-white">{s.title}</span>
                <span className="text-[11px] text-cyan-300 mt-0.5 leading-snug">
                  {s.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Context Callout */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-brand-950/30 via-navy-900 to-navy-950 flex flex-col gap-2 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span>Active Case Study: {activeScenario.title}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {activeScenario.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Scenario Weights:</span>
          <span className="rounded bg-navy-900 px-2 py-0.5 border border-navy-800 text-cyan-300">
            Fare: {activeScenario.weights.price}%
          </span>
          <span className="rounded bg-navy-900 px-2 py-0.5 border border-navy-800 text-cyan-300">
            Duration: {activeScenario.weights.duration}%
          </span>
          <span className="rounded bg-navy-900 px-2 py-0.5 border border-navy-800 text-cyan-300">
            Layover: {activeScenario.weights.layover}%
          </span>
          <span className="rounded bg-navy-900 px-2 py-0.5 border border-navy-800 text-cyan-300">
            Carrier: {activeScenario.weights.carrier}%
          </span>
          <span className="rounded bg-navy-900 px-2 py-0.5 border border-navy-800 text-emerald-400">
            Eco: {activeScenario.weights.eco}%
          </span>
        </div>
      </div>

      {/* Side-by-Side Dual Engine Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Legacy OTAs */}
        <div className="glass-card rounded-2xl p-6 border border-red-500/20 bg-gradient-to-b from-red-950/10 to-navy-950 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <XCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Legacy Flight Engine</h3>
                <span className="text-[11px] text-red-400">Sorted solely by lowest ticket price</span>
              </div>
            </div>
            <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">
              Single-Variable Sort
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Legacy Rank #1 */}
            <div className="rounded-xl border border-red-500/30 bg-navy-900/80 p-4 flex flex-col gap-2.5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-red-500 text-navy-950 h-5 w-5 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="font-bold text-white text-sm">
                    {scoredFlightA.airline} ({scoredFlightA.flightNumber})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-400">
                    ${scoredFlightA.price}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Lowest Sticker Price</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 flex justify-between border-t border-navy-800 pt-2">
                <span>Duration: {formatDuration(scoredFlightA.totalDurationMinutes)}</span>
                <span>Stops: {scoredFlightA.stops}</span>
                <span>Carrier: {scoredFlightA.carrierRating}/10</span>
              </div>

              <div className="rounded-lg bg-red-500/10 p-2 text-[11px] text-red-300 border border-red-500/20 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                <span>Hidden Penalty: {scoredFlightA.flaw}</span>
              </div>
            </div>

            {/* Legacy Rank #2 */}
            <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4 flex flex-col gap-2.5 opacity-75">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-navy-800 text-slate-400 h-5 w-5 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="font-semibold text-slate-300 text-sm">
                    {scoredFlightB.airline} ({scoredFlightB.flightNumber})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-200">
                    ${scoredFlightB.price}
                  </span>
                  <span className="text-[10px] text-red-400 block">
                    +${scoredFlightB.price - scoredFlightA.price} more
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex justify-between border-t border-navy-800 pt-2">
                <span>Duration: {formatDuration(scoredFlightB.totalDurationMinutes)}</span>
                <span>Stops: Non-stop</span>
                <span>Carrier: {scoredFlightB.carrierRating}/10</span>
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-xl bg-navy-950 p-3.5 text-xs text-slate-400 border border-navy-800">
            <strong className="text-red-400">The Problem:</strong> The user books Flight A because it sits at the top of the search results, completely unaware they are trading 7+ hours of their life and high delay risks for a minor savings.
          </div>
        </div>

        {/* Right Column: FlyRank Utility Engine */}
        <div className="glass-card rounded-2xl p-6 border border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 via-navy-900 to-navy-950 flex flex-col gap-5 shadow-glow">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 text-white flex items-center justify-center shadow-glow">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">FlyRank Utility Engine</h3>
                <span className="text-[11px] text-cyan-400">Ranked by Multi-Criteria Composite Score</span>
              </div>
            </div>
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
              5D Utility Model
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* FlyRank Rank #1 (The True Winner) */}
            <div className="rounded-xl border border-cyan-500/60 bg-gradient-to-r from-brand-950/40 via-navy-900 to-navy-950 p-4 flex flex-col gap-2.5 shadow-lg relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-400 text-navy-950 h-5 w-5 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-white text-sm block">
                      {scoredFlightB.airline} ({scoredFlightB.flightNumber})
                    </span>
                    <span className="text-[10px] text-cyan-300">
                      Top Overall Utility Champion
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black text-cyan-300">
                    {scoredFlightB.flyrankScore}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    ${scoredFlightB.price}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-navy-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full"
                  style={{ width: `${scoredFlightB.flyrankScore}%` }}
                />
              </div>

              <div className="rounded-lg bg-cyan-500/10 p-2 text-[11px] text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <span>{scoredFlightB.strength}</span>
              </div>
            </div>

            {/* FlyRank Rank #2 (Demoted due to friction) */}
            <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4 flex flex-col gap-2.5 opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-navy-800 text-slate-400 h-5 w-5 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-slate-300 text-sm block">
                      {scoredFlightA.airline} ({scoredFlightA.flightNumber})
                    </span>
                    <span className="text-[10px] text-red-400">
                      Demoted (-{Math.round((scoredFlightB.flyrankScore ?? 0) - (scoredFlightA.flyrankScore ?? 0))} pts)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-slate-400">
                    {scoredFlightA.flyrankScore}
                    <span className="text-xs font-normal text-slate-500">/100</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    ${scoredFlightA.price}
                  </span>
                </div>
              </div>

              <div className="h-1.5 w-full rounded-full bg-navy-950 overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded-full"
                  style={{ width: `${scoredFlightA.flyrankScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-xl bg-navy-950 p-3.5 text-xs text-slate-300 border border-navy-800">
            <strong className="text-cyan-400">The Solution:</strong> FlyRank recognized that paying $30 more saves 7 hours of travel, avoids airport fatigue, reduces carbon by 125 kg, and provides a 9.1-rated carrier experience.
          </div>
        </div>
      </div>

      {/* Step-by-Step Live Processing Pipeline */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              The 5-Step Evaluation Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click each step to see how raw flight itinerary telemetry is transformed into utility scores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiveStep(Math.max(1, liveStep - 1))}
              disabled={liveStep === 1}
              className="rounded-lg bg-navy-900 border border-navy-700 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setLiveStep(Math.min(5, liveStep + 1))}
              disabled={liveStep === 5}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { step: 1, label: "1. Raw Telemetry" },
            { step: 2, label: "2. Log Price Norm" },
            { step: 3, label: "3. Layover U-Curve" },
            { step: 4, label: "4. Carbon Benchmarks" },
            { step: 5, label: "5. Weighted Sum" },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setLiveStep(item.step)}
              className={`rounded-xl p-2.5 text-xs font-semibold border transition-all ${
                liveStep === item.step
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm"
                  : "bg-navy-900/60 text-slate-400 border-navy-800 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-xl bg-navy-950 p-5 border border-navy-800 text-xs text-slate-300">
          {liveStep === 1 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white text-sm">
                Step 1: Real-Time Ingestion & Extraction
              </span>
              <p className="text-slate-400 leading-relaxed">
                FlyRank ingests scheduled airline timetables, real-time ticket pricing, connection airports, aircraft equipment codes, and historic carrier reliability metrics across international routes.
              </p>
            </div>
          )}

          {liveStep === 2 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white text-sm">
                Step 2: Logarithmic Fare Normalization
              </span>
              <p className="text-slate-400 leading-relaxed">
                Rather than linear ranking, fare differences are evaluated relative to the benchmark route median ($200&ndash;$1000 envelope). A $30 difference is not allowed to overshadow major duration and reliability deficits.
              </p>
            </div>
          )}

          {liveStep === 3 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white text-sm">
                Step 3: Piecewise Layover U-Curve Calculation
              </span>
              <p className="text-slate-400 leading-relaxed">
                Connections under 60 minutes are penalized heavily (score: 40) due to terminal transit and baggage transfer risk. Layovers exceeding 3 hours decay at 12 points per extra hour due to traveler fatigue.
              </p>
            </div>
          )}

          {liveStep === 4 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white text-sm">
                Step 4: Carbon Emission Normalization
              </span>
              <p className="text-slate-400 leading-relaxed">
                Aircraft equipment models (e.g. A350 vs A340) are benchmarked to estimated kg CO₂ per passenger seat, assigning clean twin-engine composite aircraft top eco-scores.
              </p>
            </div>
          )}

          {liveStep === 5 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white text-sm">
                Step 5: Linear Weighted Multi-Attribute Sum
              </span>
              <p className="text-slate-400 leading-relaxed">
                All 5 normalized sub-scores are aggregated using the active persona weights. Itineraries are sorted deterministically, producing the final FlyRank ordering in under 2 milliseconds.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Action Footer */}
      <div className="glass-card rounded-2xl p-6 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">
            Experience FlyRank with Live Routes
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the full engine across international routes with dynamic filtering and comparison.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="rounded-xl border border-navy-700 bg-navy-900 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white"
          >
            Adjust Scoring Weights
          </Link>
          <Link
            href="/flights"
            className="rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-95"
          >
            Go to Flight Search
          </Link>
        </div>
      </div>
    </div>
  );
}
