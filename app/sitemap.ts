import { MetadataRoute } from "next";
import { locales } from "@/i18n.config";
import { APIResponse, Product } from "@/app/types/productsTypes";
import blogData from "@/app/staticData/blog.json";

const baseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

// Helper to generate URLs with locale prefixes
// Path should NOT start with a slash (e.g., 'fleurs-cbd' or 'blog/post-slug')
// For the homepage, pass an empty string ''
const generateUrl = (locale: string, path: string = ""): string => {
  return `${baseUrl}/${locale}${path ? `/${path}` : ""}`;
};

// Helper to create sitemap entries with alternates
const createUrlEntry = (
  path: string = "", // Path relative to locale root (e.g., '', 'fleurs-cbd', 'blog/post-slug')
  lastModified: Date | string | undefined = undefined,
  priority: number = 0.8 // Default priority
): MetadataRoute.Sitemap[number] => {
  // Determine priority adjustments
  let adjustedPriority = priority;
  if (path === "") adjustedPriority = 1.0; // Homepage highest
  else if (path.startsWith("blog/")) adjustedPriority = 0.7; // Blog posts slightly lower
  else if (path.includes("/")) adjustedPriority = 0.9; // Products slightly higher than categories/blog posts
  else if (path === "blog" || path === "FAQ" || path === "a-propos-de-monplancbd") adjustedPriority = 0.6; // Index/info pages lower

  const entry: MetadataRoute.Sitemap[number] = {
    url: generateUrl(locales[0], path), // Default to first locale (e.g., 'fr') for the main URL
    lastModified: lastModified ? new Date(lastModified).toISOString() : undefined,
    priority: adjustedPriority,
    alternates: {
      languages: {},
    },
  };

  locales.forEach((locale) => {
    if (entry.alternates?.languages) {
      entry.alternates.languages[locale] = generateUrl(locale, path);
    }
  });

  return entry;
};

// Categories
const categorySlugs = ["fleurs-cbd", "pollens-resines-hash-cbd", "moonrocks-cbd", "huiles-cbd", "infusions-cbd", "soins-cbd", "vaporisateur"];

// Fetch All Products (Necessary to get slugs and categories for product pages)
async function getAllProducts(): Promise<Product[]> {
  try {
    // Assuming a single endpoint returns all products needed for the sitemap
    const response = await fetch(`${process.env.API_HOST}/products`);
    if (!response.ok) {
      console.error(`Sitemap: Failed to fetch all products - ${response.status}`);
      return [];
    }
    // Assuming the API returns an object where keys are product IDs/slugs
    // and values are product objects, similar to your CategoryPage fetch.
    // Adjust parsing based on the actual API response structure.
    const data: APIResponse<Product> = await response.json();
    // Filter out potential null/invalid entries and ensure products have slugs
    return Object.values(data.products).filter((p) => p && p.slug);
  } catch (error) {
    console.error("Sitemap: Error fetching all products:", error);
    return [];
  }
}

// --- Generate Sitemap ---

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allProducts = await getAllProducts();
  const now = new Date(); // Use for default lastModified

  // 1. Static Pages
  const staticPages = [
    "", // Homepage
    "FAQ",
    "mentions-legales",
    "conditions-dutilisation",
    "politiques-de-confidentialites",
    "politique-expedition",
    "a-propos-de-monplancbd",
    // Excluded: /connexion, /inscription, /mot-de-passe-oublie, /panier, /expedition, /paiement, /paiement-virement-bancaire
  ].map((path) => createUrlEntry(path, now));

  // 2. Blog Index Page
  const blogIndexPage = [createUrlEntry("blog", now)];

  // 3. Blog Post Pages
  const blogPostPages = blogData.map((post) => {
    // Attempt to parse the date, fallback to now
    let lastModDate: Date | undefined;
    try {
      // Assuming format DD/MM/YYYY - requires careful parsing
      const parts = post.published.split("/");
      if (parts.length === 3) {
        // Note: Month is 0-indexed in Date constructor (part[1] - 1)
        lastModDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (isNaN(lastModDate.getTime())) {
          // Check if date is valid
          lastModDate = now;
        }
      } else {
        lastModDate = now;
      }
    } catch (e) {
      lastModDate = now; // Fallback on parsing error
    }
    return createUrlEntry(`blog/${post.href}`, lastModDate);
  });

  // 4. Category Pages
  const categoryPages = categorySlugs.map((slug) => createUrlEntry(slug, now));

  // 5. Product Pages
  const productPages = allProducts
    .map((product) => {
      // Find the corresponding category slug for the product
      // This assumes product.category directly matches one of the slugs.
      // If product.category is 'fleurs' and slug is 'fleurs-cbd', you need a mapping.
      // Let's assume for now product.category IS the slug. Adjust if needed.
      const categorySlug = product.category; // Needs verification - might need mapping
      if (!categorySlugs.includes(categorySlug)) {
        console.warn(`Sitemap: Product ${product.id} has unknown category slug '${categorySlug}'. Skipping.`);
        return null; // Skip product if category slug isn't known/valid
      }
      // Use product's own update time if available, otherwise fallback
      const lastMod = now; // Assuming product has a lastModified field
      return createUrlEntry(`${categorySlug}/${product.slug}`, lastMod);
    })
    .filter((entry) => entry !== null) as MetadataRoute.Sitemap; // Filter out nulls and assert type

  return [...staticPages, ...blogIndexPage, ...blogPostPages, ...categoryPages, ...productPages];
}
