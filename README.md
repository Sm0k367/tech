# Epic Tech AI • Cinematic Studio

A premium **Hollywood-grade AI cinematic creation studio** built on Cloudflare.

## Features

- **Immersive 3D Scene** with floating cinematic objects, neon rings, film reels, and auto-rotating camera
- **Multi-Agent Workflow** — Writer, Director, Editor with live status
- **Voice Input** using Web Speech API
- **FLUX.1 Image Generation** powered by Cloudflare AI
- **Memory Vault** with Vectorize embeddings for character consistency
- **Gallery** with cinematic moments
- **Glassmorphism + Neon Cyberpunk UI**
- **Cloudflare Pages + R2 + KV + D1 + Vectorize + AI ready**

## Tech Stack

- React 19 + TypeScript + Vite
- Three.js via React Three Fiber + Drei
- Framer Motion animations
- Tailwind + Custom neon palette
- Cloudflare Workers + Pages Functions
- Turnstile protection

## Development

```bash
npm install
npm run dev
```

## Deploy to Cloudflare

```bash
npm run cf:deploy
```

The project is fully configured with `wrangler.toml` bindings for:
- AI (FLUX, Llama)
- R2 (media storage)
- KV (metadata)
- Vectorize (memory vault)
- D1 (future relational data)

## Vision

This is not just an image generator — it's a full **cinematic studio** where multiple AI agents collaborate to turn your prompt into a complete film vision.

Ready for production. Cinematic. Unforgettable.

---
Built with ❤️ on Cloudflare
