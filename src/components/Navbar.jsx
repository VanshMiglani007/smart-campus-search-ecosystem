import { useState } from 'react';
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
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ backgroundColor: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center transition-transform group-hover:scale-110">
              <Search size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold font-[var(--font-heading)] gradient-text hidden sm:block">
              CampusIQ
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                  style={{
                    color: isActive ? '#f1f5f9' : '#94a3b8',
                  }}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #4f8ef7, #00d4aa)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-white/5"
            style={{ backgroundColor: 'rgba(17, 17, 24, 0.98)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: isActive ? '#f1f5f9' : '#94a3b8',
                      backgroundColor: isActive ? 'rgba(79, 142, 247, 0.1)' : 'transparent',
                    }}
                  >
                    <Icon size={16} style={{ color: isActive ? '#4f8ef7' : undefined }} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
