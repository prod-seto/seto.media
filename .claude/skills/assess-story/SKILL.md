---
description: Analyze a story and produce a Claude Code-ready implementation spec — or identify what context is missing
---

# Story → Implementation Spec

## Goal

Read a story (provided as pasted text or a path to a file in `stories/`) and do two things:

1. **Assess completeness** — Does the story contain enough context for an LLM agent to implement the feature end-to-end without guessing?
2. **Produce a spec** — Transform the story into a structured implementation spec that a Claude Code agent can execute directly, OR list exactly what's missing.

---

## Why This Matters

Stories are written for humans who already have project context. LLM agents don't have that context. The gap usually falls into predictable categories:

| What humans assume | What the LLM needs explicitly |
|---|---|
| "You know our codebase" | Which files to read, what patterns to follow |
| "Match the existing style" | Specific reference files as models |
| "Store it in the DB" | Table name, schema, field types, index strategy |
| "Add a page for this" | Route path, component name, nav registration |
| "Add tests" | Which test files, what fixtures, what assertions |
| "It should look like X" | CSS tokens, layout pattern, responsive behavior |
| "Wire it up" | Import paths, registration points, config keys |

---

## Step 1 — Read the Story

If a file path is provided (e.g. `stories/auth-login.md`), read it.
If the story text is pasted directly, work from that.

---

## Step 2 — Assess Completeness

Score the story against these **8 dimensions** that an LLM agent needs to implement a feature.
For each, rate as ✅ Present, ⚠️ Partial, or ❌ Missing:

1. **Objective** — What is being built and why? What problem does it solve?
2. **Scope boundaries** — What's in scope vs. explicitly out of scope? Are there phases?
3. **Data model** — What data is read/written? Table names, schema, field types, indexes?
4. **API contract** — What endpoints/interfaces are created? Request/response shapes? Auth requirements?
5. **UI/UX spec** — What does the user see? Layout, components, interactions, navigation?
6. **Reference patterns** — Which existing files in the codebase should be used as models?
7. **Integration points** — Where does this connect to the existing system? Nav, config, imports?
8. **Acceptance criteria** — How do we know it's done? What tests should pass? What should a human verify?

### Output Format

```
## Completeness Assessment

| # | Dimension          | Rating | Notes                          |
|---|--------------------|--------|--------------------------------|
| 1 | Objective          | ✅     | Clear: ...                     |
| 2 | Scope boundaries   | ⚠️     | Mentioned but vague            |
| 3 | Data model         | ❌     | No schema specified            |
| 4 | API contract       | ❌     | No endpoints defined           |
| 5 | UI/UX spec         | ⚠️     | Described loosely              |
| 6 | Reference patterns | ❌     | No reference files listed      |
| 7 | Integration points | ❌     | No wiring steps                |
| 8 | Acceptance criteria| ⚠️     | Requirements listed, no tests  |

**Verdict**: NOT READY — X/8 missing, X/8 partial.
```

---

## Step 3 — Produce the Spec (or Gap Report)

### If the story is complete enough (≥6 dimensions ✅):

Transform it into an **Implementation Spec** with this structure:

```
# Implementation Spec: [Feature Name]
Source: [story filename or title]

## Objective
[1-2 sentences: what and why]

## Pre-Conditions
- Environment, auth state, DB access
- Any manual setup steps before coding

## Reference Files — Read First
| File | Why |
|------|-----|
| path/to/file.ts | Pattern to follow for [X] |

## Data Model
- Table: `table_name`
- Schema (with field types)
- Indexes needed
- Seed data for tests

## Implementation Steps

### Step 1 — [Component Name]
- File to create/modify: `path/to/file.ts`
- What it does
- Key methods/routes with signatures
- Edge cases to handle

### Step 2 — [Next Component]
...

## Registration & Wiring
- [ ] Add to nav
- [ ] Register route
- [ ] Add env vars to .env.local
- [ ] Update Supabase schema/migrations

## Tests
- [ ] Smoke tests (page renders, APIs return expected shape)
- [ ] Contract tests (response shape validation)
- [ ] Specific edge cases to cover

## Definition of Done
- [ ] Page renders at [URL]
- [ ] APIs return expected shapes
- [ ] Auth gates work correctly
- [ ] `npm run build` passes with no errors
```

---

### If the story is NOT complete enough (<6 dimensions ✅):

Produce a **Gap Report**:

```
# Gap Report: [Story Title]

## What's clear
- [List what the story already defines well]

## What's missing — Questions to answer

### Data Model (❌ Missing)
- What Supabase table will store this data?
- What does a row look like? List every column with its type.
- Are there indexes needed for the queries you expect?

### API Contract (❌ Missing)
- What API routes should exist? List each with method and path.
- What does each response look like?
- Which routes require auth?

[...repeat for each missing/partial dimension...]

## Suggested Story Template
[Pre-fill the story template with what's already there, adding placeholder
sections for what's missing so the developer knows exactly what to fill in]
```

---

## Step 4 — Recommended Story Template

After completing the assessment, if the story was missing common things, output a filled-in story template the developer can use as a model for future stories:

```markdown
## Objective
[What are we building and why?]

## Scope
[What's in scope? What's explicitly out of scope?]

## Data Model
[Table names, column types, example row]

## API / Interface
[Endpoints: method, path, query params, response shape, auth requirements]

## UI / UX
[What does the user see? Layout description, key interactions]

## Reference Files
[Which existing files should be used as patterns?]

## Integration Points
[Where does this register? What config changes? Nav items?]

## Acceptance Criteria
- [ ] [Testable condition 1]
- [ ] [Testable condition 2]
- [ ] `npm run build` passes

## Out of Scope / Follow-on
[What should NOT be done in this ticket?]
```
