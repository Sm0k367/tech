export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Homepage
    if (path === '/' || path === '/validate') {
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tech AI • Cloudflare Models</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #eee; }
            .card { transition: all 0.3s; }
            .card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgb(168 85 247); }
          </style>
        </head>
        <body class="min-h-screen p-8">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
              <h1 class="text-6xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                TECH AI
              </h1>
              <p class="text-xl text-gray-400">Best Cloudflare Workers AI Models • Live on Edge</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <a href="/chat" class="card bg-zinc-900 border border-purple-500/30 rounded-3xl p-10 text-center hover:border-purple-500 group">
                <div class="text-6xl mb-6">💬</div>
                <h2 class="text-3xl font-semibold mb-2">Llama 3.1 8B</h2>
                <p class="text-purple-400 font-mono text-sm">@cf/meta/llama-3.1-8b-instruct</p>
                <p class="text-gray-400 mt-4">Fast chat, reasoning, code, agents</p>
                <div class="mt-8 text-purple-400 group-hover:text-purple-300">Open Chat →</div>
              </a>

              <a href="/image" class="card bg-zinc-900 border border-fuchsia-500/30 rounded-3xl p-10 text-center hover:border-fuchsia-500 group">
                <div class="text-6xl mb-6">🌌</div>
                <h2 class="text-3xl font-semibold mb-2">FLUX.1 Schnell</h2>
                <p class="text-fuchsia-400 font-mono text-sm">@cf/black-forest-labs/flux-1-schnell</p>
                <p class="text-gray-400 mt-4">Best text-to-image model on Cloudflare</p>
                <div class="mt-8 text-fuchsia-400 group-hover:text-fuchsia-300">Generate Image →</div>
              </a>
            </div>

            <div class="text-center mt-16 text-xs text-gray-500 font-mono">
              Powered by Cloudflare Workers AI • Real env.AI.run() • No build required
            </div>
          </div>
        </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    if (path === '/chat' || path === '/api/chat') {
      return handleChat(request, env);
    }

    if (path === '/image' || path === '/api/generate-image') {
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
        { role: "system", content: "You are a helpful, witty, and creative AI called Tech AI." },
        { role: "user", content: message }
      ]
    });

    return Response.json({ response: result.response || result });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function handleImageGeneration(request, env) {
  try {
    const { prompt = "futuristic cyberpunk city, neon, flying cars, cinematic" } = request.method === "POST" ? await request.json() : {};
    
    const result = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: prompt,
      num_steps: 8,
      guidance: 3.5,
      width: 1024,
      height: 1024
    });

    return new Response(result.image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=7200"
      }
    });
  } catch (e) {
    return new Response("Image generation error: " + e.message, { status: 500 });
  }
}
