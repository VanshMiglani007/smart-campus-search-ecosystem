// =============================================
// HashMap.js — Custom Hash Map with Chaining
// =============================================
// Time Complexity:
//   Set:       O(1) average, O(N) worst case
//   Get:       O(1) average, O(N) worst case
//   Increment: O(1) average
//   GetTopN:   O(N log N)
// Space Complexity: O(N)
// =============================================
// Collision Resolution: Separate Chaining (Linked List)
// Hash Function: djb2 variant
// =============================================
// Used for: Search frequency tracking, personalized ranking
// =============================================

class HashNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;  // for chaining
  }
}

export class HashMap {
  /**
   * @param {number} size - Number of buckets (use prime for fewer collisions)
   */
  constructor(size = 53) {
    this.buckets = new Array(size).fill(null);
    this.size = size;
    this.count = 0;       // total number of key-value pairs
    this.collisions = 0;  // track collisions for visualization
  }

  /**
   * Hash function (djb2 variant)
   * Produces a bucket index from a string key
   */
  hash(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash + key.charCodeAt(i)) & 0x7fffffff;
    }
    return hash % this.size;
  }

  /**
   * Set a key-value pair
   * Time: O(1) average
   */
  set(key, value) {
    const index = this.hash(key);
    let current = this.buckets[index];

    // Check if key already exists in the chain
    while (current !== null) {
      if (current.key === key) {
        current.value = value;
        return;
      }
      current = current.next;
    }

    // Insert new node at the head of the chain
    const newNode = new HashNode(key, value);
    if (this.buckets[index] !== null) {
      this.collisions++;
    }
    newNode.next = this.buckets[index];
    this.buckets[index] = newNode;
    this.count++;
  }

  /**
   * Get a value by key
   * Time: O(1) average
   * Returns: value or undefined
   */
  get(key) {
    const index = this.hash(key);
    let current = this.buckets[index];

    while (current !== null) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }

    return undefined;
  }

  /**
   * Increment a key's value by 1 (or set to 1 if doesn't exist)
   * Time: O(1) average
   * Returns: new value
   */
  increment(key) {
    const existing = this.get(key);
    if (existing !== undefined) {
      this.set(key, existing + 1);
      return existing + 1;
    } else {
      this.set(key, 1);
      return 1;
    }
  }

  /**
   * Delete a key
   * Time: O(1) average
   * Returns: boolean
   */
  delete(key) {
    const index = this.hash(key);
    let current = this.buckets[index];
    let prev = null;

    while (current !== null) {
      if (current.key === key) {
        if (prev === null) {
          this.buckets[index] = current.next;
        } else {
          prev.next = current.next;
        }
        this.count--;
        return true;
      }
      prev = current;
      current = current.next;
    }

    return false;
  }

  /**
   * Check if a key exists
   * Time: O(1) average
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Get all key-value pairs sorted by value (descending)
   * Time: O(N log N)
   */
  getAll() {
    const entries = [];

    for (let i = 0; i < this.size; i++) {
      let current = this.buckets[i];
      while (current !== null) {
        entries.push({ key: current.key, value: current.value });
        current = current.next;
      }
    }

    return entries.sort((a, b) => b.value - a.value);
  }

  /**
   * Get top N entries by value
   * Time: O(N log N)
   */
  getTopN(n) {
    return this.getAll().slice(0, n);
  }

  /**
   * Get the number of stored items
   */
  getCount() {
    return this.count;
  }

  /**
   * Get stats for visualization
   */
  getStats() {
    let maxChainLength = 0;
    let filledBuckets = 0;

    for (let i = 0; i < this.size; i++) {
      let chainLength = 0;
      let current = this.buckets[i];
      if (current !== null) filledBuckets++;
      while (current !== null) {
        chainLength++;
        current = current.next;
      }
      maxChainLength = Math.max(maxChainLength, chainLength);
    }

    return {
      totalBuckets: this.size,
      filledBuckets,
      count: this.count,
      collisions: this.collisions,
      maxChainLength,
      loadFactor: (this.count / this.size).toFixed(2),
    };
  }

  /**
   * Clear all entries
   */
  clear() {
    this.buckets = new Array(this.size).fill(null);
    this.count = 0;
    this.collisions = 0;
  }
}

export default HashMap;
