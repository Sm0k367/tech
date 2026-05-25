import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2, Sparkles } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

interface GenerateButtonProps {
  prompt: string;
  setGenerated: (result: any) => void;
  setAgents: (agents: any[]) => void;
}

export default function GenerateButton({ prompt, setGenerated, setAgents }: GenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          turnstileToken 
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        setGenerated(data);
        
        // Simulate agent workflow
        setAgents([
          { name: "Writer", status: "complete" },
          { name: "Director", status: "complete" },
          { name: "Editor", status: "complete" },
        ]);
      } else {
        alert(data.error || 'Generation failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Connection error. Please check your internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim()}
        className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-500 hover:from-purple-500 hover:via-fuchsia-500 hover:to-cyan-400 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-semibold text-xl py-6 px-16 rounded-3xl transition-all duration-300 shadow-2xl shadow-purple-500/30 disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-7 h-7 animate-spin" />
            <span>Crafting Cinematic Masterpiece...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span>GENERATE CINEMATIC VISION</span>
            <Play className="w-6 h-6" />
          </>
        )}
      </motion.button>

      <div className="flex justify-center">
        <Turnstile
          siteKey="1x00000000000000000000AA" 
          onSuccess={(token) => setTurnstileToken(token)}
          options={{ appearance: 'interaction-only', theme: 'dark' }}
        />
      </div>

      <p className="text-center text-xs text-white/40">
        Powered by Cloudflare AI • FLUX.1 • Llama 3.1 • Vectorize Memory
      </p>
    </div>
  );
}
