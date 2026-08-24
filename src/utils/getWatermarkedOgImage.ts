export function getWatermarkedOgImage(
  collection: string,
  slug: string,
  hasCoverImage: boolean,
  fallback = "/og.png"
): string {
  if (!hasCoverImage) return fallback;
  return `/og-watermarked/${collection}/${slug}.jpg`;
}
