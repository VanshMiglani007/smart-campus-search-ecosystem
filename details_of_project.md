# 🔍 CampusIQ — Smart Campus Search Ecosystem
## Comprehensive Project Dossier & Technical Reference
**Author:** Vansh Miglani  
**Institution:** Chandigarh University  
**Project Category:** Data Structures, Algorithms & Full-Stack Systems Engineering  
**Application Type:** In-Memory Algorithmic Search Engine & Live DSA Visualizer  
**Source Code Repository:** [GitHub - smart-campus-search-ecosystem](https://github.com/VanshMiglani007/smart-campus-search-ecosystem)  
**Live Vercel Deployment:** [https://smart-campus-search-ecosystem.vercel.app/](https://smart-campus-search-ecosystem.vercel.app/)

---

## 1. Executive Summary

**CampusIQ** is a production-grade, high-performance web platform that bridges the gap between academic Data Structures & Algorithms (DSA) theory and real-world software engineering.

In academic environments, Data Structures (such as Tries, Heaps, Hash Tables, Linked Lists, and Dynamic Programming matrices) are typically taught as abstract mathematical entities or solved as isolated LeetCode coding puzzles. Students rarely see how these fundamental structures interact synergistically inside an actual working product.

CampusIQ solves this by building a **Google-like search engine specifically tailored for university campus navigation**, where **every single feature is powered directly by a custom, hand-crafted Data Structure implemented from scratch** without external libraries:
* **Instant Prefix Autocomplete:** Handled by a **Trie (Prefix Tree)** in $O(L)$ time.
* **Trending Keywords Engine:** Handled by a **MaxHeap (Priority Queue)** in $O(\log N)$ time with a mathematical decay factor.
* **Search History & Eviction:** Handled by an **LRU (Least Recently Used) Cache** using a **Doubly Linked List + Hash Table** in $O(1)$ time.
* **Frequency & Analytics Tracking:** Handled by a **Custom HashMap with Separate Chaining** using the **djb2 hash function** in $O(1)$ average time.
* **Typo Correction ("Did you mean...?"):** Handled by **Levenshtein Edit Distance (Dynamic Programming)** with full 2D matrix backtracking in $O(m \times n)$ time.

Furthermore, CampusIQ operates on a **Zero-Database In-Memory Architecture**. All data structures live in RAM, and every algorithmic operation is visibly exposed to the user through real-time visualizations (interactive node graphs, heap trees, linked list eviction animations, DP matrices, and Big-O complexity badges).

---

## 2. Problem Statement & Motivation

### The Real-World Campus Problem
Modern university campuses are sprawling digital ecosystems. On any given day, thousands of students, faculty members, and staff need immediate access to critical campus resources:
1. **Academic Material:** DAA Notes, OS Notes, DBMS lab manuals, AI/ML study guides.
2. **Examination Data:** Mid-semester schedules, end-term timetables, result portals, revaluation forms, admit cards/hall tickets.
3. **Faculty & Staff:** Department HODs, mentor allocations, professor contact directories.
4. **Campus Life & Facilities:** Hostel mess menus, laundry schedules, room allocations, warden contacts, grievance forms.
5. **Events & Opportunities:** Hackathon registrations, cultural fest schedules, tech competitions, sports events.

In most universities, this information is fragmented across disparate platforms: PDFs sent on WhatsApp groups, outdated static university websites, separate ERP portals, and physical notice boards. Finding timely information is slow, frustrating, and prone to misinformation.

### The Technical & Educational Problem
Traditional search engines built in standard web applications typically offload search to an external SQL database:
```sql
SELECT * FROM campus_resources WHERE title LIKE '%search_term%' OR description LIKE '%search_term%';
```
While simple, this approach:
* Has poor scalability ($O(N)$ linear table scans unless complex full-text indexing is configured).
* Masks the underlying computer science fundamentals.
* Does not teach students or evaluators how indexing, caching, priority scheduling, and edit distance actually work under the hood.

**CampusIQ was engineered to demonstrate that foundational Data Structures, when correctly composed, can deliver sub-millisecond in-memory search performance, zero database latency, and complete algorithmic transparency.**

---

## 3. Tech Stack & Engineering Tools

| Tier / Component | Technology | Version | Purpose & Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React** | `v19` / `v18` | Declarative component UI, Virtual DOM reconciliation, Context API for in-memory global state management. |
| **Build Tool & Bundler** | **Vite** | `v8.0` | Next-generation frontend tooling with lightning-fast Hot Module Replacement (HMR) and optimized Rolldown production bundling. |
| **Styling & Design System** | **TailwindCSS** | `v4.3` | Modern utility-first CSS framework with custom dark-mode glassmorphic theme, custom CSS variables, and responsive layout primitives. |
| **Graph / Tree Engine** | **@xyflow/react (React Flow)** | `v12.10` | Node-edge graph rendering library used to visualize the Trie Prefix Tree with interactive zooming, panning, node physics, and branch highlighting. |
| **Analytics & Data Viz** | **Chart.js** & **react-chartjs-2** | `v4.5` / `v5.3` | HTML5 Canvas-based data visualization engine powering the 4 analytics charts and the live Linear Search vs. Trie Search performance benchmark. |
| **Motion & Animations** | **Framer Motion** | `v12.39` | Production animation library handling layout transitions, modal animations, and the animated node evictions in the LRU Cache. |
| **Iconography** | **Lucide React** | `v1.16` | Consistent, accessible SVG icon set. |
| **Languages** | **JavaScript (ES6+)** | Modern | Powers the core frontend application, React state, and browser-side DSA classes. |
| **Systems Language** | **C++ (Standard C++17/20)** | MinGW `g++ 15.2` | Clean, standalone C++ implementations with custom memory management in `algorithms for mam/` specifically for academic viva code inspections. |

---

## 4. Data Storage Architecture (In-Memory Design)

One of the defining architectural decisions of CampusIQ is its **Zero External Database** philosophy.

```
                              ┌───────────────────────────────────────────────┐
                              │            campusData.js (Seed Data)          │
                              │     85+ Entries Across 10 Campus Categories   │
                              └───────────────────────┬───────────────────────┘
                                                      │ Initial Mount Load
                                                      ▼
                       ┌─────────────────────────────────────────────────────────────┐
                       │                   SearchContext.jsx                         │
                       │           (React In-Memory Global Ref Store)                │
                       └──────────────┬───────────────┬───────────────┬──────────────┘
                                      │               │               │
                     ┌────────────────┴───┐   ┌───────┴──────┐   ┌────┴──────────────┐
                     ▼                    ▼   ▼              ▼   ▼                   ▼
              ┌─────────────┐     ┌─────────────┐     ┌─────────────┐         ┌─────────────┐
              │    Trie     │     │   HashMap   │     │   MaxHeap   │         │  LRU Cache  │
              │ (Prefixes)  │     │ (Frequency) │     │ (Trending)  │         │  (History)  │
              └─────────────┘     └─────────────┘     └─────────────┘         └─────────────┘
```

### Why No Database?
1. **Speed & Latency:** Reading from RAM is approximately $100\text{ns}$, whereas querying a local database requires disk I/O and socket overhead ($\approx 5\text{ms} - 50\text{ms}$). In-memory structures guarantee instantaneous autocomplete responses on every single keystroke.
2. **Academic Focus:** The goal is to evaluate pure Data Structure operations, memory node traversal, and pointer manipulation rather than SQL ORMs or network protocols.
3. **Reproducibility:** The application runs immediately in any browser with zero database setup, migrations, or server configuration.

### Data Composition (`src/data/campusData.js`)
The seed dataset contains **85+ curated campus keywords** organized across 10 critical domains:
* `notes` (10 items): DAA Notes, OS Notes, DBMS Notes, CN Notes, TOC Notes, etc.
* `exams` (9 items): Mid Sem Schedule, End Sem Dates, Hall Ticket, Result Portal, Backlog Exam, etc.
* `faculty` (8 items): Dr. Sharma, HOD CSE, Faculty Directory, Attendance Portal, etc.
* `hostel` (8 items): Hostel Food Menu, Hostel Rules, Room Allotment, Laundry Schedule, etc.
* `events` (9 items): Technothon, Cultural Fest, Hackathon 2025, Sports Week, Convocation, etc.
* `library` (8 items): Book Search, Digital Library, Return Policy, Book Renewal, etc.
* `courses` (8 items): Course Registration, Elective Selection, Syllabus PDF, Drop Semester, etc.
* `clubs` (9 items): Coding Club, Robotics Club, Dance Society, Music Club, Photography Club, etc.
* `labs` (8 items): Linux Lab, AI/ML Lab, Hardware Lab, Lab Manuals, Lab Timetable, etc.
* `resources` (8 items): WiFi Password, Bus Timings, Campus Map, Printing Shop, Placement Portal, etc.

### Dynamic Runtime Persistence
When a user searches for an unrecognized keyword (e.g., `"Quantum Computing Lab"`), CampusIQ does not drop it:
1. It dynamically calls `trie.insert(query, 'resources', 1)` to add it to the prefix tree.
2. It registers it in the `HashMap` to begin tracking its query count.
3. It pushes it to the `MaxHeap` with a baseline popularity score.
4. It inserts it into the `LRUCache`.

---

## 5. Exhaustive DSA Deep-Dive (The 5 Core Algorithms)

### Algorithm 1: Trie (Prefix Tree)
* **Role:** Autocomplete Suggestions & Instant Search
* **Source Files:** [`src/algorithms/Trie.js`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/src/algorithms/Trie.js) & [`algorithms for mam/Trie.cpp`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/algorithms%20for%20mam/Trie.cpp)
* **Data Structure Representation:**
  A multi-way tree where each edge represents an individual character. Nodes do not store entire strings; rather, their position in the tree defines the string they represent.
  ```
                         (root)
                        /      \
                      [d]      [e]
                       |        |
                      [a]      [x]
                     /   \      |
                   [a]   [t]   [a]
                    *     |     |
                 (DAA)   [e]   [m]
                          *     *
                       (Date) (Exam)
  ```
* **Node Definition:**
  ```javascript
  class TrieNode {
    children = {};       // character -> TrieNode
    isEndOfWord = false; // marks end of valid keyword
    frequency = 0;       // tracks popularity for suggestion ranking
    category = null;     // 'notes', 'exams', etc.
    id = uniqueId();     // React Flow visualizer identifier
  }
  ```
* **Time Complexity Analysis:**
  * **Insert:** $O(L)$, where $L$ is the length of the string. We iterate character-by-character, creating nodes if they do not exist.
  * **Search (Exact Match):** $O(L)$, traverses down $L$ child pointers.
  * **StartsWith (Prefix Check):** $O(L)$, checks if path exists for prefix.
  * **GetSuggestions (Autocomplete):** $O(L + K)$, where $L$ is prefix traversal time, and $K$ is the Depth-First Search (DFS) collection time to gather matching child words.
  * **Delete:** $O(L)$, recursive backtracking that prunes child nodes if they are not part of another active word branch (`children.length === 0`).
* **Space Complexity:** $O(N \times L)$ in the worst case (when no words share common prefixes). In practice, prefix sharing reduces memory footprint drastically.
* **Why Trie Over Linear Search?**
  * Linear search requires scanning all $N$ words and performing string comparisons: $O(N \times L)$. As $N \to 100,000$, search lag becomes noticeable.
  * Trie lookup is completely independent of the dataset size $N$; searching `"da"` takes exactly 2 operations regardless of whether the campus has 100 words or 1,000,000 words.

---

### Algorithm 2: Max Heap (Binary Priority Queue)
* **Role:** Trending Search Terms Engine
* **Source Files:** [`src/algorithms/Heap.js`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/src/algorithms/Heap.js) & [`algorithms for mam/MaxHeap.cpp`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/algorithms%20for%20mam/MaxHeap.cpp)
* **Data Structure Representation:**
  A Complete Binary Tree implemented inside a contiguous array. It satisfies the **Max Heap Property**:
  $$\text{Value}(\text{Parent}) \ge \text{Value}(\text{Children})$$
  Array indexing relationships:
  $$\text{Parent}(i) = \left\lfloor \frac{i - 1}{2} \right\rfloor, \quad \text{Left Child}(i) = 2i + 1, \quad \text{Right Child}(i) = 2i + 2$$
* **Time Complexity Analysis:**
  * **Insert:** $O(\log N)$, element is pushed to array end, then `heapifyUp()` swaps with parent until heap invariant is restored.
  * **ExtractMax:** $O(\log N)$, root element (`heap[0]`) is removed, last element is moved to root, and `heapifyDown()` restores invariant.
  * **Peek (Top Trending):** $O(1)$, returns `heap[0]`.
  * **UpdateScore:** $O(\log N)$ using an internal inverted `indexMap` (`word -> arrayIndex`) that allows $O(1)$ lookup followed by $O(\log N)$ heapification.
* **Space Complexity:** $O(N)$
* **Dynamic Trending Innovation (Mathematical Decay):**
  Raw search count causes stale topics to remain trending indefinitely. CampusIQ introduces an algorithmic **decay factor** ($\lambda = 0.94$):
  $$\text{Score}_{\text{new}}(w) = \max(1, \text{round}(\text{Score}_{\text{old}}(w) \times 0.94))$$
  When a user performs any search, existing keyword scores decay by $6\%$, and the active query receives an immediate boost ($+25$ points). This allows rising trends to overtake historically popular searches dynamically.

---

### Algorithm 3: LRU Cache (Least Recently Used)
* **Role:** Recent Search History with Automatic Eviction
* **Source Files:** [`src/algorithms/LRUCache.js`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/src/algorithms/LRUCache.js) & [`algorithms for mam/LRUCache.cpp`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/algorithms%20for%20mam/LRUCache.cpp)
* **Data Structure Representation:**
  A hybrid data structure combining a **Doubly Linked List (DLL)** and a **Hash Map**.
  * **Doubly Linked List:** Maintains chronological recency order:
    $$\text{HEAD} \iff [\text{Most Recent}] \iff \dots \iff [\text{Least Recent}] \iff \text{TAIL}$$
  * **Hash Map:** Maps `searchQuery -> DLLNode Pointer`, eliminating $O(N)$ list traversals.
* **Sentinel Nodes Pattern:**
  Uses dummy `HEAD` and `TAIL` sentinel nodes. The list is never empty, which eliminates tedious null-check boundary conditions when updating node pointers.
* **Time Complexity Analysis:**
  * **Get(key):** $O(1)$. Hash map finds node in $O(1)$; node is detached and spliced directly after `HEAD` in $O(1)$.
  * **Put(key, value):** $O(1)$. If present, update and move to head. If absent and $\text{Size} \ge \text{Capacity}$ ($C = 7$), the node before `TAIL` is unlinked and removed from both DLL and HashMap in $O(1)$.
* **Space Complexity:** $O(\text{Capacity}) = O(1)$
* **Why Not a Simple Array?**
  * Using a standard JavaScript array (`unshift()` and `splice()`) incurs $O(N)$ memory shifts on every single user interaction. The DLL + HashMap achieves true $O(1)$ constant time efficiency.

---

### Algorithm 4: Custom HashMap (Separate Chaining)
* **Role:** Search Frequency Tracking & Collision Analytics
* **Source Files:** [`src/algorithms/HashMap.js`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/src/algorithms/HashMap.js) & [`algorithms for mam/HashMap.cpp`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/algorithms%20for%20mam/HashMap.cpp)
* **Data Structure Representation:**
  A bucket array of fixed prime size ($M = 53$) where each bucket heads a singly linked list (`HashNode`) to resolve hash collisions via **Separate Chaining**.
* **Hash Function (djb2 Variant):**
  ```javascript
  hash(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash + key.charCodeAt(i)) & 0x7fffffff;
    }
    return hash % this.size;
  }
  ```
  * Uses bitwise left-shift `(hash << 5) + hash` (equivalent to multiplying by 33).
  * Bitwise AND `0x7fffffff` enforces positive 32-bit signed integer values.
  * Modulo $53$ distributes keys across buckets. $53$ is a prime number, which mathematically prevents clustering caused by common divisors in string byte sequences.
* **Time Complexity Analysis:**
  * **Set / Put:** $O(1)$ average, $O(N)$ worst case (when all keys collide into a single chain).
  * **Get:** $O(1)$ average, $O(N)$ worst case.
  * **Increment:** $O(1)$ average.
* **Space Complexity:** $O(M + N)$ where $M$ is table size and $N$ is total entries.
* **Educational Observability:**
  The class maintains a public `collisions` counter that increments whenever a bucket already containing a node receives another entry. This is graphed live in the Analytics Dashboard to visually prove how hash collisions occur in real systems.

---

### Algorithm 5: Levenshtein Distance (Dynamic Programming)
* **Role:** Typo Tolerance & Fuzzy Search ("Did you mean...?")
* **Source Files:** [`src/algorithms/Levenshtein.js`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/src/algorithms/Levenshtein.js) & [`algorithms for mam/Levenshtein.cpp`](file:///c:/Users/vansh/Documents/smart-campus-search-ecosystem/algorithms%20for%20mam/Levenshtein.cpp)
* **Mathematical Recurrence:**
  Given a source string $S$ of length $m$ and a target string $T$ of length $n$, construct matrix $D[0\dots m][0\dots n]$:
  * **Base Cases:**
    $$D[i][0] = i \quad \forall \ i \in [0, m], \qquad D[0][j] = j \quad \forall \ j \in [0, n]$$
  * **State Transition:**
    $$D[i][j] = \begin{cases}
      D[i-1][j-1] & \text{if } S[i-1] = T[j-1] \text{ (No edit required)} \\
      1 + \min \begin{cases}
        D[i][j-1] & \text{(Insertion)} \\
        D[i-1][j] & \text{(Deletion)} \\
        D[i-1][j-1] & \text{(Substitution / Replacement)}
      \end{cases} & \text{if } S[i-1] \neq T[j-1]
    \end{cases}$$
* **Time Complexity:** $O(m \times n)$
* **Space Complexity:** $O(m \times n)$ to preserve the complete 2D matrix for UI rendering and backtracking.
* **Backtracking Engine:**
  Starting at cell $(m, n)$, the algorithm traces back to $(0, 0)$ by checking which adjacent cell gave rise to the current cell's value:
  * Diagonal step with same value $\implies$ **Match**
  * Diagonal step with $+1 \implies$ **Replace**
  * Left step with $+1 \implies$ **Insert**
  * Up step with $+1 \implies$ **Delete**
  These steps are color-coded in real-time on the **Typo Correction Page**.

---

## 6. End-to-End Application Workflow

```
[User Keystroke in SearchBar]
       │
       ▼
1. Trie.getSuggestions(prefix, 8) ───────────► Instant Suggestion Dropdown
       │
       ├──► If 0 suggestions found? ─────────► Trigger Levenshtein Distance
       │                                       Find nearest campus keyword (threshold <= 3)
       │                                       Render: "Did you mean: [Word]?"
       ▼
[User Submits Query (Enter or Click)]
       │
       ├──► 1. Check Trie: Dynamic insert if keyword is new (resources category)
       ├──► 2. HashMap.increment(query): Update query frequency counter
       ├──► 3. MaxHeap.updateScore(query, +25): Apply 0.94 decay to all, bubble up active query
       ├──► 4. LRUCache.put(query): Spliced to DLL Head; evict tail if size > 7
       └──► 5. Analytics Update: Record elapsed time in milliseconds, append to timeline
```

---

## 7. Complete Page Modules Walkthrough

1. **Home Page (`/`):**
   * Central Hero section with dark glassmorphic search bar.
   * Instant category chips with count badges.
   * Right-side **Trending Panel** displaying top 5 items from the MaxHeap.
   * Bottom **Recent Searches** chips displaying the LRU Cache state.
   * Integrated Voice Search utilizing Web Speech Recognition API.
2. **Live Autocomplete Page (`/autocomplete`):**
   * Live demonstration of keystroke-by-keystroke Trie traversal.
   * Real-time activity log showing recently selected queries with timestamps.
   * Fixed bottom-right **Algorithm Panel** showing active time complexity: $O(L + K)$.
3. **Trie Visualizer Page (`/trie-visualizer`):**
   * Visual canvas powered by React Flow with custom round node styling.
   * **Insert Word:** Animates node creation and edges in emerald green.
   * **Search Word:** Traces the exact character path in electric blue.
   * **Delete Word:** Demonstrates recursive pruning of leaf nodes.
   * Minimap, zoom controls, and pan canvas.
4. **Performance Lab (`/performance`):**
   * Live benchmarking tool comparing **Linear Search $O(N)$** vs. **Trie Search $O(L)$**.
   * Adjustable dataset size slider ($100$ to $1,000$ generated campus terms).
   * Chart.js bar chart displaying:
     * Number of comparison operations executed.
     * Exact execution time in milliseconds (via `performance.now()`).
5. **Typo Correction Page (`/typo-correction`):**
   * Interactive Levenshtein matrix visualization.
   * Live input or preset buttons (`hostal`, `plcement`, `techothon`, `labriry`).
   * Color-coded matrix grid (Blue = Match/Replace, Green = Insert, Red = Delete).
   * Backtracked step-by-step transformation instructions.
6. **Trending Page (`/trending`):**
   * Dual representation of the MaxHeap:
     1. Array representation showing indices and scores.
     2. Visual binary tree layout showing hierarchical parent-child edges.
   * "Simulate Search" input allowing the user to inject a query and watch the node swap positions upward in real time.
7. **Search History Page (`/history`):**
   * Visual representation of the Doubly Linked List with `HEAD` and `TAIL` sentinel pointers.
   * Live capacity indicator (`X / 7`).
   * Animated eviction alert whenever adding an 8th item drops the tail node.
   * Re-accessing an existing item shows it jumping to the front position in $O(1)$.
8. **Analytics Dashboard (`/analytics`):**
   * 4 responsive Chart.js visualizers:
     * **Bar Chart:** Top 10 most frequently searched terms.
     * **Line Chart:** Search volume timeline across the session.
     * **Doughnut Chart:** Category distribution breakdown.
     * **Area Chart:** Query response latency distribution.
   * Live HashMap internal bucket inspector showing hash values, bucket indices, and collision statistics.

---

## 8. Unique Selling Propositions (USPs) & Academic Novelties

1. **Zero-Database Purity:** 100% in-memory data structures executing directly in browser RAM, delivering true zero-latency performance.
2. **Algorithmic Observability:** Every screen provides a "📚 About This Feature" pedagogical panel explaining the underlying algorithm, time complexity, and real-world system applications.
3. **Dual-Language Parity:** Complete mirror implementations in both modern JavaScript (for the interactive web UI) and clean C++ (for traditional academic viva inspections).
4. **Dynamic Decay Innovation in MaxHeap:** Implements practical mathematical decay ($\lambda = 0.94$) instead of naive static counters, mimicking modern recommendation engines.
5. **Empirical Performance Proof:** Includes an integrated benchmark lab demonstrating theoretical Big-O curves with real browser CPU metrics.

---

## 9. Future Roadmap & Production Scaling

If scaling CampusIQ from a single campus prototype to a distributed university system supporting 100,000+ concurrent students:
1. **Distributed In-Memory Store:** Migrate the Trie and MaxHeap instances from browser memory to an in-memory cluster like **Redis** (utilizing Redisearch and sorted sets `ZSET`).
2. **Radix Tree / Patricia Trie Optimization:** Compress single-child node chains in the Trie into edge substrings (e.g., merging `c -> o -> m -> p -> u -> t -> e -> r` into a single edge `computer`), reducing pointer overhead by up to $60\%$.
3. **Hybrid Vector Search:** Complement the prefix Trie with vector embeddings (e.g., using lightweight client-side ONNX embeddings or cosine similarity) to support semantic queries (e.g., searching `"where to eat"` returns `"Hostel Food Menu"`).
4. **Cross-Campus Federation:** Multi-tenant architecture allowing different academic institutions to load their own custom dataset via REST/GraphQL endpoints.
