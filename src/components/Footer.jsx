import React from 'react';
import ComplexityBadge from './ComplexityBadge';

const Footer = () => {
  return (
    <footer
      style={{
        width: '100%',
        background: 'rgba(10, 10, 15, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '16px 24px',
        boxSizing: 'border-box',
        zIndex: 10,
        position: 'relative',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left Side: Brand and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '14px',
              background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CampusIQ
          </span>
          <span style={{ color: '#475569', fontSize: '12px' }}>|</span>
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>
            Real DSA ecosystem for campus intelligence
          </span>
        </div>

        {/* Center: Sibling Complexity Badges (Horizontal inline layout) */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <ComplexityBadge value="O(L) Trie" />
          <ComplexityBadge value="O(logN) Heap" />
          <ComplexityBadge value="O(1) LRU" />
        </div>

        {/* Right Side: Developer Credits */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#475569' }}>
          <span>© {new Date().getFullYear()}</span>
          <span
            style={{
              color: '#94a3b8',
              fontWeight: 500,
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Developed by Vansh ❤️
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
