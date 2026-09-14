# AI Fluency — Phase 1: Setup & Workflow Audit (FL-01)

**Student Name:** Ravitej Manu  
**Program / Focus:** Artificial Intelligence & Data Science (EWIT) / Full-Stack & Systems Engineering  
**Primary Project:** FlyRank (Flight Search & Multi-Criteria Ranking Platform)  
**Deliverable:** 1–2 Page Workflow Audit, Claude Project Configuration, & Target Tasks for FL-02 to FL-04  

---

## 1. Weekly Workflow Audit (12 Real Recurring Tasks)

*Task classification framework based on Ethan Mollick's "On-boarding your AI Intern":*
- **Just Me**: High-stakes personal accountability, core cognitive struggles required for real learning, or direct personal judgment.
- **Delegate to AI with Review**: AI generates the initial draft or boilerplate; human conducts systematic verification.
- **Collaborate with AI**: Interactive co-thinking, iterative architecture design, debugging, and exploration of trade-offs.
- **Fully Automate**: Rule-bound, deterministic or templated tasks needing minimal to no manual intervention.

| # | Recurring Weekly Task | Context / Area | Classification | One-Line Rationale |
|---|----------------------|----------------|----------------|--------------------|
| 1 | **Deriving Core ML & Linear Algebra Proofs** | Academic (EWIT Coursework) | **Just Me** | Outsourcing foundational mathematical derivation robs me of the neural pathways and intuitive mental models required for advanced AI coursework. |
| 2 | **In-Person University Lab Practicals & Viva Voce** | Academic (EWIT Lab Assessments) | **Just Me** | Real-time verbal defense and closed-book execution require unassisted personal mastery and cannot involve AI assistance. |
| 3 | **Synthesizing Weekly Academic Lecture Notes & Research Papers** | Study & Research | **Delegate to AI with Review** | AI quickly extracts key themes and LaTeX summaries from dense slides or PDFs, which I then verify against textbook sources. |
| 4 | **Drafting Next.js API Routes & Zod Validation Schemas** | Side Project (FlyRank) | **Delegate to AI with Review** | Generating repetitive data contracts and input-parsing schemas is mechanical, needing only my verification for security and edge cases. |
| 5 | **Designing Composite Scoring Engine Algorithms** | Side Project (FlyRank) | **Collaborate with AI** | Exploring trade-offs between price, layover friction, and CO2 weighting requires dynamic brainstorming and iterative formula refinement. |
| 6 | **Debugging Complex TypeScript / State Management Bugs** | Engineering & Development | **Collaborate with AI** | Acting as a pair-programmer to bounce hypotheses, analyze stack traces, and isolate race conditions speeds up root-cause discovery. |
| 7 | **Authoring Vitest Unit Tests & Edge-Case Datasets** | Side Project (FlyRank) | **Delegate to AI with Review** | AI excels at enumerating boundary conditions and mock payloads, while I verify that test assertions accurately enforce business logic. |
| 8 | **Practicing LeetCode / Data Structures & Algorithms** | Career & Skill Building | **Collaborate with AI** | Working through problem intuition and analyzing space-time complexity trade-offs in a Socratic dialogue builds deeper algorithmic thinking. |
| 9 | **Formatting Conventional Git Commits & PR Descriptions** | Engineering Workflow | **Fully Automate** | Diff analysis and standard Conventional Commit message generation follow strict deterministic patterns that require zero creative overhead. |
| 10 | **Formatting & Linting Codebases (Pre-commit Hooks)** | Engineering Workflow | **Fully Automate** | Pre-commit ESLint, Prettier, and TypeScript checks should be entirely hands-off and triggered on save or commit. |
| 11 | **Drafting Professional Outreach & Cold Inquiries for Internships** | Professional Development | **Collaborate with AI** | AI helps eliminate robotic phrasing and aligns tone, but the personal motivation, portfolio narrative, and final authenticity must come from me. |
| 12 | **End-of-Week Reflection & Next Week Task Prioritization** | Productivity & Planning | **Just Me** | Evaluating personal energy, genuine career priorities, and self-honesty cannot be delegated to an algorithmic model. |

---

## 2. Toolkit Setup & Academy Verification Checklist

| Platform | Purpose | Setup Status | Verification / Evidence Notes |
|----------|---------|--------------|-------------------------------|
| **Anthropic Claude** | High-nuance reasoning, long-context code evaluation, Claude Projects | **Configured** | Account created; Free/Pro workspace active; Project created (details in Section 3). |
| **OpenAI ChatGPT** | Broad generalist search, multimodal queries, alternative code generation | **Configured** | Account verified; GPT-4o / custom memory active for quick cross-validation. |
| **Anthropic Academy** | Certified credentialing (*AI Fluency: Framework & Foundations*) | **Enrolled** | Enrolled via Skilljar; completed Module 1 (*Foundations & Fluency Framework*). |

