import { motion } from 'framer-motion';
import { Type } from 'lucide-react';

const AutocompletePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
          <Type size={32} className="text-accent-blue" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Live Autocomplete</h1>
        <p className="text-text-secondary">Trie-powered instant search — coming in Milestone 4</p>
      </div>
    </motion.div>
  );
};

export default AutocompletePage;
