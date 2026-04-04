# Feature Specification: Admin Auth & Content Ingestion

**Feature Branch**: `003-admin-auth-ingestion`
**Created**: 2026-04-03
**Status**: Draft
**Input**: User description: "email/password sign-in, a protected /admin route, and a
middleware check that gates admin pages to my account only. No public registration needed
— I'm the only admin. Admin content ingestion: two forms behind the auth gate — new
release (title, artist, type, SoundCloud URL, cover URL, released_at, is_visible toggle)
and new beat (title, BPM, key, tags multi-input, audio file upload to storage,
is_visible toggle)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Admin Sign-In (Priority: P1)

The site owner navigates to `/admin`, is redirected to a sign-in page, enters their
email and password, and lands on the admin dashboard. Unauthenticated visitors who
attempt to access any `/admin` page are redirected to sign-in and cannot access
protected content.

**Why this priority**: Authentication is the prerequisite for all admin capabilities.
Without it, content ingestion is inaccessible. It is also the primary security
boundary — an unprotected admin area would expose destructive write operations to
anyone.

**Independent Test**: Navigate to `/admin` while signed out — confirm redirect to
sign-in. Sign in with valid credentials — confirm access to the admin dashboard. Close
the browser and reopen `/admin` — confirm the session persists (within session
lifetime). Sign out — confirm `/admin` is inaccessible again.

**Acceptance Scenarios**:

1. **Given** a visitor is not signed in, **When** they navigate to any `/admin` page,
   **Then** they are redirected to the sign-in page and cannot view admin content.
2. **Given** the sign-in page is open, **When** the site owner enters valid credentials,
   **Then** they are signed in and redirected to the admin dashboard.
3. **Given** the sign-in page is open, **When** incorrect credentials are entered,
   **Then** an error message is shown and access is denied.
4. **Given** the site owner is signed in, **When** they sign out,
   **Then** they are redirected to the sign-in page and `/admin` is inaccessible again.
5. **Given** an account that is not the owner's, **When** it attempts to access `/admin`,
   **Then** access is denied — the admin gate is tied to the owner's specific account,
   not merely to being authenticated.

---

### User Story 2 — Add a New Release (Priority: P2)

The site owner uses an admin form to add a new release. They enter the title, artist
name, release type, SoundCloud URL, an optional cover image URL, an optional release
date, and a visibility toggle. On submission, the release appears on the homepage (if
visible) without requiring a deployment.

**Why this priority**: Releases are the primary showcase content. Being able to add
them without touching the database directly is the most valuable content management
capability after auth.

**Independent Test**: Sign in to `/admin`. Submit the "New Release" form with all
fields filled. Navigate to the homepage — confirm the new release appears in the
releases column. Return to admin and toggle `is_visible` off — confirm the release
disappears from the homepage.

**Acceptance Scenarios**:

1. **Given** the admin is signed in, **When** they submit the new release form with all
   required fields, **Then** the release is saved and appears on the homepage.
2. **Given** the new release form, **When** a required field is left empty,
   **Then** submission is blocked and a validation message is shown.
3. **Given** a release saved with `is_visible = false`, **When** a visitor views the
   homepage, **Then** that release does not appear in the catalog.
4. **Given** a release saved with `is_visible = true`, **When** the admin toggles it
   to `false`, **Then** the homepage no longer shows the release on the next load.

---

### User Story 3 — Add a New Beat (Priority: P2)

The site owner uses an admin form to add a new beat. They enter the title, BPM,
musical key, one or more tags, and upload an audio file. On submission, the beat is
stored and appears in the beats catalog (if visible), playable via the existing audio
player.

**Why this priority**: Equal priority to release ingestion — both are the core
content management capability. Beat ingestion is slightly more complex due to audio
file upload, but the user value is equivalent.

**Independent Test**: Sign in to `/admin`. Submit the "New Beat" form with a title,
BPM, key, at least one tag, and an MP3 audio file. Navigate to the homepage — confirm
the new beat appears in the beats catalog, is playable, and its tag appears in the
filter bar.

**Acceptance Scenarios**:

1. **Given** the admin is signed in, **When** they submit the new beat form with all
   required fields and an audio file, **Then** the beat is saved and appears in the
   homepage beats catalog.
2. **Given** the new beat form, **When** the title field is empty,
   **Then** submission is blocked and a validation message is shown.
3. **Given** a new beat with tags, **When** the beat is saved and the homepage is
   visited, **Then** the beat's tags appear in the filter bar and filter correctly.
4. **Given** a beat saved with `is_visible = false`, **When** a visitor views the
   homepage, **Then** that beat does not appear.
