"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sliders, ChevronRight, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import SettingsForm from "@/components/SettingsForm";
import { DEFAULT_USER_PREFERENCES } from "@/lib/validations/settings";
import { UserPreferences } from "@/lib/types";

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("flyrank_user_preferences");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSavePreferences = (newPrefs: UserPreferences) => {
    try {
      localStorage.setItem("flyrank_user_preferences", JSON.stringify(newPrefs));
      setPreferences(newPrefs);
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 4000);
    } catch (e) {
      console.error("Failed to save preferences to localStorage", e);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-400 font-medium">Scoring Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Scoring Matrix & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fine-tune the mathematical weights that govern your personal flight utility rankings.
          </p>
        </div>

        <Link
          href="/flights"
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-500 transition-colors shadow-md self-start sm:self-auto"
        >
          <span>Apply to Live Flights</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {savedBanner && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            Preferences and weights successfully synchronized and stored in localStorage.
          </span>
        </div>
      )}

      {/* Embedded Settings Form with Accessible Sliders & Validation */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800 shadow-2xl">
        <SettingsForm
          initialPreferences={preferences}
          onSave={handleSavePreferences}
        />
      </div>
    </div>
  );
}
