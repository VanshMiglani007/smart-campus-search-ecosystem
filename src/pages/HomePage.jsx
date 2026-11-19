import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  BarChart3,
  Clock,
  TrendingUp,
  Gauge,
  BookOpen,
  Type,
  SpellCheck,
  Sparkles,
  ShieldCheck,
  X,
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
];

const HomePage = () => {
  const { trendingItems, recordSelection, user, setUser, setShowLoginModal } = useSearch();
  const navigate = useNavigate();
  const [showShowcaseModal, setShowShowcaseModal] = useState(() => !sessionStorage.getItem('campusiq_showcase_dismissed'));

  const handleSelectSuggestion = (word) => {
    recordSelection(word);
    navigate('/autocomplete', { state: { query: word } });
  };

  // ── Conditional Landing Screen when NOT Logged In ──
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px 80px',
          boxSizing: 'border-box',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Showcase Notice Pill */}
        <button
          onClick={() => setShowShowcaseModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '24px',
            background: 'rgba(79, 142, 247, 0.08)',
            border: '1px solid rgba(79, 142, 247, 0.25)',
            color: '#4f8ef7',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '28px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(79, 142, 247, 0.16)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(79, 142, 247, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Sparkles size={14} color="#00d4aa" /> 🎓 Academic Showcase Mode • Demo Credentials Available
        </button>

        {/* Creative Headline */}
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(32px, 6vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          Unlock Symmetrical <br />
          <span className="gradient-text">Campus Search Intelligence</span>
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: 'clamp(15px, 2vw, 18px)',
            marginBottom: '36px',
            maxWidth: '620px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          An interactive, high-performance DSA visualization console. Witness live Prefix Tries, dynamic trending MaxHeaps, and LRU Cache structures working concurrently.
        </p>

        {/* Dynamic CTA Button & Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                localStorage.setItem('campusiq_user', 'Vansh');
                setUser('Vansh');
              }}
              style={{
                padding: '16px 36px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)',
                color: 'white',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(79, 142, 247, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 142, 247, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(79, 142, 247, 0.25)';
              }}
            >
              ⚡ 1-Click Showcase Demo Login
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                padding: '16px 28px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f1f5f9',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Custom Admin Login
            </button>
          </div>

          {/* Explicit Credentials Display */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                🔑 Showcase Credentials:
              </span>
              <code style={{ fontSize: '12px', background: 'rgba(79, 142, 247, 0.1)', color: '#4f8ef7', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(79, 142, 247, 0.25)' }}>
                vansh@campusiq.com
              </code>
              <span style={{ color: '#475569' }}>/</span>
              <code style={{ fontSize: '12px', background: 'rgba(0, 212, 170, 0.1)', color: '#00d4aa', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(0, 212, 170, 0.25)' }}>
                admin
              </code>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, maxWidth: '560px' }}>
              💡 <em>This platform is an academic showcase demonstrating search algorithms (Trie, Heap, LRU Cache, HashMap, DP). General registration is disabled; use Admin access to explore.</em>
            </p>
          </div>
        </div>

        {/* Showcase Popup Modal for First-time Evaluators / Visitors */}
        <AnimatePresence>
          {showShowcaseModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2500,
                background: 'rgba(5, 5, 8, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
              onClick={() => setShowShowcaseModal(false)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  background: 'rgba(17, 17, 24, 0.98)',
                  border: '1px solid rgba(79, 142, 247, 0.35)',
                  borderRadius: '24px',
                  padding: '32px 28px',
                  boxSizing: 'border-box',
                  position: 'relative',
                  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85), 0 0 35px rgba(79, 142, 247, 0.15)',
                  textAlign: 'center',
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    sessionStorage.setItem('campusiq_showcase_dismissed', 'true');
                    setShowShowcaseModal(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: '18px',
                    right: '18px',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '50%',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >
                  <X size={20} />
                </button>

                {/* Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(0, 212, 170, 0.12)', border: '1px solid rgba(0, 212, 170, 0.3)', color: '#00d4aa', fontSize: '12px', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <Sparkles size={14} /> Project Showcase & Evaluation Demo
                </div>

                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px 0', lineHeight: 1.25 }}>
                  Welcome to <span className="gradient-text">CampusIQ</span>
                </h2>

                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  This platform is an academic showcase engineered to demonstrate how real-world search engines operate using foundational <strong>Data Structures & Algorithms</strong> (Trie prefix trees, MaxHeap trending with decay, LRU cache history, custom HashMaps, and Levenshtein dynamic programming).
                </p>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    <ShieldCheck size={16} color="#4f8ef7" /> Why Admin Login Only?
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    To keep the focus strictly on demonstrating the search algorithms, visualizers, and analytics, general user registration is disabled and dedicated <strong>Admin Showcase Credentials</strong> are enabled for evaluators:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0, 0, 0, 0.35)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Admin Email</div>
                      <code style={{ fontSize: '12px', color: '#4f8ef7', fontWeight: 600 }}>vansh@campusiq.com</code>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Security Key</div>
                      <code style={{ fontSize: '12px', color: '#00d4aa', fontWeight: 600 }}>admin</code>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      localStorage.setItem('campusiq_user', 'Vansh');
                      setUser('Vansh');
                      setShowShowcaseModal(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(79, 142, 247, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Sparkles size={16} /> ⚡ 1-Click Showcase Demo Login
                  </button>

                  <button
                    onClick={() => {
                      sessionStorage.setItem('campusiq_showcase_dismissed', 'true');
                      setShowShowcaseModal(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#94a3b8',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#f1f5f9';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    Browse Landing Overview
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature/Algorithm Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            textAlign: 'left',
          }}
        >
          {[
            {
              title: 'Trie Autocomplete',
              desc: 'Queries in O(L) time. Traverses standard character nodes and performs rapid DFS to retrieve instant prefix suggestions.',
              icon: GitBranch,
              color: '#00d4aa',
            },
            {
              title: 'MaxHeap Trending',
              desc: 'Orders global autocomplete queries dynamically. Applies recency-decay algorithms to keep ranking lists active.',
              icon: TrendingUp,
              color: '#ef4444',
            },
            {
              title: 'LRU Cache History',
              desc: 'Saves search history in O(1) hash maps. Automatically evicts the least recently used keys when size limits are reached.',
              icon: Clock,
              color: '#4f8ef7',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                style={{
                  padding: '30px',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderTop: `2px solid ${item.color}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${item.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={20} color={item.color} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    marginBottom: '10px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ── Standard Dashboard Screen when LOGGED IN ──
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
      {/* Hero Section */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingBottom: '64px',
        }}
      >
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

      {/* Trending Now */}
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

      {/* Explore Features */}
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
    </motion.div>
  );
};

export default HomePage;