# Story 001 — Project Scaffolding

## Objective
Stand up a Next.js 14 site (seto.media) with Supabase for data, Tailwind for styling,
and Vercel for hosting — so there is a working foundation to build music showcase
features and producer tools on top of.

## Scope
**In scope:**
- Initialize Next.js 14 app (App Router)
- Initialize as git project (Remote git repo ssh git@github.com:prod-seto/seto.media.git)
- Configure Tailwind CSS
- Connect Supabase (client + env vars) (Supabase Project URL: https://fiwjvdjmcxavwwgwahhy.supabase.co)
- Link to Vercel project (not created yet, domain seto.media already purchased)
- Stub home page that reflects the site's purpose (music / beats / producer tools)

**Out of scope:**
- Auth / admin login (later story)
- Real music content or beat listings (later story)
- Producer tools (later story)
- Custom domain DNS configuration (domain already purchased on Vercel)

## Data Model
No DB tables in this story — just verify the Supabase client initializes
and can connect without error. Tables for tracks, beats, and tools come later.

## API / Interface
- No custom API routes in this story
- Supabase
  - Project URL: https://fiwjvdjmcxavwwgwahhy.supabase.co
  - Publishable key: sb_publishable_kVp3xPExLkuhpVCOqpHVIQ_A5Af445u
  - Secret key: [SECRET-KEY]
  - Direct connection string: postgresql://postgres:[YOUR-PASSWORD]@db.fiwjvdjmcxavwwgwahhy.supabase.co:5432/postgres
  - CLI setup commands:
    - supabase login
    - supabase init
    - supabase link --project-ref fiwjvdjmcxavwwgwahhy
  - It sounds like the anon key is legacy. The docs say "Prefer using Publishable API keys instead."

## UI / UX
- Home page `/` renders with a heading and brief description of what seto.media is
  (music releases, beats, tools for producers)
- Visual direction can be found here in this design spec - resources/soft_signal_design_spec.png
- Visual direction description: A hybrid spec where GXSC's warmth and restraint is the foundation, but Metalheart's geometric decorative language and surface textures bleed through like a signal beneath the fog. I named this spec Soft Signal — the idea being that the Metalheart machine is a signal buried beneath the GXSC fog. A few things I'm particularly happy with in this hybrid:
The Signal colour (#5A8FA0) is the conceptual keystone. It's Metalheart's cyan desaturated and cooled into something that feels earned rather than announced — it only ever appears in geometric elements: the grid underlay, corner brackets, shape outlines, and HUD bars. Never in text.
The diamond dividers between sections (the hr elements) are a small but effective touch — pure Metalheart syntax, but at GXSC scale and opacity. Same with the corner brackets on cards and panels, which replace the rounded corners from GXSC without adding any of Metalheart's aggression.
The last hard rule is the one that holds the whole thing together: the machine is always felt, never seen. If the geometry is noticeable, it is too strong. That's the line the hybrid has to walk.

## Reference Files
- None yet (this is the first story)

## Integration Points
- [ ] GitHub repo: ssh git@github.com:prod-seto/seto.media.git
- [ ] Vercel project: does not exist yet - link repo to it when able to. seto.media domain has been bought
- [ ] Supabase project: https://fiwjvdjmcxavwwgwahhy.supabase.co, no connection string in `.env.local` yet
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` not defined yet

## Acceptance Criteria
- [ ] `npm run dev` starts with no errors
- [ ] `npm run build` passes with no errors
- [ ] Home page renders at `localhost:3000` with correct placeholder content
- [ ] Supabase client can be imported without error
- [ ] Vercel preview URL is live and accessible

## Out of Scope / Follow-on
- Music/beat catalog, audio playback, producer tools — all later stories
- Auth and admin — later story
