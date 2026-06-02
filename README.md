# Gladskin — Astro SSR Project

Luxury botanical skincare storefront. Built with **Astro** in **SSR mode** — ready for backend integration.

## Quick Start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/    Header, Footer, ProductCard
├── data/          products.ts  ← replace with your API calls
├── layouts/       BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── collection/index.astro
│   ├── products/[slug].astro   ← dynamic route
│   ├── ritual.astro
│   ├── cart.astro
│   └── api/
│       ├── products.ts         GET  /api/products
│       ├── cart.ts             GET + POST /api/cart
│       └── newsletter.ts       POST /api/newsletter
├── styles/        global.css (Material 3 design tokens)
└── types/         index.ts
```

## Connecting Your Backend

Replace the mock functions in `src/data/products.ts`:

```ts
export async function getProducts() {
  const res = await fetch('https://your-api.com/products');
  return res.json();
}
```

Fill in the `src/pages/api/*.ts` endpoints with your DB logic.

## Deployment Adapter

Install an adapter for your host:

```bash
npm install @astrojs/node        # Node.js / Railway / Render
npm install @astrojs/vercel      # Vercel
npm install @astrojs/netlify     # Netlify
```

Update `astro.config.mjs`:

```js
import node from '@astrojs/node';
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```
