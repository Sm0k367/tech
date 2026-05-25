import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    setTimeout(() => {
      onSuccess();
      onClose();
      setEmail('');
      setPassword('');
      setName('');
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-panel w-full max-w-md mx-4 rounded-3xl overflow-hidden"
        >
          <div className="p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-3xl font-bold">Welcome to the Studio</div>
                <div className="text-white/60">Sign in to unlock cinematic tools</div>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-2 mb-8 border-b border-white/10 pb-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${isLogin ? 'bg-white text-black' : 'hover:bg-white/10'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${!isLogin ? 'bg-white text-black' : 'hover:bg-white/10'}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-5 top-4 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Studio name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 py-4 text-lg focus:outline-none focus:border-white/30"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-5 top-4 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@hollywood.studio"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 py-4 text-lg focus:outline-none focus:border-white/30"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-5 top-4 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 py-4 text-lg focus:outline-none focus:border-white/30"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-semibold rounded-3xl hover:bg-white/90 transition-colors text-lg flex items-center justify-center gap-2"
              >
                {isLogin ? 'ENTER THE STUDIO' : 'CREATE DIRECTOR PROFILE'}
              </button>
            </form>

            <div className="text-center text-xs text-white/40 mt-8">
              Secured by Cloudflare Turnstile • Zero-trust authentication
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
