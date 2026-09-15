'use client';

import React from 'react';
import { X, Lock, Mail, User, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onDemoLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  email,
  setEmail,
  name,
  setName,
  error,
  onSubmit,
  onDemoLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-white">
            Sign In to FlyRank
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access personalized scoring weights, saved itineraries, and alert history.
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          onClick={onDemoLogin}
          className="w-full mb-5 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Instant One-Click Demo Traveler</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            Or With Email
          </span>
        </div>

        {/* Error notice */}
        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email-input" className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Email Address
            </label>
            <input
              id="auth-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div>
            <label htmlFor="auth-name-input" className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Your Name (Optional)
            </label>
            <input
              id="auth-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            Continue to Account
          </button>
        </form>
      </div>
    </div>
  );
};
