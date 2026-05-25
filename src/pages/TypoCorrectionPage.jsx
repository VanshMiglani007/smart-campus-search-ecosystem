import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SpellCheck, BookOpen, Search, CheckCircle2 } from 'lucide-react';
import { levenshtein, findClosestMatch, getCellType } from '../algorithms/Levenshtein';
import { getAllWords } from '../data/campusData';
import ComplexityBadge from '../components/ComplexityBadge';
import { S, C } from '../styles';

const TypoCorrectionPage = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [detailResult, setDetailResult] = useState(null);
  const allWords = useMemo(() => getAllWords(), []);

  const handleCheck = () => {
    const word = input.trim();
    if (!word) return;
    const match = findClosestMatch(word, allWords, 3);
    if (match) {
      const detail = levenshtein(word, match.word);
      setResult(match);
      setDetailResult(detail);
    } else {
      setResult(null);
      setDetailResult(null);
    }
  };

  const getCellColor = (type, isFinalCell) => {
    if (isFinalCell) return { bg: 'rgba(0,212,170,0.3)', border: '#00d4aa', text: '#00d4aa' };
    switch (type) {
      case 'match':   return { bg: 'rgba(79,142,247,0.15)', border: 'rgba(79,142,247,0.3)', text: '#4f8ef7' };
      case 'replace': return { bg: 'rgba(79,142,247,0.2)',  border: 'rgba(79,142,247,0.5)', text: '#4f8ef7' };
      case 'insert':  return { bg: 'rgba(0,212,170,0.15)',  border: 'rgba(0,212,170,0.3)',  text: '#00d4aa' };
      case 'delete':  return { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444' };
      default:        return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#94a3b8' };
    }
  };

  const examples = ['chatgtp', 'plcement', 'hostal', 'exma', 'labriry'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      style={S.page}
    >
      {/* Header */}
      <div style={S.pageHeader}>
        <div style={S.iconBadge(C.purple)}>
          <SpellCheck size={26} color={C.purple} />
        </div>
        <h1 style={S.pageTitle}>Typo Correction</h1>
        <p style={S.pageSubtitle}>Levenshtein Distance — Dynamic Programming matrix visualization</p>
      </div>

      {/* Input Card */}
      <div style={S.card}>
        <label style={S.label}>Type a misspelled word</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="e.g. chatgtp, plcement, hostal..."
            style={S.input}
          />
          <button onClick={handleCheck} style={S.btnPrimary(C.blue)}>
            <Search size={14} /> Check
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={S.muted}>Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...S.card,
            border: `1px solid ${C.cyan}30`,
            background: `rgba(0,212,170,0.04)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={S.muted}>You typed:</span>
            <span style={{ fontSize: '18px', fontFamily: 'JetBrains Mono, monospace', color: '#ef4444', textDecoration: 'line-through' }}>{input}</span>
            <span style={{ color: '#475569', fontSize: '18px' }}>→</span>
            <span style={S.muted}>Did you mean:</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: C.cyan }}>{result.word}</span>
            <CheckCircle2 size={18} color={C.cyan} />
            <span style={S.muted}>(distance: {result.distance})</span>
          </div>
        </motion.div>
      )}

      {/* DP Matrix */}
      {detailResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={S.card}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={S.sectionTitle}>DP Matrix Visualization</span>
            <ComplexityBadge
              type="time"
              value={`O(${input.trim().length}×${result.word.length})`}
              color="blue"
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
              <thead>
                <tr>
                  <th style={{ width: '36px', height: '36px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}></th>
                  <th style={{ width: '36px', height: '36px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>&quot;&quot;</th>
                  {result.word.split('').map((char, j) => (
                    <th key={j} style={{ width: '36px', height: '36px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: C.cyan, fontWeight: 700 }}>
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailResult.matrix.map((row, i) => (
                  <tr key={i}>
                    <td style={{ width: '36px', height: '36px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: C.blue, fontWeight: 700, textAlign: 'center' }}>
                      {i === 0 ? '""' : input.trim()[i - 1]}
                    </td>
                    {row.map((cell, j) => {
                      const isFinal = i === detailResult.matrix.length - 1 && j === row.length - 1;
                      const cellType = getCellType(detailResult.matrix, input.trim(), result.word, i, j);
                      const colors = getCellColor(cellType, isFinal);
                      return (
                        <motion.td
                          key={j}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (i * row.length + j) * 0.007 }}
                          style={{
                            width: '36px',
                            height: '36px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 700,
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                        >
                          {cell}
                        </motion.td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            {[
              { bg: 'rgba(79,142,247,0.2)', border: 'rgba(79,142,247,0.5)', label: 'Match / Replace' },
              { bg: 'rgba(0,212,170,0.15)', border: 'rgba(0,212,170,0.3)', label: 'Insert' },
              { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', label: 'Delete' },
              { bg: 'rgba(0,212,170,0.3)', border: '#00d4aa', label: 'Final cell' },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.bg, border: `1px solid ${l.border}` }} />
                {l.label}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Operations */}
      {detailResult?.operations && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={S.card}>
          <div style={S.cardTitle}>Operations Performed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {detailResult.operations.filter(op => op.type !== 'match').map((op, i) => {
              const opColor = op.type === 'replace' ? C.blue : op.type === 'insert' ? C.cyan : C.red;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, background: `${opColor}20`, color: opColor, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ color: '#94a3b8' }}>
                    {op.type === 'replace' && <>Replace &apos;{op.sourceChar}&apos; → &apos;{op.targetChar}&apos; <span style={S.muted}>(pos {op.position})</span></>}
                    {op.type === 'insert' && <>Insert &apos;{op.targetChar}&apos; <span style={S.muted}>(pos {op.position})</span></>}
                    {op.type === 'delete' && <>Delete &apos;{op.sourceChar}&apos; <span style={S.muted}>(pos {op.position})</span></>}
                  </span>
                </div>
              );
            })}
            {detailResult.operations.filter(op => op.type !== 'match').length === 0 && (
              <p style={{ color: C.cyan, fontSize: '13px' }}>✓ Perfect match — no operations needed!</p>
            )}
          </div>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>
            Edit Distance: {detailResult.distance} &nbsp;|&nbsp;
            O({input.trim().length} × {result?.word?.length || 0}) = O({input.trim().length * (result?.word?.length || 0)})
          </div>
        </motion.div>
      )}

      {/* How It Works */}
      <div style={S.grid2}>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>📐 How Levenshtein Works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Build a 2D matrix of size (m+1) × (n+1) where m, n are string lengths.',
              <>Each cell <span style={S.mono(C.blue)}>dp[i][j]</span> = minimum edits to transform source[0..i] to target[0..j].</>,
              <>Three operations: <span style={{ color: C.blue }}>Replace</span> (diagonal +1), <span style={{ color: C.cyan }}>Insert</span> (left +1), <span style={{ color: C.red }}>Delete</span> (up +1).</>,
              <>If characters match: <span style={S.mono(C.cyan)}>dp[i][j] = dp[i-1][j-1]</span> (no cost).</>,
              <>Final answer: bottom-right cell <span style={S.mono(C.cyan)}>dp[m][n]</span>.</>,
            ].map((t, i) => <p key={i} style={S.cardText}>{t}</p>)}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>🔍 Typo Correction Flow</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'User types misspelled word',
              'Compare against all 85 campus keywords',
              'Compute Levenshtein distance for each word',
              'Return closest match within threshold (≤ 3)',
              'Display DP matrix and operations list',
            ].map((t, i) => (
              <p key={i} style={S.cardText}>
                <span style={S.mono(C.blue)}>{i + 1}.</span> {t}
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* About */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={S.infoBox}>
        <div style={S.cardTitle}><BookOpen size={14} /> 📚 About This Feature</div>
        <p style={S.cardText}>
          This page demonstrates the <strong style={{ color: C.white }}>Levenshtein Distance</strong> algorithm,
          a classic <strong style={{ color: C.white }}>Dynamic Programming</strong> problem. It computes the minimum number of
          single-character edits (insert, delete, replace) needed to transform one string into another.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ComplexityBadge type="time" value="O(m×n)" color="blue" />
          <ComplexityBadge type="space" value="O(m×n) matrix" color="purple" />
        </div>
        <p style={{ ...S.muted, marginTop: '8px' }}>Real-world use: Spell checkers, DNA alignment, Git diff, fuzzy search</p>
      </motion.div>
    </motion.div>
  );
};

export default TypoCorrectionPage;
