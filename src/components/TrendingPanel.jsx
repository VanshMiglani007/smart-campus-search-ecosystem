import { motion } from 'framer-motion';
import { TrendingUp, Flame } from 'lucide-react';

const TrendingPanel = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-warning" />
        <h3 className="text-sm font-semibold text-text-primary">Trending Now</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {items.map((item, index) => (
          <motion.div
            key={item.word}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card-hover px-4 py-3 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-warning text-xs font-bold">#{index + 1}</span>
              <TrendingUp size={12} className="text-warning" />
            </div>
            <div className="text-sm font-medium text-text-primary truncate">{item.word}</div>
            <div className="text-[10px] font-mono text-text-muted mt-1">
              score: {item.score}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPanel;
