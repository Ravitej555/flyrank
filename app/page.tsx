'use client';

import React, { useState } from 'react';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { FlightSearchHero } from '@/components/FlightSearchHero';
import { FlightCard } from '@/components/FlightCard';
import { ComparisonDrawer } from '@/components/ComparisonDrawer';
import { FavouritesView } from '@/components/FavouritesView';
import { AuthModal } from '@/components/AuthModal';
import SettingsForm from '@/components/SettingsForm';
import { useFlightSearchViewModel } from '@/lib/viewmodels/useFlightSearchViewModel';
import { useFavouritesViewModel } from '@/lib/viewmodels/useFavouritesViewModel';
import { useAuthViewModel } from '@/lib/viewmodels/useAuthViewModel';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Sparkles,
  PlaneTakeoff,
  Award,
  Layers,
  Scale,
} from 'lucide-react';
import { SortCriterion } from '@/lib/models/FlightModel';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState<boolean>(true);

  // ViewModels
  const searchVM = useFlightSearchViewModel();
  const favouritesVM = useFavouritesViewModel();
  const authVM = useAuthViewModel();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={favouritesVM.favourites.length}
        compareCount={searchVM.comparisonList.length}
        user={authVM.user}
        onOpenAuth={authVM.openModal}
        onLogout={authVM.handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* TAB 1: Search & Ranked Flights */}
        {activeTab === 'search' && (
          <div>
            <FlightSearchHero
              origin={searchVM.origin}
              setOrigin={searchVM.setOrigin}
              destination={searchVM.destination}
              setDestination={searchVM.setDestination}
              date={searchVM.date}
              setDate={searchVM.setDate}
              passengers={searchVM.passengers}
              setPassengers={searchVM.setPassengers}
              loading={searchVM.loading}
              onSearch={() => searchVM.executeSearch()}
              popularRoutes={searchVM.popularRoutes}
              onSelectPreset={searchVM.selectPopularRoute}
              onSwapAirports={searchVM.swapAirports}
            />

            {/* Filter & Sort Controls Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  Stops:
                </span>
                <button
                  type="button"
                  onClick={() => searchVM.updateFilters({ maxStops: undefined, prioritizeDirect: false })}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    searchVM.filters.maxStops === undefined && !searchVM.filters.prioritizeDirect
                      ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  All Flights
                </button>
                <button
                  type="button"
                  onClick={() => searchVM.updateFilters({ maxStops: 0, prioritizeDirect: true })}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    searchVM.filters.maxStops === 0
                      ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Direct Only
                </button>
                <button
                  type="button"
                  onClick={() => searchVM.updateFilters({ maxStops: 1, prioritizeDirect: false })}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    searchVM.filters.maxStops === 1
                      ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Max 1 Stop
                </button>
              </div>

              {/* Sort Criterion Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs">
                <label htmlFor="sort-select" className="text-slate-400 font-semibold flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={searchVM.sortBy}
                  onChange={(e) => searchVM.updateSortBy(e.target.value as SortCriterion)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-semibold"
                >
                  <option value="flyrank">FlyRank Utility Score (Optimal)</option>
                  <option value="price">Lowest Price ($)</option>
                  <option value="duration">Fastest Duration</option>
                  <option value="eco">Lowest Carbon Footprint (CO₂)</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {searchVM.error && (
              <div
                role="alert"
                className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between"
              >
                <span>{searchVM.error}</span>
                <button
                  onClick={() => searchVM.executeSearch()}
                  className="underline font-bold hover:text-white"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Search Route Summary Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <PlaneTakeoff className="w-4 h-4 text-cyan-400" />
                  <span>
                    Ranked Itineraries for {searchVM.origin} ➔ {searchVM.destination}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                    {searchVM.displayedFlights.length} options
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Adjust MAU Weights ({searchVM.weights.price}% Price, {searchVM.weights.duration}% Dur...)</span>
              </button>
            </div>

            {/* Loading Indicator */}
            {searchVM.loading && (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-300">
                  Computing Multi-Attribute Utility Scores...
                </p>
                <span className="text-xs text-slate-500 mt-1">
                  Evaluating price curve, connection friction, and airline safety rating
                </span>
              </div>
            )}

            {/* Results Flight Cards */}
            {!searchVM.loading && searchVM.displayedFlights.length > 0 && (
              <div>
                {searchVM.displayedFlights.map((flight, idx) => (
                  <FlightCard
                    key={flight.flightId}
                    flight={flight}
                    rankIndex={idx}
                    isSaved={favouritesVM.isSaved(flight.flightId)}
                    onToggleSave={favouritesVM.toggleFavourite}
                    isCompared={searchVM.comparisonList.some((f) => f.flightId === flight.flightId)}
                    onToggleCompare={searchVM.toggleComparison}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!searchVM.loading && searchVM.displayedFlights.length === 0 && (
              <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <p className="text-base font-bold text-slate-300 mb-1">
                  No flights found matching your active filters.
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Try relaxing your stop or price constraints.
                </p>
                <button
                  type="button"
                  onClick={() => searchVM.updateFilters({ maxStops: undefined, prioritizeDirect: false })}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-cyan-300"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Saved / Bookmarked Flights */}
        {activeTab === 'saved' && (
          <FavouritesView
            favourites={favouritesVM.favourites}
            stats={favouritesVM.stats}
            onToggleSave={favouritesVM.toggleFavourite}
            onToggleCompare={searchVM.toggleComparison}
            comparisonList={searchVM.comparisonList}
            onNavigateToSearch={() => setActiveTab('search')}
          />
        )}

        {/* TAB 3: Comparison View */}
        {activeTab === 'compare' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                <Layers className="w-5 h-5 text-cyan-400" />
                Flight Itinerary Comparison
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Compare up to 3 flight options side-by-side across utility score, layover risk, and emissions.
              </p>
            </div>

            {searchVM.comparisonList.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <Scale className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300 mb-1">No Flights Selected</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Click the scale icon on any flight card in search results to add it here for side-by-side evaluation.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-xl text-white shadow-md"
                >
                  Browse Flight Search
                </button>
              </div>
            ) : (
              <ComparisonDrawer
                comparisonList={searchVM.comparisonList}
                onRemove={searchVM.toggleComparison}
                onClear={searchVM.clearComparison}
                onClose={() => setActiveTab('search')}
              />
            )}
          </div>
        )}

        {/* TAB 4: Scoring Parameters & Settings Form */}
        {activeTab === 'settings' && (
          <div>
            <header className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multi-Attribute Utility (MAU) Formula</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">Ranking Engine Parameters</h2>
              <p className="text-slate-400 mt-2 text-xs sm:text-sm max-w-xl mx-auto">
                Customize the percentage weights assigned to price, travel duration, layover friction, airline reputation, and carbon footprint.
              </p>
            </header>

            <SettingsForm
              initialPreferences={{
                weights: searchVM.weights,
                currency: 'USD',
                maxStops: searchVM.filters.maxStops ?? 2,
                maxLayoverHours: 8,
                prioritizeDirect: searchVM.filters.prioritizeDirect ?? false,
                strictCarbonLimit: false,
              }}
              onSave={(savedPrefs) => {
                searchVM.updateWeights(savedPrefs.weights);
                searchVM.updateFilters({
                  maxStops: savedPrefs.maxStops,
                  prioritizeDirect: savedPrefs.prioritizeDirect,
                });
                setActiveTab('search');
              }}
            />
          </div>
        )}
      </main>

      {/* Sticky Bottom Comparison Quick-Bar (if comparisons active and not on compare tab) */}
      {searchVM.comparisonList.length > 0 && activeTab !== 'compare' && isCompareDrawerOpen && (
        <ComparisonDrawer
          comparisonList={searchVM.comparisonList}
          onRemove={searchVM.toggleComparison}
          onClear={searchVM.clearComparison}
          onClose={() => setIsCompareDrawerOpen(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authVM.isModalOpen}
        onClose={authVM.closeModal}
        email={authVM.email}
        setEmail={authVM.setEmail}
        name={authVM.name}
        setName={authVM.setName}
        error={authVM.error}
        onSubmit={authVM.handleLogin}
        onDemoLogin={authVM.handleDemoLogin}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">FlyRank ✈️</span>
            <span>— Multi-Criteria Flight Ranking Platform</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Built with React 19, Next.js 15, TypeScript & Tailwind CSS • AI Fluency Track
          </div>
        </div>
      </footer>
    </div>
  );
}
