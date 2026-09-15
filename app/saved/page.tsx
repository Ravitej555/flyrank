"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Award,
  Clock,
  DollarSign,
  Download,
  Trash2,
  Plane,
  ChevronRight,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";
import { useFavouritesViewModel } from "@/lib/viewmodels/useFavouritesViewModel";
import { FlightCard } from "@/components/FlightCard";
import { FlightItinerary } from "@/lib/types";

export default function SavedPage() {
  const { favourites, stats, removeFavourite, toggleFavourite } =
    useFavouritesViewModel();
  const [comparedId, setComparedId] = useState<string | null>(null);

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  // Export to CSV
  const exportToCSV = () => {
    if (favourites.length === 0) return;
    const headers = [
      "Flight ID",
      "Airline",
      "Flight Number",
      "Price (USD)",
      "Duration (Mins)",
      "Stops",
      "Carrier Rating",
      "CO2 (kg)",
      "FlyRank Score",
    ];

    const rows = favourites.map((f) => [
      f.flightId,
      `"${f.airline}"`,
      f.flightNumber,
      f.price,
      f.totalDurationMinutes,
      f.stops,
      f.carrierRating,
      f.co2EmissionsKg,
      f.flyrankScore ?? "N/A",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `flyrank_saved_itineraries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    if (favourites.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(favourites, null, 2)
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", `flyrank_saved_itineraries_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="text-cyan-400 font-medium">Saved Itineraries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Saved Flights Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your bookmarked flight itineraries and analyze aggregate travel utility.
          </p>
        </div>

        {favourites.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-navy-800 hover:text-white transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportToJSON}
              className="flex items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-navy-800 hover:text-white transition-colors"
            >
              <FileJson className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
          </div>
        )}
      </div>

      {/* Portfolio Analytics Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Saved Itineraries</span>
            <Bookmark className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-extrabold text-white mt-1">
            {stats.totalCount}
          </span>
          <span className="text-[11px] text-slate-400">Portfolio collection</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average FlyRank</span>
            <Award className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-extrabold text-cyan-300 mt-1">
            {stats.averageScore > 0 ? stats.averageScore : "—"}
            {stats.averageScore > 0 && (
              <span className="text-xs font-normal text-slate-400">/100</span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">Mean utility score</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Ticket Fare</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-400 mt-1">
            {stats.averagePrice > 0 ? `$${stats.averagePrice}` : "—"}
          </span>
          <span className="text-[11px] text-slate-400">USD per passenger</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Travel Time</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold text-white mt-1">
            {stats.averageDurationMinutes > 0
              ? formatDuration(stats.averageDurationMinutes)
              : "—"}
          </span>
          <span className="text-[11px] text-slate-400">Flight + layover time</span>
        </div>
      </div>

      {/* Main List */}
      {favourites.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border border-navy-800 flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-navy-900 flex items-center justify-center text-slate-500 border border-navy-800">
            <Bookmark className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-white">No Saved Flights Yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Click the bookmark icon on any flight card in the flight search results to save itineraries to your portfolio for later review.
          </p>
          <Link
            href="/flights"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-95"
          >
            <Plane className="h-4 w-4" />
            <span>Search & Bookmark Flights</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing {favourites.length} saved flights</span>
            <Link
              href="/compare"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Open in Comparison Matrix
              <Layers className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {favourites.map((flight, idx) => (
              <FlightCard
                key={flight.flightId}
                flight={flight}
                rankIndex={idx}
                isSaved={true}
                onToggleSave={toggleFavourite}
                isCompared={comparedId === flight.flightId}
                onToggleCompare={() => {
                  setComparedId(
                    comparedId === flight.flightId ? null : flight.flightId
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