5. **Given** an audio file is uploaded, **When** the beat is saved,
   **Then** the file is stored and the beat is playable from the homepage.

---

### Edge Cases

- Submitting a form while the network drops mid-upload — the form must show an error
  and not silently save a partial record.
- Uploading a non-audio file type for a beat — the form must reject it before
  submission with a clear message.
- The admin session expires while a form is open — submitting must redirect to sign-in
  rather than silently failing or writing unauthenticated data.
- A title that would produce a slug collision with an existing record — a unique slug
  must be generated automatically (e.g., append a numeric suffix).
- Optional fields left blank (cover URL, released_at for releases; BPM, key for beats)
  — the form must save and the homepage must render without layout breakage.
- Very large audio file — the form should show upload progress and handle a timeout
  gracefully rather than hanging silently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Any unauthenticated request to `/admin` or any sub-route MUST be
  redirected to the sign-in page; no admin content may be rendered to a non-authenticated
  visitor.
- **FR-002**: The sign-in page MUST accept an email address and password and grant
  access only to the site owner's specific account.
- **FR-003**: Access to admin pages MUST be denied to any account other than the
  owner's, even if that account is otherwise authenticated.
- **FR-004**: The admin area MUST provide a sign-out action that immediately revokes
  admin access and redirects to sign-in.
- **FR-005**: The admin area MUST contain a form for adding a new release with the
  following fields: title (required), artist (required), type (required; single/EP/album),
  SoundCloud URL (optional), cover image URL (optional), release date (optional),
  is_visible toggle (default: true).
- **FR-006**: The admin area MUST contain a form for adding a new beat with the
  following fields: title (required), BPM (optional, numeric), musical key (optional),
  tags (optional, multi-value), audio file upload (required), is_visible toggle
  (default: true).
- **FR-007**: On beat form submission, the audio file MUST be uploaded to file storage
  and the resulting URL MUST be saved as the beat's audio source.
- **FR-008**: Both forms MUST validate required fields client-side before submission
  and display inline error messages for invalid or missing values.
- **FR-009**: A newly saved release or beat MUST appear on the homepage on the next
  page load without requiring a code deployment or manual cache flush.
- **FR-010**: The `is_visible` flag MUST control homepage visibility for both releases
  and beats; toggling it MUST take effect on the next page load.

### Key Entities

- **Admin session**: The authenticated state of the site owner. Scoped to a single
  trusted account; persists across browser sessions until explicit sign-out or expiry.
- **Release**: A music release with title, artist, type, optional SoundCloud URL,
  optional cover image URL, optional release date, and a visibility flag. Slug is
  auto-derived from the title and must be unique.
- **Beat**: A produced instrumental with title, optional BPM, optional musical key,
  optional tags array, an audio file reference, and a visibility flag. Slug is
  auto-derived from the title and must be unique.
- **Audio file**: A binary audio asset uploaded by the admin, stored in a dedicated
  file storage bucket, and referenced by the beat's audio source field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An unauthenticated request to any `/admin` page is redirected to sign-in
  within one navigation — no admin content is ever rendered to a non-authenticated
  visitor.
- **SC-002**: The site owner can sign in and reach the admin dashboard in under 30
  seconds from a cold start.
- **SC-003**: The site owner can add a new release (all fields, no file upload) and
  see it on the homepage within 60 seconds end-to-end.
- **SC-004**: The site owner can add a new beat including an audio file upload and see
  it playable on the homepage within 3 minutes end-to-end (network speed dependent).
- **SC-005**: Toggling `is_visible` on a saved record takes effect on the homepage
  within one page reload — no deployment required.
- **SC-006**: A non-owner account cannot access any `/admin` page — confirmed by
  attempting access with a non-owner session and verifying denial.
- **SC-007**: The admin interface passes a build check with zero errors.

## Assumptions

- Only one admin account exists and will ever exist — the site owner. There is no
  admin user management UI in scope.
- No public registration UI is in scope. The sign-in page is owner-only and must not
  invite open registration.
- Audio files uploaded for beats are MP3 format. Other formats are out of scope.
- There is no edit or delete capability for existing releases or beats in this feature.
  Add-only is the full scope; editing and deleting are future features.
- The admin area does not need to match the Contemporary Soft Club design system
  precisely — functional clarity takes priority, but it should not look completely
  foreign to the site aesthetic.
- Slugs are auto-derived from titles (lowercase, hyphens). Collisions are resolved
  by appending a numeric suffix.
- The existing `releases` and `beats` tables are the target data store. No new tables
  are required.
- The `beats-audio` storage bucket already exists in Supabase Storage.
