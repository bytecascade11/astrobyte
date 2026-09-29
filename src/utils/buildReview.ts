// src/utils/buildReview.ts
// Builds the `review` prop for <Layout> / <SchemaMarkup> from a brand collection entry.
// Returns undefined (no Review schema) unless the post is a real review with a rating.

const BRAND_NAMES: Record<string, string> = {
  samsung: "Samsung",
  xiaomi: "Xiaomi",
  tecno: "Tecno",
  motorola: "Motorola",
  huawei: "Huawei",
  honor: "HONOR",
  oneplus: "OnePlus",
  pixel: "Google",
  nothing: "Nothing",
  apple: "Apple",
  oppo: "OPPO",
  vivo: "vivo",
  infinix: "Infinix",
};

type ReviewData = {
  type?: string;
  model?: string;
  rating?: number;
};

export function buildReview(collection: string, data: ReviewData) {
  const brand = BRAND_NAMES[collection];
  if (!brand) return undefined;
  if (data.type !== "review") return undefined;
  if (!data.model || typeof data.rating !== "number" || data.rating <= 0) return undefined;

  // Avoid "Samsung Samsung Galaxy..." if the model already starts with the brand.
  const productName = data.model.toLowerCase().startsWith(brand.toLowerCase())
    ? data.model
    : `${brand} ${data.model}`;

  return {
    productName,
    brand,
    ratingValue: data.rating,
    bestRating: 5,
  };
}
