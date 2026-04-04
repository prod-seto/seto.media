"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function updateToolDisk(
  toolId: string,
  data: {
    disk_image_url?: string | null;
    disk_font?: string;
    disk_font_color?: string;
    name?: string;
    is_visible?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("tools")
    .update(data)
    .eq("id", toolId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
