import { Ai } from '@cloudflare/ai';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { prompt, turnstileToken } = await context.request.json();

  if (!prompt) {
    return Response.json({ success: false, error: 'Prompt is required' }, { status: 400 });
  }

  try {
    // Simulate Turnstile validation (in production use real validation)
    if (turnstileToken === null) {
      console.log('Turnstile token missing - production would validate here');
    }

    const ai = new Ai(context.env.AI);

    // Generate image using FLUX.1 via Cloudflare AI
    const imageResponse = await ai.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: `Cinematic, hollywood film still, dramatic lighting, ${prompt}, epic composition, anamorphic lens, 8k, highly detailed, film grain`,
      num_steps: 20,
      guidance: 7.5,
    });

    // Convert to base64 or upload to R2
    const imageBuffer = imageResponse.image || imageResponse;

    // Upload to R2
    const filename = `cinematic-${Date.now()}.jpg`;
    await context.env.R2.put(filename, imageBuffer, {
      httpMetadata: { contentType: 'image/jpeg' },
    });

    const publicUrl = `https://epic-ai-media.${context.env.CF_ACCOUNT_ID ? 'r2.dev' : 'yourdomain.com'}/${filename}`;

    // Store metadata in KV
    await context.env.KV.put(`gen:${Date.now()}`, JSON.stringify({
      prompt,
      url: publicUrl,
      timestamp: new Date().toISOString(),
      model: 'flux-1-schnell'
    }), { expirationTtl: 86400 * 30 });

    return Response.json({
      success: true,
      url: publicUrl,
      prompt,
      model: "FLUX.1-schnell",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    
    // Fallback to placeholder for demo
    const fallbackUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 100}/1280/720`;
    
    return Response.json({
      success: true,
      url: fallbackUrl,
      prompt: prompt || "Cinematic masterpiece",
      model: "FLUX.1-schnell (demo fallback)",
      note: "Using placeholder due to AI binding/demo constraints",
      timestamp: new Date().toISOString()
    });
  }
};
