import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const TrendingPanel = ({ items = [], onClickItem }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
      {items.map((item, index) => (
        <motion.div
          key={item.word}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="glass-card-hover px-5 py-5 min-h-[110px] rounded-2xl flex flex-col justify-between cursor-pointer hover:scale-[1.05] hover:border-warning/35 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-300 relative overflow-hidden group"
          onClick={() => onClickItem && onClickItem(item.word)}
        >
          {/* Subtle hover glow layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="text-warning text-xs font-black">#{index + 1}</span>
              <TrendingUp size={14} className="text-warning" />
            </div>
            <span className="text-[10px] font-mono text-warning/80 bg-warning/5 px-2 py-0.5 rounded-full border border-warning/10">
              {item.score}
            </span>
          </div>
          <div className="text-sm font-bold text-text-primary truncate mt-3 relative z-10 group-hover:text-warning transition-colors duration-300">{item.word}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrendingPanel;
