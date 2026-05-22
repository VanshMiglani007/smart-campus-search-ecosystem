import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import SuggestionDropdown from './SuggestionDropdown';

const SearchBar = ({ onSelectSuggestion, autoFocus = false, showAlgorithmInfo = false, initialQuery = '' }) => {
  const { performSearch, getTypoCorrection } = useSearch();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
  const [typoSuggestion, setTypoSuggestion] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isVoiceSupported] = useState(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      return !!SpeechRecognition;
    }
    return false;
  });
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleSearch = useCallback((searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      setSuggestions([]);
      setSearchMeta(null);
      setTypoSuggestion(null);
      return;
    }

    const trimmed = searchQuery.trim();
    const result = performSearch(trimmed);
    setSuggestions(result.suggestions);
    setSearchMeta({
      elapsed: result.elapsed,
      nodesTraversed: result.nodesTraversed,
      count: result.suggestions.length,
      queryLength: trimmed.length,
    });

    // If no results, try typo correction
    if (result.suggestions.length === 0) {
      const correction = getTypoCorrection(trimmed);
      setTypoSuggestion(correction);
    } else {
      setTypoSuggestion(null);
    }
  }, [performSearch, getTypoCorrection]);

  // Automatically execute search on mount if initialQuery is provided
  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => {
        handleSearch(initialQuery);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, handleSearch]);

  // Voice search setup
  useEffect(() => {
    if (!isVoiceSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, [isVoiceSupported, handleSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleSelect = (word) => {
    setQuery(word);
    setSuggestions([]);
    setTypoSuggestion(null);
    if (onSelectSuggestion) onSelectSuggestion(word);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSearchMeta(null);
    setTypoSuggestion(null);
    inputRef.current?.focus();
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleTypoClick = (word) => {
    setQuery(word);
    handleSearch(word);
    setTypoSuggestion(null);
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div
        className={`glass-card flex items-center gap-3 px-5 py-3.5 transition-all duration-300 ${
          isFocused ? 'glow-blue' : ''
        }`}
      >
        <Search size={20} className="text-text-muted flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search notes, events, faculty..."
          autoFocus={autoFocus}
          className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted font-[var(--font-heading)]"
          id="campus-search-input"
        />

        {/* Clear button */}
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Voice Search Button */}
        <button
          onClick={toggleVoice}
          disabled={!isVoiceSupported}
          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
            isListening
              ? 'text-red-400 bg-red-500/10 mic-listening'
              : isVoiceSupported
                ? 'text-text-muted hover:text-text-primary hover:bg-white/5'
                : 'text-text-muted/30 cursor-not-allowed'
          }`}
          title={isVoiceSupported ? '🎤 Voice search (Chrome)' : 'Voice search requires Chrome'}
          aria-label="Voice search"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      </div>

      {/* Voice Label */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 text-center"
          >
            <span className="text-xs text-red-400 font-medium">🎤 Listening... Speak now</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion Dropdown */}
      <AnimatePresence>
        {(suggestions.length > 0 || typoSuggestion) && isFocused && (
          <SuggestionDropdown
            suggestions={suggestions}
            query={query}
            onSelect={handleSelect}
            typoSuggestion={typoSuggestion}
            onTypoClick={handleTypoClick}
          />
        )}
      </AnimatePresence>

      {/* Algorithm Info Panel (shown on autocomplete page) */}
      {showAlgorithmInfo && searchMeta && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-sm font-semibold text-text-primary">🌳 Trie Active</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Prefix</div>
              <div className="text-sm font-mono text-accent-blue">&quot;{query.trim()}&quot;</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Nodes Traversed</div>
              <div className="text-sm font-mono text-accent-cyan">{searchMeta.nodesTraversed}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Suggestions</div>
              <div className="text-sm font-mono text-accent-purple">{searchMeta.count}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Time</div>
              <div className="text-sm font-mono text-accent-cyan">{searchMeta.elapsed.toFixed(2)}ms</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-text-muted">Complexity: </span>
            <span className="text-[11px] font-mono text-accent-blue">
              O(L + K) = O({searchMeta.queryLength} + {searchMeta.count})
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
