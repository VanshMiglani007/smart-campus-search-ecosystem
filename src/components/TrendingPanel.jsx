import { motion } from 'framer-motion';
import { TrendingUp, Flame } from 'lucide-react';

const TrendingPanel = ({ items = [], onClickItem }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-warning" />
        <h3 className="text-sm font-semibold text-text-primary">Trending Now</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.word}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card-hover px-4 py-4 cursor-pointer hover:scale-[1.03] hover:border-warning/30 transition-all duration-300"
            onClick={() => onClickItem && onClickItem(item.word)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <span className="text-warning text-xs font-bold">#{index + 1}</span>
                <TrendingUp size={12} className="text-warning" />
              </div>
              <span className="text-[9px] font-mono text-text-muted bg-white/3 px-1.5 py-0.5 rounded">
                score: {item.score}
              </span>
            </div>
            <div className="text-sm font-semibold text-text-primary truncate">{item.word}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPanel;
