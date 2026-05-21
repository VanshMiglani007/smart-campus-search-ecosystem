import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { Trie } from '../algorithms/Trie';
import { MaxHeap } from '../algorithms/Heap';
import { LRUCache } from '../algorithms/LRUCache';
import { HashMap } from '../algorithms/HashMap';
import { findClosestMatch } from '../algorithms/Levenshtein';
import campusData, { getAllWords } from '../data/campusData';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  // ── Refs for mutable DSA instances (persist across re-renders) ──
  const trieRef = useRef(null);
  const heapRef = useRef(null);
  const lruRef = useRef(null);
  const hashMapRef = useRef(null);

  // ── State for UI reactivity ──
  const [analytics, setAnalytics] = useState({
    totalSearches: 0,
    sessionStart: Date.now(),
    responseTimes: [],
    searchTimeline: [],     // { timestamp, count } for line chart
  });

  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [lastOperation, setLastOperation] = useState({ op: 'init()', complexity: '—' });

  // ── Initialize all data structures on mount ──
  useEffect(() => {
    // Create Trie and load campus data
    const trie = new Trie();
    campusData.forEach(item => {
      trie.insert(item.word, item.category, item.frequency);
    });
    trieRef.current = trie;

    // Create MaxHeap and load initial frequencies
    const heap = new MaxHeap();
    campusData.forEach(item => {
      heap.insert({ word: item.word, score: item.frequency });
    });
    heapRef.current = heap;

    // Create LRU Cache
    const lru = new LRUCache(7);
    lruRef.current = lru;

    // Create HashMap for frequency tracking
    const hashMap = new HashMap(53);
    campusData.forEach(item => {
      hashMap.set(item.word, item.frequency);
    });
    hashMapRef.current = hashMap;

    // Set initial UI state
    setTrendingItems(heap.getTopN(5));
    setFrequencyData(hashMap.getTopN(10));
  }, []);

  /**
   * Perform a search query — updates all data structures
   * This is the main entry point called on every search event
   */
  const performSearch = useCallback((query) => {
    if (!query || !query.trim()) return { suggestions: [], elapsed: 0 };

    const trimmedQuery = query.trim();
    const startTime = performance.now();

    // 1. Get suggestions from Trie
    const trie = trieRef.current;
    const suggestions = trie ? trie.getSuggestions(trimmedQuery, 8) : [];
    const elapsed = performance.now() - startTime;

    // 2. Update HashMap frequency
    const hashMap = hashMapRef.current;
    if (hashMap) {
      hashMap.increment(trimmedQuery);
      setFrequencyData(hashMap.getTopN(10));
    }

    // 3. Update MaxHeap trending score
    const heap = heapRef.current;
    if (heap) {
      heap.updateScore(trimmedQuery, 1);
      setTrendingItems(heap.getTopN(5));
    }

    // 4. Update LRU Cache (search history)
    const lru = lruRef.current;
    let evictedKey = null;
    if (lru) {
      const result = lru.put(trimmedQuery, trimmedQuery);
      evictedKey = result.evictedKey;
      setRecentSearches(lru.getAll());
    }

    // 5. Update analytics
    setAnalytics(prev => {
      const newTotal = prev.totalSearches + 1;
      const newTimes = [...prev.responseTimes, elapsed];
      const newTimeline = [...prev.searchTimeline, { timestamp: Date.now(), count: newTotal }];
      return {
        ...prev,
        totalSearches: newTotal,
        responseTimes: newTimes,
        searchTimeline: newTimeline,
      };
    });

    // 6. Update last operation
    setLastOperation({
      op: `getSuggestions("${trimmedQuery.substring(0, 15)}")`,
      complexity: `O(L) = O(${trimmedQuery.length})`,
    });

    return {
      suggestions,
      elapsed,
      nodesTraversed: suggestions._nodesTraversed || trimmedQuery.length,
      evictedKey,
    };
  }, []);

  /**
   * Get typo correction suggestion using Levenshtein distance
   */
  const getTypoCorrection = useCallback((input) => {
    if (!input || input.trim().length < 2) return null;
    const allWords = getAllWords();
    return findClosestMatch(input.trim(), allWords, 3);
  }, []);

  /**
   * Record a search selection (when user clicks a suggestion)
   */
  const recordSelection = useCallback((word) => {
    const trie = trieRef.current;
    if (trie) {
      trie.incrementFrequency(word);
    }

    const heap = heapRef.current;
    if (heap) {
      heap.updateScore(word, 2); // Extra weight for selection
      setTrendingItems(heap.getTopN(5));
    }

    const hashMap = hashMapRef.current;
    if (hashMap) {
      hashMap.increment(word);
      setFrequencyData(hashMap.getTopN(10));
    }

    const lru = lruRef.current;
    if (lru) {
      lru.put(word, word);
      setRecentSearches(lru.getAll());
    }
  }, []);

  // ── Context value ──
  const value = {
    // DSA instances (via refs)
    trie: trieRef,
    heap: heapRef,
    lru: lruRef,
    hashMap: hashMapRef,

    // Actions
    performSearch,
    getTypoCorrection,
    recordSelection,

    // Reactive state
    analytics,
    recentSearches,
    trendingItems,
    frequencyData,
    lastOperation,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

/**
 * Custom hook to use the search context
 */
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export default SearchContext;
