'use client';

import React, { useState, useId } from 'react';
import {
  DEFAULT_USER_PREFERENCES,
  UserPreferencesSchema,
  WEIGHT_TOLERANCE_EPSILON,
} from '@/lib/validations/settings';
import { CurrencyCode, RankingWeights, UserPreferences } from '@/lib/types';
import { Sliders, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsFormProps {
  initialPreferences?: UserPreferences;
  onSave?: (preferences: UserPreferences) => void;
}

export default function SettingsForm({
  initialPreferences = DEFAULT_USER_PREFERENCES,
  onSave,
}: SettingsFormProps) {
  const formId = useId();
  const [weights, setWeights] = useState<RankingWeights>(initialPreferences.weights);
  const [currency, setCurrency] = useState<CurrencyCode>(initialPreferences.currency);
  const [maxStops, setMaxStops] = useState<number>(initialPreferences.maxStops);
  const [maxLayoverHours, setMaxLayoverHours] = useState<number>(initialPreferences.maxLayoverHours);
  const [prioritizeDirect, setPrioritizeDirect] = useState<boolean>(initialPreferences.prioritizeDirect);
  const [strictCarbonLimit, setStrictCarbonLimit] = useState<boolean>(initialPreferences.strictCarbonLimit);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Compute live weight sum
  const currentTotalWeight = Math.round(
    (weights.price + weights.duration + weights.layover + weights.carrier + weights.eco) * 10
  ) / 10;
  const isWeightSumValid = Math.abs(currentTotalWeight - 100) <= WEIGHT_TOLERANCE_EPSILON;

  const handleWeightChange = (key: keyof RankingWeights, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaveSuccess(false);
    // Clear specific field error when user interacts
    if (fieldErrors[key] || fieldErrors['total']) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        delete next['total'];
        return next;
      });
    }
  };

  const handleReset = () => {
    setWeights(DEFAULT_USER_PREFERENCES.weights);
    setCurrency(DEFAULT_USER_PREFERENCES.currency);
    setMaxStops(DEFAULT_USER_PREFERENCES.maxStops);
    setMaxLayoverHours(DEFAULT_USER_PREFERENCES.maxLayoverHours);
    setPrioritizeDirect(DEFAULT_USER_PREFERENCES.prioritizeDirect);
    setStrictCarbonLimit(DEFAULT_USER_PREFERENCES.strictCarbonLimit);
    setFieldErrors({});
    setSaveSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveSuccess(false);
    setFieldErrors({});

    const candidate: UserPreferences = {
      weights,
      currency,
      maxStops,
      maxLayoverHours,
      prioritizeDirect,
      strictCarbonLimit,
    };

    const parseResult = UserPreferencesSchema.safeParse(candidate);

    if (!parseResult.success) {
      const formattedErrors: Record<string, string> = {};
      for (const issue of parseResult.error.issues) {
        const key = issue.path[issue.path.length - 1]?.toString() || 'form';
        formattedErrors[key] = issue.message;
      }
      setFieldErrors(formattedErrors);
      return;
    }

    if (onSave) {
      onSave(parseResult.data);
    }
    setSaveSuccess(true);
  };

  return (
    <section aria-labelledby={`${formId}-title`} className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-6 shadow-xl max-w-2xl mx-auto my-8 backdrop-blur-sm">
      <header className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Sliders className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id={`${formId}-title`} className="text-xl font-bold text-white">
              Ranking Utility Settings
            </h2>
            <p className="text-sm text-slate-400">
              Customize the Multi-Attribute Utility function ($S = \sum w_i S_i$)
            </p>
          </div>
        </div>

        {/* Live dynamic total badge */}
        <div
          role="status"
          aria-live="polite"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
            isWeightSumValid
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-400'
          }`}
        >
          {isWeightSumValid ? (
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>Total: {currentTotalWeight}%</span>
        </div>
      </header>

      {/* Global Form Feedback */}
      {fieldErrors['total'] && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Invalid Weights Distribution</p>
            <p className="mt-0.5">{fieldErrors['total']}</p>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-sm flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Preferences Saved</p>
            <p className="mt-0.5">Your ranking algorithm weights have been updated successfully.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Fieldset 1: Multi-Criteria Scoring Weights */}
        <fieldset className="border border-slate-700/80 rounded-lg p-4 space-y-4 bg-slate-850">
          <legend className="px-2 text-sm font-semibold text-blue-400">
            Multi-Criteria Utility Weights (Must equal 100%)
          </legend>

          {/* Price Weight */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label htmlFor={`${formId}-price`} className="text-slate-300 font-medium">
                Price Sensitivity ($w_{'{price}'}$)
              </label>
              <span className="text-slate-400 font-mono">{weights.price}%</span>
            </div>
            <input
              id={`${formId}-price`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={weights.price}
              onChange={(e) => handleWeightChange('price', Number(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={weights.price}
              aria-invalid={!!fieldErrors['price']}
              aria-describedby={fieldErrors['price'] ? `${formId}-price-err` : undefined}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {fieldErrors['price'] && (
              <p id={`${formId}-price-err`} className="text-xs text-red-400 mt-1">
                {fieldErrors['price']}
              </p>
            )}
          </div>

          {/* Duration Weight */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label htmlFor={`${formId}-duration`} className="text-slate-300 font-medium">
                Total Flight Duration ($w_{'{duration}'}$)
              </label>
              <span className="text-slate-400 font-mono">{weights.duration}%</span>
            </div>
            <input
              id={`${formId}-duration`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={weights.duration}
              onChange={(e) => handleWeightChange('duration', Number(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={weights.duration}
              aria-invalid={!!fieldErrors['duration']}
              aria-describedby={fieldErrors['duration'] ? `${formId}-duration-err` : undefined}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {fieldErrors['duration'] && (
              <p id={`${formId}-duration-err`} className="text-xs text-red-400 mt-1">
                {fieldErrors['duration']}
              </p>
            )}
          </div>

          {/* Layover Weight */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label htmlFor={`${formId}-layover`} className="text-slate-300 font-medium">
                Layover Friction ($w_{'{layover}'}$)
              </label>
              <span className="text-slate-400 font-mono">{weights.layover}%</span>
            </div>
            <input
              id={`${formId}-layover`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={weights.layover}
              onChange={(e) => handleWeightChange('layover', Number(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={weights.layover}
              aria-invalid={!!fieldErrors['layover']}
              aria-describedby={fieldErrors['layover'] ? `${formId}-layover-err` : undefined}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {fieldErrors['layover'] && (
              <p id={`${formId}-layover-err`} className="text-xs text-red-400 mt-1">
                {fieldErrors['layover']}
              </p>
            )}
          </div>

          {/* Carrier Weight */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label htmlFor={`${formId}-carrier`} className="text-slate-300 font-medium">
                Airline Reliability ($w_{'{carrier}'}$)
              </label>
              <span className="text-slate-400 font-mono">{weights.carrier}%</span>
            </div>
            <input
              id={`${formId}-carrier`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={weights.carrier}
              onChange={(e) => handleWeightChange('carrier', Number(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={weights.carrier}
              aria-invalid={!!fieldErrors['carrier']}
              aria-describedby={fieldErrors['carrier'] ? `${formId}-carrier-err` : undefined}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {fieldErrors['carrier'] && (
              <p id={`${formId}-carrier-err`} className="text-xs text-red-400 mt-1">
                {fieldErrors['carrier']}
              </p>
            )}
          </div>

          {/* Eco Weight */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label htmlFor={`${formId}-eco`} className="text-slate-300 font-medium">
                Carbon / Eco-Efficiency ($w_{'{eco}'}$)
              </label>
              <span className="text-slate-400 font-mono">{weights.eco}%</span>
            </div>
            <input
              id={`${formId}-eco`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={weights.eco}
              onChange={(e) => handleWeightChange('eco', Number(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={weights.eco}
              aria-invalid={!!fieldErrors['eco']}
              aria-describedby={fieldErrors['eco'] ? `${formId}-eco-err` : undefined}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {fieldErrors['eco'] && (
              <p id={`${formId}-eco-err`} className="text-xs text-red-400 mt-1">
                {fieldErrors['eco']}
              </p>
            )}
          </div>
        </fieldset>

        {/* Fieldset 2: Routing & Currency Constraints */}
        <fieldset className="border border-slate-700/80 rounded-lg p-4 space-y-4 bg-slate-850">
          <legend className="px-2 text-sm font-semibold text-blue-400">
            Routing & Display Parameters
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred Currency */}
            <div className="space-y-1">
              <label htmlFor={`${formId}-currency`} className="block text-sm font-medium text-slate-300">
                Display Currency
              </label>
              <select
                id={`${formId}-currency`}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            {/* Max Stops */}
            <div className="space-y-1">
              <label htmlFor={`${formId}-max-stops`} className="block text-sm font-medium text-slate-300">
                Maximum Stops Allowed
              </label>
              <input
                id={`${formId}-max-stops`}
                type="number"
                min={0}
                max={3}
                step={1}
                value={maxStops}
                onChange={(e) => setMaxStops(parseInt(e.target.value, 10) || 0)}
                aria-invalid={!!fieldErrors['maxStops']}
                aria-describedby={fieldErrors['maxStops'] ? `${formId}-stops-err` : undefined}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors['maxStops'] && (
                <p id={`${formId}-stops-err`} className="text-xs text-red-400 mt-1">
                  {fieldErrors['maxStops']}
                </p>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prioritizeDirect}
                onChange={(e) => setPrioritizeDirect(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Strictly prioritize direct flights where available</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={strictCarbonLimit}
                onChange={(e) => setStrictCarbonLimit(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Highlight itineraries below average carbon threshold (≤120g CO2/km)</span>
            </label>
          </div>
        </fieldset>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-750 text-slate-300 text-sm font-medium transition"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition"
          >
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </section>
  );
}
