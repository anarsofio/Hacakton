# CaseFlow

AI-assisted case management demo for personal injury attorneys. Six connected stages —
Documents, Police Report, Treatment Timeline (the centerpiece), Quality of Life, Financial
Reports, and Negotiation Letter — built as a Next.js 16 App Router site with mock data
standing in for a real AI extraction pipeline.

**Live demo:** https://caseflow-gamma.vercel.app

## Stack
- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- lucide-react icons
- Self-hosted Fraunces (headings) + Inter (body) via `@fontsource`

## Design
Navy (`#0f1b2d`) / gold (`#c9974a`) / cream (`#f5efe6`) palette, Fraunces serif display type
over Inter body type. All mock data lives in `src/lib/mockData.ts` — swap that file for a real
per-stage AI extraction pipeline without touching the UI.

## Run locally
\`\`\`bash
npm install
npm run dev
\`\`\`
Open http://localhost:3000.

## Deploy your own copy to Vercel
1. Push this repo to GitHub (see below).
2. Go to https://vercel.com/new, import the GitHub repo.
3. Framework preset auto-detects as Next.js — no config needed. Click **Deploy**.

## Push this repo to GitHub
\`\`\`bash
git remote add origin https://github.com/<your-username>/caseflow.git
git branch -M main
git push -u origin main
\`\`\`
Then import the repo at https://vercel.com/new for automatic deploys on every push.

## Project structure
\`\`\`
src/
  app/
    page.tsx                 # Dashboard + case stepper
    documents/                # Stage 1 — Intake
    police-report/             # Stage 2 — Incident
    treatment-timeline/        # Stage 3 — Chronology (centerpiece)
    quality-of-life/           # Stage 4 — Impact (client questionnaire)
    financial-reports/         # Stage 5 — Damages
    negotiation-letter/        # Stage 6 — Output
  components/                  # Shared UI (stepper, cards, badges, clients)
  lib/mockData.ts              # All mock/demo data
\`\`\`

All AI-generated content in the UI carries an "AI-generated — review required" badge, matching
the source brief.
