import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const SearchHistoryPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-accent-cyan" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Search History</h1>
        <p className="text-text-secondary">LRU Cache visualization — coming in Milestone 8</p>
      </div>
    </motion.div>
  );
};

export default SearchHistoryPage;
