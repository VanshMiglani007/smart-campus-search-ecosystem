import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';

const PerformancePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-4">
          <Gauge size={32} className="text-accent-purple" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Performance Comparison</h1>
        <p className="text-text-secondary">Linear Search vs Trie Search — coming in Milestone 6</p>
      </div>
    </motion.div>
  );
};

export default PerformancePage;
