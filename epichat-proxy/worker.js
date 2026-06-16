// EpiChat Proxy — Cloudflare Worker
// Keeps the Anthropic API key server-side; browser never sees it.
//
// Deploy steps:
//   1. npm install -g wrangler
//   2. wrangler login
//   3. wrangler secret put ANTHROPIC_API_KEY   ← paste your new key when prompted
//   4. wrangler deploy
//
// Then update PROXY_URL in epivail-merged-full.html with the workers.dev URL.

const ALLOWED_ORIGIN = 'https://charlesharrison.epiquerealty.com'; // your Lofty domain

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, anthropic-version',
      'Vary': 'Origin',
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.text();
    } catch {
      return new Response('Bad Request', { status: 400 });
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'text/event-stream',
        'Cache-Control': 'no-store',
        ...corsHeaders,
      },
    });
  },
};
