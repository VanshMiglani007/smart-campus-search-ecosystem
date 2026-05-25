import { motion } from 'framer-motion';
import {
  FileText, GraduationCap, Users, Building2, Calendar,
  BookOpen, School, Heart, FlaskConical, Globe, Search,
} from 'lucide-react';
import { getCategoryColor } from '../data/campusData';
import ComplexityBadge from './ComplexityBadge';

const iconMap = {
  notes: FileText,
  exams: GraduationCap,
  faculty: Users,
  hostel: Building2,
  events: Calendar,
  library: BookOpen,
  courses: School,
  clubs: Heart,
  labs: FlaskConical,
  resources: Globe,
};

const SuggestionDropdown = ({ suggestions, query, onSelect, typoSuggestion, onTypoClick }) => {
  /**
   * Highlight the matching prefix in a suggestion word
   */
  const highlightMatch = (word, prefix) => {
    if (!prefix) return word;

    const lowerWord = word.toLowerCase();
    const lowerPrefix = prefix.toLowerCase();
    const matchIndex = lowerWord.indexOf(lowerPrefix);

    if (matchIndex === -1) return word;

    const before = word.slice(0, matchIndex);
    const match = word.slice(matchIndex, matchIndex + prefix.length);
    const after = word.slice(matchIndex + prefix.length);

    return (
      <>
        {before}
        <span className="text-accent-blue font-semibold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.95 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{ transformOrigin: 'top' }}
      className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl border border-white/8 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] overflow-hidden z-50"
    >
      {/* Suggestions List */}
      {suggestions.map((item, index) => {
        const Icon = iconMap[item.category] || Search;
        const categoryColor = getCategoryColor(item.category);

        return (
          <motion.button
            key={`${item.word}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSelect(item.word)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left group"
          >
            {/* Category Icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${categoryColor}15` }}
            >
              <Icon size={15} style={{ color: categoryColor }} />
            </div>

            {/* Word + Category */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-text-primary truncate">
                {highlightMatch(item.word, query)}
              </div>
              <div className="text-[10px] text-text-muted capitalize">{item.category}</div>
            </div>

            {/* Frequency */}
            <span className="text-[11px] font-mono text-text-muted flex-shrink-0">
              freq: {item.frequency}
            </span>

            {/* Complexity Badge */}
            <ComplexityBadge type="time" value="O(L)" color="cyan" />
          </motion.button>
        );
      })}

      {/* Typo Suggestion */}
      {typoSuggestion && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onTypoClick(typoSuggestion.word)}
          className="w-full flex items-center gap-3 px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors text-left"
        >
          <span className="text-sm text-text-muted">Did you mean:</span>
          <span className="text-sm text-accent-cyan font-semibold">{typoSuggestion.word}</span>
          <span className="text-xs font-mono text-text-muted">
            (distance: {typoSuggestion.distance})
          </span>
          <span className="text-accent-cyan">✓</span>
        </motion.button>
      )}

      {/* No results */}
      {suggestions.length === 0 && !typoSuggestion && (
        <div className="px-4 py-3 text-sm text-text-muted text-center">
          No results found. Try the{' '}
          <a href="/typo" className="text-accent-blue hover:underline">
            Typo Correction
          </a>{' '}
          page →
        </div>
      )}
    </motion.div>
  );
};

export default SuggestionDropdown;
