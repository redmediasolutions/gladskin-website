import type { APIRoute } from 'astro';

const BASE_URL   = import.meta.env.WOO_BASE_URL        || 'https://gs.redmediasolutions.in';
const WOO_KEY    = import.meta.env.WOO_CONSUMER_KEY    || '';
const WOO_SECRET = import.meta.env.WOO_CONSUMER_SECRET || '';

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Decode Firebase ID token locally — no outbound API call needed.
// UID lives in the `user_id` claim (also mirrored in `sub`).
function uidFromToken(token: string): string | null {
  try {
    const part    = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes   = Uint8Array.from(atob(part), c => c.charCodeAt(0));
    const decoded = JSON.parse(new TextDecoder().decode(bytes));
    return decoded.user_id || decoded.sub || null;
  } catch {
    return null;
  }
}

// Build a WooCommerce URL with credentials in query params.
// Many shared-hosting setups strip the Authorization header before it reaches
// PHP/WooCommerce, causing silent 401/404. Query-param auth always reaches the app.
function wooUrl(path: string): string {
  const u = new URL(`${BASE_URL}/wp-json/wc/v3/${path}`);
  if (WOO_KEY)    u.searchParams.set('consumer_key',    WOO_KEY);
  if (WOO_SECRET) u.searchParams.set('consumer_secret', WOO_SECRET);
  return u.toString();
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body    = await request.json().catch(() => null);
    const orderId = Number(body?.orderId);
    if (!orderId || isNaN(orderId)) return json({ error: 'orderId required' }, 400);

    // ── 1. Extract UID from Firebase token (local decode — no network) ──
    const authHeader = request.headers.get('Authorization') || '';
    const idToken    = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const uid        = idToken ? uidFromToken(idToken) : null;
    if (!uid) return json({ error: 'Unauthorized' }, 401);

    // ── 2. Fetch order from WooCommerce ───────────────────────────────
    console.log(`[cancel-order] GET order/${orderId} for uid=${uid}`);
    const getRes = await fetch(wooUrl(`orders/${orderId}`), {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!getRes.ok) {
      const errText = await getRes.text().catch(() => '');
      console.error(`[cancel-order] GET ${orderId} → ${getRes.status}:`, errText.slice(0, 400));
      if (getRes.status === 404) {
        // Order doesn't exist in WooCommerce — signal client to handle via Firestore
        return json({ error: 'Order not found in WooCommerce', wooNotFound: true }, 404);
      }
      let msg = `WooCommerce returned ${getRes.status}`;
      try { msg = JSON.parse(errText).message || msg; } catch {}
      return json({ error: msg }, 500);
    }

    const wooOrder = await getRes.json();

    // ── 3. Verify ownership via app_uid meta ──────────────────────────
    const appUidMeta = (wooOrder.meta_data || []).find((m: any) => m.key === 'app_uid');
    if (!appUidMeta || String(appUidMeta.value) !== uid) {
      console.warn(`[cancel-order] ownership mismatch: order uid=${appUidMeta?.value} request uid=${uid}`);
      return json({ error: 'Forbidden — order does not belong to this account' }, 403);
    }

    // ── 4. Already terminal? ──────────────────────────────────────────
    if (['cancelled', 'completed'].includes(wooOrder.status)) {
      return json({ error: `Order is already ${wooOrder.status}` }, 400);
    }

    // ── 5. 24-hour window ─────────────────────────────────────────────
    const diffHours = (Date.now() - new Date(wooOrder.date_created).getTime()) / 3_600_000;
    if (diffHours >= 24) {
      return json({ error: 'Cancellation window expired (24 hours)' }, 400);
    }

    // ── 6. Cancel ─────────────────────────────────────────────────────
    const cancelRes = await fetch(wooUrl(`orders/${orderId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });

    if (!cancelRes.ok) {
      const errText = await cancelRes.text().catch(() => '');
      console.error(`[cancel-order] PUT ${orderId} → ${cancelRes.status}:`, errText.slice(0, 400));
      return json({ error: `Cancel failed (WooCommerce ${cancelRes.status})` }, 500);
    }

    return json({ success: true });

  } catch (e: any) {
    console.error('[cancel-order] unexpected error:', e);
    return json({ error: e.message || 'Server error' }, 500);
  }
};
