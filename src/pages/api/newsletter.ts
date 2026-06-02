import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const email = data.get('email');

  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // TODO: connect to your email service / database here
  // e.g. await db.newsletter.create({ email })
  console.log('Newsletter signup:', email);

  return new Response(JSON.stringify({ success: true, email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
