import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, Plus, Search, Trash2, Filter, BookOpen, X, Shuffle, RefreshCw } from 'lucide-react';
import { Trie, TrieNode } from '../algorithms/Trie';
import ComplexityBadge from '../components/ComplexityBadge';

// ── Custom Node renderer ──
function TrieNodeComponent({ data }) {
  const { label, isEndOfWord, isHighlighted, isNewlyInserted, frequency } = data;

  let borderColor = 'rgba(255,255,255,0.15)';
  let bgColor = 'rgba(17,17,24,0.95)';
  let shadow = 'none';
  let textColor = '#f1f5f9';

  if (isNewlyInserted) {
    borderColor = 'rgba(0,212,170,0.9)';
    bgColor = 'rgba(0,212,170,0.18)';
    shadow = '0 0 18px rgba(0,212,170,0.5)';
  } else if (isHighlighted) {
    borderColor = 'rgba(79,142,247,0.9)';
    bgColor = 'rgba(79,142,247,0.18)';
    shadow = '0 0 18px rgba(79,142,247,0.5)';
    textColor = '#4f8ef7';
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
      {isEndOfWord && (
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
          }}
        >
          {frequency || '✓'}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { trieNode: TrieNodeComponent };

// ── Layout: convert Trie data to React Flow nodes/edges ──
function buildFlowGraph(trieData, highlightedIds = [], newNodeIds = []) {
  const { nodes: rawNodes, edges: rawEdges } = trieData;
  if (!rawNodes || rawNodes.length === 0) return { nodes: [], edges: [] };

  const highlightSet = new Set(highlightedIds);
  const newSet = new Set(newNodeIds);

  // Build adjacency: parentId → [childId...]
  const childrenMap = {};
  const parentMap = {};
  rawEdges.forEach(e => {
    parentMap[e.target] = e.source;
    if (!childrenMap[e.source]) childrenMap[e.source] = [];
    childrenMap[e.source].push(e.target);
  });

  // Find root (node with no parent)
  const rootNode = rawNodes.find(n => !parentMap[n.id]);
  if (!rootNode) return { nodes: [], edges: [] };

  // Build a map for quick lookup
  const nodeById = {};
  rawNodes.forEach(n => { nodeById[n.id] = n; });

  const VERTICAL_GAP = 90;
  const MIN_H_GAP = 68; // minimum horizontal gap between sibling subtrees
  const posMap = {};

  // Post-order: compute the width of each subtree
  function subtreeWidth(id) {
    const children = childrenMap[id] || [];
    if (children.length === 0) return MIN_H_GAP;
    const total = children.reduce((sum, cid) => sum + subtreeWidth(cid), 0);
    return Math.max(MIN_H_GAP, total);
  }

  // Assign x positions based on subtree widths with premium organic branch layout
  function assignPos(id, left, depth) {
    const children = childrenMap[id] || [];
    const width = subtreeWidth(id);
    
    // Add creative organic curves (shuffling coordinates slightly) so nodes branch out naturally
    // rather than looking rigidly grid-aligned!
    const charCode = id.charCodeAt(id.length - 1) || 0;
    const organicOffset = Math.sin(depth * 1.6 + charCode) * 16;
    const x = left + width / 2 + organicOffset;
    
    // Vertical wavy variance
    const verticalOffset = Math.cos(left * 0.05) * 5;
    const y = depth * VERTICAL_GAP + verticalOffset;
    
    posMap[id] = { x, y };

    let childLeft = left;
    children.forEach(cid => {
      const cw = subtreeWidth(cid);
      assignPos(cid, childLeft, depth + 1);
      childLeft += cw;
    });
  }

  const totalW = subtreeWidth(rootNode.id);
  assignPos(rootNode.id, -totalW / 2, 0);

  const flowNodes = rawNodes.map(node => ({
    id: node.id,
    type: 'trieNode',
    position: posMap[node.id] || { x: 0, y: 0 },
    data: {
      label: node.char === '' ? 'ROOT' : (node.char || 'ROOT'),
      isEndOfWord: node.isEndOfWord,
      isHighlighted: highlightSet.has(node.id),
      isNewlyInserted: newSet.has(node.id),
      frequency: node.frequency,
      childCount: node.childCount,
    },
  }));

  const flowEdges = rawEdges.map(e => {
    const isHL = highlightSet.has(e.source) && highlightSet.has(e.target);
    return {
      id: `e-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      style: {
        stroke: isHL ? '#4f8ef7' : 'rgba(255,255,255,0.18)',
        strokeWidth: isHL ? 2.5 : 1.5,
      },
      animated: isHL,
    };
  });

  return { nodes: flowNodes, edges: flowEdges };
}

// ── Default words ──
const DEFAULT_WORDS = ['DAA', 'Data', 'Database', 'DBMS', 'Exam', 'Events'];

// ── Cool words pool for Shuffling ──
const COOL_WORDS_POOL = [
  'Campus', 'Search', 'Trie', 'Smart', 'Vansh', 'Coding', 'Hacker', 
  'Matrix', 'Data', 'Ecosystem', 'Intelligence', 'Dynamic', 'Visual', 
  'Nodes', 'Graph', 'Algorithms', 'DSA', 'Logic', 'Code', 'Binary',
  'Tree', 'Array', 'Cache', 'Heap', 'Stack', 'Queue', 'Hash', 'Design'
];

// ── Inner component (needs ReactFlowProvider above) ──
function TrieVisualizerInner() {
  const [localTrie] = useState(() => {
    const t = new Trie();
    DEFAULT_WORDS.forEach(w => t.insert(w, 'demo', 10));
    return t;
  });

  const initialFlow = useMemo(() => {
    return buildFlowGraph(localTrie.getAllNodes());
  }, [localTrie]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);

  const [insertWord, setInsertWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [deleteWord, setDeleteWord] = useState('');
  const [prefixWord, setPrefixWord] = useState('');
  const [allWords, setAllWords] = useState(() => localTrie.getAllWords());
  const [isLocked, setIsLocked] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [lastOp, setLastOp] = useState({ type: 'INIT', word: '', time: '' });
  const [prefixResults, setPrefixResults] = useState([]);

  const refreshTree = useCallback((highlighted = [], newNodes = []) => {
    const trieData = localTrie.getAllNodes();
    const { nodes: fn, edges: fe } = buildFlowGraph(trieData, highlighted, newNodes);
    setNodes(fn);
    setEdges(fe);
    setAllWords(localTrie.getAllWords());
  }, [localTrie, setNodes, setEdges]);

  const handleInsert = () => {
    const word = insertWord.trim();
    if (!word) return;
    const start = performance.now();
    localTrie.insert(word, 'demo', 10);
    const elapsed = performance.now() - start;
    const path = localTrie.getTraversalPath(word);
    refreshTree([], path);
    setLastOp({ type: 'INSERT', word, time: `O(${word.length})` });
    setStatusMsg(`✅ Inserted "${word}" — ${elapsed.toFixed(2)}ms`);
    setInsertWord('');
    setTimeout(() => refreshTree(), 1500);
  };

  const handleSearch = () => {
    const word = searchWord.trim();
    if (!word) return;
    const start = performance.now();
    const found = localTrie.search(word);
    const elapsed = performance.now() - start;
    const path = localTrie.getTraversalPath(word);
    refreshTree(path, []);
    setLastOp({ type: 'SEARCH', word, time: `O(${word.length})` });
    setStatusMsg(found ? `✅ Found "${word}" — ${elapsed.toFixed(2)}ms` : `❌ "${word}" not found — ${elapsed.toFixed(2)}ms`);
    setSearchWord('');
    setTimeout(() => refreshTree(), 2000);
  };

  const handleDelete = () => {
    const word = deleteWord.trim();
    if (!word) return;
    const start = performance.now();
    const deleted = localTrie.delete(word);
    const elapsed = performance.now() - start;
    if (deleted) {
      refreshTree();
      setLastOp({ type: 'DELETE', word, time: `O(${word.length})` });
      setStatusMsg(`🗑️ Deleted "${word}" — ${elapsed.toFixed(2)}ms`);
    } else {
      setStatusMsg(`❌ "${word}" not found`);
    }
    setDeleteWord('');
  };

  const handlePrefix = () => {
    const prefix = prefixWord.trim();
    if (!prefix) return;
    const start = performance.now();
    const results = localTrie.getSuggestions(prefix, 10);
    const elapsed = performance.now() - start;
    const path = localTrie.getTraversalPath(prefix);
    refreshTree(path, []);
    setPrefixResults(results);
    setLastOp({ type: 'PREFIX', word: prefix, time: `O(${prefix.length}+${results.length})` });
    setStatusMsg(`🔍 ${results.length} suggestions for "${prefix}" — ${elapsed.toFixed(2)}ms`);
    setTimeout(() => refreshTree(), 3000);
  };

  const handleRemoveWord = (word) => {
    localTrie.delete(word);
    refreshTree();
    setStatusMsg(`🗑️ Removed "${word}"`);
  };

  const handleShuffle = () => {
    // Pick 6 random distinct words from the cool pool
    const shuffled = [...COOL_WORDS_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);
    
    // Clear and rebuild localTrie
    localTrie.root = new TrieNode('');
    localTrie.root.id = 'trie-root';
    localTrie.wordCount = 0;
    localTrie.nodeCount = 1;
    
    selected.forEach(w => localTrie.insert(w, 'demo', 10));
    
    refreshTree();
    setLastOp({ type: 'SHUFFLE', word: selected.slice(0, 3).join(', ') + '...', time: 'O(N×L)' });
    setStatusMsg(`🔀 Shuffled words and reconstructed organic branches!`);
  };

  // Shared styles
  const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '16px', padding: '18px', marginBottom: '0' };
  const lbl = { display: 'block', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 };
  const inp = { flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: '#f1f5f9', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif' };
  const btn = (color) => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '10px', border: `1px solid ${color}40`, background: `${color}14`, color, fontSize: '13px', fontWeight: 500, cursor: 'pointer', flexShrink: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '40px 32px 80px', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <GitBranch size={26} color="#00d4aa" />
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, background: 'linear-gradient(135deg, #4f8ef7 0%, #00d4aa 50%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block', marginBottom: '8px' }}>
          Trie Visualizer
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Insert, search, delete and explore the Trie tree interactively</p>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Left controls */}
        <div style={{ width: '260px', minWidth: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <div style={card}>
            <label style={lbl}>Insert Word</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={insertWord} onChange={e => setInsertWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} placeholder="e.g. ChatGPT" style={inp} />
              <button onClick={handleInsert} style={btn('#00d4aa')}><Plus size={13} /> Insert</button>
            </div>
          </div>

          <div style={card}>
            <label style={lbl}>Search Word</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={searchWord} onChange={e => setSearchWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="e.g. Data" style={inp} />
              <button onClick={handleSearch} style={btn('#4f8ef7')}><Search size={13} /> Search</button>
            </div>
          </div>

          <div style={card}>
            <label style={lbl}>Delete Word</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={deleteWord} onChange={e => setDeleteWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDelete()} placeholder="e.g. DBMS" style={inp} />
              <button onClick={handleDelete} style={btn('#ef4444')}><Trash2 size={13} /> Delete</button>
            </div>
          </div>

          <div style={card}>
            <label style={lbl}>Find Prefix</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={prefixWord} onChange={e => setPrefixWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePrefix()} placeholder="e.g. Da" style={inp} />
              <button onClick={handlePrefix} style={btn('#a855f7')}><Filter size={13} /> Find</button>
            </div>
            {prefixResults.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {prefixResults.map((r, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{r.word}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>×{r.frequency}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...lbl, marginBottom: 0 }}>Words ({allWords.length})</label>
              <button
                onClick={handleShuffle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(79,142,247,0.1)',
                  border: '1px solid rgba(79,142,247,0.3)',
                  color: '#4f8ef7',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,142,247,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,142,247,0.1)'; }}
              >
                <Shuffle size={10} /> Shuffle Tree
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto', marginBottom: '4px' }}>
              {allWords.map(w => (
                <span key={w.word} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#94a3b8' }}>
                  {w.word}
                  <button onClick={() => handleRemoveWord(w.word)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 1 }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div style={{ flex: 1, minWidth: '0', height: '680px', borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.09)', position: 'relative' }}>
          
          {/* Floating Lock Toggle */}
          <button
            onClick={() => setIsLocked(!isLocked)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: isLocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 212, 170, 0.15)',
              border: isLocked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(0, 212, 170, 0.3)',
              color: isLocked ? '#ef4444' : '#00d4aa',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {isLocked ? '🔒 Screen Locked' : '🔓 Screen Unlocked'}
          </button>

          <ReactFlow
            key={`trie-flow-${allWords.length}-${lastOp.type}`}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.2}
            maxZoom={2.5}
            attributionPosition="bottom-left"
            panOnDrag={!isLocked}
            zoomOnScroll={!isLocked}
            zoomOnDoubleClick={!isLocked}
            nodesDraggable={!isLocked}
            nodesConnectable={false}
          >
            <Background color="rgba(255,255,255,0.025)" gap={24} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={node => {
                if (node.data?.isHighlighted) return '#4f8ef7';
                if (node.data?.isNewlyInserted) return '#00d4aa';
                if (node.data?.isEndOfWord) return '#00d4aa';
                return '#1e1e2e';
              }}
              maskColor="rgba(10,10,15,0.85)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ marginTop: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
        {[
          ['Nodes', localTrie.nodeCount, '#4f8ef7'],
          ['Words', localTrie.wordCount, '#00d4aa'],
          ['Last op', `${lastOp.type}${lastOp.word ? ` "${lastOp.word}"` : ''}`, '#a855f7'],
          ['Time', lastOp.time || '—', '#f59e0b'],
        ].map(([label, val, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#475569' }}>{label}:</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color }}>{val}</span>
          </div>
        ))}
        {statusMsg && <span style={{ color: '#94a3b8', marginLeft: '4px' }}>{statusMsg}</span>}
      </div>

      {/* Active Algorithms Panel — inline below status */}
      <div style={{ marginTop: '10px', background: 'rgba(17,17,24,0.85)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: '14px', padding: '12px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '12px', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00d4aa', fontWeight: 600, fontSize: '12px', marginRight: '4px' }}>
          <span style={{ fontSize: '14px' }}>⚡</span> Active Algorithms
        </div>
        {[{ name: 'Trie', c: 'O(L)', color: '#4f8ef7' }].map(ds => (
          <span key={ds.name} style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, padding: '2px 8px', borderRadius: '999px', backgroundColor: `${ds.color}18`, color: ds.color, border: `1px solid ${ds.color}30` }}>
            {ds.name} {ds.c}
          </span>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
          <span style={{ color: '#475569' }}>Last op:</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4f8ef7', fontSize: '11px' }}>
            {lastOp.type === 'INIT' ? 'init()'
              : lastOp.type === 'INSERT' ? `insert("${lastOp.word}")`
              : lastOp.type === 'SEARCH' ? `search("${lastOp.word}")`
              : lastOp.type === 'DELETE' ? `delete("${lastOp.word}")`
              : lastOp.type === 'PREFIX' ? `getSuggestions("${lastOp.word}")`
              : 'init()'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#475569' }}>Time:</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00d4aa', fontSize: '11px' }}>
            {lastOp.time || '—'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '10px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px', fontSize: '12px' }}>
        {[
          { dot: { border: '2px solid rgba(255,255,255,0.15)', background: '#111118' }, label: 'Default' },
          { dot: { border: '2px solid rgba(0,212,170,0.5)', background: 'rgba(0,212,170,0.1)' }, label: 'End of word' },
          { dot: { border: '2px solid rgba(79,142,247,0.9)', background: 'rgba(79,142,247,0.18)', boxShadow: '0 0 8px rgba(79,142,247,0.3)' }, label: 'Searched' },
          { dot: { border: '2px solid rgba(0,212,170,0.9)', background: 'rgba(0,212,170,0.18)', boxShadow: '0 0 8px rgba(0,212,170,0.3)' }, label: 'Inserted' },
        ].map(({ dot, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', ...dot }} />
            <span style={{ color: '#94a3b8' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ marginTop: '14px', background: 'rgba(79,142,247,0.04)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: '18px', padding: '22px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={14} /> 📚 About This Feature
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '10px' }}>
          This page visualizes the <strong style={{ color: '#f1f5f9' }}>Trie (prefix tree)</strong> data structure in real-time.
          Each node represents a character, and paths from root to green-marked nodes form complete words.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <ComplexityBadge type="time" value="O(L) Insert" color="cyan" />
          <ComplexityBadge type="time" value="O(L) Search" color="blue" />
          <ComplexityBadge type="time" value="O(L) Delete" color="purple" />
          <ComplexityBadge type="space" value="O(N×L)" color="amber" />
        </div>
        <p style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>
          Real-world use: Autocomplete engines, spell checkers, IP routing tables
        </p>
      </div>
    </motion.div>
  );
}

// ── Default export wraps with ReactFlowProvider (required by @xyflow/react) ──
export default function TrieVisualizerPage() {
  return (
    <ReactFlowProvider>
      <TrieVisualizerInner />
    </ReactFlowProvider>
  );
}
