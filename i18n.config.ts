export const locales = ["fr", "en", "es"] as const;
export type Locale = (typeof locales)[number];
