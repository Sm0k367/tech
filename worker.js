export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve the React SPA for all non-API routes
    if (!path.startsWith('/api/')) {
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TECH AI — Cloudflare Workers AI Playground</title>
  <script type="module" crossorigin src="/assets/index-Cd1spBlc.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-IJ4lN-ZE.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Space+Grotesk:wght@500;600;700&amp;display=swap');
    body { margin: 0; font-family: 'Inter', system-ui, sans-serif; overflow: hidden; }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    // API routes (connect to real Cloudflare AI)
    if (path === '/api/chat') {
      return handleChat(request, env);
    }

    if (path === '/api/generate') {
      return handleImageGeneration(request, env);
    }

    return new Response("Not found", { status: 404 });
  }
};

async function handleChat(request, env) {
  try {
    const { message = "Hello" } = request.method === "POST" ? await request.json() : {};
    
    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: "system", content: "You are TECH AI — a brilliant, witty, visionary AI running on Cloudflare's global edge network. Be helpful, creative, slightly cocky, and always impressive." },
        { role: "user", content: message }
      ]
    });

    return Response.json({ response: result.response || "Thinking at the speed of light..." });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function handleImageGeneration(request, env) {
  try {
    const { prompt = "cyberpunk samurai in neon tokyo rain, dramatic lighting" } = request.method === "POST" ? await request.json() : {};
    
    const result = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt,
      num_steps: 8,
      guidance: 3.5
    });

    return new Response(result.image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    return new Response("Image generation failed. The models are cooking something special.", { status: 500 });
  }
}