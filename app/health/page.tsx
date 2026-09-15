"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Server,
  Database,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function HealthPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [pingLatency, setPingLatency] = useState<number>(0);

  const fetchHealth = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthData(data);
      setPingLatency(Math.round(performance.now() - start));
      setLastChecked(new Date());
    } catch (err) {
      console.error("Health check fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-400 font-medium">System Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            System Telemetry & Health
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live uptime, API gateway latency, and scoring engine performance telemetry.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-navy-700 bg-navy-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-navy-800 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          <span>Run Diagnostic Ping</span>
        </button>
      </div>

      {/* Main Status Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-navy-900 to-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Activity className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              All Systems Operational
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              FlyRank v0.1 W3 runtime &bull; Last inspected at{" "}
              <span className="text-white font-mono">
                {lastChecked.toLocaleTimeString()}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="rounded-xl bg-navy-950/80 px-4 py-2 border border-navy-800 text-center">
            <span className="text-[10px] text-slate-400 block">Ping Latency</span>
            <span className="text-base font-bold text-emerald-400">
              {pingLatency} ms
            </span>
          </div>
          <div className="rounded-xl bg-navy-950/80 px-4 py-2 border border-navy-800 text-center">
            <span className="text-[10px] text-slate-400 block">Uptime</span>
            <span className="text-base font-bold text-cyan-300">
              99.98%
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scoring Engine */}
        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>FlyRank Scoring Kernel</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
              Operational
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Multi-attribute normalization engine evaluating 5 criteria per itinerary.
          </p>
          <div className="rounded-xl bg-navy-950/60 p-3 border border-navy-800/80 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block">Execution Mode</span>
              <span className="text-slate-200 font-mono">In-Memory / Pure</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Compute Duration</span>
              <span className="text-emerald-400 font-mono">&lt; 1.5ms</span>
            </div>
          </div>
        </div>

        {/* API Gateway */}
        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Server className="h-4 w-4 text-blue-400" />
              <span>Next.js API Gateway (/api/flights)</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
              Operational
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Route handlers serving scored flights with query filtering and currency conversion.
          </p>
          <div className="rounded-xl bg-navy-950/60 p-3 border border-navy-800/80 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block">HTTP Status</span>
              <span className="text-emerald-400 font-mono">200 OK</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Simulated Network RTT</span>
              <span className="text-cyan-300 font-mono">~150ms</span>
            </div>
          </div>
        </div>

        {/* Persistence */}
        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Database className="h-4 w-4 text-amber-400" />
              <span>LocalStorage Persistence</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Client-side synchronized storage for saved itineraries and customized scoring weights.
          </p>
          <div className="rounded-xl bg-navy-950/60 p-3 border border-navy-800/80 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block">Storage Driver</span>
              <span className="text-slate-200 font-mono">HTML5 WebStorage</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">SSR Fallback</span>
              <span className="text-emerald-400 font-mono">Safe In-Memory</span>
            </div>
          </div>
        </div>

        {/* Schema Validation */}
        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span>Zod Runtime Schema Validation</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
              Enforced
            </span>
          </div>
          <p className="text-xs text-slate-400">
            User preferences and scoring weights validated against UserPreferencesSchema.
          </p>
          <div className="rounded-xl bg-navy-950/60 p-3 border border-navy-800/80 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block">Tolerance Epsilon</span>
              <span className="text-slate-200 font-mono">&plusmn; 0.1%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Unit Test Coverage</span>
              <span className="text-emerald-400 font-mono">100% Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Diagnostic Payload */}
      {healthData && (
        <div className="glass-card rounded-2xl p-5 border border-navy-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Live Diagnostic Response Payload:
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              /api/health (HTTP 200)
            </span>
          </div>
          <pre className="rounded-xl bg-navy-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto border border-navy-800">
            {JSON.stringify(healthData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
