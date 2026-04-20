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
    <main className="max-w-[960px] mx-auto px-4 sm:px-10 pt-8 pb-20">
      <HomeCatalog beats={beats ?? []} releases={releases ?? []} />
    </main>
  );
}
