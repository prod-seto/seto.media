import { HomeCatalog } from "@/components/HomeCatalog";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const [{ data: releases }, { data: beats }] = await Promise.all([
    supabase
      .from("releases")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("beats")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 40px 80px" }}>
      <HomeCatalog beats={beats ?? []} releases={releases ?? []} />
    </main>
  );
}
