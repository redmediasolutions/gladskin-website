import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { productId, quantity } = body;

  if (!productId || !quantity) {
    return new Response(JSON.stringify({ error: 'productId and quantity required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // TODO: persist cart item to session / database
  console.log('Add to cart:', { productId, quantity });

  return new Response(JSON.stringify({ success: true, productId, quantity }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const GET: APIRoute = async () => {
  // TODO: fetch cart from session / database
  const cart: { productId: string; quantity: number }[] = [];

  return new Response(JSON.stringify(cart), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
