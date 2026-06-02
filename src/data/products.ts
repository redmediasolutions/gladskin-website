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
  },
  {
    id: '2',
    name: 'Retinol Night Cream',
    price: 142.00,
    category: 'Age Defying',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsQf0dtK1fes7GwfjIjBLtC-98QbdvGFpPbaNjGNuA-t6RWRFXGZXjLTW7-H2QaYzpYp5OYRjPiaPms4OkQCFrSajtAWKLS9qLjP4Z9cYiGZ523GwzIrvbgPbvFhKpIu157o0J04f_Qmmrm9g7lzN4ICA8EjDXLeLf29LOZq_NFIIFE29jKl_rqs7lTEAunZNceBAeQZHpzqCPtVR0RlimRzQScW3lRzFlfXpICmusjqnBjGda4mbqfFRSlWnpjEYUd75LQdSfWRg',
    imageAlt: 'Retinol Night Cream jar with flower petals',
    slug: 'retinol-night-cream',
  },
  {
    id: '3',
    name: 'Eczema Relief Cream',
    price: 98.00,
    category: 'Calming Therapy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbf8J8GVFZlrwps9VnycfeyEgOIXLjmjlpu7a5vamz6xSG1red0BWJd64HwpJTEmACXL8owZQaYNktVaR6ajLLdgLF-7QOFRpoNvnw4yyt8-ai1YvZL46ZseUwB4O6RDGD2KBvZCTsT2Kc8EXoiJlB-VzSW4-9ahmw5MuU6bhpFVaj5W8lSZ7r057LB9VEnd4Lbr7CU_oKCaCzxvDTU22BsINZOqYxzG-op74EWRxFkY0A7AD1TglLdgeXslLzoUUtxz8c93rIl00',
    imageAlt: 'Eczema Relief Cream tube with botanical leaves',
    slug: 'eczema-relief-cream',
  },
];

// Replace this function with a real API call when backend is ready
export async function getProducts(): Promise<Product[]> {
  // TODO: replace with fetch('/api/products')
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // TODO: replace with fetch(`/api/products/${slug}`)
  return products.find((p) => p.slug === slug);
}
