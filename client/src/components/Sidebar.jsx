import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Sparkles,
  BookmarkCheck,
  FolderOpen
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'My Notes',
      path: '/notes',
      icon: BookOpen
    },
    {
      label: 'Search Notes',
      path: '/search',
      icon: Search
    },
    {
      label: 'AI Study Assistant',
      path: '/ai-assistant',
      icon: Sparkles,
      highlight: true
    },
    {
      label: 'Saved AI Results',
      path: '/saved-ai',
      icon: BookmarkCheck
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-800/80 bg-slate-950/40 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Core Features
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm'
                        : item.highlight
                        ? 'text-sky-300 hover:bg-sky-500/10 hover:text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-sky-400' : ''}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-gradient-to-br from-brand-950/40 to-slate-900/60">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-semibold text-slate-200">Instant AI Helper</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Select any study note to generate instant explanations and exam summaries.
          </p>
          <NavLink
            to="/ai-assistant"
            className="block text-center text-xs font-semibold py-2 px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            Launch AI Assistant
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
