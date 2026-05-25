import { motion } from 'framer-motion';
import {
  GitBranch,
  BarChart3,
  Clock,
  TrendingUp,
  Gauge,
  BookOpen,
  Type,
  SpellCheck,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/SearchBar';
import TrendingPanel from '../components/TrendingPanel';
import ComplexityBadge from '../components/ComplexityBadge';
import { getCategoryColor } from '../data/campusData';

const features = [
  {
    title: 'Live Autocomplete',
    description: 'Instant prefix search with Trie — every keystroke is O(L)',
    icon: Type,
    path: '/autocomplete',
    color: '#4f8ef7',
    complexity: 'O(L)',
  },
  {
    title: 'Trie Visualizer',
    description: 'Watch nodes grow live as words are inserted',
    icon: GitBranch,
    path: '/trie-visualizer',
    color: '#00d4aa',
    complexity: 'O(L)',
  },
  {
    title: 'Performance Lab',
    description: 'Linear search vs Trie benchmark',
    icon: Gauge,
    path: '/performance',
    color: '#a855f7',
    complexity: 'O(N) vs O(L)',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Search frequency tracking',
    icon: BarChart3,
    path: '/analytics',
    color: '#f59e0b',
    complexity: 'O(1)',
  },
  {
    title: 'Search History',
    description: 'LRU Cache visualization',
    icon: Clock,
    path: '/history',
    color: '#00d4aa',
    complexity: 'O(1)',
  },
  {
    title: 'Trending Engine',
    description: 'MaxHeap powered ranking',
    icon: TrendingUp,
    path: '/trending',
    color: '#ef4444',
    complexity: 'O(logN)',
  },
  {
    title: 'Typo Correction',
    description: 'Levenshtein distance visualizer',
    icon: SpellCheck,
    path: '/typo',
    color: '#a855f7',
    complexity: 'O(m×n)',
  },
];

const quickCategories = [
  { name: 'Notes', category: 'notes' },
  { name: 'Events', category: 'events' },
  { name: 'Faculty', category: 'faculty' },
  { name: 'Hostel', category: 'hostel' },
  { name: 'Library', category: 'library' },
  { name: 'Courses', category: 'courses' },
];

const HomePage = () => {
  const { trendingItems, recordSelection } = useSearch();
  const navigate = useNavigate();

  const handleSelectSuggestion = (word) => {
    recordSelection(word);
    navigate('/autocomplete', { state: { query: word } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 24px 60px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Hero Section ── */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingBottom: '64px',
        }}
      >
        {/* Main heading */}
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(36px, 7vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="gradient-text">Campus Intelligence</span>
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: 'clamp(15px, 2vw, 18px)',
            marginBottom: '36px',
            maxWidth: '480px',
          }}
        >
          Search Everything. Understand Everything.
        </p>

        {/* Search bar */}
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <SearchBar onSelectSuggestion={handleSelectSuggestion} />
        </div>

        {/* Quick category pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '24px',
          }}
        >
          {quickCategories.map((cat) => {
            const color = getCategoryColor(cat.category);
            return (
              <button
                key={cat.category}
                onClick={() => handleSelectSuggestion(cat.name)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: `1px solid ${color}40`,
                  background: `${color}0a`,
                  color,
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${color}20`;
                  e.currentTarget.style.borderColor = `${color}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${color}0a`;
                  e.currentTarget.style.borderColor = `${color}40`;
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Trending Now ── */}
      <section style={{ marginBottom: '64px' }}>
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          Trending Now
        </h2>
        <TrendingPanel items={trendingItems} />
      </section>

      {/* ── Explore Features ── */}
      <section style={{ marginBottom: '64px' }}>
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          Explore Features
        </h2>

        {/* Row 1: first 4 features */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {features.slice(0, 4).map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    minHeight: '160px',
                    padding: '24px',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid rgba(255,255,255,0.09)`,
                    borderTop: `2px solid ${feature.color}`,
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 36px ${feature.color}18`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${feature.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={feature.color} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500, color: feature.color, background: `${feature.color}12`, border: `1px solid ${feature.color}30`, padding: '3px 8px', borderRadius: '6px' }}>
                      {feature.complexity}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Row 2: last 3 features — centered */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {features.slice(4).map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                style={{ textDecoration: 'none', color: 'inherit', width: 'calc(25% - 15px)', minWidth: '220px', maxWidth: '320px' }}
              >
                <div
                  style={{
                    minHeight: '160px',
                    height: '100%',
                    padding: '24px',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid rgba(255,255,255,0.09)`,
                    borderTop: `2px solid ${feature.color}`,
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 36px ${feature.color}18`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${feature.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={feature.color} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 500, color: feature.color, background: `${feature.color}12`, border: `1px solid ${feature.color}30`, padding: '3px 8px', borderRadius: '6px' }}>
                      {feature.complexity}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── About Platform ── */}
      <section
        style={{
          padding: '48px 32px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          <span className="gradient-text">About Platform</span>
        </h2>

        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '15px' }}>
          Real DSA ecosystem built for campus intelligence.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <ComplexityBadge value="O(L) Trie" />
          <ComplexityBadge value="O(logN) Heap" />
          <ComplexityBadge value="O(1) LRU" />
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;