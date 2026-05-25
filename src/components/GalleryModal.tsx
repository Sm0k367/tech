import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Download, Heart } from 'lucide-react';
import CFImage from './CFImage';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockGallery = [
  { id: 1, url: 'https://picsum.photos/id/1015/800/600', title: 'Neon Samurai Showdown', prompt: 'Cyberpunk samurai in heavy rain, neon lights, cinematic lighting' },
  { id: 2, url: 'https://picsum.photos/id/133/800/600', title: 'Dystopian Tokyo 2147', prompt: 'Futuristic Tokyo at night with flying cars, heavy atmosphere' },
  { id: 3, url: 'https://picsum.photos/id/201/800/600', title: 'Ghost in the Machine', prompt: 'Digital ghost emerging from holographic interface, dark cyberpunk' },
  { id: 4, url: 'https://picsum.photos/id/29/800/600', title: 'The Last Director', prompt: 'Elderly film director in abandoned Hollywood studio, dramatic lighting' },
];

export default function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const [selected, setSelected] = useState<any>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-7xl w-full h-[90vh] glass-panel rounded-3xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold tracking-tighter">THE VAULT</div>
              <div className="text-xs px-4 py-1.5 bg-white/10 rounded-full">142 cinematic moments preserved</div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockGallery.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelected(item)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer aspect-video bg-black"
              >
                <CFImage src={item.url} alt={item.title} className="group-hover:scale-110 transition-transform duration-700" />
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6">
                  <div className="font-medium text-lg mb-1">{item.title}</div>
                  <div className="text-xs text-white/60 line-clamp-2">{item.prompt}</div>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-black/70 hover:bg-black p-2 rounded-2xl backdrop-blur">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="bg-black/70 hover:bg-black p-2 rounded-2xl backdrop-blur">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 border-t border-white/10 text-center text-xs text-white/40">
            All generations are stored in R2 • Vector embeddings in Vectorize • Powered by Cloudflare
          </div>
        </motion.div>

        {/* Detail View */}
        <AnimatePresence>
          {selected && (
            <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative">
                  <CFImage src={selected.url} alt={selected.title} className="w-full" />
                  <button onClick={() => setSelected(null)} className="absolute top-6 right-6 bg-black/80 p-3 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-10">
                  <div className="text-4xl font-bold mb-3">{selected.title}</div>
                  <div className="text-white/70 text-lg leading-relaxed mb-8">{selected.prompt}</div>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-white text-black rounded-3xl font-semibold flex items-center justify-center gap-3">
                      <Play className="w-5 h-5" /> RECREATE THIS SCENE
                    </button>
                    <button className="flex-1 py-4 border border-white/30 hover:bg-white/5 rounded-3xl font-semibold">Add to Memory Vault</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
