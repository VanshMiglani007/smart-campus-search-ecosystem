// =============================================
// Heap.js — MaxHeap Data Structure
// =============================================
// Time Complexity:
//   Insert:        O(log N)
//   ExtractMax:    O(log N)
//   Peek:          O(1)
//   UpdateScore:   O(N + log N) → find O(N) + heapify O(log N)
// Space Complexity: O(N)
// =============================================
// Used for: Trending engine — tracks top searched keywords
// Score = frequency × recency weight
// =============================================

export class MaxHeap {
  constructor() {
    this.heap = [];       // Array of { word, score }
    this.indexMap = {};   // word → index for fast lookup
  }

  /**
   * Get parent index
   */
  _parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  /**
   * Get left child index
   */
  _leftChildIndex(i) {
    return 2 * i + 1;
  }

  /**
   * Get right child index
   */
  _rightChildIndex(i) {
    return 2 * i + 2;
  }

  /**
   * Swap two elements and update the index map
   */
  _swap(i, j) {
    const wordI = this.heap[i].word;
    const wordJ = this.heap[j].word;

    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];

    this.indexMap[wordI] = j;
    this.indexMap[wordJ] = i;
  }

  /**
   * Restore heap property upward from index
   * Time: O(log N)
   */
  heapifyUp(index) {
    let current = index;

    while (current > 0) {
      const parent = this._parentIndex(current);
      if (this.heap[current].score > this.heap[parent].score) {
        this._swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  /**
   * Restore heap property downward from index
   * Time: O(log N)
   */
  heapifyDown(index) {
    const size = this.heap.length;
    let largest = index;

    while (true) {
      const left = this._leftChildIndex(largest);
      const right = this._rightChildIndex(largest);
      let next = largest;

      if (left < size && this.heap[left].score > this.heap[next].score) {
        next = left;
      }
      if (right < size && this.heap[right].score > this.heap[next].score) {
        next = right;
      }

      if (next !== largest) {
        this._swap(largest, next);
        largest = next;
      } else {
        break;
      }
    }
  }

  /**
   * Insert a new item or update existing
   * Time: O(log N)
   */
  insert({ word, score }) {
    if (this.indexMap.hasOwnProperty(word)) {
      // Update existing
      this.updateScore(word, score - this.heap[this.indexMap[word]].score);
      return;
    }

    this.heap.push({ word, score });
    const index = this.heap.length - 1;
    this.indexMap[word] = index;
    this.heapifyUp(index);
  }

  /**
   * Extract the maximum element
   * Time: O(log N)
   */
  extractMax() {
    if (this.heap.length === 0) return null;

    const max = this.heap[0];
    const last = this.heap.pop();
    delete this.indexMap[max.word];

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.indexMap[last.word] = 0;
      this.heapifyDown(0);
    }

    return max;
  }

  /**
   * Peek at the maximum element without removing
   * Time: O(1)
   */
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Update the score of an existing word
   * Time: O(N + log N) → O(N) for find + O(log N) for re-heapify
   */
  updateScore(word, delta) {
    if (!this.indexMap.hasOwnProperty(word)) {
      // Word doesn't exist, insert it
      this.insert({ word, score: delta });
      return;
    }

    const index = this.indexMap[word];
    const oldScore = this.heap[index].score;
    this.heap[index].score += delta;

    if (this.heap[index].score > oldScore) {
      this.heapifyUp(index);
    } else {
      this.heapifyDown(index);
    }
  }

  /**
   * Get all items sorted by score (descending)
   * Time: O(N log N)
   */
  getAll() {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }

  /**
   * Get top N items sorted by score
   * Time: O(N log N)
   */
  getTopN(n) {
    return this.getAll().slice(0, n);
  }

  /**
   * Get the current size of the heap
   */
  size() {
    return this.heap.length;
  }

  /**
   * Get the raw heap array (for visualization)
   */
  getRawHeap() {
    return [...this.heap];
  }

  /**
   * Check if a word exists in the heap
   */
  has(word) {
    return this.indexMap.hasOwnProperty(word);
  }

  /**
   * Get score for a specific word
   */
  getScore(word) {
    if (!this.indexMap.hasOwnProperty(word)) return 0;
    return this.heap[this.indexMap[word]].score;
  }

  /**
   * Clear the heap
   */
  clear() {
    this.heap = [];
    this.indexMap = {};
  }
}

export default MaxHeap;
