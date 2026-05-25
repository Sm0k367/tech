import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface AgentCardProps {
  agent: { name: string; status: string };
  index: number;
}

export default function AgentCard({ agent, index }: AgentCardProps) {
  const colors = ['#c026d3', '#22d3ee', '#a855f7'];
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel p-6 rounded-3xl group cursor-pointer hover:scale-[1.02] transition-transform"
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Zap className="w-8 h-8" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-xl tracking-tight">{agent.name}</h4>
            <div className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[10px] ${
              agent.status === 'complete' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {agent.status}
            </div>
          </div>
          
          <p className="text-white/50 text-sm mt-1 leading-tight">
            {agent.name === "Writer" && "Crafting the perfect screenplay"}
            {agent.name === "Director" && "Visualizing every frame"}
            {agent.name === "Editor" && "Polishing the final cut"}
          </p>
          
          <div className="h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-white to-cyan-400 rounded-full"
              initial={{ width: "35%" }}
              animate={{ 
                width: agent.status === 'complete' ? "100%" : "65%" 
              }}
              transition={{ duration: 1.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
