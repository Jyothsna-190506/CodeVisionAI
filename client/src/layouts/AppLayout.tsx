import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  History,
  FileText,
  MessageSquare,
  Settings,
  ShieldAlert,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  GitBranch,
  Binary,
  Network,
  CheckCircle2,
  Terminal,
  Search,
  Command,
  UserCircle,
  FolderGit2
} from 'lucide-react';
import { GlassAIButton } from '../components/ThreeUI/GlassAIButton';
import { ThreeBackground } from '../components/ThreeUI/ThreeBackground';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'PROJECTS',
      items: [
        { label: 'All Projects', path: '/projects', icon: FolderKanban },
      ],
    },
    {
      group: 'ANALYSIS',
      items: [
        { label: 'New Analysis', path: '/editor', icon: Code2, highlight: true },
        { label: 'Analysis History', path: '/history', icon: History },
        { label: 'Reports', path: '/reports', icon: FileText },
      ],
    },
    {
      group: 'AI ENGINE',
      items: [
        { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  if (user?.role === 'ADMIN') {
    navGroups.push({
      group: 'ADMINISTRATION',
      items: [
        { label: 'Admin Dashboard', path: '/admin', icon: ShieldAlert },
      ],
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Subtle ThreeUI Constellation Background */}
      <ThreeBackground opacity={0.15} interactive={false} />

      {/* ThreeUI Animated Top Dock / Command Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#080d1a]/85 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                CodeVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-extrabold">AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Quick Command Prompt Trigger */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/editor"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-3 transition-all"
          >
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Analyze or inspect code snippet...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </Link>
        </div>

        {/* Right side user info & action */}
        <div className="flex items-center gap-3">
          <Link to="/editor">
            <GlassAIButton size="sm" variant="primary">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">New Analysis</span>
            </GlassAIButton>
          </Link>

          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 border border-indigo-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
              {user?.name?.slice(0, 2) || 'CV'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">{user?.name}</div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{user?.role}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Outlet */}
      <div className="flex-1 flex min-h-0 relative z-10">
        {/* ThreeUI Developer-Style Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } transition-all duration-300 border-r border-slate-800/80 bg-[#050914]/80 backdrop-blur-xl flex flex-col justify-between p-3 flex-shrink-0`}
        >
          <div className="space-y-4 overflow-y-auto pr-1">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {sidebarOpen && (
                  <div className="px-3 text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                    {group.group}
                  </div>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-600/20 to-cyan-500/10 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      {sidebarOpen && (
                        <span className="truncate">{item.label}</span>
                      )}
                      {sidebarOpen && item.highlight && (
                        <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                          IDE
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer Status */}
          {sidebarOpen && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1 mt-2">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Atlas Database
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono truncate">Engine: Multi-Provider LLM</p>
            </div>
          )}
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
