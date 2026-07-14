import type { Product } from '../types/index';

// Server-only WooCommerce REST client. Credentials live in `.env` (never bundled
// to the browser since they aren't prefixed with PUBLIC_). This module must only
// be imported from Astro frontmatter / API routes — never from a client <script>.

const BASE_URL = import.meta.env.WOO_BASE_URL || 'https://store.gladskin.in';
const CONSUMER_KEY = import.meta.env.WOO_CONSUMER_KEY || 'ck_1f90c93d45a4593f00f89ba5c942001e13898e09';
const CONSUMER_SECRET = import.meta.env.WOO_CONSUMER_SECRET || 'cs_1c4ddd44c08c3399ecbca3e6e16f1234274ae392';

const authHeader = 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

console.log(

  'BASE_URL:',

  BASE_URL,

);

console.log(

  'WOO KEY EXISTS:',

  !!CONSUMER_KEY,

);

console.log(

  'WOO SECRET EXISTS:',

  !!CONSUMER_SECRET,

);

console.log(

  'KEY LENGTH:',

  CONSUMER_KEY.length,

);

console.log(

  'SECRET LENGTH:',

  CONSUMER_SECRET.length,

);

async function wooGet(
  path: string,
  params: Record<string, string> = {}
): Promise<any> {

  const url = new URL(
    `${BASE_URL}/wp-json/wc/v3/${path}`
  );

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  console.log("================================");
  console.log("Woo URL:", url.toString());

  const res = await fetch(
    url.toString(),
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  const body = await res.text();

  console.log("Woo Status:", res.status);
  console.log("Woo Body:", body);

  if (!res.ok) {
    throw new Error(
      `WooCommerce API ${path} failed: ${res.status}\n${body}`
    );
  }

  return JSON.parse(body);
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
  const regular =
    parseFloat(
      json.regular_price ||
      json.price ||
      '0',
    ) || 0;

  const sale =
    json.sale_price
      ? parseFloat(
          json.sale_price,
        ) || null
      : null;

  const price =
    sale && sale > 0
      ? sale
      : (parseFloat(
          json.price || '0',
        ) || regular);

  const originalPrice =
    regular > price
      ? regular
      : undefined;

  const image =
    json.images?.[0]?.src ||
    FALLBACK_IMAGE;

  const imageAlt =
    json.images?.[0]?.alt ||
    json.name;

  // Find the first non-internal category
  const realCategory =
    (json.categories || []).find(
      (c: any) =>
        !INTERNAL_CATEGORY_IDS.has(
          c.id,
        ),
    );

  const category =
    realCategory?.name ||
    'Gladskin';

  const categoryId =
    realCategory?.id || 0;

  const composition =
    metaValue(
      json.meta_data,
      'composition',
    );

  const howItWorks =
    metaValue(
      json.meta_data,
      'how_does_it_work',
    );

  const sideEffects =
    metaValue(
      json.meta_data,
      'side_effects',
    );

  const metaMap: Record<
    string,
    any
  > = {};

  for (const m of (
    json.meta_data || []
  )) {
    metaMap[m.key] = m.value;
  }

  function parseHighlight(
    prefix: string,
  ) {
    const title =
      stripHtml(
        metaMap[
          `${prefix}_title`
        ]?.toString(),
      );

    const desc =
      stripHtml(
        metaMap[
          `${prefix}_description`
        ]?.toString(),
      );

    if (!title && !desc)
      return null;

    const iconRaw =
      metaMap[
        `${prefix}_icon`
      ];

    const icon =
      iconRaw &&
      typeof iconRaw ===
        'object' &&
      iconRaw.value &&
      iconRaw.value !== '0'
        ? String(
            iconRaw.value,
          )
        : typeof iconRaw ===
              'string' &&
            iconRaw &&
            iconRaw !== '0'
          ? iconRaw
          : '';

    return {
      icon,
      title: title || '',
      description:
        desc || '',
    };
  }

  const highlights = [
    'highlights',
    'highlights_copy',
    'highlights_copy2',
    'highlights_copy3',
  ]
    .map(parseHighlight)
    .filter(
      Boolean,
    ) as {
    icon: string;
    title: string;
    description: string;
  }[];

  return {
    id: String(json.id),

    name: json.name,

    category,
    categoryId,

    price,
    originalPrice,

    badge: json.featured
      ? 'Bestseller'
      : undefined,

    image,
    imageAlt,

    slug: json.slug,

    description:
      stripHtml(
        json.short_description,
      ) ||
      stripHtml(
        json.description,
      ) ||
      undefined,

    composition,
    howItWorks,
    sideEffects,

    inStock:
      json.stock_status ===
      'instock',

    highlights:
      highlights.length > 0
        ? highlights
        : undefined,
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
  if (
    cachedCategories &&
    Date.now() - cachedCategories.at < CACHE_MS
  ) {
    return cachedCategories.data;
  }

  const cats: WooCategory[] = [
    {
      id: 49,
      name: 'All',
      slug: 'all',
      count: 0,
    },
    {
      id: 45,
      name: 'Skin',
      slug: 'skin',
      count: 0,
    },
    {
      id: 46,
      name: 'Hair',
      slug: 'hair',
      count: 0,
    },
    {
      id: 47,
      name: 'Hygiene',
      slug: 'hygiene',
      count: 0,
    },
  ];

  cachedCategories = {
    at: Date.now(),
    data: cats,
  };

  return cats;
}

const subCategoryCache = new Map<
  number,
  {
    at: number;
    data: WooCategory[];
  }
>();

export async function fetchSubCategories(
  parentId: number,
): Promise<WooCategory[]> {
  const cached =
    subCategoryCache.get(
      parentId,
    );

  if (
    cached &&
    Date.now() - cached.at <
      CACHE_MS
  ) {
    return cached.data;
  }

  const raw = await wooGet(
    'products/categories',
    {
      parent: String(parentId),
      hide_empty: 'true',
      per_page: '100',
      orderby: 'name',
      order: 'asc',
    },
  );

  const categories = (raw as any[])
    .map(
      (
        c: any,
      ): WooCategory => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c.count,
      }),
    );

  console.log(
    `Subcategories for ${parentId}:`,
    categories,
  );

  subCategoryCache.set(
    parentId,
    {
      at: Date.now(),
      data: categories,
    },
  );

  return categories;
}

