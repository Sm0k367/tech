import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene3D from './components/Scene3D';
import GenerateButton from './components/GenerateButton';
import AgentCard from './components/AgentCard';
import CFImage from './components/CFImage';
import LoginModal from './components/LoginModal';
import GalleryModal from './components/GalleryModal';
import MemoryVault from './components/MemoryVault';
import { Mic, Image as ImageIcon, Users, LogIn } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agents] = useState([
    { name: "Writer", status: "idle" },
    { name: "Director", status: "idle" },
    { name: "Editor", status: "idle" },
  ]);

  const voiceInput = () => {
    const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.onresult = (e: any) => setPrompt(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      <Scene3D />

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-2xl">
        <div className="max-w-screen-2xl mx-auto px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 rounded-3xl flex items-center justify-center text-4xl font-bold">ET</div>
            <div>
              <div className="text-4xl font-bold tracking-tighter">Epic Tech AI</div>
              <div className="text-cyan-400 text-sm -mt-1">Cinematic AI Studio</div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={() => setShowGallery(true)} className="flex items-center gap-2 hover:text-cyan-400">
              <ImageIcon className="w-5 h-5" /> Gallery
            </button>
            <button className="flex items-center gap-2 hover:text-cyan-400">
              <Users className="w-5 h-5" /> Vault
            </button>
            {!isAuthenticated && (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 px-6 py-3 rounded-3xl bg-white/10 hover:bg-white/20">
                <LogIn className="w-5 h-5" /> Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-28 max-w-screen-2xl mx-auto px-10 flex gap-8">
        {/* Left Sidebar - Agents */}
        <div className="w-80 space-y-4">
          {agents.map((agent, i) => <AgentCard key={i} agent={agent} index={i} />)}
        </div>

        {/* Main Area */}
        <div className="flex-1 space-y-8">
          <div className="glass-panel p-10 rounded-3xl">
            <div className="flex gap-4 mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your cinematic vision..."
                className="flex-1 bg-transparent text-2xl placeholder:text-white/40 focus:outline-none min-h-[160px]"
              />
              <button onClick={voiceInput} className="self-end p-5 rounded-3xl bg-white/10 hover:bg-white/20">
                <Mic className="w-9 h-9" />
              </button>
            </div>
            <GenerateButton prompt={prompt} setGenerated={setGenerated} setAgents={() => {}} />
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel aspect-video rounded-3xl overflow-hidden">
                <CFImage src={generated.url} alt="AI Generation" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <div className="w-96">
          <MemoryVault />
        </div>
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => setIsAuthenticated(true)} />
      <GalleryModal isOpen={showGallery} onClose={() => setShowGallery(false)} />
    </div>
  );
}
