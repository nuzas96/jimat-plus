# JiMAT+

JiMAT+ is a student food security decision engine built for the PutraHack 2026 preliminary round and refined for the grand finale.

It helps students answer one urgent question:

**Can my remaining budget and pantry items realistically last until my next allowance?**

## What The Prototype Does

- calculates **Estimated Days Covered**
- assigns a **Survival Score**
- assigns a **Confidence Level**
- warns what may happen if the user does nothing
- recommends the **Best Next Purchase**
- generates a short survival plan and shopping summary
- supports **pricing contexts** such as `Student-Area Budget Preset`, `Campus Budget Preset`, and `Urban Off-Campus`
- surfaces **support options** when the situation becomes critical

## Locked Demo Scenario

Use this same scenario across the app, deck, and video:

- Remaining Budget: `RM20`
- Days Left Until Next Allowance: `3`
- Pantry Items: `rice, eggs, onion, instant noodles`

Expected result story:

- `Estimated Days Covered: 2.8 days`
- `Survival Score: Tight`
- `Confidence Level: Medium`
- warning that the current plan may not last without adjustment
- `Best Next Purchase: Tofu`
- `Tofu price: RM4.50`
- coverage improves to `3+ days`

## Why This Qualifies Now

JiMAT+ fits the Food Security theme because it addresses a real short-term food security problem for students: unstable access to meals near the end of an allowance cycle. The prototype focuses on affordability, pantry reuse, practical next-step decisions, and support escalation rather than generic meal browsing.

## Finals Architecture

- React + TypeScript frontend for the guided assessment flow
- structured finals data layer for meals, purchase candidates, support resources, and pricing contexts
- deterministic recommendation engine with context-aware pricing
- local assessment logging for internal demo analytics and proof packaging

## Finals Proof Notes

- `Student-Area Budget Preset` is a manually maintained finals-demo pricing preset calibrated around student-accessible shops near the UniKL MIIT area
- validation, pricing proof, comparison, and commercial viability should be presented in the finals deck rather than in the public app UI
- user-facing claims should stay modest and exact: small-sample early validation, not large-scale market validation

## Stack

- Vite
- React
- TypeScript
- rule-based scoring engine for deterministic outputs
- Lovable for prototype generation and UI iteration

## AI Disclosure

- Lovable: prototype generation and UI iteration
- Codex/OpenAI tools: implementation support, logic refinement, UI polish, and documentation support

## Run Locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run build
npm run lint
```

## Roadmap

Later versions can expand into:

- admin-managed datasets and reporting
- deeper campus-specific support integrations
- stronger local meal recommendations
- a backend service for shared data and multi-campus scaling
