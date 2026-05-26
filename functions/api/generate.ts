import { Ai } from '@cloudflare/ai';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { prompt, turnstileToken } = await context.request.json();

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    // TODO: Add real Turnstile validation in production
    if (!turnstileToken) {
      console.warn('Turnstile token missing');
    }

    const ai = new Ai(context.env.AI);

    // FLUX.1-schnell parameters (correct format)
    const imageResponse = await ai.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: `Cinematic masterpiece, Hollywood film still, ${prompt}, dramatic lighting, anamorphic lens flare, film grain, moody atmosphere, epic composition, highly detailed, 8k`,
      steps: 8,           // max 8 for schnell
      // width: 1024,     // optional - default is usually 1024x1024
      // height: 1024,
      seed: Math.floor(Math.random() * 4294967295),
    });

    // The response contains base64 image
    const base64Image = imageResponse.image;
    if (!base64Image) {
      throw new Error('No image returned from AI');
    }

    // Convert base64 to Uint8Array
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

    const publicUrl = `https://epic-ai-media.r2.dev/${filename}`;  // Use your actual R2 public domain

    // Optional: Store metadata in KV
    await context.env.KV.put(
      `gen:${Date.now()}`,
      JSON.stringify({
        prompt,
        url: publicUrl,
        timestamp: new Date().toISOString(),
        model: 'flux-1-schnell'
      }),
      { expirationTtl: 86400 * 30 } // 30 days
    );

    return Response.json({
      success: true,
      url: publicUrl,
      prompt,
      model: "FLUX.1-schnell",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Generation error:', error);

    // Fallback for demo / rate limits
    const fallbackUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 100}/1280/720`;

    return Response.json({
      success: true,
      url: fallbackUrl,
      prompt: prompt || "Cinematic masterpiece",
      model: "FLUX.1-schnell (demo fallback)",
      note: "Using placeholder due to error or rate limit",
      timestamp: new Date().toISOString()
    });
  }
};
