# FlyRank — Assignment Submission: AI-Assisted React Development

**Student / Candidate:** Ravitej Manu  
**Track:** FlyRank AI Internship — Frontend AI Engineering  
**Mentor Session Reference:** [React Frontend Development with AI /w Ishak](https://www.youtube.com/watch?v=pYhYlcmFOwU)  
**Primary Project:** FlyRank (Flight Search & Multi-Criteria Ranking Platform)  
**Repository:** [https://github.com/Ravitej555/flyrank](https://github.com/Ravitej555/flyrank)  

---

## 1. The Completed Application

### Project Overview
**FlyRank** is an intelligent flight ranking and comparison application built with **React 19**, **Next.js 15 (App Router)**, **TypeScript (Strict Mode)**, **Tailwind CSS**, **Zod**, and **Vitest**. 

While traditional flight engines sort solely by sticker price—ignoring grueling 14-hour overnight layovers, unfavorable departure times, and carrier cancellation rates—FlyRank computes a multi-dimensional utility score:

$$\text{FlyRank Score} = \sum_{i=1}^{n} w_i \times S_i$$

Where criteria include:
- **Price Utility ($S_{\text{price}}$)**: Inverse log-normalized fare vs. route median.
- **Duration Efficiency ($S_{\text{duration}}$)**: Travel time penalty relative to non-stop flights.
- **Layover Comfort ($S_{\text{layover}}$)**: Heavy penalty for tight connection risk ($<60\text{ min}$) and fatigue ($>4\text{ hrs}$).
- **Carrier Reliability ($S_{\text{carrier}}$)**: Airline on-time performance and consumer ratings (0–10).
- **Carbon Impact ($S_{\text{eco}}$)**: Estimated $\text{CO}_2$ emissions per passenger trip.

### Architectural Pattern: MVVM (Model-View-ViewModel)
Directly mirroring the architectural principles demonstrated by **Mentor Ishak** in the tutorial session, the codebase strictly separates responsibilities into four decoupled layers:

```text
┌─────────────────────────────────────────────────────────────┐
│                 VIEWS (Presentational UI)                   │
│   Navbar, FlightSearchHero, FlightCard, ComparisonDrawer,   │
│                 FavouritesView, AuthModal                   │
└──────────────────────────────▲──────────────────────────────┘
                               │ State, Handlers, Bindings
┌──────────────────────────────┴──────────────────────────────┐
│                  VIEWMODELS (Custom Hooks)                  │
│    useFlightSearchViewModel, useFavouritesViewModel,        │
│                      useAuthViewModel                       │
└──────────────────────────────▲──────────────────────────────┘
                               │ Domain Operations
┌──────────────────────────────┴──────────────────────────────┐
│                    MODELS (Business Logic)                  │
│      FlightModel, FavouritesModel, AuthModel, scoring       │
└──────────────────────────────▲──────────────────────────────┘
                               │ Ingestion & I/O
┌──────────────────────────────┴──────────────────────────────┐
│                   SERVICES (Data & Storage)                 │
│         flightService, savedFlightsService, authService     │
└─────────────────────────────────────────────────────────────┘
```

1. **Services Layer (`lib/services/`)**:
   - `flightService.ts`: Ingestion and simulated network API with realistic airline routes (JFK ⇄ LHR, SFO ⇄ HND, DXB ⇄ CDG, BLR ⇄ SIN), realistic stops, and emission data.
   - `savedFlightsService.ts`: Local storage persistence engine with SSR-safe in-memory fallback.
   - `authService.ts`: Session management supporting guest and one-click demo traveler authentication.
2. **Models Layer (`lib/models/`)**:
   - `FlightModel.ts`: Pure business logic for flight filtering, sorting, and dynamic FlyRank score evaluation.
   - `FavouritesModel.ts`: Bookmarking logic, deduplication, and aggregate statistics calculation (average score, average fare, total duration).
   - `AuthModel.ts`: Validation and session lifecycle.
   - `scoring.ts`: Deterministic Multi-Attribute Utility (MAU) scoring engine.
3. **ViewModels Layer (`lib/viewmodels/`)**:
   - `useFlightSearchViewModel.ts`: Reactive state for search queries, filter thresholds, dynamic weight tuning, and comparison selections.
   - `useFavouritesViewModel.ts`: Reactive state for saved flights and aggregate metrics.
   - `useAuthViewModel.ts`: Reactive state for auth modal, credentials, and demo sign-in.
4. **Views Layer (`components/` & `app/`)**:
   - `Navbar.tsx`: Responsive navigation with active tab indicators and badge counts.
   - `FlightSearchHero.tsx`: Accessible IATA input controls, swap functionality, date picker, and popular route chips.
   - `FlightCard.tsx`: Rich itinerary presentation displaying ranking ribbons, 0–100 score badges, layover warnings, carbon badges, and expandable score breakdown progress bars.
   - `ComparisonDrawer.tsx`: Side-by-side comparison modal highlighting best-in-class metrics across up to 3 flights.
   - `FavouritesView.tsx`: Dedicated dashboard for bookmarked flights with summary analytics.
   - `SettingsForm.tsx`: Zod-validated interactive weight adjuster sliders with WCAG AA compliance.

---

## 2. Prompts Used During Development

Below is the chronological sequence of engineering prompts utilized during development, structured according to the prompt-driven workflow taught by Mentor Ishak:

### Prompt 1: Multi-Attribute Utility Scoring Engine & Mathematical Formulation
```text
Write a pure, deterministic TypeScript scoring engine inside `lib/scoring.ts` to compute a FlyRank Score (0-100) for a FlightItinerary object.
Requirements:
- Accept RankingWeights: price (default 40), duration (default 25), layover (default 15), carrier (default 10), eco (default 10).
- Normalize price: $200 benchmark = 100, $1000 = 0.
- Normalize duration: 2h benchmark = 100, 18h = 0.
- Score layovers: 0 stops = 100; layovers < 60 min = 40 (tight connection risk); 1-3 hrs = 85; > 4 hrs heavily penalized down to 10.
- Carrier rating: 0-10 mapped to 0-100.
- Eco score: 50kg CO2 = 100, 500kg = 0.
- Return both the rounded final composite score and a granular ScoreBreakdown.
- Do not use React hooks or side effects. Include unit tests in `lib/scoring.test.ts`.
```

### Prompt 2: Service Layer & Realistic Data Engine
```text
Create the Services Layer for FlyRank following the architectural pattern shown in Mentor Ishak's React session:
1. `lib/services/flightService.ts`:
   - Define FlightSearchParams and export POPULAR_ROUTES presets (JFK-LHR, SFO-HND, DXB-CDG, BLR-SIN, ORD-FRA).
   - Export MOCK_FLIGHT_CATALOG containing 12 realistic flights with diverse airlines (British Airways, Emirates, Norse Atlantic, Singapore Airlines, etc.), prices, durations, stops, layover times, and CO2 emissions.
   - Export async `fetchFlights(params)` simulating network latency (150ms).
2. `lib/services/savedFlightsService.ts`:
   - Implement getSavedFlights, saveFlight, removeSavedFlight, and isFlightSaved.
   - Store data in localStorage with an in-memory fallback for Next.js SSR.
3. `lib/services/authService.ts`:
   - Implement getCurrentUser, loginUser, loginAsDemo, and logoutUser.
```

### Prompt 3: Models Layer (Pure Business Logic)
```text
Implement the domain Models Layer:
1. `lib/models/FlightModel.ts`:
   - Implement `getRankedFlights(params, weights, sortBy)` that queries flightService, calls computeFlyRankScore for each flight, and sorts results.
   - Implement `sortFlights(flights, criterion)` supporting 'flyrank', 'price', 'duration', and 'eco'.
   - Implement `applyFilters(flights, filters)` supporting maxStops, prioritizeDirect, maxPrice, and selectedAirlines.
   - Implement `recalculateScores(flights, weights, sortBy)` for instant in-memory recalculation without refetching.
2. `lib/models/FavouritesModel.ts`:
   - Implement loadFavourites, toggleFavourite, removeFavourite, and isSaved.
   - Implement `getStats(favourites)` calculating averageScore, averagePrice, and averageDurationMinutes.
```

### Prompt 4: ViewModels Layer (Custom React Hooks)
```text
Create the MVVM custom hooks inside `lib/viewmodels/`:
1. `useFlightSearchViewModel.ts`:
   - Manage origin, destination, date, passengers, weights, sortBy, and filter state.
   - Provide executeSearch, updateWeights (with real-time recalculation), updateSortBy, updateFilters, selectPopularRoute, swapAirports, and toggleComparison.
2. `useFavouritesViewModel.ts`:
   - Manage saved flights state, aggregate stats, toggleFavourite, and removeFavourite.
   - Synchronize with the 'storage' event for multi-tab reactivity.
3. `useAuthViewModel.ts`:
   - Manage user profile state, auth modal visibility, email/name inputs, handleLogin, handleDemoLogin, and handleLogout.
```

### Prompt 5: Presentational Components (Views)
```text
Build the presentational UI components:
1. `components/Navbar.tsx`:
   - Accessible header with tabs: 'Explore Flights', 'Saved Itineraries', 'Compare', and 'Scoring Weights'.
   - Badges showing counts for saved flights and comparison items.
   - User profile badge or 'Sign In / Demo' CTA.
2. `components/FlightSearchHero.tsx`:
   - Inputs for origin, destination, departure date, and passengers.
   - Airport swap button and popular route preset pill buttons.
3. `components/FlightCard.tsx`:
   - Display airline, flight number, duration, stops badge, layover risk warning (<60m), and carbon emissions.
   - Render the FlyRank Score badge (0-100) with color tiering (Emerald for >=85, Cyan for >=72, Amber for >=60).
   - Action buttons: Favourite toggle (heart), Compare toggle (scale), and Score Breakdown expander (showing progress bars for all 5 dimensions).
4. `components/ComparisonDrawer.tsx`:
   - Side-by-side comparison modal comparing up to 3 flights with best-in-class highlights.
5. `components/FavouritesView.tsx`:
   - Summary statistics cards (Average FlyRank, Average Fare, Average Duration) and list of saved cards.
6. `components/AuthModal.tsx`:
   - Accessible modal with email login and one-click demo traveler sign-in.
```

### Prompt 6: Application Assembly & Integration
```text
Assemble the full application inside `app/page.tsx`:
- Connect Navbar, FlightSearchHero, FlightCard, ComparisonDrawer, FavouritesView, AuthModal, and SettingsForm.
- Allow seamless tab switching between Search, Saved, Compare, and Settings.
- When the user saves custom weights in SettingsForm, update the search ViewModel's active weights so flights immediately re-rank in real time.
- Ensure strict TypeScript typing and WCAG AA accessibility.
```

---

## 3. How AI Assisted Throughout Implementation

Using the **Task Classification Framework** introduced in Ethan Mollick's *"On-boarding your AI Intern"* (and documented in our Phase 1 Audit):

| Classification | Tasks Executed | AI Role & Human Oversight |
| :--- | :--- | :--- |
| **Collaborate with AI** | Mathematical formulation of the FlyRank MAU scoring function (`lib/scoring.ts`) | We co-designed the normalization curves (log-scaled price curve vs. linear duration) and connection risk penalties through iterative brainstorming. |
| **Delegate to AI with Review** | MVVM scaffolding, TypeScript contracts (`types.ts`), and mock dataset generation (`flightService.ts`) | AI drafted the boilerplate and data shapes; we reviewed the fields for realistic aviation numbers (fuel burn, layover times). |
| **Delegate to AI with Review** | Authoring Vitest unit tests (`tests/flightModel.test.ts`, `tests/favouritesModel.test.ts`) | AI generated test matrices and boundary conditions; we verified test assertion validity. |
| **Fully Automate** | Next.js build verification, Tailwind utility classes, and TypeScript typechecking | AI ran `npm run typecheck` and `npm run build` directly via terminal tooling to verify zero compilation errors. |

### Strategic Advantages of AI Pairing
1. **Rapid Architectural Prototyping**: Generating the complete MVVM layer structure (3 services, 3 models, 3 viewmodels, 6 components) was accomplished in minutes while maintaining architectural consistency.
2. **Comprehensive Edge-Case Brainstorming**: AI helped identify subtle airline edge cases—such as tight connection risks under 60 minutes and multi-day layover fatigue penalties.
3. **Explaining Trade-offs**: When designing the comparison drawer, AI suggested best-in-class attribute badges (e.g. `Lowest Price`, `Fastest`, `Greenest`) to make side-by-side evaluation instantly scannable.

---

## 4. Manual Improvements, Corrections & Refactoring Performed After Reviewing AI Code

Direct unguided AI generation consistently introduces subtle logical flaws, accessibility omissions, and coupling traps. Below are five concrete instances of manual engineering corrections applied during this build:

### Correction 1: Floating-Point Equality Trap in Weight Normalization
- **AI-Generated Flaw**: When validating that user weight sliders sum to 100%, the initial AI output used strict equality:
  ```typescript
  // AI-generated:
  const isValid = weights.price + weights.duration + weights.layover + weights.carrier + weights.eco === 100;
  ```
  In JavaScript (IEEE 754 floating-point arithmetic), a valid distribution such as `33.3 + 33.3 + 33.4` produces `100.00000000000001`, causing valid user inputs to fail validation silently.
- **Manual Engineering Correction**: We injected a defined tolerance epsilon inside the Zod schema refinement:
  ```typescript
  // Corrected implementation (lib/validations/settings.ts):
  export const WEIGHT_TOLERANCE_EPSILON = 0.05;

  export const RankingWeightsSchema = z.object({ ... }).refine(
    (weights) => {
      const sum = weights.price + weights.duration + weights.layover + weights.carrier + weights.eco;
      return Math.abs(sum - 100) <= WEIGHT_TOLERANCE_EPSILON;
    },
    (weights) => ({
      message: `Ranking weights must sum to exactly 100% (currently ${sum}%).`,
      path: ['total'],
    })
  );
  ```

---

### Correction 2: WCAG 2.1 AA Accessibility & Screen-Reader Error Linkage
- **AI-Generated Flaw**: The initial UI generated by AI had generic `<div onClick>` elements, unlabeled inputs, and detached error text:
  ```html
  <!-- AI-generated -->
  <div>Origin:</div>
  <input type="text" value={origin} />
  {error && <div>{error}</div>}
  ```
  Screen readers were incapable of announcing which input failed validation or what values sliders held.
- **Manual Engineering Correction**: We systematically upgraded all form controls:
  - Added explicit `<label htmlFor={uniqueId}>` to all inputs.
  - Linked error messages using `aria-describedby={errorId}` and `aria-invalid={true}`.
  - Added `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` to sliders.
  - Wrapped dynamic calculations (such as the live total weight sum) in `role="status"` and `aria-live="polite"`.

---

### Correction 3: Decoupling Scoring Logic into Pure Headless Models
- **AI-Generated Flaw**: In early iterations, AI attempted to inline the flight ranking and scoring logic directly inside the `useFlightSearchViewModel` hook. This coupled business calculations to React's lifecycle and prevented running headless unit tests in Vitest without mocking React hooks.
- **Manual Engineering Correction**: We decoupled all algorithmic operations into pure static methods in `lib/models/FlightModel.ts`:
  - `FlightModel.getRankedFlights()`
  - `FlightModel.sortFlights()`
  - `FlightModel.applyFilters()`
  - `FlightModel.recalculateScores()`
  
  This allowed us to write lightning-fast, headless Vitest tests in `tests/flightModel.test.ts` that execute in under 15ms.

---

### Correction 4: Next.js SSR LocalStorage Hydration Safety
- **AI-Generated Flaw**: AI used direct calls to `localStorage.getItem()` at module or component initialization:
  ```typescript
  // AI-generated:
  const saved = JSON.parse(localStorage.getItem('saved_flights') || '[]');
  ```
  In Next.js 15 App Router Server Components, this throws `ReferenceError: localStorage is not defined` during SSR and static page prerendering (`next build`).
- **Manual Engineering Correction**: In `lib/services/savedFlightsService.ts` and `lib/services/authService.ts`, we implemented defensive guards with an in-memory fallback:
  ```typescript
  // Corrected implementation:
  let inMemoryFavorites: FlightItinerary[] = [];

  export function getSavedFlights(): FlightItinerary[] {
    if (typeof window === 'undefined') {
      return inMemoryFavorites;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return inMemoryFavorites;
    }
  }
  ```
  This allowed Next.js static page optimization (`next build`) to succeed with zero prerender errors.

---

### Correction 5: Comparison Drawer Unbounded Growth & FIFO Eviction
- **AI-Generated Flaw**: AI's initial comparison toggle simply appended clicked flights without limit, creating layout overflow and excessive DOM nodes.
- **Manual Engineering Correction**: In `useFlightSearchViewModel.ts`, we implemented a bounded FIFO eviction policy capping comparisons at 3 items:
  ```typescript
  // Corrected implementation:
  const toggleComparison = (flight: FlightItinerary) => {
    setComparisonList((prev) => {
      if (prev.some((f) => f.flightId === flight.flightId)) {
        return prev.filter((f) => f.flightId !== flight.flightId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), flight]; // FIFO eviction
      }
      return [...prev, flight];
    });
  };
  ```

---

## 5. Verification & Test Evidence

The application was validated using automated test execution, static analysis, and production bundle compilation:

```text
> vitest run
 ✓ lib/scoring.test.ts (2 tests)
 ✓ tests/favouritesModel.test.ts (2 tests)
 ✓ lib/validations/settingsValidation.test.ts (10 tests)
 ✓ tests/flightModel.test.ts (4 tests)
 ✓ tests/SettingsForm.test.tsx (4 tests)

 Test Files  5 passed (5)
      Tests  22 passed (22)
   Duration  7.56s
```

- **TypeScript Strict Check**: `npm run typecheck` (`tsc --noEmit`) passes with **0 errors**.
- **Next.js 15 Production Build**: `npm run build` succeeds, generating fully optimized static routes (`/`, `/_not-found`).

---

## 6. Conclusion
By pairing human architectural discipline with AI speed, we built a production-grade, fully accessible, and mathematically sound React application. This submission demonstrates that AI is most powerful when guided by rigorous software engineering standards—clear domain modeling, pure business logic, defensive input boundaries, and comprehensive unit test coverage.
