import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Trie } from '../algorithms/Trie';
import { MaxHeap } from '../algorithms/Heap';
import { LRUCache } from '../algorithms/LRUCache';
import { HashMap } from '../algorithms/HashMap';
import { findClosestMatch } from '../algorithms/Levenshtein';
import campusData from '../data/campusData';

const SearchContext = createContext(null);

const STORAGE_KEYS = {
  DATASET: 'campusiq_dataset',
  ANALYTICS: 'campusiq_analytics',
  RECENT: 'campusiq_recent_searches',
};

function getPersistedDataset() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DATASET);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse campusiq_dataset from localStorage', e);
  }
  return campusData;
}

function savePersistedDataset(dataset) {
  try {
    localStorage.setItem(STORAGE_KEYS.DATASET, JSON.stringify(dataset));
  } catch (e) {
    console.error('Failed to save campusiq_dataset to localStorage', e);
  }
}

function getPersistedAnalytics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.totalSearches === 'number') return parsed;
    }
  } catch (e) {
    console.error('Failed to parse campusiq_analytics from localStorage', e);
  }
  return {
    totalSearches: 0,
    sessionStart: Date.now(),
    responseTimes: [],
    searchTimeline: [],
  };
}

function savePersistedAnalytics(analytics) {
  try {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to save campusiq_analytics to localStorage', e);
  }
}

function getPersistedRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse campusiq_recent_searches from localStorage', e);
  }
  return [];
}

function savePersistedRecentSearches(recent) {
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recent));
  } catch (e) {
    console.error('Failed to save campusiq_recent_searches to localStorage', e);
  }
}

