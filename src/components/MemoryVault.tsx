export default function MemoryVault() {
  return (
    <div className="glass-panel p-8 rounded-3xl">
      <h3 className="text-xl font-semibold mb-6">Memory Vault</h3>
      <div className="text-sm text-white/60 mb-4">Vectorize • Character Consistency</div>
      <input 
        type="text" 
        placeholder="Search characters or styles..." 
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-6"
      />
      <div className="space-y-3 text-sm">
        <div className="bg-white/5 p-4 rounded-2xl">Cyberpunk Samurai</div>
        <div className="bg-white/5 p-4 rounded-2xl">Neon Knight</div>
        <div className="bg-white/5 p-4 rounded-2xl">Future Tokyo Rain</div>
      </div>
    </div>
  );
}
