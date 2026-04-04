"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export type BeatState =
  | null
  | { success: true; id: string }
  | { success: false; error: string; fields?: Record<string, string> };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createBeat(
  prevState: BeatState,
  formData: FormData
): Promise<BeatState> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "Unauthorized" };
  }

  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const audio_url = (formData.get("audio_url") as string | null)?.trim() ?? "";
  const bpmRaw = (formData.get("bpm") as string | null)?.trim();
  const bpm = bpmRaw ? parseInt(bpmRaw, 10) : null;
  const key = (formData.get("key") as string | null)?.trim() || null;
  const tagsRaw = (formData.get("tags") as string | null)?.trim() ?? "";
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const is_visible = formData.get("is_visible") === "true";

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!audio_url) fieldErrors.audio_url = "Audio file is required";

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Validation failed", fields: fieldErrors };
  }

  // Generate unique slug
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let attempt = 1;

  while (true) {
    const { data: existing } = await supabase
      .from("beats")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) break;
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const { data, error } = await supabase
    .from("beats")
    .insert({
      title,
      slug,
      bpm,
      key,
      tags,
      audio_url,
      is_visible,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}
