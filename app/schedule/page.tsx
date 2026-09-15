"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plane,
  Building,
  User,
  Mail,
  Sparkles,
  Download,
} from "lucide-react";

export default function SchedulePage() {
  const [persona, setPersona] = useState<string>("corporate");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [date, setDate] = useState<string>("2026-10-20");
  const [timeSlot, setTimeSlot] = useState<string>("14:00 UTC");
  const [notes, setNotes] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([
    "Custom Scoring Weights",
    "Carbon Tracking & ESG",
  ]);

  const [confirmed, setConfirmed] = useState<boolean>(false);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setConfirmed(true);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FlyRank Inc//FlyRank Demo//EN
BEGIN:VEVENT
UID:demo-${Date.now()}@flyrank.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${date.replace(/-/g, "")}T140000Z
DTEND:${date.replace(/-/g, "")}T144500Z
SUMMARY:FlyRank v0.1 W3 Intelligent Utility Architecture Walkthrough
DESCRIPTION:Product demonstration for ${name} (${company}). Topics: ${interests.join(
      ", "
    )}.
LOCATION:FlyRank Virtual Meeting Room (Google Meet)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FlyRank_Demo_${date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="text-cyan-400 font-medium">Schedule Demo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Schedule a FlyRank Demonstration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Experience how multi-attribute flight ranking reduces corporate travel friction and carbon footprints.
          </p>
        </div>
      </div>

      {confirmed ? (
        /* Confirmation Screen */
        <div className="glass-card rounded-2xl p-8 sm:p-12 border border-emerald-500/40 shadow-2xl text-center flex flex-col items-center gap-5 animate-in zoom-in-95">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Demo Reservation Confirmed!
          </h2>
          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Thank you, <strong className="text-white">{name}</strong>. Your FlyRank v0.1 W3 product walkthrough has been scheduled for{" "}
            <strong className="text-cyan-400">{date} at {timeSlot}</strong>. A confirmation invite will be sent to <span className="text-slate-200">{email}</span>.
          </p>

          {/* Details Pill */}
          <div className="rounded-xl bg-navy-950 p-4 border border-navy-800 text-xs text-left w-full max-w-md flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Host:</span>
              <span className="text-white font-medium">FlyRank Engineering Team</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Organization:</span>
              <span className="text-white font-medium">{company || "Independent"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Topics:</span>
              <span className="text-cyan-300 font-medium text-right">
                {interests.join(", ")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleDownloadCalendar}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-95"
            >
              <Download className="h-4 w-4" />
              <span>Download Calendar (.ics)</span>
            </button>
            <button
              onClick={() => setConfirmed(false)}
              className="rounded-xl border border-navy-700 bg-navy-900 px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              Schedule Another Demo
            </button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800 shadow-2xl flex flex-col gap-6"
        >
          {/* Persona selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">
              Select Your Traveler / Organization Profile:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "corporate", label: "Corporate Travel", icon: Building },
                { id: "individual", label: "Frequent Traveler", icon: User },
                { id: "airline", label: "Airline / Alliance", icon: Plane },
                { id: "developer", label: "API Developer", icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                const isSel = persona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPersona(item.id)}
                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium border transition-all ${
                      isSel
                        ? "bg-brand-600/20 text-cyan-300 border-cyan-500/50 shadow-sm"
                        : "bg-navy-900 text-slate-400 border-navy-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-medium text-slate-300">
                Your Full Name *
              </label>
              <input
                id="name"
                required
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-300">
                Work or Travel Email *
              </label>
              <input
                id="email"
                required
                type="email"
                placeholder="e.g. alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-xs font-medium text-slate-300">
                Company / Organization
              </label>
              <input
                id="company"
                type="text"
                placeholder="e.g. Acme Travel Group"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-xs font-medium text-slate-300">
                Preferred Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">
              Select Time Slot (45-Minute Deep Dive):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["10:00 UTC", "14:00 UTC", "17:00 UTC", "21:00 UTC"].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`rounded-lg py-2 text-xs font-medium border text-center transition-colors ${
                    timeSlot === slot
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-navy-900 text-slate-400 border-navy-800 hover:text-white"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Checkbox Grid */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">
              Topics You Would Like Covered:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Custom Scoring Weights",
                "Carbon Tracking & ESG",
                "Layover Fatigue Mitigation",
                "Comparison Drawer Integration",
                "Enterprise API & Webhooks",
                "Portfolio Export & Expense Sync",
              ].map((topic) => {
                const checked = interests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={`flex items-center gap-2 rounded-lg p-2.5 text-xs border text-left transition-colors ${
                      checked
                        ? "bg-brand-600/15 text-cyan-300 border-cyan-500/40"
                        : "bg-navy-900/60 text-slate-400 border-navy-800 hover:text-slate-200"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center ${
                        checked
                          ? "bg-cyan-500 border-cyan-500 text-navy-950"
                          : "border-slate-600"
                      }`}
                    >
                      {checked && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-xs font-medium text-slate-300">
              Additional Notes or Specific Use Case (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="e.g. We are evaluating FlyRank for a 500-person remote company..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-6 py-3 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-all"
            >
              Confirm Demonstration Booking
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
