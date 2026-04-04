"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function updateReleasesOrder(
  ids: string[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "Unauthorized" };
  }

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("releases")
      .update({ sort_order: i + 1 })
      .eq("id", ids[i]);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

export async function updateBeatsOrder(
  ids: string[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "Unauthorized" };
  }

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("beats")
      .update({ sort_order: i + 1 })
      .eq("id", ids[i]);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}