### Steps to Capture & Attach Setup Evidence
1. **Anthropic Academy Completion**: Log in to [Anthropic Academy](https://anthropic.skilljar.com/ai-fluency-framework-foundations), navigate to your course dashboard for *AI Fluency: Framework & Foundations*, and capture a screenshot showing Module 1 marked as **Completed / 100%**.
2. **Claude Project Configuration**: Open [Claude.ai](https://claude.ai) -> Projects -> "FlyRank & AI Engineering", take a screenshot showing the **Project Details**, **Custom Instructions**, and **Project Knowledge** pane.

---

## 3. Configured Claude Project

### Project Metadata
- **Project Name:** `FlyRank & AI Engineering Hub`
- **Target Context:** Engineering flight ranking systems, computer science coursework, and high-leverage AI-assisted coding.

### Custom Instructions (Paste into Claude Project Settings)

```markdown
# Role & User Persona
You are an expert senior software architect, AI research mentor, and pair programmer assisting Ravitej Manu, an Artificial Intelligence & Data Science engineering student and full-stack developer.

# User Background & Current Stack
- Core Project: FlyRank — an intelligent flight search and multi-criteria ranking engine (Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS, Zod, Vitest).
- Engineering Standards: Conventional Commits, clean architecture, deterministic pure functions for business logic, zero implicit `any`.
- Academic & Career Goals: Mastering modern AI workflows (AI Fluency track FL-01 to FL-04), preparing for systems engineering roles, and building production-grade full-stack applications.

# Interaction & Tone Guidelines
1. Technical & Direct: Provide concise, high-density explanations. Skip pleasantries, conversational filler, and disclaimers.
2. Code Standards First: When writing TypeScript, provide type definitions first. Ensure all code is modular, robustly typed, and adheres to the project's CLAUDE.md guidelines.
3. Socratic Co-Thinking: When tackling complex algorithms (e.g., scoring functions or DS&A), present trade-offs, edge cases, and mathematical formulations before jumping into code.
4. Active Review Mode: When reviewing code or text, highlight potential security gaps, performance bottlenecks (CWV/LCP), and architectural inconsistencies.
```

### Uploaded Project Knowledge Files
- `CLAUDE.md`: Contains coding standards, tech stack constraints, scoring engine formula, and Conventional Commit guidelines.
- `README.md`: Contains FlyRank architecture overview and API specifications.

---

## 4. Three Target Tasks for Modules FL-02 through FL-04

These three recurring tasks are selected from the audit above. Each has specific, measurable criteria for what "done well" means to ensure rigorous evaluation in subsequent modules.

---

### Target Task 1: Algorithmic Scoring Engine Development & Optimization (FL-02 Focus)
- **Source Audit Task:** Task 5 (*Designing Composite Scoring Engine Algorithms*) & Task 7 (*Authoring Vitest Unit Tests & Edge-Case Datasets*)
- **Category:** Collaborate with AI + Delegate to AI with Review
- **What "Done Well" Means (Measurable Success Criteria):**
  1. **Deterministic Accuracy**: Mathematical formula correctly balances normalized dimensions ($P_{\text{norm}}, D_{\text{norm}}, L_{\text{norm}}, A_{\text{rating}}, E_{\text{norm}}$) into a bounded score $S \in [0, 100]$ without NaN or division-by-zero crashes.
  2. **100% Edge-Case Coverage**: Vitest test suite handles zero-duration layovers, overnight flights, extreme price spikes (>5x median), and missing airline safety ratings with predictable fallbacks.
  3. **Performance Budget**: Scoring calculation processes a batch of 250 flight itineraries in under 15ms in Node.js runtime.
  4. **Interpretability**: The function outputs both the final aggregate score and an exact, human-readable breakdown (`ScoreBreakdown`) for UI explainability.

---

### Target Task 2: Type-Safe API Contract & Zod Validation Synthesis (FL-03 Focus)
- **Source Audit Task:** Task 4 (*Drafting Next.js API Routes & Zod Validation Schemas*)
- **Category:** Delegate to AI with Review
- **What "Done Well" Means (Measurable Success Criteria):**
  1. **Zero Validation Leakage**: 100% of untrusted inbound query parameters (`origin`, `destination`, `dateRange`, `passengers`, `sortWeights`) pass through strict Zod schemas with descriptive error messages.
  2. **TypeScript Synchronization**: Zero discrepancy between runtime Zod schemas (`z.infer<typeof FlightQuerySchema>`) and compile-time TypeScript interfaces; zero use of `any`.
  3. **Generation Time Reduction**: Drafting time for new endpoint schemas and request handlers reduced by ≥60% compared to manual writing, while maintaining zero type errors (`tsc --noEmit`).
  4. **Security & Sanitization**: Schema rejects malformed IATA codes, negative prices, and invalid ISO dates before hitting backend services.

---

### Target Task 3: Technical Research Synthesis & Documentation Distillation (FL-04 Focus)
- **Source Audit Task:** Task 3 (*Synthesizing Weekly Academic Lecture Notes & Research Papers*)
- **Category:** Delegate to AI with Review
- **What "Done Well" Means (Measurable Success Criteria):**
  1. **High Information Density**: Transforms a 10-15 page paper or lecture slide deck into a structured 1-page executive briefing covering: Problem Statement, Core Mechanism, Mathematical Formulation, Limitations, and Direct Application to My Code.
  2. **Zero Hallucination Tolerance**: 100% of cited formulas, benchmark numbers, and architectural claims correspond to verifiable sections of the source document.
  3. **Personal Synthesis Output**: Incorporates an explicit "Relevance to FlyRank / My Projects" section written in my own voice showing applied understanding.
  4. **Time-to-Comprehension**: Deep conceptual understanding achieved in <25 minutes per paper compared to 90+ minutes of unassisted reading.
