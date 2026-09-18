/**
 * Cloudflare Pages Function
 * Route: /api/pp6
 *
 * This proxy keeps the browser on the same origin and avoids
 * frontend cross-origin concerns when calling Google Apps Script.
 */

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const gasUrl = context.env.GAS_API_URL;

  if (!gasUrl) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'Missing GAS_API_URL environment variable'
    }), {
      status: 500,
      headers: {'content-type': 'application/json; charset=utf-8'}
    });
  }

  const target = new URL(gasUrl);
  for (const [key, value] of url.searchParams.entries()) {
    target.searchParams.set(key, value);
  }

  const upstream = await fetch(target.toString(), {
    method: 'GET',
    headers: {'Accept': 'application/json'}
  });

  const body = await upstream.text();

  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
