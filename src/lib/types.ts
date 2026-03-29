import type { Tables } from "./database.types";

// Derived from generated schema — run `npm run db:types` to regenerate
export type Release = Tables<"releases">;
export type Beat = Tables<"beats">;

export type ReleaseType = "single" | "ep" | "album";
