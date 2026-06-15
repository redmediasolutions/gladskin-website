import type { Product } from '../types/index.ts';

const ph = (label: string, bg: string) =>
  `https://placehold.co/600x800/${bg}/ffffff?font=montserrat&text=${encodeURIComponent(label)}`;

export const products: Product[] = [
  {
    id: '1',
    name: 'Vitawhite Kojic Facewash',
    price: 215,
    originalPrice: 354,
    category: 'Skin',
    image: ph('Vitawhite Kojic Facewash', '6f0562'),
    imageAlt: 'Vitawhite Kojic Facewash bottle',
    slug: 'vitawhite-kojic-facewash',
    inStock: true,
    description: 'A brightening face wash powered by kojic acid that gently lifts away dullness, evens out tone and leaves skin feeling fresh and luminous after every cleanse.',
    composition: 'Kojic Acid, Glycolic Acid, Niacinamide, Aloe Vera Extract, Glycerin, Vitamin E, Mild Surfactant Base',
    howItWorks: 'Kojic acid inhibits melanin production at the source while glycolic acid gently exfoliates surface buildup, revealing brighter, more even-toned skin with regular use.',
    sideEffects: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Patch test recommended before first use.',
    highlights: [
      { icon: 'wb_sunny',   title: 'Brightening Formula',  description: 'Kojic acid visibly reduces dullness and dark spots over time.' },
      { icon: 'water_drop', title: 'Gentle Daily Cleanse',  description: 'Mild surfactant base cleanses without stripping the skin barrier.' },
      { icon: 'eco',        title: 'Aloe Infused',          description: 'Soothes and hydrates while it cleanses.' },
      { icon: 'science',    title: 'Dermat Tested',         description: 'Formulated and tested for everyday facial use.' },
    ],
  },
  {
    id: '2',
    name: 'Collagen Peptides',
    price: 72,
    originalPrice: 110,
    category: 'Hygiene',
    image: ph('Collagen Peptides', 'b70b68'),
    imageAlt: 'Collagen Peptides supplement pack',
    slug: 'collagen-peptides',
    inStock: true,
    description: 'A daily peptide supplement that supports skin elasticity, hair strength and joint comfort from within â€” easy to mix into your everyday routine.',
    composition: 'Hydrolysed Collagen Peptides, Vitamin C, Biotin, Zinc, Hyaluronic Acid',
    howItWorks: 'Hydrolysed peptides are rapidly absorbed and delivered to skin and connective tissue, supporting your body\'s natural collagen production for visible results over weeks of consistent use.',
    sideEffects: 'Not recommended during pregnancy or breastfeeding without medical advice. Consult a physician if you have existing health conditions.',
    highlights: [
      { icon: 'favorite',     title: 'Skin Elasticity',  description: 'Supports firmer, more resilient skin from within.' },
      { icon: 'bolt',         title: 'Daily Boost',       description: 'One serving a day fits easily into any routine.' },
      { icon: 'spa',          title: 'Hair & Nail Care',  description: 'Strengthens hair and nails alongside skin benefits.' },
      { icon: 'science',      title: 'Lab Verified',      description: 'Tested for purity and potency in every batch.' },
    ],
  },
  {
    id: '3',
    name: 'Hair Removal Cream Spray',
    price: 236,
    originalPrice: 472,
    category: 'Hair',
    image: ph('Hair Removal Cream Spray', '8c277b'),
    imageAlt: 'Hair Removal Cream Spray bottle',
    slug: 'hair-removal-cream-spray',
    inStock: true,
    description: 'A fast-acting spray-on hair removal cream that works in minutes, leaving skin smooth and irritation-free without the need for razors or waxing.',
    composition: 'Calcium Thioglycolate, Aloe Vera Extract, Glycerin, Vitamin E, Fragrance (Mild)',
    howItWorks: 'The spray formula breaks down hair structure at the surface for quick, painless removal. Aloe and Vitamin E condition skin during and after use, minimising redness and irritation.',
    sideEffects: 'Patch test 24 hours before use. Do not use on broken or irritated skin. Rinse thoroughly after the recommended contact time.',
    highlights: [
      { icon: 'bolt',        title: 'Fast Acting',     description: 'Removes hair in as little as 5 minutes.' },
      { icon: 'spa',         title: 'Skin Conditioning', description: 'Aloe and Vitamin E soothe skin during use.' },
      { icon: 'spray',       title: 'Easy Spray Application', description: 'No mess, no strips â€” just spray, wait, rinse.' },
      { icon: 'eco',         title: 'Dermat Tested',   description: 'Formulated to minimise irritation on sensitive skin.' },
    ],
  },
  {
    id: '4',
    name: 'Femihope Drops',
    price: 101,
    originalPrice: 158,
    category: 'Hygiene',
    image: ph('Femihope Drops', 'fe509e'),
    imageAlt: 'Femihope Drops bottle',
    slug: 'femihope-drops',
    inStock: true,
    description: 'A gentle daily wellness drop formulated to support feminine hormonal balance and everyday comfort, made with trusted botanical actives.',
    composition: 'Shatavari Extract, Ashoka Extract, Lodhra Extract, Aloe Vera, Purified Water Base',
    howItWorks: 'Traditional botanical actives work together to support the body\'s natural hormonal rhythm when taken consistently as part of a daily routine.',
    sideEffects: 'Consult a healthcare provider before use if pregnant, breastfeeding, or on medication. Discontinue if discomfort occurs.',
    highlights: [
      { icon: 'favorite',  title: 'Hormonal Balance',  description: 'Botanical actives support natural cyclical comfort.' },
      { icon: 'spa',       title: 'Gentle Formula',     description: 'Made with traditionally trusted herbal extracts.' },
      { icon: 'water_drop',title: 'Easy Daily Drops',   description: 'Simple to dose and add to your daily routine.' },
      { icon: 'science',   title: 'Quality Tested',     description: 'Every batch is tested for safety and consistency.' },
    ],
  },
  {
    id: '5',
    name: 'Hydrating Body Lotion',
    price: 148,
    originalPrice: 400,
    category: 'Skin',
    image: ph('Hydrating Body Lotion', 'b0265f'),
    imageAlt: 'Hydrating Body Lotion bottle',
    slug: 'hydrating-body-lotion',
    inStock: true,
    description: 'A lightweight, fast-absorbing body lotion that locks in moisture for up to 24 hours, leaving skin soft, smooth and lightly fragranced.',
    composition: 'Shea Butter, Glycerin, Hyaluronic Acid, Niacinamide, Vitamin E, Aloe Vera Extract',
    howItWorks: 'A blend of humectants and emollients draws moisture into the skin and seals it in, restoring softness and comfort from the very first application.',
    sideEffects: 'For external use only. Discontinue if irritation occurs. Suitable for daily use on body and limbs.',
    highlights: [
      { icon: 'water_drop', title: '24-Hour Hydration', description: 'Keeps skin soft and supple all day long.' },
      { icon: 'spa',        title: 'Lightweight Feel',  description: 'Absorbs quickly without a greasy residue.' },
      { icon: 'eco',        title: 'Shea & Aloe Blend', description: 'Nourishing botanicals soothe and condition.' },
      { icon: 'auto_awesome', title: 'Soft Glow Finish', description: 'Leaves skin looking visibly smoother and radiant.' },
    ],
  },
  {
    id: '6',
    name: 'Quick Glow Face Serum',
    price: 100,
    originalPrice: 500,
    category: 'Men',
    badge: 'Bestseller',
    image: ph('Quick Glow Face Serum', '6f0562'),
    imageAlt: 'Quick Glow Face Serum bottle',
    slug: 'quick-glow-face-serum',
    inStock: true,
    description: 'A quick-absorbing daily serum designed for men\'s skin, instantly refreshing tired-looking skin and reducing the appearance of dullness after a long day.',
    composition: 'Niacinamide, Caffeine Extract, Hyaluronic Acid, Vitamin C, Aloe Vera, Glycerin',
    howItWorks: 'Caffeine and Vitamin C work together to energise tired-looking skin while niacinamide and hyaluronic acid restore hydration and even out tone â€” all in one quick step.',
    sideEffects: 'For external use only. Avoid contact with eyes. Patch test recommended for sensitive skin.',
    highlights: [
      { icon: 'bolt',        title: 'Instant Refresh',  description: 'Caffeine-infused formula revives tired-looking skin fast.' },
      { icon: 'wb_sunny',    title: 'Brightens Tone',   description: 'Vitamin C helps even out and brighten complexion.' },
      { icon: 'water_drop',  title: 'Lightweight Hydration', description: 'Hyaluronic acid hydrates without feeling heavy.' },
      { icon: 'eco',         title: 'Built for Daily Use',  description: 'Fast-absorbing formula fits any morning routine.' },
    ],
  },
];

// Live catalog comes from the same WooCommerce store the glowfit app uses
// (fetched server-side in src/lib/woocommerce.ts — credentials never reach the
// browser). The local mock array above is kept only as a fallback if the store
// is briefly unreachable, so the site never renders empty.

export async function getProducts(): Promise<Product[]> {
  try {
    const { fetchLiveProducts } = await import('../lib/woocommerce');
    const live = await fetchLiveProducts();
    if (live.length > 0) return live;
  } catch (err) {
    console.warn('[products] live catalog fetch failed, using fallback data:', err);
  }
  return products;
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    const { fetchLiveProductsByCategory } = await import('../lib/woocommerce');
    return await fetchLiveProductsByCategory(categoryId);
  } catch (err) {
    console.warn(`[products] live category ${categoryId} fetch failed:`, err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const { fetchLiveProductBySlug } = await import('../lib/woocommerce');
    const live = await fetchLiveProductBySlug(slug);
    if (live) return live;
  } catch (err) {
    console.warn('[products] live product lookup failed, using fallback data:', err);
  }
  return products.find((p) => p.slug === slug);
}
