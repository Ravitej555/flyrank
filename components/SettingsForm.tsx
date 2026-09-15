'use client';

import React, { useState } from 'react';

// Single vague prompt output: "Build a settings form with validation for flight ranking preferences."
export default function SettingsForm({ onSave }: { onSave?: any }) {
  const [price, setPrice] = useState('40');
  const [duration, setDuration] = useState('25');
  const [layover, setLayover] = useState('15');
  const [carrier, setCarrier] = useState('10');
  const [eco, setEco] = useState('10');
  const [currency, setCurrency] = useState('USD');
  const [maxStops, setMaxStops] = useState('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Naive string-to-number parsing and strict equality check
    const p = parseFloat(price);
    const d = parseFloat(duration);
    const l = parseFloat(layover);
    const c = parseFloat(carrier);
    const ec = parseFloat(eco);

    if (isNaN(p) || isNaN(d) || isNaN(l) || isNaN(c) || isNaN(ec)) {
      setError('All weights must be valid numbers.');
      return;
    }

    // AI Mistake / Flaw: Strict float equality check without epsilon tolerance
    // If user inputs 33.3 + 33.3 + 33.4 = 100.00000000000001, this fails!
    const total = p + d + l + c + ec;
    if (total !== 100) {
      setError(`Weights must sum to exactly 100. Current total: ${total}`);
      return;
    }

    if (p < 0 || d < 0 || l < 0 || c < 0 || ec < 0) {
      setError('Weights cannot be negative.');
      return;
    }

    const config = {
      weights: { price: p, duration: d, layover: l, carrier: c, eco: ec },
      currency,
      maxStops: parseInt(maxStops, 10),
    };

    if (onSave) {
      onSave(config);
    }
    setSuccess(true);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md max-w-lg mx-auto my-8 text-white">
      <h2 className="text-xl font-bold mb-4">Flight Ranking Settings</h2>

      {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-500 text-white p-3 rounded mb-4">Settings saved successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div>Price Weight (%):</div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white"
          />
        </div>

        <div>
          <div>Duration Weight (%):</div>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white"
          />
        </div>

        <div>
          <div>Layover Weight (%):</div>
          <input
            type="number"
            value={layover}
            onChange={(e) => setLayover(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white"
          />
        </div>

        <div>
          <div>Carrier Reliability (%):</div>
          <input
            type="number"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white"
          />
        </div>

        <div>
          <div>Eco / Carbon Weight (%):</div>
          <input
            type="number"
            value={eco}
            onChange={(e) => setEco(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white"
          />
        </div>

        <div>
          <div>Preferred Currency:</div>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white"
          />
        </div>

        <div>
          <div>Max Stops:</div>
          <input
            type="number"
            value={maxStops}
            onChange={(e) => setMaxStops(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
