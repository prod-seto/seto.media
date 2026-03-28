Implementation Spec: Project Scaffolding

Source: stories/001-project-scaffolding.md

Objective

Initialize the seto.media Next.js 14 app with Tailwind CSS, connect the Supabase
client using the new publishable key format, and deploy to Vercel — providing a
foundation for a music showcase and producer tools site styled with the Soft Signal
design system.

Pre-Conditions

- Node.js and npm installed locally
- Vercel CLI installed: npm i -g vercel
- Supabase CLI installed: npm i -g supabase
- SSH access configured for git@github.com:prod-seto/seto.media.git
- Secret key handling: SUPABASE_SECRET_KEY (see .env.local) goes only in
.env.local (never committed) and Vercel env vars as a server-only variable. Never use
it in client-side code.

Reference Files — Read First

┌───────────────────────────────────────┬──────────────────────────────────────────┐
│                 File                  │                   Why                    │
├───────────────────────────────────────┼──────────────────────────────────────────┤
│ resources/soft_signal_design_spec.png │ Verify design token values before        │
│                                       │ writing CSS                              │
└───────────────────────────────────────┴──────────────────────────────────────────┘

Design System: Soft Signal

Concept: GXSC warmth and restraint as foundation, with Metalheart's geometric language
  felt beneath — never seen overtly.

Hard rules:
1. Signal colour #5A8FA0 appears only in geometric elements (grid, corner brackets,
shape outlines, HUD bars). Never in text.
2. Section dividers (<hr>) render as centered diamond shapes — Metalheart syntax at
low opacity
3. Cards/panels use corner brackets, not rounded corners
4. If the geometry is noticeable, it is too strong

Tailwind tokens:
colors: {
  background: '#F5F3EF',  // warm off-white — the GXSC fog
  ink:        '#2C2C2C',  // near-black — all text
  signal:     '#5A8FA0',  // geometric elements only
  mist:       '#9A9A9A',  // secondary text, borders
  dust: {
    tan:  '#B5A08A',
    sage: '#8A9E8C',
  }
},
fontFamily: {
  serif: ['Georgia', 'serif'],
  sans:  ['Inter', 'system-ui', 'sans-serif'],
}

Data Model

None this story. No tables created or queried.

Implementation Steps

Step 1 — Initialize Next.js App

- npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias
"@/*"
- App Router: yes. ESLint: yes. Turbopack: no.
- Delete boilerplate from src/app/page.tsx and public/*.svg

Step 2 — Configure Tailwind

- File: tailwind.config.ts
- Apply Soft Signal tokens from above
- Cross-check hex values against resources/soft_signal_design_spec.png

Step 3 — Global Layout

- File: src/app/layout.tsx
- <body className="bg-background text-ink font-sans">
- Import Inter via next/font/google

Step 4 — Diamond Divider Component

- File: src/components/Divider.tsx
export function Divider() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-2 h-2 rotate-45 border border-signal opacity-30" />
    </div>
  )
}
- If still visually prominent at 30% opacity, reduce further — the machine must be
felt, not seen

Step 5 — Corner Bracket Utility

- File: src/components/BracketCard.tsx
- A wrapper component that adds four L-shaped corner decorations in signal at low
opacity
- Children render inside; no rounded corners (rounded-none)
- Use absolute positioning for the bracket spans

Step 6 — Home Page Stub

- File: src/app/page.tsx
[Wordmark: "seto.media" — font-serif text-ink]
[Tagline: "music releases · beats · producer tools" — font-sans text-mist]
<Divider />
<BracketCard> Releases — placeholder </BracketCard>
<Divider />
<BracketCard> Beats — placeholder </BracketCard>
<Divider />
<BracketCard> Tools — placeholder </BracketCard>

Step 7 — Supabase Client + Env Vars

- Install: npm install @supabase/supabase-js
- File: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Use publishable key for client-side. Secret key is server-only.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)
- File: .env.local (confirm it's in .gitignore before writing)
NEXT_PUBLIC_SUPABASE_URL=https://fiwjvdjmcxavwwgwahhy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<from Supabase dashboard>
SUPABASE_SECRET_KEY=<from Supabase dashboard, never commit>
- Note: SUPABASE_SECRET_KEY has no NEXT_PUBLIC_ prefix — it will never be sent to the
browser
- File: .env.local.example (commit this, no real values)

Step 8 — Link Supabase CLI

supabase login
supabase init
supabase link --project-ref fiwjvdjmcxavwwgwahhy

Step 9 — Verify Supabase Connection

- Add temporarily to src/app/page.tsx (server component):
const { error } = await supabase.from('_verify_').select('*').limit(1)
console.log('Supabase:', error?.message)
// Expected: Postgres error about missing relation — not a network/auth error
- Confirm, then remove

Step 10 — Git Init and Push

git init
# Verify .env.local is in .gitignore before proceeding
git add .
git commit -m "chore: initial scaffold — Next.js 14, Tailwind, Supabase, Soft Signal"
git remote add origin git@github.com:prod-seto/seto.media.git
git push -u origin main

Step 11 — Deploy to Vercel

- Run vercel in project root
- Create new Vercel project during the flow (does not exist yet)
- Add env vars in Vercel dashboard → Settings → Environment Variables:
  - NEXT_PUBLIC_SUPABASE_URL — all environments
  - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — all environments
  - SUPABASE_SECRET_KEY — server only (uncheck "expose to browser")
- DNS wiring for seto.media is out of scope

Registration & Wiring

- .env.local must be in .gitignore — verify before first commit
- .env.local.example committed with empty values
- SUPABASE_SECRET_KEY configured as server-only in Vercel (no NEXT_PUBLIC_ prefix)

Definition of Done

- npm run dev starts with no errors
- npm run build passes
- Home page renders with Soft Signal aesthetic: diamond dividers visible but subtle,
corner-bracket cards, signal colour only in geometry
- Supabase client initializes — connection check logs a Postgres error (not
network/auth)
- Code pushed to git@github.com:prod-seto/seto.media.git
- Vercel preview URL is live and accessible
