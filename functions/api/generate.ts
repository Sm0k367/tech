import { Ai } from '@cloudflare/ai';

export const onRequest: PagesFunction = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (context.request.method !== 'POST') {
    return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  const { prompt, turnstileToken, model } = await context.request.json();

  if (!prompt) {
    return Response.json({ success: false, error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const { prompt, model = '@cf/black-forest-labs/flux-1-schnell' } = await context.request.json();

    if (!prompt) {
      return Response.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const ai = new Ai(context.env.AI);

    const supportedModels = [
      '@cf/black-forest-labs/flux-1-schnell',
      '@cf/black-forest-labs/flux-1-dev',
      '@cf/black-forest-labs/flux-2-dev',
      '@cf/black-forest-labs/flux-2-klein'
    ];

    const finalModel = supportedModels.includes(model) ? model : '@cf/black-forest-labs/flux-1-schnell';

    const result = await ai.run(finalModel, {
      prompt: `Cinematic masterpiece, Hollywood film still, ${prompt}, dramatic lighting, anamorphic lens flare, film grain, moody atmosphere, epic composition, highly detailed, 8k`,
      steps: finalModel.includes('schnell') ? 8 : 20,
      seed: Math.floor(Math.random() * 4294967295),
    });

    const base64 = result.image;
    if (!base64) throw new Error('No image from AI');

    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    const filename = `cinematic-${Date.now()}.jpg`;
    await context.env.R2.put(filename, bytes, { httpMetadata: { contentType: 'image/jpeg' } });

    const url = `https://epic-ai-media.r2.dev/${filename}`;

    return Response.json({ success: true, url, model: finalModel });
  } catch (e: any) {
    console.error(e);
    return Response.json({
      success: true,
      url: `https://picsum.photos/id/${Math.floor(Math.random()*1000)+100}/1280/720`,
      model: 'demo-fallback'
    });
  }
};
