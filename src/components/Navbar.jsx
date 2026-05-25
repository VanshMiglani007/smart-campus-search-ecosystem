import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(() => localStorage.getItem('campusiq_user') || '');
  const [showDropdown, setShowDropdown] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const location = useLocation();

  // Load custom credentials
  useEffect(() => {
    const saved = localStorage.getItem('campusiq_user');
    if (saved) setUser(saved);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegistering) {
      if (name.trim().length < 2) {
        setError('Please enter a valid name.');
        return;
      }
      localStorage.setItem('campusiq_user', name);
      setUser(name);
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg('');
      }, 1000);
    } else {
      // Login validation
      if (email === 'vansh@campusiq.com' && password === 'admin') {
        localStorage.setItem('campusiq_user', 'Vansh');
        setUser('Vansh');
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg('');
        }, 1000);
      } else if (password.length >= 4) {
        // Allow dynamic logins for ease of testing
        const customName = email.split('@')[0];
        const formattedName = customName.charAt(0).toUpperCase() + customName.slice(1);
        localStorage.setItem('campusiq_user', formattedName);
        setUser(formattedName);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg('');
        }, 1000);
      } else {
        setError('Invalid credentials. (Hint: password must be >= 4 chars)');
      }
    }
  };

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
              onClick={() => { setShowModal(true); setError(''); setSuccessMsg(''); }}
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

      {/* Login Modal */}
      <AnimatePresence>
        {showModal && (
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
              zIndex: 1000,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                width: '100%',
                maxWidth: '380px',
                background: 'rgba(17, 17, 24, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '32px 24px',
                boxSizing: 'border-box',
                position: 'relative',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>

              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px 0', textAlign: 'center' }}>
                {isRegistering ? 'Sign up to explore CampusIQ search engine' : 'Sign in to access premium campus tools'}
              </p>

              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', padding: '10px 12px', color: '#ef4444', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {successMsg && (
                <div style={{ background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.2)', borderRadius: '10px', padding: '10px 12px', color: '#00d4aa', fontSize: '12px', marginBottom: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {isRegistering && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={14} color="#475569" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Vansh Miglani" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 12px 10px 34px', fontSize: '13px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} color="#475569" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vansh@campusiq.com" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 12px 10px 34px', fontSize: '13px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} color="#475569" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 12px 10px 34px', fontSize: '13px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <button type="submit" style={{ width: '100%', padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.2s' }}>
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', marginTop: '20px', margin: '20px 0 0' }}>
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: '#00d4aa', fontWeight: 600, cursor: 'pointer', marginLeft: '4px' }}>
                  {isRegistering ? 'Sign In' : 'Sign Up'}
                </button>
              </p>

              {/* Developer Default hint */}
              {!isRegistering && (
                <p style={{ color: '#475569', fontSize: '11px', textAlign: 'center', marginTop: '12px', margin: '12px 0 0' }}>
                  Hint: Use <code style={{ color: '#4f8ef7' }}>vansh@campusiq.com</code> / <code style={{ color: '#4f8ef7' }}>admin</code> to test!
                </p>
              )}
            </motion.div>
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