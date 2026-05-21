// =============================================
// LRUCache.js — Least Recently Used Cache
// =============================================
// Implementation: Doubly Linked List + HashMap
// Time Complexity:
//   Get:   O(1)
//   Put:   O(1)
//   Clear: O(1)
// Space Complexity: O(capacity)
// =============================================
// Used for: Search history with automatic eviction
// of least recently used items when capacity is full.
// =============================================

/**
 * Doubly Linked List Node
 */
class DLLNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
    this.timestamp = Date.now();
  }
}

export class LRUCache {
  /**
   * @param {number} capacity - Maximum number of items (default: 7)
   */
  constructor(capacity = 7) {
    this.capacity = capacity;
    this.size = 0;
    this.map = {};          // key → DLLNode (HashMap for O(1) lookup)

    // Sentinel head and tail nodes simplify edge cases
    this.head = new DLLNode('HEAD', null);  // Most recent
    this.tail = new DLLNode('TAIL', null);  // Least recent
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Remove a node from the doubly linked list
   * Time: O(1)
   */
  _removeNode(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
    node.prev = null;
    node.next = null;
  }

  /**
   * Add a node right after the head (most recent position)
   * Time: O(1)
   */
  _addToFront(node) {
    const next = this.head.next;
    this.head.next = node;
    node.prev = this.head;
    node.next = next;
    next.prev = node;
  }

  /**
   * Move an existing node to the front (mark as most recently used)
   * Time: O(1)
   */
  _moveToFront(node) {
    this._removeNode(node);
    this._addToFront(node);
    node.timestamp = Date.now();
  }

  /**
   * Get a value by key. Returns the value or -1 if not found.
   * Moves the accessed item to the front (most recent).
   * Time: O(1)
   */
  get(key) {
    if (!this.map.hasOwnProperty(key)) {
      return -1;
    }

    const node = this.map[key];
    this._moveToFront(node);
    return node.value;
  }

  /**
   * Put a key-value pair into the cache.
   * If the key exists, update the value and move to front.
   * If the cache is full, evict the LRU item (tail).
   * Time: O(1)
   * Returns: { evictedKey: string | null } for UI animation
   */
  put(key, value) {
    let evictedKey = null;

    // If key already exists, update and move to front
    if (this.map.hasOwnProperty(key)) {
      const node = this.map[key];
      node.value = value || node.value;
      this._moveToFront(node);
      return { evictedKey: null };
    }

    // If at capacity, evict the LRU item (just before tail)
    if (this.size >= this.capacity) {
      const lruNode = this.tail.prev;
      evictedKey = lruNode.key;
      this._removeNode(lruNode);
      delete this.map[lruNode.key];
      this.size--;
    }

    // Create new node and add to front
    const newNode = new DLLNode(key, value || key);
    this._addToFront(newNode);
    this.map[key] = newNode;
    this.size++;

    return { evictedKey };
  }

  /**
   * Get all items ordered from most recent to least recent
   * Time: O(N) where N = current size
   */
  getAll() {
    const items = [];
    let current = this.head.next;

    while (current !== this.tail) {
      items.push({
        key: current.key,
        value: current.value,
        timestamp: current.timestamp,
      });
      current = current.next;
    }

    return items;
  }

  /**
   * Check if a key exists in the cache
   * Time: O(1)
   */
  has(key) {
    return this.map.hasOwnProperty(key);
  }

  /**
   * Remove a specific key from the cache
   * Time: O(1)
   */
  remove(key) {
    if (!this.map.hasOwnProperty(key)) return false;

    const node = this.map[key];
    this._removeNode(node);
    delete this.map[key];
    this.size--;
    return true;
  }

  /**
   * Clear the entire cache
   * Time: O(1)
   */
  clear() {
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.map = {};
    this.size = 0;
  }

  /**
   * Get the current size
   */
  getSize() {
    return this.size;
  }

  /**
   * Get the capacity
   */
  getCapacity() {
    return this.capacity;
  }

  /**
   * Check if the cache is full
   */
  isFull() {
    return this.size >= this.capacity;
  }
}

export default LRUCache;
