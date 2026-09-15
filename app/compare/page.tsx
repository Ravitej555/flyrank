"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Award,
  Clock,
  Leaf,
  ShieldCheck,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Plane,
  RotateCcw,
} from "lucide-react";
import { MOCK_FLIGHT_CATALOG } from "@/lib/services/flightService";
import { computeFlyRankScore, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { FlightItinerary } from "@/lib/types";
import { useFavouritesViewModel } from "@/lib/viewmodels/useFavouritesViewModel";

export default function ComparePage() {
  const { isSaved, toggleFavourite } = useFavouritesViewModel();

  // Selected flight IDs for comparison (default to top 3 mock flights)
  const [selectedIds, setSelectedIds] = useState<string[]>(["FL-101", "FL-102", "FL-103"]);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<FlightItinerary | null>(null);

  // Read any flights stored from comparison list if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("flyrank_compare_selection");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedIds(parsed);
        }
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  // Update storage when selectedIds change
  useEffect(() => {
    try {
      localStorage.setItem("flyrank_compare_selection", JSON.stringify(selectedIds));
    } catch {
      // Ignore
    }
  }, [selectedIds]);

  // Compute flights with current flyrank scores
  const allScoredFlights = useMemo(() => {
    return MOCK_FLIGHT_CATALOG.map((flight) => {
      const { score, breakdown } = computeFlyRankScore(flight, DEFAULT_WEIGHTS);
      return {
        ...flight,
        flyrankScore: score,
        scoreBreakdown: breakdown,
      };
    });
  }, []);

  const comparedFlights = useMemo(() => {
    return selectedIds
      .map((id) => allScoredFlights.find((f) => f.flightId === id))
      .filter(Boolean) as FlightItinerary[];
  }, [selectedIds, allScoredFlights]);

  // Find category winners
  const winners = useMemo(() => {
    if (comparedFlights.length === 0) return {};
    const bestPrice = Math.min(...comparedFlights.map((f) => f.price));
    const bestDuration = Math.min(...comparedFlights.map((f) => f.totalDurationMinutes));
    const bestCarrier = Math.max(...comparedFlights.map((f) => f.carrierRating));
    const bestEco = Math.min(...comparedFlights.map((f) => f.co2EmissionsKg));
    const bestScore = Math.max(...comparedFlights.map((f) => f.flyrankScore ?? 0));

    return {
      bestPriceId: comparedFlights.find((f) => f.price === bestPrice)?.flightId,
      bestDurationId: comparedFlights.find((f) => f.totalDurationMinutes === bestDuration)?.flightId,
      bestCarrierId: comparedFlights.find((f) => f.carrierRating === bestCarrier)?.flightId,
      bestEcoId: comparedFlights.find((f) => f.co2EmissionsKg === bestEco)?.flightId,
      bestScoreId: comparedFlights.find((f) => f.flyrankScore === bestScore)?.flightId,
    };
  }, [comparedFlights]);

  const removeFlight = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const addFlight = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-400 font-medium">Compare Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Side-by-Side Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Granular multi-dimensional breakdown with category champion badges and utility deltas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedIds(["FL-101", "FL-102", "FL-103"])}
            className="flex items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-navy-800 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default Set</span>
          </button>
          <Link
            href="/flights"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-500 shadow-md"
          >
            <Plane className="h-3.5 w-3.5" />
            <span>Browse More Flights</span>
          </Link>
        </div>
      </div>

      {/* Flight Selector Pill Bar */}
      <div className="glass-card rounded-2xl p-4 border border-navy-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            Active Columns ({comparedFlights.length}/4 max):
          </span>
          <span className="text-xs text-slate-400">
            Compare key tradeoffs before making a final booking decision.
          </span>
        </div>

        {/* Add more flights dropdown */}
        {selectedIds.length < 4 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Add flight:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addFlight(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              aria-label="Add Flight to Comparison"
              className="rounded-lg border border-navy-700 bg-navy-900 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="" disabled>
                Select itinerary to add...
              </option>
              {allScoredFlights
                .filter((f) => !selectedIds.includes(f.flightId))
                .map((f) => (
                  <option key={f.flightId} value={f.flightId}>
                    {f.airline} ({f.flightNumber}) - ${f.price} &bull; Score: {f.flyrankScore}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {comparedFlights.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-navy-800 flex flex-col items-center gap-4">
          <Layers className="h-12 w-12 text-slate-500" />
          <h3 className="text-lg font-bold text-white">No Flights in Comparison</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Select flights from the search page or load default flights to compare their price, duration, and score breakdowns.
          </p>
          <button
            onClick={() => setSelectedIds(["FL-101", "FL-102", "FL-103"])}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500"
          >
            Load Sample Comparison Set
          </button>
        </div>
      ) : (
        /* Comparison Table / Grid */
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[760px] grid grid-cols-4 gap-4">
            {comparedFlights.map((flight) => {
              const isBestScore = winners.bestScoreId === flight.flightId;
              const isBestPrice = winners.bestPriceId === flight.flightId;
              const isBestDuration = winners.bestDurationId === flight.flightId;
              const isBestCarrier = winners.bestCarrierId === flight.flightId;
              const isBestEco = winners.bestEcoId === flight.flightId;
              const saved = isSaved(flight.flightId);

              return (
                <div
                  key={flight.flightId}
                  className={`glass-card rounded-2xl p-5 border flex flex-col gap-5 relative transition-all ${
                    isBestScore
                      ? "border-cyan-500/60 shadow-glow bg-gradient-to-b from-brand-950/40 via-navy-900 to-navy-950"
                      : "border-navy-800 bg-navy-900/60"
                  }`}
                >
                  {/* Top action row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-navy-800 px-2 py-0.5 text-[11px] font-bold text-cyan-400 border border-navy-700">
                        {flight.flightNumber}
                      </span>
                      {isBestScore && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Top Utility
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavourite(flight)}
                        title={saved ? "Remove Bookmark" : "Save Itinerary"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          saved ? "text-red-400 bg-red-500/10" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => removeFlight(flight.flightId)}
                        title="Remove Column"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-navy-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Airline & Price */}
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                      {flight.airline}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-white">
                        ${flight.price}
                      </span>
                      <span className="text-xs text-slate-400">USD</span>
                      {isBestPrice && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          Lowest Fare
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Composite FlyRank Score Card */}
                  <div className="rounded-xl bg-navy-950/80 p-3.5 border border-navy-800/90 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-cyan-400" />
                        FlyRank Score
                      </span>
                      <span className="text-2xl font-black text-cyan-300">
                        {flight.flyrankScore}
                        <span className="text-xs font-normal text-slate-400">/100</span>
                      </span>
                    </div>

                    {/* Mini progress bar */}
                    <div className="h-2 w-full rounded-full bg-navy-900 overflow-hidden border border-navy-800">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full"
                        style={{ width: `${flight.flyrankScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Criteria Breakdown Rows */}
                  <div className="flex flex-col gap-3 text-xs border-t border-navy-800 pt-3">
                    {/* Duration */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        Duration
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-white">
                          {formatDuration(flight.totalDurationMinutes)}
                        </span>
                        {isBestDuration && (
                          <span className="ml-1.5 rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">
                            Fastest
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stops & Layover */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Stops</span>
                      <span className="font-semibold text-white">
                        {flight.stops === 0
                          ? "Non-stop"
                          : `${flight.stops} stop (${formatDuration(flight.layoverDurationMinutes)} layover)`}
                      </span>
                    </div>

                    {/* Carrier Rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                        Carrier Rating
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-amber-300">
                          {flight.carrierRating} / 10
                        </span>
                        {isBestCarrier && (
                          <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                            Top Rated
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Carbon Impact */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                        Carbon (CO₂)
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-emerald-400">
                          {flight.co2EmissionsKg} kg
                        </span>
                        {isBestEco && (
                          <span className="ml-1.5 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                            Cleanest
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Normalized Sub-Scores Grid */}
                  {flight.scoreBreakdown && (
                    <div className="rounded-xl bg-navy-950/60 p-3 border border-navy-800 text-[11px] flex flex-col gap-2">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[9px]">
                        Sub-Utility Scores
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fare:</span>
                          <span className="font-medium text-slate-200">
                            {flight.scoreBreakdown.priceScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Speed:</span>
                          <span className="font-medium text-slate-200">
                            {flight.scoreBreakdown.durationScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Layover:</span>
                          <span className="font-medium text-slate-200">
                            {flight.scoreBreakdown.layoverScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Carrier:</span>
                          <span className="font-medium text-slate-200">
                            {flight.scoreBreakdown.carrierScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Simulation Action */}
                  <div className="mt-auto pt-2">
                    <button
                      onClick={() => setBookingSuccessModal(flight)}
                      className={`w-full rounded-xl py-2.5 text-xs font-semibold transition-all shadow-md ${
                        isBestScore
                          ? "bg-gradient-to-r from-brand-600 to-cyan-500 text-white hover:opacity-95"
                          : "bg-navy-800 text-slate-200 hover:bg-navy-700 hover:text-white"
                      }`}
                    >
                      Simulate Booking (${flight.price})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Simulator Confirmation Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-cyan-500/40 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Booking Simulation Confirmed
                </h3>
                <span className="text-xs text-slate-400">
                  Demo Flight Reservation &bull; Mock Ticket
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-navy-950/90 p-4 border border-navy-800 text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Airline / Flight:</span>
                <span className="font-semibold text-white">
                  {bookingSuccessModal.airline} ({bookingSuccessModal.flightNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fare:</span>
                <span className="font-semibold text-emerald-400">
                  ${bookingSuccessModal.price} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">FlyRank Utility Score:</span>
                <span className="font-semibold text-cyan-300">
                  {bookingSuccessModal.flyrankScore} / 100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-white">
                  {formatDuration(bookingSuccessModal.totalDurationMinutes)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              This confirms the booking simulation for FlyRank evaluation. No real payment or flight booking was charged.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setBookingSuccessModal(null)}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-2.5 text-xs font-semibold text-white hover:opacity-95"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
