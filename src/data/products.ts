import type { Product } from '../types/index.ts';

export async function getProducts(): Promise<Product[]> {
  const { fetchLiveProducts } = await import('../lib/woocommerce');
  return await fetchLiveProducts();
}

export async function getProductsByCategory(
  categoryId: number,
): Promise<Product[]> {

  console.log(
    '[getProductsByCategory] Requested Category:',
    categoryId,
  );

  const { fetchLiveProductsByCategory } =
    await import('../lib/woocommerce');

  const products =
    await fetchLiveProductsByCategory(
      categoryId,
    );

  console.log(
    '[getProductsByCategory] Products Found:',
    products.length,
  );

  console.log(
    '[getProductsByCategory] Categories:',
    products.map(p => ({
      name: p.name,
      category: p.category,
      categoryId: p.categoryId,
    })),
  );

  return products;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const { fetchLiveProductBySlug } = await import('../lib/woocommerce');
  return await fetchLiveProductBySlug(slug);
}