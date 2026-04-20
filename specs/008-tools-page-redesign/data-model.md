# Data Model: Tools Page Redesign + Site Navbar

**Branch**: `008-tools-page-redesign` | **Date**: 2026-04-18

## Schema Changes

**None.** All required fields already exist on the `tools` table. No migrations needed.

## Tool Entity (existing table, fields consumed by new UI)

| Field | Type | Required for card | Notes |
|-------|------|-------------------|-------|
| `id` | uuid | Yes (key) | React key |
| `name` | text | Yes | Displayed in Orbitron as card heading |
| `slug` | text | Yes | Used to build `/tools/[slug]` link |
| `is_visible` | boolean | Yes | Filtered at query level (`eq("is_visible", true)`) |
| `sort_order` | integer | Yes | Query ordering |
| `game_subtitle` | text \| null | No | Short tagline; card omits this line if null |
| `disk_image_url` | text \| null | No | Optional thumbnail accent; card complete without it |

Fields below are **not consumed** by the new `ToolCard` or `SiteNav`:

- `bg_color`, `bg_gradient`, `hub_color`, `rim_text`, `disk_font`, `disk_font_color`, `game_font_size`, `esrb_rating` — retained in schema for admin/future use

## TypeScript Interface (no changes to database.types.ts)

The existing `Tables<"tools">` type from `src/lib/database.types.ts` already covers all fields. `ToolCard` will accept `tool: Tables<"tools">` as its prop, consuming only the fields above.

## Component Data Flow

```
Supabase (tools table)
  └─ tools/page.tsx [async server component]
       └─ SELECT name, slug, game_subtitle, disk_image_url, is_visible, sort_order
            WHERE is_visible = true ORDER BY sort_order ASC
       └─ maps to → <ToolCard tool={tool} /> for each row

layout.tsx [server component]
  └─ <SiteNav /> [client component, no data fetch — uses usePathname()]
```

## State (SiteNav only)

`SiteNav` has no server-side data. Its only dynamic behavior is reading `pathname` from `usePathname()` to apply active-link styling. No React state (`useState`) required.
