# PoC Design System Architecture

## Overview
This repository serves as a **Proof of Concept (PoC)** to demonstrate the implementation of a scalable, enterprise-grade UI architecture for the **Caresmartz360** platform.

The primary goal of this PoC is to prove to engineering leadership that adopting a strict, **3-tier design token architecture** decouples visual styling from business logic, dramatically reducing UI regression bugs and increasing developer velocity.

## The Architecture
We are replacing legacy, monolithic stylesheets with a highly structured CSS Custom Property (`var(--...)`) system driven directly by Figma design decisions. 

This repository strictly enforces the following 3-tier structure (located in `src/styles/`):

1. **Tier 1 (Primitives):** Base values without context (e.g., `--blue-500: #0f62fe;`). Hardcoded hex values are only permitted here.
2. **Tier 2 (Semantics):** Contextual tokens mapped directly to primitives (e.g., `--bg-surface-primary: var(--blue-500);`). **No module-specific prefixes** (like `--stg-`) are allowed.
3. **Tier 3 (Components):** Angular component stylesheets that consume *only* Tier 2 semantic variables. They do not contain hex codes or layout math.

## The Pitch
By isolating our CSS in this manner, an architect can change a single global semantic token, and the entire application updates instantly—without a developer ever needing to touch Angular `.ts` logic or component `.html` structure.

## Relevant Ecosystem Links
* **Single Source of Truth (SSOT) Token Repository:** [caresmartz360-design-system](https://github.com/Charan-Design-CS360/caresmartz360-design-system)
* **AI Instructions:** See `AI_CONTEXT.md` before making any AI-assisted code generations in this repository.
