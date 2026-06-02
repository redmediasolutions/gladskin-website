import type { Product } from '../types/index.ts';

export const products: Product[] = [
  {
    id: '1',
    name: 'Orchid Dew Serum',
    price: 185.00,
    category: 'Botanical Essence',
    badge: 'New Arrival',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3OStVcRiij2KLfyt_1pKJcs3MdmBgLVH55EaE4bm_7Ccm9wQS8Gk_0wmCSHGvfsMuoktvyNCcpWFfXagALXEkgRotBMlgdxUyekE1KdxUqekcnfeB-OZXme4QaTaXxbGnKP468316s5wokUxLD7lnw7VoFHtf1Jo1ndNbYNm0pl2rdiJqiNzF8suMvi2fDfJ0L5iHG3srxVBG2fKiJ4n2q31tGstoa_DFMQEiR9jc5a8pzLWJsDZQvgMG4Z3O6cZOfXdHwzZgffY',
    imageAlt: 'Orchid Dew Serum bottle on marble surface',
    slug: 'orchid-dew-serum',
    inStock: true,
    description: 'A lightweight, fast-absorbing serum distilled from rare Vanda orchid extracts harvested at peak bloom. Delivers concentrated cellular intelligence directly to your skin\'s nocturnal repair cycle, revealing luminosity that builds night after night.',
    composition: 'Vanda Orchid Extract, Hyaluronic Acid (3 molecular weights), Niacinamide 5%, Peptide Complex (Matrixyl 3000), Ceramide NP, Vitamin C (Ascorbyl Glucoside), Panthenol, Allantoin, Glycerin, Squalane',
    howItWorks: 'The orchid\'s unique longevity molecule activates your skin\'s natural SIRT1 pathway — the same mechanism that protects cells from oxidative stress. Applied to damp skin, the tri-weighted hyaluronic acid creates a hydration reservoir at multiple depths while the peptide complex signals fibroblasts to rebuild collagen architecture overnight.',
    sideEffects: 'Formulated for all skin types. Patch test recommended for sensitive skin. Avoid contact with eyes. Discontinue if irritation occurs.',
    highlights: [
      { icon: 'spa',           title: 'Rare Orchid Extract',   description: 'Sourced from high-altitude Vanda sanctuaries for maximum bio-potency.' },
      { icon: 'water_drop',    title: 'Triple Hydration',      description: '3 molecular weights of hyaluronic acid penetrate every skin layer.' },
      { icon: 'science',       title: 'Clinically Tested',     description: '94% reported visible luminosity improvement in 4 weeks.' },
      { icon: 'eco',           title: '100% Botanical',        description: 'Free from parabens, sulphates, and synthetic fragrances.' },
    ],
  },
  {
    id: '2',
    name: 'Retinol Night Cream',
    price: 142.00,
    category: 'Age Defying',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsQf0dtK1fes7GwfjIjBLtC-98QbdvGFpPbaNjGNuA-t6RWRFXGZXjLTW7-H2QaYzpYp5OYRjPiaPms4OkQCFrSajtAWKLS9qLjP4Z9cYiGZ523GwzIrvbgPbvFhKpIu157o0J04f_Qmmrm9g7lzN4ICA8EjDXLeLf29LOZq_NFIIFE29jKl_rqs7lTEAunZNceBAeQZHpzqCPtVR0RlimRzQScW3lRzFlfXpICmusjqnBjGda4mbqfFRSlWnpjEYUd75LQdSfWRg',
    imageAlt: 'Retinol Night Cream jar with flower petals',
    slug: 'retinol-night-cream',
    inStock: true,
    description: 'A velvety night cream that harnesses encapsulated retinol at 0.3% concentration — potent enough for visible results, gentle enough for nightly use. Blended with orchid ceramides and squalane, it rebuilds the skin barrier while you sleep.',
    composition: 'Encapsulated Retinol 0.3%, Orchid Ceramide Complex, Squalane, Bakuchiol, Peptide Complex (Argireline), Shea Butter, Jojoba Esters, Vitamin E (Tocopherol), Niacinamide 3%, Allantoin, Glycerin',
    howItWorks: 'Encapsulated retinol releases slowly through the night, minimising irritation while maximising cell turnover. Bakuchiol — nature\'s retinol — works synergistically to smooth fine lines. The ceramide complex seals in active ingredients and restores the skin\'s lipid barrier, so you wake to plumper, more refined skin.',
    sideEffects: 'Begin with alternate-night use. Always apply SPF the following morning. Not suitable during pregnancy. May cause mild purging in the first 2–3 weeks.',
    highlights: [
      { icon: 'bedtime',       title: 'Overnight Renewal',     description: 'Encapsulated retinol works through the night for gentler, sustained results.' },
      { icon: 'shield',        title: 'Barrier Repair',        description: 'Ceramide complex rebuilds the lipid barrier while you sleep.' },
      { icon: 'auto_awesome',  title: 'Visibly Lifts',         description: '89% reported reduction in fine lines after 8 weeks.' },
      { icon: 'eco',           title: 'Gentle Formula',        description: 'Bakuchiol and encapsulation minimise retinol irritation.' },
    ],
  },
  {
    id: '3',
    name: 'Eczema Relief Cream',
    price: 98.00,
    category: 'Calming Therapy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbf8J8GVFZlrwps9VnycfeyEgOIXLjmjlpu7a5vamz6xSG1red0BWJd64HwpJTEmACXL8owZQaYNktVaR6ajLLdgLF-7QOFRpoNvnw4yyt8-ai1YvZL46ZseUwB4O6RDGD2KBvZCTsT2Kc8EXoiJlB-VzSW4-9ahmw5MuU6bhpFVaj5W8lSZ7r057LB9VEnd4Lbr7CU_oKCaCzxvDTU22BsINZOqYxzG-op74EWRxFkY0A7AD1TglLdgeXslLzoUUtxz8c93rIl00',
    imageAlt: 'Eczema Relief Cream tube with botanical leaves',
    slug: 'eczema-relief-cream',
    inStock: true,
    description: 'A rich, fragrance-free calming cream developed specifically for reactive, eczema-prone skin. Combines colloidal oatmeal, orchid mucilage, and a patented ceramide blend to soothe flare-ups, reduce redness and restore comfort within hours.',
    composition: 'Colloidal Oatmeal 1%, Orchid Mucilage, Ceramide AP/EOP/NP Complex, Shea Butter, Allantoin, Bisabolol, Zinc PCA, Panthenol B5, Madecassoside, Glycerin, Petrolatum (Ultra-refined)',
    howItWorks: 'Colloidal oatmeal forms a protective film that immediately reduces itch and transepidermal water loss. The triple-ceramide complex fills gaps in the compromised skin barrier, while madecassoside (from Centella Asiatica) calms inflammatory pathways. Zinc PCA regulates excess sebum without drying — essential for eczema-prone microbiomes.',
    sideEffects: 'Fragrance-free, steroid-free, and suitable for infants over 3 months. Patch test recommended. Safe for use on face and body.',
    highlights: [
      { icon: 'healing',       title: 'Instant Relief',        description: 'Colloidal oatmeal soothes itch and irritation within 2 hours of application.' },
      { icon: 'favorite',      title: 'Steroid-Free',          description: 'Clinically effective without steroids — safe for long-term daily use.' },
      { icon: 'shield',        title: 'Barrier Restore',       description: 'Triple ceramide complex repairs the compromised skin barrier overnight.' },
      { icon: 'child_care',    title: 'Family Safe',           description: 'Fragrance-free formula suitable for infants, children, and adults.' },
    ],
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export const categories = [...new Set(products.map(p => p.category))];
