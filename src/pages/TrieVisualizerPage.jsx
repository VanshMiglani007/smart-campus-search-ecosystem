import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, Plus, Search, Trash2, Filter, BookOpen, X } from 'lucide-react';
import { Trie } from '../algorithms/Trie';
import ComplexityBadge from '../components/ComplexityBadge';

// ── Custom Trie Node Component for React Flow ──
function TrieNodeComponent({ data }) {
  const {
    label,
    isEndOfWord,
    isHighlighted,
    isNewlyInserted,
    isDeleted,
    frequency,
    childCount,
  } = data;

  let borderColor = 'rgba(255,255,255,0.1)';
  let bgColor = 'rgba(17,17,24,0.95)';
  let shadow = 'none';
  let textColor = '#f1f5f9';

  if (isDeleted) {
    borderColor = 'rgba(239,68,68,0.6)';
    bgColor = 'rgba(239,68,68,0.15)';
    textColor = '#ef4444';
  } else if (isNewlyInserted) {
    borderColor = 'rgba(0,212,170,0.8)';
    bgColor = 'rgba(0,212,170,0.15)';
    shadow = '0 0 16px rgba(0,212,170,0.4)';
  } else if (isHighlighted) {
    borderColor = 'rgba(79,142,247,0.8)';
    bgColor = 'rgba(79,142,247,0.15)';
    shadow = '0 0 20px rgba(79,142,247,0.5)';
  } else if (isEndOfWord) {
    borderColor = 'rgba(0,212,170,0.5)';
    bgColor = 'rgba(0,212,170,0.08)';
  }

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: shadow,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
      }}
      title={`Char: ${label}\nisEnd: ${isEndOfWord}\nChildren: ${childCount}\n${isEndOfWord ? `Freq: ${frequency}` : ''}`}
    >
      <span
        style={{
          color: textColor,
          fontWeight: 700,
          fontSize: label === 'ROOT' ? 9 : 15,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label === 'ROOT' ? '⊙' : label}
      </span>
      {isEndOfWord && !isDeleted && (
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            backgroundColor: '#00d4aa',
            color: '#0b0f19',
            borderRadius: '50%',
            width: 14,
            height: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            fontWeight: 800,
            boxShadow: '0 0 8px rgba(0,212,170,0.4)',
          }}
          title={`Search Frequency: ${frequency}`}
        >
          {frequency}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { trieNode: TrieNodeComponent };

/**
 * Perform custom layout of tree nodes
 * Returns { nodes, edges } compatible with React Flow
 */
function layoutTrieNodes(trieNodes, highlightedIds = [], newNodeIds = []) {
  const flowNodes = [];
  const flowEdges = [];
  const highlightSet = new Set(highlightedIds);
  const newSet = new Set(newNodeIds);

  // Group nodes by levels
  const levels = {};
  trieNodes.forEach((node) => {
    if (!levels[node.level]) {
      levels[node.level] = [];
    }
    levels[node.level].push(node);
  });

  const levelKeys = Object.keys(levels).sort((a, b) => Number(a) - Number(b));
  const verticalSpacing = 95;
  const initialHorizontalSpacing = 420;

  levelKeys.forEach((lvlStr) => {
    const level = Number(lvlStr);
    const nodesInLevel = levels[level];
    const horizontalSpacing = initialHorizontalSpacing / Math.pow(1.5, level);

    // Sort nodes to maintain visual child order matching left-to-right parent structure
    nodesInLevel.sort((a, b) => a.path.localeCompare(b.path));

    const totalWidth = (nodesInLevel.length - 1) * horizontalSpacing;

    nodesInLevel.forEach((node, idx) => {
      let x = idx * horizontalSpacing - totalWidth / 2;

      // Handle custom alignment based on parent position
      if (level > 0) {
        const parentId = node.parentId;
        const parentNode = trieNodes.find((n) => n.id === parentId);
        if (parentNode) {
          const parentFlow = flowNodes.find((fn) => fn.id === parentId);
          if (parentFlow) {
            const siblings = nodesInLevel.filter((n) => n.parentId === parentId);
            const sibIdx = siblings.findIndex((s) => s.id === node.id);
            const sibSpacing = 50;
            const sibTotal = (siblings.length - 1) * sibSpacing;
            x = parentFlow.position.x + sibIdx * sibSpacing - sibTotal / 2;
          }
        }
      }

      flowNodes.push({
        id: node.id,
        type: 'trieNode',
        position: { x, y: level * verticalSpacing },
        data: {
          label: node.char,
          isEndOfWord: node.isEndOfWord,
          isHighlighted: highlightSet.has(node.id),
          isNewlyInserted: newSet.has(node.id),
          isDeleted: node.isDeleted,
          frequency: node.frequency,
          childCount: node.childCount,
        },
      });
    });
  });

  // Create connections
  trieNodes.forEach((node) => {
    if (node.parentId) {
      const isConnectionHighlighted =
        highlightSet.has(node.id) && highlightSet.has(node.parentId);
      flowEdges.push({
        id: `e-${node.parentId}-${node.id}`,
        source: node.parentId,
        target: node.id,
        style: {
          stroke: isConnectionHighlighted
            ? '#4f8ef7'
            : 'rgba(255,255,255,0.15)',
          strokeWidth: isConnectionHighlighted ? 2.5 : 1.5,
        },
        animated: isConnectionHighlighted,
      });
    }
  });

  return { nodes: flowNodes, edges: flowEdges };
}

// ── Default words to pre-insert ──
const DEFAULT_WORDS = ['DAA', 'Data', 'Database', 'DBMS', 'Exam', 'Events'];

const TrieVisualizerPage = () => {
  // Local Trie for this visualizer (separate from global context)
  const [localTrie] = useState(() => {
    const t = new Trie();
    DEFAULT_WORDS.forEach((w) => t.insert(w, 'demo', 10));
    return t;
  });

  const initialLayout = useMemo(() => {
    const trieData = localTrie.getAllNodes();
    return layoutTrieNodes(trieData, [], []);
  }, [localTrie]);

  const [nodes, setNodes, onNodesChange] = useNodesState(() => initialLayout.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(() => initialLayout.edges);
  const [insertWord, setInsertWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [deleteWord, setDeleteWord] = useState('');
  const [prefixWord, setPrefixWord] = useState('');
  const [allWords, setAllWords] = useState(() => localTrie.getAllWords());
  const [statusMsg, setStatusMsg] = useState('');
  const [lastOp, setLastOp] = useState({ type: 'INIT', word: '', time: '' });
  const [prefixResults, setPrefixResults] = useState([]);

  // Refresh the visual tree from the Trie data
  const refreshTree = useCallback(
    (highlighted = [], newNodes = []) => {
      const trieData = localTrie.getAllNodes();
      const { nodes: flowNodes, edges: flowEdges } = layoutTrieNodes(
        trieData,
        highlighted,
        newNodes
      );
      setNodes(flowNodes);
      setEdges(flowEdges);
      setAllWords(localTrie.getAllWords());
    },
    [localTrie, setNodes, setEdges]
  );


  // ── INSERT ──
  const handleInsert = () => {
    const word = insertWord.trim();
    if (!word) return;

    const start = performance.now();
    localTrie.insert(word, 'demo', 10);
    const elapsed = performance.now() - start;

    const path = localTrie.getTraversalPath(word);
    refreshTree([], path);

    setLastOp({ type: 'INSERT', word, time: `O(L) = O(${word.length})` });
    setStatusMsg(`✅ Inserted "${word}" — ${elapsed.toFixed(2)}ms`);
    setInsertWord('');

    // Clear new-node highlight after animation
    setTimeout(() => {
      refreshTree();
    }, 1500);
  };

  // ── SEARCH ──
  const handleSearch = () => {
    const word = searchWord.trim();
    if (!word) return;

    const start = performance.now();
    const found = localTrie.search(word);
    const elapsed = performance.now() - start;

    const path = localTrie.getTraversalPath(word);
    refreshTree(path, []);

    setLastOp({ type: 'SEARCH', word, time: `O(L) = O(${word.length})` });
    setStatusMsg(
      found
        ? `✅ Found "${word}" — ${elapsed.toFixed(2)}ms`
        : `❌ "${word}" not found — ${elapsed.toFixed(2)}ms`
    );
    setSearchWord('');

    setTimeout(() => {
      refreshTree();
    }, 2000);
  };

  // ── DELETE ──
  const handleDelete = () => {
    const word = deleteWord.trim();
    if (!word) return;

    const start = performance.now();
    const deleted = localTrie.delete(word);
    const elapsed = performance.now() - start;

    if (deleted) {
      refreshTree();
      setLastOp({ type: 'DELETE', word, time: `O(L) = O(${word.length})` });
      setStatusMsg(`🗑️ Deleted "${word}" — ${elapsed.toFixed(2)}ms`);
    } else {
      setStatusMsg(`❌ "${word}" not found — cannot delete`);
    }
    setDeleteWord('');
  };

  // ── PREFIX SUGGESTIONS ──
  const handlePrefix = () => {
    const prefix = prefixWord.trim();
    if (!prefix) return;

    const start = performance.now();
    const results = localTrie.getSuggestions(prefix, 10);
    const elapsed = performance.now() - start;

    const path = localTrie.getTraversalPath(prefix);
    refreshTree(path, []);
    setPrefixResults(results);

    setLastOp({ type: 'PREFIX', word: prefix, time: `O(L+K) = O(${prefix.length}+${results.length})` });
    setStatusMsg(`🔍 ${results.length} suggestions for "${prefix}" — ${elapsed.toFixed(2)}ms`);

    setTimeout(() => {
      refreshTree();
    }, 3000);
  };

  // ── Delete word from word list ──
  const handleRemoveWord = (word) => {
    localTrie.delete(word);
    refreshTree();
    setStatusMsg(`🗑️ Removed "${word}"`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-3">
            <GitBranch size={28} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">Trie Visualizer</h1>
          <p className="text-text-secondary text-sm">
            Insert, search, delete and explore the Trie tree interactively
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* ── Left Panel: Controls ── */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            {/* Insert */}
            <div className="glass-card p-4">
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">Insert Word</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={insertWord}
                  onChange={(e) => setInsertWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                  placeholder="e.g. ChatGPT"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-cyan/50 transition-colors"
                />
                <button
                  onClick={handleInsert}
                  className="px-3 py-2 rounded-lg bg-accent-cyan/20 text-accent-cyan text-sm font-medium hover:bg-accent-cyan/30 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Insert
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="glass-card p-4">
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">Search Word</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. Data"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-blue/50 transition-colors"
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-2 rounded-lg bg-accent-blue/20 text-accent-blue text-sm font-medium hover:bg-accent-blue/30 transition-colors flex items-center gap-1"
                >
                  <Search size={14} /> Search
                </button>
              </div>
            </div>

            {/* Delete */}
            <div className="glass-card p-4">
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">Delete Word</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteWord}
                  onChange={(e) => setDeleteWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                  placeholder="e.g. DBMS"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-red-500/50 transition-colors"
                />
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            {/* Prefix */}
            <div className="glass-card p-4">
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">Find Prefix</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prefixWord}
                  onChange={(e) => setPrefixWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePrefix()}
                  placeholder="e.g. Da"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-purple/50 transition-colors"
                />
                <button
                  onClick={handlePrefix}
                  className="px-3 py-2 rounded-lg bg-accent-purple/20 text-accent-purple text-sm font-medium hover:bg-accent-purple/30 transition-colors flex items-center gap-1"
                >
                  <Filter size={14} /> Suggest
                </button>
              </div>
              {/* Prefix results */}
              {prefixResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {prefixResults.map((r, i) => (
                    <div key={i} className="text-xs text-text-secondary flex justify-between px-1">
                      <span>{r.word}</span>
                      <span className="font-mono text-text-muted">freq: {r.frequency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Word List */}
            <div className="glass-card p-4">
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">
                Inserted Words ({allWords.length})
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {allWords.map((w) => (
                  <span
                    key={w.word}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary"
                  >
                    {w.word}
                    <button
                      onClick={() => handleRemoveWord(w.word)}
                      className="text-text-muted hover:text-red-400 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Panel: React Flow Canvas ── */}
          <div className="flex-1 min-h-[500px] lg:min-h-[600px] glass-card overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.3}
              maxZoom={2}
              attributionPosition="bottom-left"
            >
              <Background color="rgba(255,255,255,0.03)" gap={20} />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  if (node.data?.isHighlighted) return '#4f8ef7';
                  if (node.data?.isNewlyInserted) return '#00d4aa';
                  if (node.data?.isEndOfWord) return '#00d4aa';
                  return '#1e1e2e';
                }}
                maskColor="rgba(10,10,15,0.8)"
              />
            </ReactFlow>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 glass-card px-5 py-3 flex flex-wrap items-center gap-4 text-xs"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Total nodes:</span>
            <span className="font-mono text-accent-blue">{localTrie.nodeCount}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Total words:</span>
            <span className="font-mono text-accent-cyan">{localTrie.wordCount}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Last operation:</span>
            <span className="font-mono text-accent-purple">
              {lastOp.type} {lastOp.word ? `"${lastOp.word}"` : ''}
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Time:</span>
            <span className="font-mono text-warning">{lastOp.time || '—'}</span>
          </div>

          {statusMsg && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-text-secondary">{statusMsg}</span>
            </>
          )}
        </motion.div>

        {/* Legend */}
        <div className="mt-3 glass-card px-5 py-3 flex flex-wrap items-center gap-5 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-white/10 bg-bg-surface" />
            <span className="text-text-muted">Default node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-accent-cyan/50 bg-accent-cyan/10 relative">
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-cyan border border-bg-surface" />
            </div>
            <span className="text-text-muted">End of word</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-accent-blue/80 bg-accent-blue/15 glow-blue" />
            <span className="text-text-muted">Traversed (search)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-accent-cyan/80 bg-accent-cyan/15 glow-cyan" />
            <span className="text-text-muted">Newly inserted</span>
          </div>
        </div>

        {/* Viva Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 mb-16 glass-card p-5"
        >
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <BookOpen size={14} />
            📚 About This Feature
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            This page visualizes the <strong className="text-text-primary">Trie (prefix tree)</strong> data structure in real-time.
            Each node represents a character, and paths from root to green-marked nodes form complete words.
            The tree re-renders on every insert, delete, and search operation.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ComplexityBadge type="time" value="O(L) Insert" color="cyan" />
            <ComplexityBadge type="time" value="O(L) Search" color="blue" />
            <ComplexityBadge type="time" value="O(L) Delete" color="purple" />
            <ComplexityBadge type="space" value="O(N×L) Space" color="amber" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Real-world use: Autocomplete engines, spell checkers, IP routing tables, dictionary implementations
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrieVisualizerPage;
