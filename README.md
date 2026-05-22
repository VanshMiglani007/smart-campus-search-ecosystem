# 🔍 CampusIQ — Smart Campus Search Ecosystem

> **An intelligent, DSA-powered search ecosystem for smart campus navigation.**
> Built with React 18 • TailwindCSS • React Flow • Chart.js • Framer Motion

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 What is CampusIQ?

CampusIQ is a **production-quality, visually stunning search platform** that combines:
- 🔍 **Google Search-like UX** — live autocomplete, voice search, trending
- 📊 **DSA Learning Platform** — every algorithm is visualized and explained
- 🎬 **Live Visualization Engine** — Trie trees, DP matrices, heap trees rendered in real-time

**Every algorithm is:**
- ✅ Implemented manually in JavaScript (zero external DS libraries)
- ✅ Visually demonstrated with animation
- ✅ Explained with complexity labels in the UI

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework with hooks |
| React Router v6 | Client-side routing |
| TailwindCSS v4 | Styling with dark theme |
| Framer Motion | Page transitions & animations |
| Chart.js + react-chartjs-2 | Analytics charts |
| React Flow | Interactive Trie tree visualization |
| Lucide React | Icons |
| Google Fonts | Space Grotesk + JetBrains Mono |

**No backend. No database. No API calls.** All DSA logic runs purely in the browser.

---

## 📁 Project Structure

```
src/
├── algorithms/
│   ├── Trie.js              ← Insert, Search, Delete, getSuggestions O(L)
│   ├── Heap.js              ← MaxHeap with heapifyUp/Down O(log N)
│   ├── LRUCache.js          ← Doubly Linked List + HashMap O(1)
│   ├── HashMap.js           ← Chaining collision resolution O(1)
│   └── Levenshtein.js       ← Full DP matrix O(m×n)
├── data/
│   └── campusData.js        ← 85 campus keywords across 10 categories
├── pages/
│   ├── HomePage.jsx          ← Hero, search bar, trending, categories
│   ├── AutocompletePage.jsx  ← Live Trie search with algorithm panel
│   ├── TrieVisualizerPage.jsx ← React Flow interactive tree
│   ├── PerformancePage.jsx   ← Linear vs Trie comparison
│   ├── AnalyticsDashboard.jsx ← 4 Chart.js charts + HashMap table
│   ├── SearchHistoryPage.jsx ← LRU Cache linked list visualization
│   ├── TrendingPage.jsx      ← MaxHeap tree + array visualization
│   └── TypoCorrectionPage.jsx ← Levenshtein DP matrix
├── components/
│   ├── Navbar.jsx            ← Responsive nav with mobile drawer
│   ├── SearchBar.jsx         ← Autocomplete + voice search
│   ├── SuggestionDropdown.jsx ← Prefix highlighting + category icons
│   ├── TrendingPanel.jsx     ← Top 5 from MaxHeap
│   ├── ComplexityBadge.jsx   ← O-notation styled chip
│   ├── AlgorithmPanel.jsx    ← Fixed bottom-right DS indicator
│   └── ParticleBackground.jsx ← Animated mesh gradient + particles
├── context/
│   └── SearchContext.jsx     ← Global state wiring all DS together
└── App.jsx                   ← Router + AnimatePresence
```

---

## 🧠 DSA Algorithms Implemented

| Algorithm | Data Structure | Time Complexity | Used For |
|---|---|---|---|
| **Trie** | Prefix Tree | O(L) insert/search | Autocomplete suggestions |
| **MaxHeap** | Binary Heap | O(log N) insert/extract | Trending keywords engine |
| **LRU Cache** | DLL + HashMap | O(1) get/put | Search history with eviction |
| **HashMap** | Hash Table + Chaining | O(1) avg lookup | Frequency tracking |
| **Levenshtein** | 2D DP Matrix | O(m×n) | Typo correction |

---

## 📄 Pages

1. **🏠 Home** — Hero section, giant search bar, algorithm indicators, trending, recent searches
2. **⌨️ Autocomplete** — Live Trie search with algorithm info panel, typo fallback
3. **🌳 Trie Visualizer** — React Flow canvas with insert/search/delete/prefix controls
4. **⚡ Performance** — Linear O(N) vs Trie O(L) with Chart.js comparison
5. **📊 Analytics** — 4 charts (bar/line/doughnut/area) + HashMap table
6. **🕐 History** — LRU Cache doubly linked list with animated eviction
7. **🔥 Trending** — MaxHeap tree + array visualization with simulate search
8. **✏️ Typo Correction** — Levenshtein DP matrix with color-coded operations

---

## 🛠️ How to Run

```bash
# Clone the repository
git clone https://github.com/VanshMiglani007/smart-campus-search-ecosystem.git

# Navigate to project
cd smart-campus-search-ecosystem

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🎓 Academic Project

Built as a university DSA project demonstrating:
- Manual implementation of 5 core data structures
- Real-world application of algorithms in a search engine
- Visual proof of algorithmic efficiency (Trie vs Linear Search)
- Professional-grade UI with dark theme and animations

**Every page includes a "📚 About This Feature" viva info box** explaining the algorithm, complexity, and real-world usage.

---

## 👨‍💻 Author

**Vansh Miglani** — Chandigarh University

---

*Built with ❤️ and lots of DSA*
