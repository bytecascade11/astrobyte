// ReviByte — Instagram Downloader Proxy
// Cloudflare Worker Script
// Deploy this on Cloudflare Workers. Your RAPIDAPI_KEY secret is read server-side only.

const RAPIDAPI_HOST = 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com';

export default {
  async fetch(request, env) {

    // Allow CORS from your ReviByte domain
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://www.revibyte.blog',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Get the Instagram URL from query param
    const { searchParams } = new URL(request.url);
    const instaURL = searchParams.get('url');

    if (!instaURL) {
      return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Validate it's actually an Instagram URL
    if (!/instagram\.com\/(reel|p|tv|stories)\//.test(instaURL)) {
      return new Response(JSON.stringify({ error: 'Invalid Instagram URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    try {
      // Call RapidAPI — key is read from Cloudflare secret, never exposed
      const apiRes = await fetch(
        `https://${RAPIDAPI_HOST}/index?url=${encodeURIComponent(instaURL)}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': env.RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST,
          },
        }
      );

      if (!apiRes.ok) {
        return new Response(JSON.stringify({ error: `API error: ${apiRes.status}` }), {
          status: apiRes.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const data = await apiRes.json();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};

