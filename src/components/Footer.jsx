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
        padding: '40px 24px 24px',
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
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Core Info */}
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #4f8ef7 0%, #00d4aa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}
          >
            About Platform
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
            Real DSA ecosystem built for campus intelligence. Explore search structures, priority rankings, and cache states live.
          </p>
        </div>

        {/* Complexity Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ComplexityBadge value="O(L) Trie" />
          <ComplexityBadge value="O(logN) Heap" />
          <ComplexityBadge value="O(1) LRU" />
        </div>

        {/* Bottom row */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            paddingTop: '16px',
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#475569',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span>© {new Date().getFullYear()} CampusIQ. All rights reserved.</span>
          <span
            style={{
              color: '#94a3b8',
              fontWeight: 500,
              fontSize: '12px',
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
