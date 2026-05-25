import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import {
  Search,
  Home,
  Type,
  GitBranch,
  Gauge,
  BarChart3,
  Clock,
  TrendingUp,
  SpellCheck,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Lock,
  Mail,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/autocomplete', label: 'Autocomplete', icon: Type },
  { path: '/trie-visualizer', label: 'Trie Viz', icon: GitBranch },
  { path: '/performance', label: 'Performance', icon: Gauge },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/trending', label: 'Trending', icon: TrendingUp },
  { path: '/typo', label: 'Typo', icon: SpellCheck },
];

const Navbar = () => {
  const { user, setUser, setShowLoginModal } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('campusiq_user');
    setUser('');
    setShowDropdown(false);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        zIndex: 100,
        backgroundColor: 'rgba(10,10,15,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          padding: '0 24px',
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Logo (left aligned) */}
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #4f8ef7 0%, #00d4aa 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CampusIQ
          </span>
        </NavLink>

        {/* Center Nav Links (Creative centered layout like Stripe/Vercel) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            overflow: 'hidden',
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#f1f5f9' : '#94a3b8',
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#f1f5f9';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={13} color={isActive ? '#00d4aa' : '#94a3b8'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Right side: Authentication Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: '#f1f5f9',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0, 212, 170, 0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {user.charAt(0)}
                </div>
                <span>{user}</span>
                <ChevronDown size={12} color="#94a3b8" />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '140px',
                      background: 'rgba(17,17,24,0.95)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                    >
                      <LogOut size={12} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '12px',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79,142,247,0.2)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 0.9; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 1; }}
            >
              <LogIn size={13} /> Sign In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
            className="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: '#0d0d15',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                padding: '12px',
              }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: '#94a3b8',
                      fontSize: '13px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <Icon size={14} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;