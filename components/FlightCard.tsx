'use client';

import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Leaf,
  Star,
  ChevronDown,
  ChevronUp,
  Heart,
  Scale,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { FlightItinerary } from '../lib/types';

interface FlightCardProps {
  flight: FlightItinerary;
  rankIndex: number;
  isSaved: boolean;
  onToggleSave: (flight: FlightItinerary) => void;
  isCompared: boolean;
  onToggleCompare: (flight: FlightItinerary) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  rankIndex,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
}) => {
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  const score = flight.flyrankScore ?? 0;
  const breakdown = flight.scoreBreakdown;

  // Visual badge colors based on score
  const getScoreBadgeStyles = (s: number) => {
    if (s >= 85) {
      return {
        badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
        ring: 'text-emerald-400 border-emerald-500',
        label: 'Optimal Utility',
      };
    }
    if (s >= 72) {
      return {
        badge: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
        ring: 'text-cyan-400 border-cyan-500',
        label: 'Strong Choice',
      };
    }
    if (s >= 60) {
      return {
        badge: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        ring: 'text-amber-400 border-amber-500',
        label: 'Fair Balance',
      };
    }
    return {
      badge: 'bg-slate-700/30 border-slate-700 text-slate-400',
      ring: 'text-slate-400 border-slate-600',
      label: 'Suboptimal Trade-off',
    };
  };

  const scoreStyle = getScoreBadgeStyles(score);

  return (
    <article
      className={`border rounded-2xl p-5 mb-4 bg-slate-900/80 backdrop-blur-md transition-all hover:shadow-xl relative overflow-hidden ${
        rankIndex === 0
          ? 'border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Rank Ribbons for Top Itineraries */}
      {rankIndex === 0 && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
          🏆 #1 FlyRank Pick
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Flight & Airline Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-black text-sm text-cyan-400 shadow-inner">
            {flight.airline.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-base tracking-tight">{flight.airline}</h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                {flight.flightNumber}
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <Star className="w-3 h-3 fill-amber-400" />
                {flight.carrierRating.toFixed(1)}/10
              </span>
            </div>

            {/* Duration and Route details */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {formatDuration(flight.totalDurationMinutes)}
              </span>

              <span className="text-slate-600">•</span>

              {/* Stops Badge */}
              {flight.stops === 0 ? (
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Direct Flight
                </span>
              ) : (
                <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {flight.stops} {flight.stops === 1 ? 'Stop' : 'Stops'} (
                  {formatDuration(flight.layoverDurationMinutes)} layover)
                </span>
              )}

              {/* Layover warning alerts */}
              {flight.stops > 0 && flight.layoverDurationMinutes < 60 && (
                <span className="flex items-center gap-1 text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Tight connection!
                </span>
              )}
              {flight.stops > 0 && flight.layoverDurationMinutes > 240 && (
                <span className="flex items-center gap-1 text-amber-300 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Clock className="w-3 h-3 text-amber-300" />
                  Fatigue layover
                </span>
              )}

              <span className="text-slate-600">•</span>

              {/* Eco Badge */}
              <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                {flight.co2EmissionsKg} kg CO₂
              </span>
            </div>
          </div>
        </div>

        {/* FlyRank Score & Price Section */}
        <div className="flex items-center justify-between w-full lg:w-auto lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
          {/* Price */}
          <div className="text-left lg:text-right">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Total Fare
            </span>
            <span className="text-2xl font-black text-white tracking-tight">
              ${flight.price}
            </span>
            <span className="text-[10px] text-slate-500 block">tax & fees incl.</span>
          </div>

          {/* FlyRank Utility Score Badge */}
          <div className="text-center">
            <div
              className={`px-3.5 py-1.5 rounded-xl border flex flex-col items-center justify-center ${scoreStyle.badge}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                FlyRank
              </span>
              <span className="text-2xl font-black tracking-tight">{score}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 block mt-1">
              {scoreStyle.label}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={() => onToggleCompare(flight)}
              title={isCompared ? 'Remove from Comparison' : 'Add to Comparison'}
              aria-label={`Compare ${flight.airline} flight ${flight.flightNumber}`}
              className={`p-2.5 rounded-xl border transition-all ${
                isCompared
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/70 border-slate-700/70 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Bookmark / Favourite */}
            <button
              type="button"
              onClick={() => onToggleSave(flight)}
              title={isSaved ? 'Remove from Saved' : 'Save Itinerary'}
              aria-label={`Bookmark ${flight.airline} flight`}
              className={`p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-slate-800/70 border-slate-700/70 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Score Breakdown Expander */}
            <button
              type="button"
              onClick={() => setShowBreakdown((prev) => !prev)}
              aria-expanded={showBreakdown}
              aria-label="Toggle Score Breakdown"
              className="p-2.5 rounded-xl border border-slate-700/70 bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1 text-xs"
            >
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Multi-Factor Score Breakdown */}
      {showBreakdown && breakdown && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-950/60 -mx-5 -mb-5 p-5 rounded-b-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Utility Score Breakdown (out of 100)
            </h4>
            <span className="text-[11px] text-slate-400">
              Composite Score: <strong className="text-cyan-300">{score}/100</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* Price score */}
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Price Utility</span>
                <span className="font-bold text-white">{breakdown.priceScore}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.priceScore}%` }}
                />
              </div>
            </div>

            {/* Duration score */}
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Travel Speed</span>
                <span className="font-bold text-white">{breakdown.durationScore}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.durationScore}%` }}
                />
              </div>
            </div>

            {/* Layover score */}
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Layover Comfort</span>
                <span className="font-bold text-white">{breakdown.layoverScore}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.layoverScore}%` }}
                />
              </div>
            </div>

            {/* Carrier score */}
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Airline Rating</span>
                <span className="font-bold text-white">{breakdown.carrierScore}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.carrierScore}%` }}
                />
              </div>
            </div>

            {/* Eco score */}
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Carbon Efficiency</span>
                <span className="font-bold text-white">{breakdown.ecoScore}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.ecoScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
