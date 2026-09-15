'use client';

import React from 'react';
import { Plane, Bookmark, Sliders, BarChart2, User, LogOut } from 'lucide-react';
import { UserProfile } from '../lib/services/authService';

export type ActiveTab = 'search' | 'saved' | 'settings' | 'compare';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  compareCount: number;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
  user,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveTab('search')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveTab('search')}
          aria-label="FlyRank Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Fly<span className="text-cyan-400">Rank</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 tracking-wider uppercase font-semibold">
              Utility Engine
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            Explore Flights
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved Itineraries
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'compare'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Compare
            {compareCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Scoring Weights
          </button>
        </nav>

        {/* User / Auth */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-white block">{user.name}</span>
                <span className="text-[10px] text-cyan-400 block">{user.email}</span>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-xl border border-slate-700 hover:border-red-500/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-900/95">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'search' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Plane className="w-4 h-4 mb-0.5" />
          Flights
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium relative ${
            activeTab === 'saved' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Bookmark className="w-4 h-4 mb-0.5" />
          Saved ({savedCount})
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium relative ${
            activeTab === 'compare' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <BarChart2 className="w-4 h-4 mb-0.5" />
          Compare ({compareCount})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'settings' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4 mb-0.5" />
          Weights
        </button>
      </div>
    </header>
  );
};
