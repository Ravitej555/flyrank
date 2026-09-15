# FlyRank — Assignment Submission: Week 3 (W3) Full-Stack App Router & Multi-Criteria Utility Architecture

**Student / Candidate:** Ravitej Manu  
**Track:** FlyRank AI Internship — Frontend AI Engineering (Week 3)  
**Project:** FlyRank (Intelligent Multi-Criteria Flight Search, Ranking & Utility Platform)  
**Repository Branch:** [https://github.com/Ravitej555/flyrank/tree/feat/w3-app-router](https://github.com/Ravitej555/flyrank/tree/feat/w3-app-router)  
**Pull Request:** [https://github.com/Ravitej555/flyrank/pull/new/feat/w3-app-router](https://github.com/Ravitej555/flyrank/pull/new/feat/w3-app-router)  
**Primary Repository:** [https://github.com/Ravitej555/flyrank](https://github.com/Ravitej555/flyrank)  

---

## 1. Executive Summary & Week 3 Milestones

In Week 3, FlyRank was evolved from a tabbed prototype into a production-ready, full-stack **Next.js 15 App Router** multi-page architecture with deep route-level modularity, high-impact glassmorphic design, and extensive interactive tooling.

### Core Innovations Delivered:
1. **Interactive Live Demonstration (`/demo`)**:
   - Side-by-side comparative simulation contrasting traditional OTA price-only sorting with FlyRank multi-attribute utility ranking.
   - 4 real-world scenario simulations (*The $30 Savings Trap: 14h Overnight Layover vs Direct*, *Tight Connection Sprint Risk*, *The Sustainable Traveler*, *Corporate Road Warrior*).
   - 5-step animated evaluation pipeline explaining raw ingestion, logarithmic price normalization, piecewise layover U-curves, carbon benchmarking, and linear weighted summation.
2. **Flight Search & Dynamic Ranking (`/flights`)**:
   - Real-time multi-dimensional scoring evaluating fare, duration, layover friction, and carrier reliability.
   - Quick utility presets (*Balanced*, *Budget First*, *Speed First*, *Eco First*).
   - Stops and airline filtering with collapsible score breakdown cards and floating comparison drawer.
3. **Side-by-Side Comparison Matrix (`/compare`)**:
   - Detailed matrix comparing up to 4 itineraries with category champion highlights (*Lowest Fare*, *Fastest*, *Top Rated*, *Cleanest*, *Top Utility*) and a booking simulator confirmation receipt.
4. **Saved Itineraries & Portfolio Analytics (`/saved`)**:
   - Portfolio tracking with aggregate metrics (mean FlyRank utility score, total travel duration, average fare) and one-click **CSV & JSON export** capabilities.
5. **WCAG-Accessible Scoring Matrix (`/settings`)**:
   - Accessible settings form with strict **Zod runtime schema validation**, live sum check, weight sliders, and synchronized `localStorage` persistence.
6. **Rigor & Math Treatise (`/philosophy`)**:
   - Comprehensive documentation of the mathematical model $\text{FlyRank Score} = \frac{\sum w_i \times S_i}{\sum w_i}$ with an **Interactive Math Sandbox**.
7. **Demonstration Scheduling (`/schedule`)**:
   - Enterprise and individual demo scheduler with traveler persona selection, time slot picker, and **Calendar (.ics) export**.
8. **System Health & Telemetry (`/health`)**:
   - Real-time status monitoring with API ping latency, kernel calculation speed (<1.5ms), and live `/api/health` diagnostic ping.
9. **API Route Handlers (`/api/health` & `/api/flights`)**:
   - Clean Next.js 15 API routes serving scored flight itineraries and system telemetry.

---

## 2. Verification & Test Metrics

- **TypeScript Strict Mode**: 0 errors (`npm run typecheck`).
- **Vitest Test Suite**: 22 passed across 5 test suites (100% pass rate).
- **Next.js 15 Production Build**: 13 static and dynamic routes compiled cleanly (`npm run build`).
- **Development Server**: Verified running live at `http://localhost:3000`.

---

## 3. Technology Stack

- **Framework**: Next.js 15.1.0 (React 19, App Router)
- **Language**: TypeScript 5.7 (Strict Mode)
- **Styling**: Tailwind CSS, PostCSS, Lucide React
- **Validation**: Zod 3.24 (Runtime schema validation)
- **Testing**: Vitest 5.0, React Testing Library, JSDOM
