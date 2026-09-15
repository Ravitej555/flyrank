'use client';

import React from 'react';
import { Search, ArrowRightLeft, Calendar, Users, MapPin, Sparkles } from 'lucide-react';

interface RoutePreset {
  origin: string;
  destination: string;
  label: string;
}

interface FlightSearchHeroProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  passengers: number;
  setPassengers: (val: number) => void;
  loading: boolean;
  onSearch: () => void;
  popularRoutes: RoutePreset[];
  onSelectPreset: (origin: string, dest: string) => void;
  onSwapAirports: () => void;
}

export const FlightSearchHero: React.FC<FlightSearchHeroProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  date,
  setDate,
  passengers,
  setPassengers,
  loading,
  onSearch,
  popularRoutes,
  onSelectPreset,
  onSwapAirports,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="mb-10 text-slate-100">
      {/* Hero Badge & Headings */}
      <div className="text-center max-w-3xl mx-auto mb-8 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Attribute Utility Optimization</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200">True Optimal Flight</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Standard flight search optimizes only for sticker price. FlyRank calculates a composite utility score balancing price, travel time, layover stress, airline reliability, and carbon emissions.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Origin */}
          <div className="md:col-span-3">
            <label htmlFor="origin-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Origin Airport (IATA)
            </label>
            <input
              id="origin-input"
              type="text"
              maxLength={3}
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              placeholder="e.g. JFK"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-bold tracking-wider"
              required
            />
          </div>

          {/* Swap Button */}
          <div className="hidden md:flex md:col-span-1 justify-center pb-1">
            <button
              type="button"
              onClick={onSwapAirports}
              title="Swap Airports"
              aria-label="Swap Origin and Destination"
              className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all transform hover:scale-105"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-3">
            <label htmlFor="destination-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Destination (IATA)
            </label>
            <input
              id="destination-input"
              type="text"
              maxLength={3}
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              placeholder="e.g. LHR"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-bold tracking-wider"
              required
            />
          </div>

          {/* Date */}
          <div className="md:col-span-2">
            <label htmlFor="date-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Departure Date
            </label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          {/* Passengers */}
          <div className="md:col-span-1">
            <label htmlFor="passengers-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Travelers
            </label>
            <input
              id="passengers-input"
              type="number"
              min={1}
              max={9}
              value={passengers}
              onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-2 text-white text-xs text-center focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-semibold"
            />
          </div>

          {/* Search CTA */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Ranking...' : 'Rank Flights'}
            </button>
          </div>
        </form>

        {/* Popular Route Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Popular Routes:
          </span>
          {popularRoutes.map((preset) => (
            <button
              key={`${preset.origin}-${preset.destination}`}
              type="button"
              onClick={() => onSelectPreset(preset.origin, preset.destination)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                origin === preset.origin && destination === preset.destination
                  ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300 font-semibold'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {preset.origin} ⇄ {preset.destination}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
