import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const TrendingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <TrendingUp size={32} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Trending Engine</h1>
        <p className="text-text-secondary">MaxHeap-powered trending — coming in Milestone 9</p>
      </div>
    </motion.div>
  );
};

export default TrendingPage;
