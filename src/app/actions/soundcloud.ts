"use server";

export async function fetchSoundCloudMetadata(url: string): Promise<{
  title?: string;
  artist?: string;
  coverUrl?: string;
  error?: string;
}> {
  if (!url) return { error: "URL is required" };

  let response: Response;
  try {
    response = await fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`,
      { next: { revalidate: 0 } }
    );
  } catch {
    return { error: "Could not fetch track metadata" };
  }

  if (!response.ok) {
    return { error: "Could not fetch track metadata" };
  }

  let data: Record<string, unknown>;
  try {
    data = await response.json();
  } catch {
    return { error: "Could not fetch track metadata" };
  }

  // oEmbed returns type: "rich" for tracks, "link" for playlists/profiles
  if (data.type !== "rich") {
    return { error: "URL must be a SoundCloud track, not a playlist or profile" };
  }

  return {
    title: typeof data.title === "string" ? data.title : undefined,
    artist: typeof data.author_name === "string" ? data.author_name : undefined,
    coverUrl: typeof data.thumbnail_url === "string" ? data.thumbnail_url : undefined,
  };
}
