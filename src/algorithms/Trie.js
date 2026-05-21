// =============================================
// Trie.js — Full Trie Data Structure
// =============================================
// Time Complexity:
//   Insert:             O(L) where L = word length
//   Search:             O(L)
//   StartsWith:         O(L)
//   Delete:             O(L)
//   GetSuggestions:     O(L + K) where K = number of results
// Space Complexity:     O(N × L) where N = number of words
// =============================================

let nodeIdCounter = 0;

function generateUniqueId() {
  return `trie-node-${nodeIdCounter++}`;
}

export class TrieNode {
  constructor(char = '') {
    this.children = {};        // character → TrieNode
    this.isEndOfWord = false;
    this.frequency = 0;        // how many times this word was searched
    this.category = null;      // 'notes', 'events', 'faculty', etc.
    this.char = char;          // the character this node represents
    this.id = generateUniqueId();  // unique id for React Flow visualization
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode('');
    this.root.id = 'trie-root';
    this.wordCount = 0;
    this.nodeCount = 1; // root node
  }

  /**
   * Insert a word into the Trie
   * Time: O(L) where L = word.length
   */
  insert(word, category = null, frequency = 1) {
    if (!word || typeof word !== 'string') return;

    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (let i = 0; i < lowerWord.length; i++) {
      const char = lowerWord[i];
      if (!node.children[char]) {
        node.children[char] = new TrieNode(char);
        this.nodeCount++;
      }
      node = node.children[char];
    }

    if (!node.isEndOfWord) {
      this.wordCount++;
    }

    node.isEndOfWord = true;
    node.frequency = Math.max(node.frequency, frequency);
    node.category = category || node.category;

    // Store the original casing
    node._originalWord = word;
  }

  /**
   * Search for an exact word in the Trie
   * Time: O(L)
   * Returns: boolean
   */
  search(word) {
    if (!word || typeof word !== 'string') return false;

    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (let i = 0; i < lowerWord.length; i++) {
      const char = lowerWord[i];
      if (!node.children[char]) return false;
      node = node.children[char];
    }

    return node.isEndOfWord;
  }

  /**
   * Check if any word starts with the given prefix
   * Time: O(L)
   * Returns: boolean
   */
  startsWith(prefix) {
    if (!prefix || typeof prefix !== 'string') return false;

    let node = this.root;
    const lowerPrefix = prefix.toLowerCase();

    for (let i = 0; i < lowerPrefix.length; i++) {
      const char = lowerPrefix[i];
      if (!node.children[char]) return false;
      node = node.children[char];
    }

    return true;
  }

  /**
   * Delete a word from the Trie
   * Time: O(L)
   * Returns: boolean (true if word was found and deleted)
   */
  delete(word) {
    if (!word || typeof word !== 'string') return false;

    const lowerWord = word.toLowerCase();
    const path = []; // track the path for cleanup
    let node = this.root;

    // Traverse to the end of the word
    for (let i = 0; i < lowerWord.length; i++) {
      const char = lowerWord[i];
      if (!node.children[char]) return false;
      path.push({ node, char });
      node = node.children[char];
    }

    if (!node.isEndOfWord) return false;

    node.isEndOfWord = false;
    node.frequency = 0;
    node.category = null;
    node._originalWord = undefined;
    this.wordCount--;

    // Clean up nodes that are no longer needed
    // Walk backwards and remove nodes with no children and not end-of-word
    for (let i = path.length - 1; i >= 0; i--) {
      const { node: parentNode, char } = path[i];
      const childNode = parentNode.children[char];

      if (Object.keys(childNode.children).length === 0 && !childNode.isEndOfWord) {
        delete parentNode.children[char];
        this.nodeCount--;
      } else {
        break;
      }
    }

    return true;
  }

  /**
   * Get all suggestions for a given prefix, sorted by frequency
   * Time: O(L + K) where L = prefix length, K = number of matching words
   */
  getSuggestions(prefix, limit = 8) {
    if (!prefix || typeof prefix !== 'string') return [];

    let node = this.root;
    const lowerPrefix = prefix.toLowerCase();
    let nodesTraversed = 0;

    // Navigate to the prefix node
    for (let i = 0; i < lowerPrefix.length; i++) {
      const char = lowerPrefix[i];
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
      nodesTraversed++;
    }

    // Collect all words from this node using DFS
    const results = [];
    this._collectWords(node, lowerPrefix, results);

    // Sort by frequency (descending)
    results.sort((a, b) => b.frequency - a.frequency);

    // Attach traversal metadata
    const limited = results.slice(0, limit);
    limited._nodesTraversed = nodesTraversed;

    return limited;
  }

  /**
   * DFS helper to collect all words from a given node
   */
  _collectWords(node, currentWord, results) {
    if (node.isEndOfWord) {
      results.push({
        word: node._originalWord || currentWord,
        frequency: node.frequency,
        category: node.category,
      });
    }

    for (const char of Object.keys(node.children).sort()) {
      this._collectWords(node.children[char], currentWord + char, results);
    }
  }

  /**
   * Get all nodes as a flat list for React Flow graph rendering
   * Returns: Array of { id, char, isEndOfWord, parentId, depth, frequency, category }
   */
  getAllNodes() {
    const nodes = [];
    const edges = [];

    const traverse = (node, depth, parentId) => {
      nodes.push({
        id: node.id,
        char: node.char || 'ROOT',
        isEndOfWord: node.isEndOfWord,
        depth,
        frequency: node.frequency,
        category: node.category,
        childCount: Object.keys(node.children).length,
      });

      if (parentId !== null) {
        edges.push({
          id: `edge-${parentId}-${node.id}`,
          source: parentId,
          target: node.id,
        });
      }

      const sortedChildren = Object.keys(node.children).sort();
      for (const char of sortedChildren) {
        traverse(node.children[char], depth + 1, node.id);
      }
    };

    traverse(this.root, 0, null);
    return { nodes, edges };
  }

  /**
   * Get the traversal path for a word (list of node IDs)
   * Used for highlighting animation in React Flow
   */
  getTraversalPath(word) {
    if (!word || typeof word !== 'string') return [];

    const path = [this.root.id];
    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (let i = 0; i < lowerWord.length; i++) {
      const char = lowerWord[i];
      if (!node.children[char]) return path;
      node = node.children[char];
      path.push(node.id);
    }

    return path;
  }

  /**
   * Get all inserted words
   */
  getAllWords() {
    const words = [];
    this._collectWords(this.root, '', words);
    return words;
  }

  /**
   * Update frequency of a word (for search tracking)
   */
  incrementFrequency(word) {
    if (!word || typeof word !== 'string') return;

    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (let i = 0; i < lowerWord.length; i++) {
      const char = lowerWord[i];
      if (!node.children[char]) return;
      node = node.children[char];
    }

    if (node.isEndOfWord) {
      node.frequency++;
    }
  }

  /**
   * Reset the node ID counter (useful for testing)
   */
  static resetIdCounter() {
    nodeIdCounter = 0;
  }
}

export default Trie;
