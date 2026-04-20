---
description: Guide a product owner through writing a complete story — covering business context, user needs, and acceptance criteria — ready to hand off to a developer
---

# PO Story Writer

## Goal

Take a feature idea or problem description (provided as pasted text or a path to a file in `stories/`) and help a product owner produce a complete, well-formed story.

The output is a story document covering everything a **developer needs to understand the business context** — but making no technical decisions. Data models, API design, implementation approach, and code patterns are the developer's domain and are intentionally left out.

This story is designed to be handed to a developer, who will then run it through the `assess-story` skill to produce a full implementation spec.

---

## Why This Matters

Product owners know the "what" and "why" better than anyone. But stories often go to developers incomplete — missing the business rules, edge cases, and acceptance criteria that prevent misaligned implementations.

This skill closes that gap **on the PO side**, before the story ever reaches a developer.

| What POs know | What often gets left out |
|---|---|
| The problem being solved | The specific users affected and how |
| The desired outcome | The edge cases and failure scenarios |
| What success looks like | Explicit out-of-scope boundaries |
| The business rules | Conditions that make a scenario pass or fail |
| Why it's being built now | Dependencies on other teams or stories |

---

## Step 1 — Read the Input

If a file path is provided (e.g. `stories/draft-checkout-flow.md`), read it.
If the feature idea or problem description is pasted directly, work from that.

---

## Step 2 — Assess Completeness

Score the input against these **7 dimensions** that a product owner is responsible for.
For each, rate as ✅ Present, ⚠️ Partial, or ❌ Missing:

1. **Problem statement** — What problem or user need is this addressing? Why does it matter?
2. **Users & stakeholders** — Who is this for? Which roles or personas are affected?
3. **User scenarios** — What should the user be able to do? Are the key flows described?
4. **Business rules** — Are there rules, constraints, or logic that must be enforced?
5. **Acceptance criteria** — How will the PO verify this is done? Are conditions testable?
6. **Scope boundaries** — What is explicitly in scope? What is explicitly out of scope?
7. **Priority & context** — Why is this being built now? What's the business impact or urgency?

### Output Format

```
## Completeness Assessment

| # | Dimension           | Rating | Notes                                  |
|---|---------------------|--------|----------------------------------------|
| 1 | Problem statement   | ✅     | Clear: ...                             |
| 2 | Users & stakeholders| ⚠️     | Mentioned but personas not defined     |
| 3 | User scenarios      | ❌     | No flows described                     |
| 4 | Business rules      | ❌     | No rules or constraints stated         |
| 5 | Acceptance criteria | ⚠️     | Requirements listed but not testable   |
| 6 | Scope boundaries    | ❌     | No out-of-scope declared               |
| 7 | Priority & context  | ✅     | Clear: ...                             |

**Verdict**: NEEDS WORK — X/7 missing, X/7 partial.
```

---

## Step 3 — Fill in the Story (or Gap Report)

### If the input is complete enough (≥5 dimensions ✅):

Produce a **well-formed story document** using this structure:

```markdown
# Story: [Feature Name]

## Problem Statement
[1-3 sentences: what problem exists, who has it, and why it matters now]

## Users & Stakeholders
- **Primary user**: [Who is doing the action? What is their role?]
- **Affected parties**: [Who else is impacted by this feature?]
- **Out of scope users**: [Any roles explicitly NOT addressed by this story]

## User Scenarios

### Primary scenario — [happy path label]
**As a** [user role],
**I want to** [action],
**so that** [value or outcome].

**Given** [starting condition]
**When** [user action]
**Then** [expected result]

### Secondary scenario — [edge case or alt path label]
[Repeat the Given/When/Then format for each meaningful variation]

### Error / failure scenario
**Given** [condition that leads to failure]
**When** [user action]
**Then** [what the user should see or experience]

## Business Rules
- [Rule 1: a constraint or logic that must always hold — e.g. "A user can only submit once per day"]
- [Rule 2: ...]
- [Add as many as apply. If none, write "None identified."]

## Acceptance Criteria
- [ ] [Condition 1 — written so a PO can verify it manually without technical knowledge]
- [ ] [Condition 2]
- [ ] [Condition 3]
- [ ] Edge case: [specific edge condition is handled gracefully]

## Scope

### In scope
- [Feature / behaviour 1]
- [Feature / behaviour 2]

### Out of scope
- [What is explicitly NOT being built in this story]
- [Follow-on work deferred to a future story]

## Priority & Context
[Why is this being built now? What business goal, OKR, user complaint, or event is driving it?]

## Dependencies
- [Any other stories, teams, or systems this depends on — or "None"]

## Open Questions
- [Anything the PO is unsure about that needs a decision before development starts — or "None"]
```

---

### If the input is NOT complete enough (<5 dimensions ✅):

Produce a **Gap Report** that tells the PO exactly what to add:

```
# Gap Report: [Feature Name]

## What's already clear
- [List what the input already covers well]

## What needs to be added

### Users & Stakeholders (❌ Missing)
- Who is the primary user of this feature? What is their role?
- Are there other users who are affected but not the main actor?
- Are there any roles who should explicitly NOT have access to this?

### User Scenarios (❌ Missing)
- Walk through the main flow: what does the user do, step by step?
- What happens if something goes wrong? What does the user see?
- Are there any variations or alternate paths worth capturing?

### Business Rules (❌ Missing)
- Are there any rules that must always be true? (e.g. limits, permissions, validations)
- Are there any conditions under which the action should be blocked or flagged?

[...repeat for each missing/partial dimension...]

## Story Draft (fill in the gaps)
[Pre-fill the story template with what's already there, leaving clear placeholders
for what's missing so the PO knows exactly what to complete]
```

---

## Step 4 — Story Quality Checklist

After producing the story, verify it passes these checks before handing it to a developer:

- [ ] No technical decisions are made (no database tables, no API routes, no file paths)
- [ ] Every acceptance criterion can be verified by a non-technical person
- [ ] The primary user scenario has a complete Given/When/Then
- [ ] At least one error or edge case scenario is described
- [ ] Out-of-scope is explicitly stated (even if just one item)
- [ ] Business rules are stated as facts, not implementation hints
- [ ] Open questions are listed rather than assumed away

If any checks fail, revise the story before outputting the final version.

---

## Output

Output the final story document in full, ready to save to `stories/[story-name].md`.

Then print the quality checklist with pass/fail status for each item.
