import type { APIRoute } from 'astro';
import { getProducts } from '../../data/products.ts';

export const GET: APIRoute = async () => {
  // TODO: replace getProducts() with real DB query
  const products = await getProducts();
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
