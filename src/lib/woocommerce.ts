import type { Product } from '../types/index';

// Server-only WooCommerce REST client. Credentials live in `.env` (never bundled
// to the browser since they aren't prefixed with PUBLIC_). This module must only
// be imported from Astro frontmatter / API routes — never from a client <script>.

const BASE_URL = import.meta.env.WOO_BASE_URL || 'https://gs.redmediasolutions.in';
const CONSUMER_KEY = import.meta.env.WOO_CONSUMER_KEY || '';
const CONSUMER_SECRET = import.meta.env.WOO_CONSUMER_SECRET || '';

const authHeader = 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

async function wooGet(path: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${BASE_URL}/wp-json/wc/v3/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const res = await fetch(url.toString(), { headers: { Authorization: authHeader } });
  if (!res.ok) throw new Error(`WooCommerce API ${path} failed: ${res.status}`);
  return res.json();
}

function stripHtml(html: string | undefined | null): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/&#8211;|&#8212;/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function metaValue(metaData: any[], key: string): string | undefined {
  const entry = (metaData || []).find(m => m.key === key && m.value);
  return entry ? stripHtml(String(entry.value)) : undefined;
}

const FALLBACK_IMAGE = 'https://placehold.co/600x800/6f0562/ffffff?font=montserrat&text=Gladskin';

// "Display in App" — master visibility switch. Only products tagged with this
// category are shown anywhere on the site.
const APP_VISIBLE_CATEGORY_ID = 49;
// Curated homepage row categories (organizational markers, not real product types).
export const HOMEPAGE_CATEGORY_ID = 19;
export const RECOMMENDED_CATEGORY_ID = 41;

const INTERNAL_CATEGORY_IDS = new Set([APP_VISIBLE_CATEGORY_ID, HOMEPAGE_CATEGORY_ID, RECOMMENDED_CATEGORY_ID]);

function hasCategory(json: any, categoryId: number): boolean {
  return (json.categories || []).some((c: any) => c.id === categoryId);
}

function mapWooProduct(json: any): Product {
  const regular = parseFloat(json.regular_price || json.price || '0') || 0;
  const sale = json.sale_price ? parseFloat(json.sale_price) || null : null;
  const price = sale && sale > 0 ? sale : (parseFloat(json.price || '0') || regular);
  const originalPrice = regular > price ? regular : undefined;

  const image = json.images?.[0]?.src || FALLBACK_IMAGE;
  const imageAlt = json.images?.[0]?.alt || json.name;
  // Internal marker categories (app visibility / homepage row placement) are
  // not real product types — skip them and use the first actual category,
  // e.g. "Hair", "Face Wash". Falls back to a generic label if none remain.
  const realCategory = (json.categories || []).find((c: any) => !INTERNAL_CATEGORY_IDS.has(c.id));
  const category = realCategory?.name || 'Gladskin';

  const composition = metaValue(json.meta_data, 'composition');
  const howItWorks = metaValue(json.meta_data, 'how_does_it_work');
  const sideEffects = metaValue(json.meta_data, 'side_effects');

  // Mirrors glowfit ProductDetail.fromJson extractHighlights:
  // WooCommerce stores up to 4 highlights via ACF with prefixes:
  // highlights, highlights_copy, highlights_copy2, highlights_copy3
  const metaMap: Record<string, any> = {};
  for (const m of (json.meta_data || [])) metaMap[m.key] = m.value;

  function parseHighlight(prefix: string) {
    const title = stripHtml(metaMap[`${prefix}_title`]?.toString());
    const desc  = stripHtml(metaMap[`${prefix}_description`]?.toString());
    if (!title && !desc) return null;
    const iconRaw = metaMap[`${prefix}_icon`];
    const icon = (iconRaw && typeof iconRaw === 'object' && iconRaw.value && iconRaw.value !== '0')
      ? String(iconRaw.value)
      : (typeof iconRaw === 'string' && iconRaw && iconRaw !== '0' ? iconRaw : '');
    return { icon, title: title || '', description: desc || '' };
  }

  const highlights = ['highlights', 'highlights_copy', 'highlights_copy2', 'highlights_copy3']
    .map(parseHighlight)
    .filter(Boolean) as { icon: string; title: string; description: string }[];

  return {
    id: String(json.id),
    name: json.name,
    price,
    originalPrice,
    category,
    badge: json.featured ? 'Bestseller' : undefined,
    image,
    imageAlt,
    slug: json.slug,
    description: stripHtml(json.short_description) || stripHtml(json.description) || undefined,
    composition,
    howItWorks,
    sideEffects,
    inStock: json.stock_status === 'instock',
    highlights: highlights.length > 0 ? highlights : undefined,
  };
}

let cachedProducts: { at: number; data: Product[] } | null = null;
const CACHE_MS = 5 * 60 * 1000;

export async function fetchLiveProducts(): Promise<Product[]> {
  if (cachedProducts && Date.now() - cachedProducts.at < CACHE_MS) return cachedProducts.data;

  const raw = await wooGet('products', {
    per_page: '100',
    orderby: 'date',
    order: 'desc',
    status: 'publish',
    category: String(APP_VISIBLE_CATEGORY_ID),
  });

  const products = (raw as any[])
    .filter(p => !p.catalog_visibility || p.catalog_visibility !== 'hidden')
    .map(mapWooProduct);

  cachedProducts = { at: Date.now(), data: products };
  return products;
}

const categoryRowCache = new Map<number, { at: number; data: Product[] }>();

// Products for a curated homepage row: must carry both the row's category
// (e.g. "Homepage" or "Recommended Section") and the "Display in App" marker.
export async function fetchLiveProductsByCategory(categoryId: number): Promise<Product[]> {
  const cached = categoryRowCache.get(categoryId);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;

  const raw = await wooGet('products', {
    per_page: '100',
    orderby: 'date',
    order: 'desc',
    status: 'publish',
    category: String(categoryId),
  });

  const products = (raw as any[])
    .filter(p => (!p.catalog_visibility || p.catalog_visibility !== 'hidden') && hasCategory(p, APP_VISIBLE_CATEGORY_ID))
    .map(mapWooProduct);

  categoryRowCache.set(categoryId, { at: Date.now(), data: products });
  return products;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

let cachedCategories: { at: number; data: WooCategory[] } | null = null;

export async function fetchLiveCategories(): Promise<WooCategory[]> {
  if (cachedCategories && Date.now() - cachedCategories.at < CACHE_MS) return cachedCategories.data;
  // Includes subcategories (e.g. "Face Wash", "Female", "Hair Conditioner") —
  // the mobile app's Remote Config "productcategories" list can reference any
  // category ID regardless of its place in the WooCommerce hierarchy.
  const raw = await wooGet('products/categories', {
    hide_empty: 'true',
    per_page: '100',
    orderby: 'name',
    order: 'asc',
  });
  const cats = (raw as any[])
    .filter((c: any) => !INTERNAL_CATEGORY_IDS.has(c.id)) // exclude internal marker categories
    .map((c: any): WooCategory => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }));
  cachedCategories = { at: Date.now(), data: cats };
  return cats;
}

export async function fetchLiveProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await fetchLiveProducts();
  const match = products.find(p => p.slug === slug);
  if (match) return match;

  // Not in the cached listing (e.g. not in the first 100) — try a direct lookup.
  const raw = await wooGet('products', { slug });
  const first = (raw as any[])[0];
  return first && hasCategory(first, APP_VISIBLE_CATEGORY_ID) ? mapWooProduct(first) : undefined;
}
