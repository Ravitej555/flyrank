# FlyRank — AI & Developer Guidelines (CLAUDE.md)

Welcome to **FlyRank**, an intelligent flight search, scoring, and ranking platform that computes multi-dimensional utility scores for flight itineraries (evaluating price, travel duration, layover friction, airline reliability, and carbon efficiency).

---

## 1. Tech Stack & Architecture

- **Frontend Framework**: Next.js 15 (React 19, App Router)
- **Language**: TypeScript 5.x (Strict mode enabled, no implicit `any`)
- **Styling**: Tailwind CSS, CSS Modules (when isolation is required), Lucide React (icons)
- **Backend / API**: Next.js Route Handlers (`app/api/*`) on Node.js runtime
- **Data Validation**: Zod for runtime schema validation of flight search queries and API payloads
- **Testing**: Vitest + React Testing Library
- **Package Manager**: `npm`

### Directory Layout
```text
flyrank/
├── app/                  # Next.js App Router (pages, layout, route handlers)
│   ├── api/flights/      # Flight search and scoring API routes
│   ├── globals.css       # Base Tailwind styling and custom themes
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main flight search and ranking dashboard
├── components/           # Reusable React components
│   ├── FlightCard.tsx    # Individual flight result with score badge
│   ├── FilterBar.tsx     # Filters for stops, airlines, price ranges
│   ├── RankingMatrix.tsx # Dynamic weight adjusters (price vs speed vs comfort)
│   └── ScoreBreakdown.tsx# Visual breakdown of FlyRank composite score
├── lib/                  # Core business logic and scoring algorithms
│   ├── scoring.ts        # FlyRank composite scoring engine
│   ├── types.ts          # Shared TypeScript interfaces and data models
│   └── utils.ts          # Utility functions (time, currency, formatting)
├── public/               # Static assets (airline logos, icons)
├── CLAUDE.md             # AI assistant and project conventions (this file)
├── LICENSE               # MIT License
└── README.md             # Project overview and documentation
```

---

## 2. Common Developer Commands

```bash
# Install dependencies
npm install

# Run local development server (default: http://localhost:3000)
npm run dev

# Run test suite
npm test

# Run tests with coverage
npm run test:coverage

# Run linter and type-checking
npm run lint
npm run typecheck

# Build for production
npm run build

# Start production server
npm run start
```

---

## 3. Flight Ranking Engine Principles

FlyRank calculates a composite score $S \in [0, 100]$ using weighted normalized criteria:

$$S = w_{\text{price}} \cdot P_{\text{norm}} + w_{\text{duration}} \cdot D_{\text{norm}} + w_{\text{layover}} \cdot L_{\text{norm}} + w_{\text{airline}} \cdot A_{\text{rating}} - w_{\text{co2}} \cdot E_{\text{norm}}$$

- All scoring logic must reside in pure functions under `lib/scoring.ts`.
- Every scoring function must have corresponding unit tests verifying edge cases (e.g., zero layovers, extreme price outliers).
- Scoring calculations must be deterministic and return both the final score and an interpretable sub-score breakdown (`ScoreBreakdown`).

---

## 4. Coding Conventions & Best Practices

- **TypeScript**:
  - Prefer `interface` for object shapes and data contracts; use `type` for unions and primitives.
  - Strict null checks: never use `any` or `@ts-ignore` without explicit documentation of technical debt.
- **React Components**:
  - Use functional components with explicit prop interfaces (`interface Props { ... }`).
  - Favor Server Components by default; add `'use client'` only where state or browser APIs are required.
  - Keep UI components decoupled from data fetching and scoring calculation logic.
- **Error Handling**:
  - Use defensive programming and schema validation (`zod`) on external flight provider data.
  - Return clear, typed error responses (`{ error: string, code: string }`) with appropriate HTTP status codes.

---

## 5. Git & Commit Guidelines (Conventional Commits)

All commits in this repository must strictly adhere to the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```text
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types:
- `feat`: A new feature (e.g., `feat: add layover friction penalty calculation`)
- `fix`: A bug fix (e.g., `fix: correct currency conversion for EUR flights`)
- `docs`: Documentation updates only (e.g., `docs: update API endpoints in README`)
- `style`: Changes that do not affect the meaning of the code (formatting, white-space)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, auxiliary tools, dependencies, or repository config

---

## 6. Learned Project Rules (Workflow Drill Post-Mortem)

These rules are enforced across all features and code reviews:

1. **Form Validation Separation (Zod First)**:
   All forms and user configuration panels MUST define and validate inputs through a dedicated Zod schema residing under `lib/validations/`. UI components must never perform manual, ad-hoc string parsing (`parseFloat()`, manual `isNaN` checks, or inline alert dialogs) in submit handlers. Validation errors must be mapped from `zod.safeParse()` issues.

2. **Floating-Point Weight Sums with Epsilon Tolerance**:
   Any multi-attribute weighting algorithm or user-adjustable criteria distribution whose sum must equal 100% (or 1.0) MUST enforce a tolerance epsilon (`Math.abs(sum - 100) <= WEIGHT_TOLERANCE_EPSILON`, where `WEIGHT_TOLERANCE_EPSILON = 0.05`) inside Zod `.refine()`. Strict equality (`sum === 100` or `sum === 1.0`) is prohibited due to IEEE 754 decimal rounding inaccuracies (e.g. `33.3 + 33.3 + 33.4 = 100.00000000000001`).

3. **Accessible Form Controls & Error Linkage (WCAG 2.1 AA)**:
   - Every input and slider control MUST have an associated `<label htmlFor={uniqueId}>`.
   - Every validation error element MUST have an `id` linked to its corresponding input via `aria-describedby={errorId}`.
   - Any input failing validation MUST declare `aria-invalid={true}`.
   - Sliders and numeric adjusters MUST declare `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
   - Dynamic real-time calculation counters (e.g., total weight sum) MUST declare `role="status"` and `aria-live="polite"`.
