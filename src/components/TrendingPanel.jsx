import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const TrendingPanel = ({ items = [], onClickItem }) => {
  if (!items || items.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-full min-h-[110px] rounded-3xl border border-white/10 bg-white/[0.03] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch">
      {items.map((item, index) => (
        <motion.div
          key={item.word}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07 }}
          onClick={() => onClickItem?.(item.word)}
          className="h-full"
        >
          <div
            className="
            h-full
            cursor-pointer
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            hover:bg-white/[0.06]
            hover:border-white/20
            transition-all
            duration-300
            shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
            p-5
            group
            "
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#f59e0b] text-xs font-bold">
                  #{index + 1}
                </span>

                <TrendingUp
                  size={13}
                  className="text-[#f59e0b]"
                />
              </div>

              <span
                className="
                text-[10px]
                font-mono
                text-[#f59e0b]/70
                bg-[#f59e0b]/10
                px-2
                py-1
                rounded-full
                border
                border-[#f59e0b]/20
                "
              >
                {item.score}
              </span>
            </div>

            <div className="text-sm font-semibold text-[#f1f5f9] leading-snug group-hover:text-[#f59e0b] transition-colors">
              {item.word}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrendingPanel;