'use client';

import React from 'react';
import { Bookmark, Sparkles, TrendingUp, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { FlightItinerary } from '../lib/types';
import { FavouritesStats } from '../lib/models/FavouritesModel';
import { FlightCard } from './FlightCard';

interface FavouritesViewProps {
  favourites: FlightItinerary[];
  stats: FavouritesStats;
  onToggleSave: (flight: FlightItinerary) => void;
  onToggleCompare: (flight: FlightItinerary) => void;
  comparisonList: FlightItinerary[];
  onNavigateToSearch: () => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  favourites,
  stats,
  onToggleSave,
  onToggleCompare,
  comparisonList,
  onNavigateToSearch,
}) => {
  if (favourites.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900/60 border border-slate-800 rounded-3xl max-w-2xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <Bookmark className="w-7 h-7 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Saved Itineraries Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Bookmark high-utility flights using the heart button while searching to compare them later or track price and carbon trade-offs.
        </p>
        <button
          onClick={onNavigateToSearch}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          <span>Explore Flight Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <section className="animate-in fade-in duration-300">
      {/* Header and Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bookmark className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Saved Flight Itineraries</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Review and monitor your bookmarked options across airlines, travel times, and scoring metrics.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Average FlyRank
              </span>
              <span className="text-xl font-black text-cyan-300">
                {stats.averageScore} <span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Average Fare
              </span>
              <span className="text-xl font-black text-emerald-400">
                ${stats.averagePrice}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Average Duration
              </span>
              <span className="text-xl font-black text-purple-300">
                {formatDuration(stats.averageDurationMinutes)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Cards List */}
      <div>
        {favourites.map((flight, idx) => (
          <FlightCard
            key={flight.flightId}
            flight={flight}
            rankIndex={idx}
            isSaved={true}
            onToggleSave={onToggleSave}
            isCompared={comparisonList.some((f) => f.flightId === flight.flightId)}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
    </section>
  );
};
