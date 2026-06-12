import { setDefaultResultOrder } from 'node:dns';
import type { Product } from '../types/index';

// Without this, Node's fetch (undici) hangs ~10s per request and times out
// connecting to this host on this machine — forcing IPv4 resolution order
// fixes it immediately (verified: raw TCP connect succeeds with family:4).
setDefaultResultOrder('ipv4first');

// Server-only WooCommerce REST client. Credentials live in `.env` (never bundled
// to the browser since they aren't prefixed with PUBLIC_). This module must only
// be imported from Astro frontmatter / API routes — never from a client <script>.

const BASE_URL = import.meta.env.WOO_BASE_URL || 'https://gs.redmediasolutions.in';
const CONSUMER_KEY = import.meta.env.WOO_CONSUMER_KEY || '';
const CONSUMER_SECRET = import.meta.env.WOO_CONSUMER_SECRET || '';

const authHeader = 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

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

function mapWooProduct(json: any): Product {
  const regular = parseFloat(json.regular_price || json.price || '0') || 0;
  const sale = json.sale_price ? parseFloat(json.sale_price) || null : null;
  const price = sale && sale > 0 ? sale : (parseFloat(json.price || '0') || regular);
  const originalPrice = regular > price ? regular : undefined;

  const image = json.images?.[0]?.src || FALLBACK_IMAGE;
  const imageAlt = json.images?.[0]?.alt || json.name;
  // Category id 49 ("Display in App") is an app-visibility marker, not a
  // real product type — skip it and use the first actual category, e.g.
  // "Hair", "Face Wash". Falls back to a generic label if none remain.
  const realCategory = (json.categories || []).find((c: any) => c.id !== 49);
  const category = realCategory?.name || 'Gladskin';

  const composition = metaValue(json.meta_data, 'composition');
  const howItWorks = metaValue(json.meta_data, 'how_does_it_work');
  const sideEffects = metaValue(json.meta_data, 'side_effects');

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
  });

  const products = (raw as any[])
    .filter(p => !p.catalog_visibility || p.catalog_visibility !== 'hidden')
    .map(mapWooProduct);

  cachedProducts = { at: Date.now(), data: products };
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
  const raw = await wooGet('products/categories', {
    parent: '0',
    hide_empty: 'true',
    per_page: '20',
    orderby: 'name',
    order: 'asc',
  });
  const cats = (raw as any[])
    .filter((c: any) => c.id !== 49) // exclude internal "Display in App" marker
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
  return first ? mapWooProduct(first) : undefined;
}
