# PoC Design System Architecture

## Overview
This repository serves as a **Proof of Concept (PoC)** to demonstrate the implementation of a scalable, enterprise-grade UI architecture for the **Caresmartz360** platform.

The primary goal of this PoC is to prove to engineering leadership that adopting a strict, **3-tier design token architecture** decouples visual styling from business logic, dramatically reducing UI regression bugs and increasing developer velocity.

---

## 🏗️ The Architecture Layout

To achieve complete separation of concerns, this Angular project enforces a strict, hierarchical SCSS folder structure. **This architecture must be verified and kept strictly up-to-date with every push.**

```text
src/
 └── styles/
      ├── 1-primitives/         # TIER 1: Raw values, no context
      │    ├── _colors.scss     # e.g., --blue-500: #0f62fe;
      │    ├── _spacing.scss    # e.g., --space-4: 0.25rem;
      │    └── _typography.scss # e.g., --font-size-sm: 12px;
      │
      ├── 2-semantics/          # TIER 2: Contextual intent (Maps to Primitives)
      │    ├── _theme-light.scss# e.g., --bg-surface-primary: var(--blue-500);
      │    ├── _layout.scss     # e.g., --padding-container: var(--space-8);
      │    └── _a11y.scss       # e.g., --focus-ring: 2px solid var(--blue-700);
      │
      ├── 3-components/         # TIER 3: Global Component overrides
      │    ├── _cards.scss      
      │    └── _tables.scss     
      │
      └── styles.scss           # The master file that imports everything in order
```

### The 3 Rules of the Architecture
We are replacing legacy, monolithic stylesheets with a highly structured CSS Custom Property (`var(--...)`) system driven directly by Figma design decisions. 

1. **Tier 1 (Primitives):** Base values without context. Hardcoded hex values are **only permitted here.**
2. **Tier 2 (Semantics):** Contextual tokens mapped directly to primitives. **No module-specific prefixes** (like `--stg-`) are allowed.
3. **Tier 3 (Components):** Angular component stylesheets that consume *only* Tier 2 semantic variables. They do not contain hex codes or layout math.

---

## 🛑 Continuous Verification Rule
**Mandatory for all human developers and AI agents:**
Before any branch is merged or code is pushed, the committer must verify that the UI code does not violate the architecture layout above. 
*   If a hex code is found in Tier 2 or Tier 3, **the build fails.**
*   If a module-specific prefix is used, **the build fails.**

## The Pitch
By isolating our CSS in this manner, an architect can change a single global semantic token, and the entire application updates instantly—without a developer ever needing to touch Angular `.ts` logic or component `.html` structure.

## Relevant Ecosystem Links
* **Single Source of Truth (SSOT) Token Repository:** [caresmartz360-design-system](https://github.com/Charan-Design-CS360/caresmartz360-design-system)
* **Master Project Tracker:** See `PROJECT-TRACKER.md` for current progress.
* **AI Instructions:** See `AI_CONTEXT.md` before making any AI-assisted code generations in this repository.
