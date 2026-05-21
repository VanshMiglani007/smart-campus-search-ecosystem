import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const AnalyticsDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={32} className="text-warning" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
        <p className="text-text-secondary">Search analytics with HashMap — coming in Milestone 7</p>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
