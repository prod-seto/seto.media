"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export type ReleaseState =
  | null
  | { success: true; id: string }
  | { success: false; error: string; fields?: Record<string, string> };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createRelease(
  prevState: ReleaseState,
  formData: FormData
): Promise<ReleaseState> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "Unauthorized" };
  }

  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const artist = (formData.get("artist") as string | null)?.trim() ?? "";
  const type = (formData.get("type") as string | null) ?? "single";
  const soundcloud_url = (formData.get("soundcloud_url") as string | null)?.trim() || null;
  const cover_url = (formData.get("cover_url") as string | null)?.trim() || null;
  const released_at = (formData.get("released_at") as string | null)?.trim() || null;
  const is_visible = formData.get("is_visible") === "true";

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!artist) fieldErrors.artist = "Artist is required";

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Validation failed", fields: fieldErrors };
  }

  // Generate unique slug
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let attempt = 1;

  while (true) {
    const { data: existing } = await supabase
      .from("releases")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) break;
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const { data, error } = await supabase
    .from("releases")
    .insert({
      title,
      artist,
      type,
      slug,
      soundcloud_url,
      cover_url,
      released_at,
      is_visible,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}