export function SearchProvider({ children }) {
  // ── In-Memory Dataset persistence ref ──
  const datasetRef = useRef(null);
  if (datasetRef.current === null) {
    datasetRef.current = getPersistedDataset();
  }
  const dataset = datasetRef.current;

  // ── Helper to update word frequency & new terms in persistent storage ──
  const updatePersistedItem = (word, newFreq, defaultCategory = 'resources') => {
    let list = datasetRef.current || [];
    const index = list.findIndex(item => item.word.toLowerCase() === word.toLowerCase());
    if (index >= 0) {
      list[index].frequency = newFreq;
    } else {
      list.push({ word, category: defaultCategory, frequency: newFreq, tags: [defaultCategory] });
    }
    datasetRef.current = list;
    savePersistedDataset(list);
  };

  // ── Refs for mutable DSA instances (persist across re-renders) ──
  const trieRef = useRef(null);
  if (trieRef.current === null) {
    const trie = new Trie();
    dataset.forEach(item => {
      trie.insert(item.word, item.category, item.frequency);
    });
    trieRef.current = trie;
  }

  const heapRef = useRef(null);
  if (heapRef.current === null) {
    const heap = new MaxHeap();
    dataset.forEach(item => {
      heap.insert({ word: item.word, score: item.frequency });
    });
    heapRef.current = heap;
  }

  const lruRef = useRef(null);
  if (lruRef.current === null) {
    const lru = new LRUCache(7);
    const savedRecent = getPersistedRecentSearches();
    [...savedRecent].reverse().forEach(word => {
      lru.put(word, word);
    });
    lruRef.current = lru;
  }

  const hashMapRef = useRef(null);
  if (hashMapRef.current === null) {
    const hashMap = new HashMap(53);
    dataset.forEach(item => {
      hashMap.set(item.word, item.frequency);
    });
    hashMapRef.current = hashMap;
  }

  // ── State for UI reactivity (initialized from localStorage) ──
  const [analytics, setAnalytics] = useState(getPersistedAnalytics);

  const [recentSearches, setRecentSearches] = useState(() => {
    return lruRef.current ? lruRef.current.getAll() : getPersistedRecentSearches();
  });

  const [trendingItems, setTrendingItems] = useState(() => {
    return heapRef.current
      ? heapRef.current.getTopN(5)
      : [...dataset]
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 5)
          .map(item => ({ word: item.word, score: item.frequency }));
  });

  const [frequencyData, setFrequencyData] = useState(() => {
    return hashMapRef.current
      ? hashMapRef.current.getTopN(10)
      : [...dataset]
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 10)
          .map(item => ({ key: item.word, value: item.frequency }));
  });

  const [lastOperation, setLastOperation] = useState({ op: 'init()', complexity: '—' });

  /**
   * Perform a search query — updates all data structures and local storage
   */
  const performSearch = useCallback((query) => {
    if (!query || !query.trim()) return { suggestions: [], elapsed: 0 };

    const trimmedQuery = query.trim();
    const startTime = performance.now();

    // 1. Get suggestions from Trie
    const trie = trieRef.current;
    
    // Check if it matches a category name case-insensitively
    const lowerQuery = trimmedQuery.toLowerCase();
    const categories = ['notes', 'exams', 'faculty', 'hostel', 'events', 'library', 'courses', 'clubs', 'labs', 'resources'];
    const isCategory = categories.includes(lowerQuery);

    let suggestions = [];
    if (isCategory) {
      const allTrieWords = trie ? trie.getAllWords() : [];
      suggestions = allTrieWords
        .filter(item => item.category === lowerQuery)
        .slice(0, 8);
    } else {
      suggestions = trie ? trie.getSuggestions(trimmedQuery, 8) : [];
    }

    // Dynamic Insertion: If this exact query is not in the Trie and is not a category, add it!
    const exists = trie ? trie.search(trimmedQuery) : false;
    if (trie && !exists && !isCategory) {
      trie.insert(trimmedQuery, 'resources', 1);
      updatePersistedItem(trimmedQuery, 1, 'resources');
    }

    const elapsed = performance.now() - startTime;

    // 2. Update HashMap frequency
    const hashMap = hashMapRef.current;
    if (hashMap && !isCategory) {
      if (!hashMap.has(trimmedQuery)) {
        hashMap.set(trimmedQuery, 1);
        updatePersistedItem(trimmedQuery, 1, 'resources');
      } else {
        const newCount = hashMap.increment(trimmedQuery);
        updatePersistedItem(trimmedQuery, newCount || ((hashMap.get(trimmedQuery) || 1)));
      }
      setFrequencyData(hashMap.getTopN(10));
    }

    // 3. Update MaxHeap trending score with dynamic decay
    const heap = heapRef.current;
    if (heap && !isCategory) {
      const decayedHeap = heap.heap.map(item => ({
        word: item.word,
        score: Math.max(1, Math.round(item.score * 0.94))
      }));
      heap.clear();
      decayedHeap.forEach(item => {
        heap.insert(item);
      });

      if (!heap.has(trimmedQuery)) {
        heap.insert({ word: trimmedQuery, score: 20 });
      } else {
        heap.updateScore(trimmedQuery, 25);
      }
      setTrendingItems(heap.getTopN(5));
    }

    // 4. Update LRU Cache (search history)
    const lru = lruRef.current;
    let evictedKey = null;
    if (lru && !isCategory) {
      const result = lru.put(trimmedQuery, trimmedQuery);
      evictedKey = result.evictedKey;
      const allRecent = lru.getAll();
      setRecentSearches(allRecent);
      savePersistedRecentSearches(allRecent);
    }

    // 5. Update analytics
    setAnalytics(prev => {
      const newTotal = prev.totalSearches + 1;
      const newTimes = [...prev.responseTimes, elapsed];
      const newTimeline = [...prev.searchTimeline, { timestamp: Date.now(), count: newTotal }];
      const updated = {
        ...prev,
        totalSearches: newTotal,
        responseTimes: newTimes,
        searchTimeline: newTimeline,
      };
      savePersistedAnalytics(updated);
      return updated;
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
    const trie = trieRef.current;
    const allWords = trie ? trie.getAllWords().map(w => w.word) : [];
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
      const decayedHeap = heap.heap.map(item => ({
        word: item.word,
        score: Math.max(1, Math.round(item.score * 0.94))
      }));
      heap.clear();
      decayedHeap.forEach(item => {
        heap.insert(item);
      });

      heap.updateScore(word, 35);
      setTrendingItems(heap.getTopN(5));
    }

    const hashMap = hashMapRef.current;
    if (hashMap) {
      const newCount = hashMap.increment(word);
      updatePersistedItem(word, newCount || ((hashMap.get(word) || 1)));
      setFrequencyData(hashMap.getTopN(10));
    }

    const lru = lruRef.current;
    if (lru) {
      lru.put(word, word);
      const allRecent = lru.getAll();
      setRecentSearches(allRecent);
      savePersistedRecentSearches(allRecent);
    }
  }, []);

  /**
   * Reset all data back to original seed dataset
   */
  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.DATASET);
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
    localStorage.removeItem(STORAGE_KEYS.RECENT);
    window.location.reload();
  }, []);

  // ── Authentication State ──
  const [user, setUser] = useState(() => localStorage.getItem('campusiq_user') || '');
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    resetAllData,

    // Reactive state
    analytics,
    recentSearches,
    trendingItems,
    frequencyData,
    lastOperation,

    // Auth state
    user,
    setUser,
    showLoginModal,
    setShowLoginModal,
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
// eslint-disable-next-line react-refresh/only-export-components
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
