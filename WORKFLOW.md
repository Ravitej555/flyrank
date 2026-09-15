# Workflow Audit: Directed AI vs. Vague Generation (Round 1 vs. Round 2)

**Project:** FlyRank (Flight Search & Multi-Attribute Ranking Platform)  
**Branches:** [`feat/settings-vague`](https://github.com/Ravitej555/flyrank/tree/feat/settings-vague) vs. [`feat/settings-precise`](https://github.com/Ravitej555/flyrank/tree/feat/settings-precise)  
**Total Codebase Diff:** 6 files changed, 627 insertions(+), 120 deletions(-)

---

### 1. Correctness & Specific Diffs
The difference between unguided generation and directed engineering is visible in how validation logic is structured:

- **Coupled vs. Decoupled Logic:** In Round 1 (`components/SettingsForm.tsx:23-45`), validation was inlined inside an event handler with primitive `parseFloat()` conversions and string state. In Round 2, validation is completely decoupled into a standalone Zod schema (`lib/validations/settings.ts:8-37`), enabling independent headless unit testing.
- **Floating-Point Equality Trap (AI Mistake Caught):** Round 1 generated `total !== 100` (`SettingsForm.tsx:34`). In JavaScript, `33.3 + 33.3 + 33.4` produces `100.00000000000001`, causing valid decimal weight distributions to fail validation silently. Round 2 resolved this by injecting `WEIGHT_TOLERANCE_EPSILON = 0.05` via Zod `.refine()` (`lib/validations/settings.ts:18`), correctly accepting floating-point distributions.

### 2. Accessibility (a11y)
- **Label Associations:** Round 1 rendered plain text wrapper divs (`<div>Price Weight (%):</div><input type="number" />`), completely omitting `id` and `htmlFor`. Screen readers cannot determine the input's purpose.
- **Semantic Structure & ARIA:** Round 2 grouped inputs into semantic `<fieldset>` elements with descriptive `<legend>` tags (`components/SettingsForm.tsx:162,284`). Each slider features `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow={weights[field]}`, `aria-invalid={!!fieldErrors[field]}`, and `aria-describedby` targeting the error element ID.
- **Dynamic Announcements:** The real-time weight sum is wrapped in `role="status"` with `aria-live="polite"` (`SettingsForm.tsx:128`), allowing screen readers to hear weight updates as sliders move.

### 3. Edge Cases & Type Safety
- **Type Narrowing:** Round 1 typed the currency input as a raw string (`useState('USD')`), accepting invalid values like `"INVALID"`. Round 2 constrained currencies using `z.enum(['USD', 'EUR', 'GBP', 'INR'])` synchronized with `CurrencyCode` in `lib/types.ts`.
- **Constraint Bounds:** Round 1 accepted fractional or negative stops (`maxStops = -5` or `1.5`). Round 2 enforced `z.number().int().min(0).max(3)`.
- **Reset State:** Round 1 provided no error recovery or reset mechanism. Round 2 added a dedicated `handleReset()` returning all sliders and options to `DEFAULT_USER_PREFERENCES`.

### 4. Review Effort & Time-to-Production
- **Round 1 (Vague Prompt):** Prompt writing took 15 seconds, but code review and debugging took ~40 minutes. We had to manually identify missing tests, broken float logic, and total absence of WCAG compliance.
- **Round 2 (Directed Prompt with Verification):** Specifying constraints, file locations, and verification steps took 3 minutes. The resulting code passed all 16 Vitest unit and integration tests (`tests/SettingsForm.test.tsx` and `lib/validations/settingsValidation.test.ts`) on the first run with zero TypeScript compilation errors. 

**Conclusion:** Round 2 felt slower during prompt construction, but was 4x faster end-to-end because it eliminated manual architectural remediation and debugging.