export async function fetchCategoryById(

  categoryId: number,

) {

  return await wooGet(

    `products/categories/${categoryId}`,

  );

}

export async function fetchProductsByCategory(
  categoryId: number,
): Promise<Product[]> {

  const raw = await wooGet(
    'products',
    {
      per_page: '100',
      orderby: 'date',
      order: 'desc',
      status: 'publish',
      category: String(
        categoryId,
      ),
    },
  );

  return raw
    .filter(
      (p: any) =>
        (!p.catalog_visibility ||
          p.catalog_visibility !==
            'hidden') &&
        hasCategory(
          p,
          APP_VISIBLE_CATEGORY_ID,
        ),
    )
    .map(mapWooProduct);
}

export async function fetchProductsPaginated({

  page = 1,

  perPage = 24,

  categoryId,

}: {

  page?: number;

  perPage?: number;

  categoryId?: number;

}): Promise<{

  products: Product[];

  totalProducts: number;

  totalPages: number;

  currentPage: number;

}> {
  const url = new URL(
    `${BASE_URL}/wp-json/wc/v3/products`,
  );

  url.searchParams.set(
    'page',
    String(page),
  );

  url.searchParams.set(
    'per_page',
    String(perPage),
  );

  url.searchParams.set(
    'orderby',
    'date',
  );

  url.searchParams.set(
    'order',
    'desc',
  );

  url.searchParams.set(
    'status',
    'publish',
  );

  if (categoryId) {
    url.searchParams.set(
      'category',
      String(categoryId),
    );
  }

  const res = await fetch(
    url.toString(),
    {
      headers: {
        Authorization:
          authHeader,
      },
    },
  );

  if (!res.ok) {
    throw new Error(
      `WooCommerce API failed: ${res.status}`,
    );
  }

  const raw =
    await res.json();

  const totalProducts =
    Number(
      res.headers.get(
        'X-WP-Total',
      ),
    ) || 0;

  const totalPages =
    Number(
      res.headers.get(
        'X-WP-TotalPages',
      ),
    ) || 1;

  const products = raw
    .filter(
      (p: any) =>
        (!p.catalog_visibility ||
          p.catalog_visibility !==
            'hidden') &&
        hasCategory(
          p,
          APP_VISIBLE_CATEGORY_ID,
        ),
    )
    .map(mapWooProduct);

  return {
    products,
    totalProducts,
    totalPages,
    currentPage: page,
  };
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
