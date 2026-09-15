# ✈️ FlyRank — Intelligent Multi-Criteria Flight Search & Ranking Platform

> **Week 3 (W3) Full-Stack Next.js 15 App Router Architecture**  
> Candidate: **Ravitej Manu**  
> Track: **FlyRank AI Internship — Frontend AI Engineering (Week 3)**  
> Repository: [https://github.com/Ravitej555/flyrankweek3](https://github.com/Ravitej555/flyrankweek3)

---

## 🌟 Executive Summary

FlyRank transitions traditional single-metric online travel agency (OTA) flight search into a **multi-attribute utility ranking engine**. Instead of forcing users to sort solely by raw ticket price—frequently recommending grueling 14-hour overnight layovers just to save $30—FlyRank balances **Fare, Total Travel Duration, Piecewise Layover Friction, Carrier Reliability, and Carbon Footprint** into an optimal composite utility score:

$$\text{FlyRank Score} = \frac{\sum_{i=1}^{n} w_i \times S_i}{\sum_{i=1}^{n} w_i} \quad \text{where } S_i \in [0, 100]$$

---

## 🚀 Key Route Modules & Features Delivered

1. **Interactive Simulation & OTA Comparison (`/demo`)**
   - Side-by-side comparative simulator contrasting legacy price-only sorting with FlyRank’s multi-attribute ranking.
   - 4 built-in real-world traveler scenarios:
     - *The $30 Savings Trap*: 14h overnight layover vs direct flight.
     - *Tight Connection Sprint Risk*: 35-minute transfer with 48% missed connection risk.
     - *The Sustainable Traveler*: Carbon benchmarking with high eco-scoring.
     - *Corporate Road Warrior*: Punctuality and duration optimization.
   - Animated 5-step evaluation pipeline explaining raw normalization, piecewise layover U-curves, and linear weighting.

2. **Flight Search & Real-Time Ranking Matrix (`/flights`)**
   - Dynamic real-time scoring evaluating fare, duration, layover friction, and carrier on-time rate.
   - Instant utility presets: *Balanced*, *Budget First*, *Speed First*, *Eco First*.
   - Carrier and stop filtering, collapsible score breakdowns, and floating comparison drawer.

3. **Multi-Itinerary Comparison Matrix (`/compare`)**
   - Deep side-by-side matrix comparing up to 4 itineraries with category champion badges (*Lowest Fare*, *Fastest*, *Top Rated*, *Cleanest*, *Top Utility*).
   - Integrated booking simulator and confirmation receipt modal.

4. **Saved Itineraries & Portfolio Analytics (`/saved`)**
   - Persistent portfolio tracking with aggregate metrics (mean FlyRank utility score, total travel duration, average fare).
   - One-click **CSV & JSON export** capabilities.

5. **WCAG-Accessible Custom Scoring Matrix (`/settings`)**
   - Accessible settings form with strict **Zod runtime schema validation**, live sum check, weight sliders, and synchronized `localStorage` persistence.

6. **Mathematical Rigor & Treatise (`/philosophy`)**
   - Formal mathematical specification of all normalization formulas with an **Interactive Math Sandbox**.

7. **Demonstration Scheduling (`/schedule`)**
   - Enterprise and individual demo scheduler with traveler persona selection, time slot picker, and **Calendar (.ics) export**.

8. **Telemetry & Diagnostic Health (`/health`)**
   - Real-time status monitoring with API ping latency, kernel calculation speed (<1.5ms), and live `/api/health` diagnostic ping.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15.1.0 (React 19, App Router)
- **Language**: TypeScript 5.7 (Strict Mode)
- **Styling**: Tailwind CSS, PostCSS, Lucide React
- **Validation**: Zod 3.24
- **Testing**: Vitest 5.0, React Testing Library, JSDOM

---

## 🧪 Quality & Test Metrics

- **TypeScript Strict Mode**: 0 errors (`npm run typecheck`)
- **Vitest Unit & Integration Tests**: 22 passed across 5 test suites (`npm test`)
- **Next.js Production Build**: 13 static & dynamic routes compiled cleanly (`npm run build`)

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Ravitej555/flyrankweek3.git
cd flyrankweek3

# Install dependencies
npm install

# Run tests
npm test

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore FlyRank.
