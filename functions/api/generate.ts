import { Ai } from '@cloudflare/ai';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { prompt, model = '@cf/black-forest-labs/flux-1-schnell', turnstileToken } = await context.request.json();

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const ai = new Ai(context.env.AI);

    // Supported models (add more as Cloudflare releases them)
    const supportedModels = [
      '@cf/black-forest-labs/flux-1-schnell',
      '@cf/black-forest-labs/flux-1-dev',
      '@cf/black-forest-labs/flux-2-dev',
      '@cf/black-forest-labs/flux-2-klein',
    ];

    const finalModel = supportedModels.includes(model) ? model : '@cf/black-forest-labs/flux-1-schnell';

    const imageResponse = await ai.run(finalModel, {
      prompt: `Cinematic masterpiece, Hollywood film still, ${prompt}, dramatic lighting, anamorphic lens flare, film grain, moody atmosphere, epic composition, highly detailed, 8k`,
      steps: finalModel.includes('schnell') ? 8 : 20,
      seed: Math.floor(Math.random() * 4294967295),
    });

    const base64Image = imageResponse.image;
    if (!base64Image) throw new Error('No image returned from AI');

    // Convert base64 to binary
    const binaryString = atob(base64Image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Upload to R2
    const filename = `cinematic-${Date.now()}.jpg`;
    await context.env.R2.put(filename, bytes, {
      httpMetadata: { contentType: 'image/jpeg' },
    });

    const publicUrl = `https://epic-ai-media.r2.dev/${filename}`;

    // Store metadata
    await context.env.KV.put(
      `gen:${Date.now()}`,
      JSON.stringify({ prompt, url: publicUrl, model: finalModel, timestamp: new Date().toISOString() }),
      { expirationTtl: 86400 * 30 }
    );

    return Response.json({
      success: true,
      url: publicUrl,
      model: finalModel,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Generation error:', error);

    // Demo fallback
    const fallbackUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 100}/1280/720`;
    return Response.json({
      success: true,
      url: fallbackUrl,
      model: 'demo-fallback',
      note: 'Used placeholder due to error or rate limit',
      timestamp: new Date().toISOString()
    });
  }
};
