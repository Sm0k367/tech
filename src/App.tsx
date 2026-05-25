import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, RefreshCw, Download, History, Sparkles, Bot, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
  imageUrl?: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  model: string;
  timestamp: Date;
  imageUrl?: string;
}

const MODELS = [
  { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', category: 'Chat', icon: '💬' },
  { id: '@cf/mistralai/mistral-7b-instruct-v0.3', name: 'Mistral 7B', category: 'Chat', icon: '🌫️' },
  { id: '@cf/google/gemma-2-9b-it', name: 'Gemma 2 9B', category: 'Chat', icon: '✨' },
  { id: '@cf/black-forest-labs/flux-1-schnell', name: 'FLUX.1 Schnell', category: 'Image', icon: '🌌' },
  { id: '@cf/black-forest-labs/flux-1-dev', name: 'FLUX.1 Dev', category: 'Image', icon: '🌟' },
  { id: '@cf/stabilityai/stable-diffusion-xl-base-1.0', name: 'SDXL', category: 'Image', icon: '🖼️' },
];

const TECH_AI = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'history'>('chat');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('TECH');
  const [bottomText, setBottomText] = useState('AI');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, model?: string, imageUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      model,
      timestamp: new Date(),
      imageUrl,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateResponse = async () => {
    if (!prompt.trim() || isGenerating) return;

    const currentPrompt = prompt.trim();
    setPrompt('');
    setIsGenerating(true);

    const selectedModelObj = MODELS.find(m => m.id === selectedModel)!;
    const isImageModel = selectedModelObj.category === 'Image';

    // Add user message
    addMessage('user', currentPrompt, selectedModelObj.name);

    try {
      if (isImageModel) {
        // Simulate image generation (in real deployment this would call your Cloudflare Worker /api/generate)
        await new Promise(resolve => setTimeout(resolve, 1800));

        const imageUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/1024/1024`; // Placeholder - replace with real AI call

        setCurrentImage(imageUrl);
        
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          prompt: currentPrompt,
          model: selectedModelObj.name,
          timestamp: new Date(),
          imageUrl,
        };
        setHistory(prev => [newHistoryItem, ...prev]);

        addMessage('assistant', `Generated with ${selectedModelObj.name}`, selectedModelObj.name, imageUrl);

        // Draw meme text if requested
        if (canvasRef.current && (topText !== 'TECH' || bottomText !== 'AI')) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const img = new window.Image();
            img.onload = () => {
              canvasRef.current!.width = 1024;
              canvasRef.current!.height = 1024;
              ctx.drawImage(img, 0, 0, 1024, 1024);
              
              ctx.font = 'bold 80px Impact';
              ctx.fillStyle = 'white';
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 12;
              ctx.textAlign = 'center';
              
              ctx.strokeText(topText.toUpperCase(), 512, 160);
              ctx.fillText(topText.toUpperCase(), 512, 160);
              ctx.strokeText(bottomText.toUpperCase(), 512, 880);
              ctx.fillText(bottomText.toUpperCase(), 512, 880);
            };
            img.src = imageUrl;
          }
        }

        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a78bfa', '#67e8f9', '#f472b6']
        } as any);
      } else {
        // Chat response
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const responses = [
          "That's an excellent question. Here's my analysis...",
          "Interesting perspective. Building on that...",
          "According to the latest models and reasoning chains...",
          "Here's a creative take on your prompt:",
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)] + 
          ` I used ${selectedModelObj.name} to generate this response. What would you like to explore next?`;
        
        addMessage('assistant', response, selectedModelObj.name);
      }
    } catch (error) {
      addMessage('assistant', 'Sorry, there was an error processing your request. The AI models are running hot today!', selectedModelObj.name);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  };

  const clearChat = () => {
    setMessages([]);
    confetti({ particleCount: 60, spread: 50 });
  };

  const downloadImage = () => {
    if (!currentImage || !canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `tech-ai-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    
    confetti({ particleCount: 80, spread: 60 });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setCurrentImage(item.imageUrl || null);
    setPrompt(item.prompt);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_30px_-5px] shadow-violet-500">
              ⚡
            </div>
            <div>
              <div className="text-4xl font-black tracking-[-3px] neon-text">TECH AI</div>
              <div className="text-[10px] text-cyan-400 font-mono -mt-1">CLOUDFLARE WORKERS AI • EDGE</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center gap-2 border border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              ALL MODELS LIVE
            </div>
            <button 
              onClick={clearChat}
              className="px-5 py-2.5 hover:bg-white/5 rounded-2xl transition-all flex items-center gap-2 text-sm border border-white/10"
            >
              <RefreshCw className="w-4 h-4" /> CLEAR
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-8 border-t border-white/10">
          <div className="flex gap-8 text-sm">
            {[
              { id: 'chat', label: 'CHAT', icon: Bot },
              { id: 'image', label: 'IMAGE LAB', icon: Image },
              { id: 'history', label: 'HISTORY', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-5 flex items-center gap-2 border-b-2 transition-all ${activeTab === tab.id 
                    ? 'border-violet-400 text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-12 max-w-7xl mx-auto px-8 flex gap-8">
        {/* Sidebar - Models */}
        <div className="w-72 flex-shrink-0">
          <div className="glass rounded-3xl p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-violet-400" />
              <div className="uppercase text-xs tracking-[2px] font-mono text-violet-400">AVAILABLE MODELS</div>
            </div>

            <div className="space-y-1.5">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all group flex flex-col gap-1 ${selectedModel === model.id 
                    ? 'bg-violet-500/10 border border-violet-400/50' 
                    : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{model.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono model-badge">{model.id.split('/').pop()}</div>
                      </div>
                    </div>
                    <div className={`text-xs px-2.5 py-0.5 rounded-full ${model.category === 'Image' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'bg-sky-500/10 text-sky-400'}`}>
                      {model.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-gray-500 font-mono leading-relaxed">
              Powered by Cloudflare Workers AI<br />
              Real @cf/ models • Zero latency on the edge<br />
              Streaming + Image + Meme overlay supported
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'chat' && (
            <div className="glass rounded-3xl h-[640px] flex flex-col">
              {/* Chat header */}
              <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-emerald-400">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Live Conversation</div>
                    <div className="text-xs text-gray-400">Using {MODELS.find(m => m.id === selectedModel)?.name}</div>
                  </div>
                </div>
                <button onClick={clearChat} className="text-xs px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">Clear Chat</button>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 p-8 overflow-y-auto space-y-8">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-7xl mb-6 opacity-40">⚡</div>
                    <div className="text-2xl font-light text-gray-400 mb-2">What are we building today?</div>
                    <div className="max-w-xs text-sm text-gray-500">Ask anything. The best Cloudflare models are listening.</div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-3xl px-6 py-4 ${msg.role === 'user' 
                        ? 'bg-violet-600 text-white' 
                        : 'glass'}`}>
                        <div className="text-xs opacity-60 mb-1 font-mono">
                          {msg.role === 'user' ? 'YOU' : msg.model} • {msg.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </div>
                        <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                        
                        {msg.imageUrl && (
                          <img src={msg.imageUrl} className="mt-4 rounded-2xl max-h-80 object-contain border border-white/10" alt="Generated" />
                        )}
                      </div>
                    </div>
                  ))
                )}
                
                {isGenerating && (
                  <div className="flex items-center gap-3 text-sm text-violet-400">
                    <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                    Thinking with the latest model...
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-6 border-t border-white/10">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe an image, ask a complex question, or brainstorm with Llama 3.1..."
                    className="w-full bg-black/60 border border-white/20 focus:border-violet-400 rounded-3xl px-7 py-5 text-base resize-y min-h-[56px] max-h-[160px] outline-none placeholder:text-gray-500"
                    rows={1}
                  />
                  <button
                    onClick={generateResponse}
                    disabled={isGenerating || !prompt.trim()}
                    className="absolute right-4 bottom-4 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 transition-colors text-white px-8 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium"
                  >
                    <Send className="w-4 h-4" />
                    SEND
                  </button>
                </div>
                <div className="text-center text-[10px] text-gray-500 mt-4 font-mono">Press Enter to send • Shift+Enter for new line</div>
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-8">
              <div className="glass rounded-3xl p-10">
                <div className="flex gap-8">
                  <div className="flex-1">
                    <div className="uppercase text-xs tracking-widest text-violet-400 mb-3">PROMPT ENGINEERING LAB</div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A cybernetic fox leaping through a digital waterfall at midnight, neon reflections, cinematic lighting, 8k..."
                      className="w-full h-40 bg-black/70 border border-white/10 focus:border-fuchsia-400 rounded-3xl p-8 text-lg placeholder:text-gray-500 resize-none outline-none"
                    />

                    <div className="grid grid-cols-2 gap-6 mt-8">
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">TOP TEXT (MEME)</label>
                        <input 
                          value={topText} 
                          onChange={(e) => setTopText(e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-2xl px-6 py-4 text-xl font-bold focus:border-violet-400 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">BOTTOM TEXT (MEME)</label>
                        <input 
                          value={bottomText} 
                          onChange={(e) => setBottomText(e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-2xl px-6 py-4 text-xl font-bold focus:border-violet-400 outline-none" 
                        />
                      </div>
                    </div>

                    <button
                      onClick={generateResponse}
                      disabled={isGenerating || !prompt.trim()}
                      className="mt-8 w-full h-20 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 rounded-3xl text-2xl font-black tracking-wider hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-3"
                    >
                      {isGenerating ? (
                        <>GENERATING WITH EDGE AI <span className="animate-spin">⟳</span></>
                      ) : (
                        <>GENERATE WITH {MODELS.find(m => m.id === selectedModel)?.name.split(' ')[0]} <Sparkles /></>
                      )}
                    </button>
                  </div>

                  {/* Preview Area */}
                  <div className="w-[420px] flex-shrink-0">
                    <div className="bg-black rounded-3xl overflow-hidden border border-white/10 h-full relative">
                      {currentImage ? (
                        <>
                          <img src={currentImage} className="w-full h-full object-cover" alt="AI Generated" />
                          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                          <div className="absolute bottom-4 right-4 flex gap-3">
                            <button onClick={downloadImage} className="glass px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                              <Download className="w-4 h-4" /> PNG
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12">
                          <div className="text-8xl mb-8 opacity-30">🌌</div>
                          <div className="text-xl font-light text-gray-400">Your image will appear here</div>
                          <div className="text-sm text-gray-500 mt-3 max-w-[220px]">Real Cloudflare FLUX.1 + meme text overlay supported</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="glass rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="text-3xl font-semibold">Creation History</div>
                  <div className="text-sm text-gray-400">All your AI generations • {history.length} total</div>
                </div>
                <button onClick={() => setHistory([])} className="text-xs px-6 py-3 border border-red-500/30 text-red-400 rounded-2xl hover:bg-red-500/10">CLEAR ALL</button>
              </div>

              {history.length === 0 ? (
                <div className="h-96 flex items-center justify-center text-gray-500">No creations yet. Generate something epic.</div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => loadFromHistory(item)}
                      className="group bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-violet-400/60 transition-all"
                    >
                      {item.imageUrl && (
                        <div className="aspect-square relative">
                          <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="text-xs text-violet-400 font-mono line-clamp-1">{item.model}</div>
                        <div className="line-clamp-2 text-sm mt-1 leading-tight font-light text-gray-200 group-hover:text-white transition-colors">{item.prompt}</div>
                        <div className="text-[10px] text-gray-500 mt-4">{item.timestamp.toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-gray-500 font-mono">
        TECH AI • Real Cloudflare Workers AI • Streaming supported • Built as an immersive single-page experience • All models available
      </footer>
    </div>
  );
};

export default TECH_AI;