# Quickstart: Admin Auth & Content Ingestion Verification

**Branch**: `003-admin-auth-ingestion`
**Gate**: `npm run build` + manual verification (auth flow + both forms)

---

## One-time Supabase setup (before running locally)

These steps are done once in the Supabase dashboard, not in code:

1. **Create the owner auth account**:
   - Dashboard → Authentication → Users → Add user
   - Enter your email + password
   - Copy the generated UUID — you'll need it for RLS policies

2. **Add RLS write policies** (SQL Editor):
   ```sql
   -- Replace 'YOUR-UUID-HERE' with your actual UUID from step 1

   CREATE POLICY "releases: owner insert"
     ON releases FOR INSERT
     WITH CHECK (auth.uid() = 'YOUR-UUID-HERE');

   CREATE POLICY "releases: owner update"
     ON releases FOR UPDATE
     USING (auth.uid() = 'YOUR-UUID-HERE');

   CREATE POLICY "beats: owner insert"
     ON beats FOR INSERT
     WITH CHECK (auth.uid() = 'YOUR-UUID-HERE');

   CREATE POLICY "beats: owner update"
     ON beats FOR UPDATE
     USING (auth.uid() = 'YOUR-UUID-HERE');
   ```

3. **Add storage policy** for `beats-audio` bucket (SQL Editor):
   ```sql
   CREATE POLICY "beats-audio: owner insert"
     ON storage.objects FOR INSERT
     WITH CHECK (
       bucket_id = 'beats-audio'
       AND (storage.foldername(name))[1] = auth.uid()::text
     );
   ```

4. **Add env var** to `.env.local`:
   ```
   ADMIN_EMAIL=your-email@example.com
   ```
   Also add `ADMIN_EMAIL` to Vercel environment variables (server-only — no
   `NEXT_PUBLIC_` prefix).

---

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## US1 — Auth gate verification

- [ ] Navigate to `http://localhost:3000/admin` while not signed in → confirm redirect to `/login`
- [ ] Navigate to `http://localhost:3000/admin/releases/new` while not signed in → confirm redirect to `/login`
- [ ] Sign in at `/login` with your owner credentials → confirm redirect to `/admin`
- [ ] While signed in, navigate to `/admin` directly → confirm no redirect loop
- [ ] Click sign-out → confirm redirect to `/login`, then confirm `/admin` is blocked again
- [ ] (Optional, if you have a test account) Sign in with a non-owner account → confirm redirect away from admin

---

## US2 — New release form

- [ ] Sign in, navigate to `/admin/releases/new`
- [ ] Submit with title field empty → confirm inline error, form not submitted
- [ ] Fill all fields and submit → confirm success message or redirect
- [ ] Navigate to `http://localhost:3000` → confirm new release appears in the releases column
- [ ] Return to admin, set `is_visible = false` on the new release → confirm it disappears from homepage on next load
- [ ] Submit with only required fields (leave optional fields blank) → confirm saves without errors and homepage renders correctly

---

## US3 — New beat form

- [ ] Sign in, navigate to `/admin/beats/new`
- [ ] Submit with title field empty → confirm inline error
- [ ] Try uploading a `.txt` file as audio → confirm file type rejection
- [ ] Fill all fields, add 2–3 tags, upload a valid MP3 → confirm success
- [ ] Navigate to homepage → confirm beat appears in beats catalog and is playable
- [ ] Confirm beat's tags appear in the filter bar and filter the list when clicked
- [ ] Confirm BPM and key display correctly in the row
- [ ] Submit a beat with no BPM, no key, no tags → confirm saves and renders without broken layout
- [ ] Set `is_visible = false` → confirm beat disappears from homepage

---

## Build gate

```bash
npm run build
```

Expected: zero TypeScript errors, build completes successfully.
