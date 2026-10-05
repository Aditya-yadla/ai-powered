import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Brain,
  Search,
  PlusCircle,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';

const Navbar = ({ onOpenCreateModal }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-indigo-500 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  StudyMind <span className="text-brand-400 text-xs px-1.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Student Assistant</span>
              </div>
            </Link>
          </div>

          {/* Quick Search Bar */}
          {user && (
            <form onSubmit={handleQuickSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notes, subjects, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-brand-500 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </form>
          )}

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={onOpenCreateModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-sky-500 text-white font-medium text-sm shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Note</span>
                </button>

                <Link
                  to="/ai-assistant"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-brand-500/50 text-sm font-medium transition-all"
                >
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span>AI Assistant</span>
                </Link>

                <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 font-semibold text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <span className="text-sm font-medium text-slate-300 max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-4">
          {user && (
            <form onSubmit={handleQuickSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 outline-none"
                />
              </div>
            </form>
          )}

          <nav className="flex flex-col space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCreateModal();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-medium text-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Note</span>
                </button>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-900 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-900 text-sm font-medium"
                >
                  My Notes
                </Link>
                <Link
                  to="/ai-assistant"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-900 text-sm font-medium"
                >
                  AI Explanation & Summary
                </Link>
                <Link
                  to="/saved-ai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-900 text-sm font-medium"
                >
                  Saved AI Results
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-slate-900 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-300 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
