'use client';

import React from 'react';
import { X, Scale, Clock, Award, Leaf, Trash2 } from 'lucide-react';
import { FlightItinerary } from '../lib/types';

interface ComparisonDrawerProps {
  comparisonList: FlightItinerary[];
  onRemove: (flight: FlightItinerary) => void;
  onClear: () => void;
  onClose: () => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  comparisonList,
  onRemove,
  onClear,
  onClose,
}) => {
  if (comparisonList.length === 0) return null;

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  // Identify best-in-class metrics
  const bestPrice = Math.min(...comparisonList.map((f) => f.price));
  const bestDuration = Math.min(...comparisonList.map((f) => f.totalDurationMinutes));
  const bestScore = Math.max(...comparisonList.map((f) => f.flyrankScore ?? 0));
  const bestEco = Math.min(...comparisonList.map((f) => f.co2EmissionsKg));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/95 border-t border-slate-700 shadow-2xl backdrop-blur-xl p-4 sm:p-6 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 id="comparison-title" className="text-base sm:text-lg font-bold text-white">
                Flight Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Comparing {comparisonList.length} of max 3 selected itineraries side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {comparisonList.map((flight) => {
            const score = flight.flyrankScore ?? 0;
            const isTopScore = score === bestScore && comparisonList.length > 1;
            const isTopPrice = flight.price === bestPrice && comparisonList.length > 1;
            const isTopDuration = flight.totalDurationMinutes === bestDuration && comparisonList.length > 1;
            const isTopEco = flight.co2EmissionsKg === bestEco && comparisonList.length > 1;

            return (
              <div
                key={flight.flightId}
                className={`bg-slate-950/80 rounded-2xl p-4 border relative ${
                  isTopScore ? 'border-cyan-500/60 ring-1 ring-cyan-500/40' : 'border-slate-800'
                }`}
              >
                {/* Remove flight button */}
                <button
                  onClick={() => onRemove(flight)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                  title="Remove from comparison"
                  aria-label="Remove flight"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Airline & Flight Number */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400">
                    {flight.airline.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{flight.airline}</h4>
                    <span className="text-xs text-slate-400 font-mono">{flight.flightNumber}</span>
                  </div>
                </div>

                {/* FlyRank Score Card */}
                <div
                  className={`p-3 rounded-xl mb-3 flex items-center justify-between border ${
                    isTopScore
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                      FlyRank Utility
                    </span>
                    <span className="text-2xl font-black">{score}/100</span>
                  </div>
                  {isTopScore && (
                    <span className="text-[10px] font-bold bg-cyan-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" /> Winner
                    </span>
                  )}
                </div>

                {/* Metrics Breakdown List */}
                <div className="space-y-2 text-xs">
                  {/* Price */}
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Ticket Price:</span>
                    <span
                      className={`font-bold ${
                        isTopPrice ? 'text-emerald-400 font-black' : 'text-white'
                      }`}
                    >
                      ${flight.price} {isTopPrice && '(Lowest)'}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Duration:
                    </span>
                    <span
                      className={`font-semibold ${
                        isTopDuration ? 'text-cyan-300 font-black' : 'text-slate-200'
                      }`}
                    >
                      {formatDuration(flight.totalDurationMinutes)} {isTopDuration && '(Fastest)'}
                    </span>
                  </div>

                  {/* Stops */}
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Stops & Layovers:</span>
                    <span className="font-medium text-slate-300">
                      {flight.stops === 0
                        ? 'Direct'
                        : `${flight.stops} stop (${formatDuration(flight.layoverDurationMinutes)})`}
                    </span>
                  </div>

                  {/* Airline Rating */}
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Carrier Rating:</span>
                    <span className="font-semibold text-amber-300">{flight.carrierRating} / 10</span>
                  </div>

                  {/* Carbon emissions */}
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" /> CO₂ Emissions:
                    </span>
                    <span
                      className={`font-semibold ${
                        isTopEco ? 'text-emerald-400 font-black' : 'text-slate-300'
                      }`}
                    >
                      {flight.co2EmissionsKg} kg {isTopEco && '(Greenest)'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
