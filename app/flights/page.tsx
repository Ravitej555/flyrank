"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plane,
  Filter,
  Sliders,
  Layers,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
} from "lucide-react";
import { useFlightSearchViewModel } from "@/lib/viewmodels/useFlightSearchViewModel";
import { useFavouritesViewModel } from "@/lib/viewmodels/useFavouritesViewModel";
import { FlightSearchHero } from "@/components/FlightSearchHero";
import { FlightCard } from "@/components/FlightCard";
import { ComparisonDrawer } from "@/components/ComparisonDrawer";
import { DEFAULT_WEIGHTS } from "@/lib/scoring";
import { RankingWeights } from "@/lib/types";

export default function FlightsPage() {
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    date,
    setDate,
    passengers,
    setPassengers,
    weights,
    updateWeights,
    sortBy,
    updateSortBy,
    filters,
    updateFilters,
    displayedFlights,
    rawFlightsCount,
    loading,
    error,
    executeSearch,
    selectPopularRoute,
    swapAirports,
    popularRoutes,
    comparisonList,
    toggleComparison,
    clearComparison,
  } = useFlightSearchViewModel();

  const { isSaved, toggleFavourite } = useFavouritesViewModel();
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Quick weight presets
  const applyWeightPreset = (type: "balanced" | "budget" | "speed" | "eco") => {
    let newWeights: RankingWeights;
    switch (type) {
      case "budget":
        newWeights = { price: 60, duration: 20, layover: 10, carrier: 5, eco: 5 };
        break;
      case "speed":
        newWeights = { price: 20, duration: 55, layover: 15, carrier: 5, eco: 5 };
        break;
      case "eco":
        newWeights = { price: 20, duration: 15, layover: 10, carrier: 5, eco: 50 };
        break;
      default:
        newWeights = DEFAULT_WEIGHTS;
    }
    updateWeights(newWeights);
  };

  // Re-open drawer when comparisonList has items
  useEffect(() => {
    if (comparisonList.length > 0) {
      setDrawerOpen(true);
    }
  }, [comparisonList.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8 pb-32">
      {/* Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-400 font-medium">Flights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Flight Search & Utility Ranking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-dimensional scoring evaluating fare, duration, layover friction, and reliability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-navy-800 hover:text-white transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Customize Weights</span>
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Compare Matrix ({comparisonList.length})</span>
          </Link>
        </div>
      </div>

      {/* Flight Search Hero */}
      <FlightSearchHero
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        date={date}
        setDate={setDate}
        passengers={passengers}
        setPassengers={setPassengers}
        loading={loading}
        onSearch={() => executeSearch()}
        popularRoutes={popularRoutes}
        onSelectPreset={selectPopularRoute}
        onSwapAirports={swapAirports}
      />

      {/* Filter and Ranking Controls Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-navy-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Quick weight presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Utility Presets:
          </span>
          <button
            onClick={() => applyWeightPreset("balanced")}
            className="rounded-lg border border-navy-700 bg-navy-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-navy-800 hover:text-white transition-colors"
          >
            Balanced
          </button>
          <button
            onClick={() => applyWeightPreset("budget")}
            className="rounded-lg border border-navy-700 bg-navy-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-navy-800 hover:text-white transition-colors"
          >
            Budget First
          </button>
          <button
            onClick={() => applyWeightPreset("speed")}
            className="rounded-lg border border-navy-700 bg-navy-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-navy-800 hover:text-white transition-colors"
          >
            Speed / Non-Stop
          </button>
          <button
            onClick={() => applyWeightPreset("eco")}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            Eco (Low CO₂)
          </button>
        </div>

        {/* Right: Stops Filter & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Stops filter */}
          <div className="flex items-center gap-1 bg-navy-950/80 p-1 rounded-lg border border-navy-800 text-xs">
            <span className="px-2 text-slate-400 font-medium">Stops:</span>
            <button
              onClick={() => updateFilters({ ...filters, maxStops: undefined })}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                filters.maxStops === undefined
                  ? "bg-brand-600 text-white font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => updateFilters({ ...filters, maxStops: 0 })}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                filters.maxStops === 0
                  ? "bg-brand-600 text-white font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => updateFilters({ ...filters, maxStops: 1 })}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                filters.maxStops === 1
                  ? "bg-brand-600 text-white font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              &le; 1 Stop
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => updateSortBy(e.target.value as any)}
              aria-label="Sort Itineraries"
              className="rounded-lg border border-navy-700 bg-navy-900 px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="flyrank">FlyRank Score (Optimal)</option>
              <option value="price">Lowest Price ($)</option>
              <option value="duration">Shortest Duration (Fastest)</option>
              <option value="eco">Lowest Carbon (CO₂)</option>
              <option value="carrier">Highest Carrier Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => executeSearch()}
            className="underline hover:text-red-300 font-semibold"
          >
            Retry Search
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{displayedFlights.length}</span>{" "}
          ranked itineraries ({rawFlightsCount} total on route){" "}
          <span className="font-semibold text-cyan-400">
            {origin} &rarr; {destination}
          </span>
        </div>
        {filters.maxStops !== undefined && (
          <button
            onClick={() => updateFilters({ ...filters, maxStops: undefined })}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Stops Filter
          </button>
        )}
      </div>

      {/* Flight Cards Grid / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-xs text-slate-400">
            Ingesting routes and calculating multi-dimensional utility scores...
          </p>
        </div>
      ) : displayedFlights.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-navy-800 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-navy-900 flex items-center justify-center text-slate-400">
            <Plane className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Flights Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            No flights match your active filters. Try clearing stops or searching a different date.
          </p>
          <button
            onClick={() => {
              updateFilters({ maxStops: undefined, maxPrice: undefined, selectedAirlines: [], prioritizeDirect: false });
              executeSearch();
            }}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedFlights.map((flight, index) => {
            const isFlightSaved = isSaved(flight.flightId);
            const isCompared = comparisonList.some((f) => f.flightId === flight.flightId);

            return (
              <FlightCard
                key={flight.flightId}
                flight={flight}
                rankIndex={index}
                isSaved={isFlightSaved}
                onToggleSave={toggleFavourite}
                isCompared={isCompared}
                onToggleCompare={toggleComparison}
              />
            );
          })}
        </div>
      )}

      {/* Floating Comparison Drawer if flights selected */}
      {comparisonList.length > 0 && drawerOpen && (
        <ComparisonDrawer
          comparisonList={comparisonList}
          onRemove={(flight) => toggleComparison(flight)}
          onClear={clearComparison}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}
