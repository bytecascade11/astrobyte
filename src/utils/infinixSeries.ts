// src/utils/infinixSeries.ts
export const INFINIX_SERIES = ["Hot", "Note", "Zero", "GT", "Smart"] as const;
export type InfinixSeries = (typeof INFINIX_SERIES)[number];

export const SERIES_NOTE: Record<InfinixSeries, string> = {
  Hot: "Everyday value and gaming on a budget",
  Note: "Big battery, big screen, mid-range price",
  Zero: "Camera and design flagships",
  GT: "Built for gaming performance",
  Smart: "Entry-level phones",
};

// Uses the `series` frontmatter field if set, otherwise reads it from the
// model/title (e.g. "Infinix Hot 60 Pro" -> "Hot"). Case-sensitive on purpose
// so words like "hot" or "note" in normal sentences don't match.
export function getInfinixSeries(data: {
  series?: string;
  model?: string;
  title: string;
}): InfinixSeries | null {
  if (data.series) {
    const exact = INFINIX_SERIES.find(
      s => s.toLowerCase() === data.series!.toLowerCase()
    );
    if (exact) return exact;
  }
  const text = `${data.model ?? ""} ${data.title}`;
  return INFINIX_SERIES.find(s => new RegExp(`\\b${s}\\b`).test(text)) ?? null;
                  }

