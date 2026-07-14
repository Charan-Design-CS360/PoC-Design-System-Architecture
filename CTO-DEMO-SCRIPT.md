# CTO Live Demo Script: Zero-Hex Architecture

> **Goal:** Prove to leadership that the 3-tier, prefix-free SCSS architecture increases development velocity and eliminates CSS regression bugs by demonstrating a single source of truth cascade.

## Setup
1. Open the PoC Angular Dashboard side-by-side with your IDE.
2. Ensure the dashboard is running (`npm start`) and visible on screen.
3. Have `src/styles/1-primitives/_colors.scss` open in the IDE.

## The Script

### 1. The Problem Statement (1 min)
"As we saw in the Aegis audit, the global codebase has 4,371 hardcoded hex colors and over 6,000 `!important` tags. This creates brittle, siloed UI that takes days to update and makes global features like Dark Mode impossible."

### 2. The Solution Architecture (1 min)
"We've completely removed hardcoded values from our components. Instead, we use a 3-Tier Architecture driven directly by Figma."
- **Point to the Dashboard:** "This dashboard has zero hex codes in its HTML or Component SCSS."
- **Point to the IDE:** "Instead, every color, spacing, and font size is mapped through semantic tokens back to a single source of truth: our Primitives layer."

### 3. The Live Demonstration (2 mins)
"To prove this, let's say brand marketing decides to rebrand our primary action color from our standard blue to a vibrant purple."

**Action:** 
1. In `src/styles/1-primitives/_colors.scss`, find the `--Brandblue-600` token.
2. Change the hex value from `#0077FF` to `#9333EA` (Purple).
3. Hit **Save**.

**Result:**
Watch the Angular dashboard instantly hot-reload. Every primary button, icon, and active state across the entire UI will flawlessly update to purple, without touching a single component file.

### 4. The Power of Semantics (1 min)
"Because we use semantic mapping (Tier 2), we didn't just change 'blue to purple'. We safely updated the intent of 'Primary Action' everywhere. This also unlocks instant, bug-free theming."

**Action:**
Click the **Theme: Dark** toggle on the dashboard.
"Dark mode and High Contrast are now natively supported out-of-the-box, because components listen to semantics, not hardcoded colors."

## The Conclusion
"By adopting this architecture, UI updates that used to take sprint cycles and QA passes can now be executed instantly, safely, and automated directly from Figma."
