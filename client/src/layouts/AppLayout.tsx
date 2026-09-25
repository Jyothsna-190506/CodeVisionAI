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
  Search,
  CheckCircle2,
  Database
} from 'lucide-react';
import { GlassAIButton } from '../components/ThreeUI/GlassAIButton';
import { ThreeBackground } from '../components/ThreeUI/ThreeBackground';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

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
        { label: 'Admin Console', path: '/admin', icon: ShieldAlert },
      ],
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-pearl text-charcoal flex flex-col font-sans relative overflow-hidden">
      {/* ThreeUI Subtle Pearl Background Particles */}
      <ThreeBackground opacity={0.35} interactive={false} />

      {/* Floating Light Glass Header / Command Dock */}
      <header className="h-16 border-b border-border-pearl bg-ivory/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-pearl-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-white hover:bg-ivory-warm text-charcoal-muted hover:text-charcoal border border-border-pearl transition-all shadow-pearl-sm"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-terracotta to-orange-warm p-0.5 shadow-pearl-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-ivory rounded-[10px] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-terracotta" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-charcoal flex items-center gap-1.5">
                CodeVision <span className="text-terracotta font-extrabold">AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Quick Search / Command Palette Trigger */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/editor"
            className="px-4 py-1.5 rounded-xl bg-white border border-border-pearl hover:border-terracotta/40 text-charcoal-muted hover:text-charcoal text-xs flex items-center gap-3 transition-all shadow-pearl-sm"
          >
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-terracotta" />
              <span>Inspect or analyze code snippet...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-ivory-warm border border-border-pearl text-[10px] font-mono text-charcoal-muted">
              ⌘K
            </kbd>
          </Link>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-3">
          <Link to="/editor">
            <GlassAIButton size="sm" variant="primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Analysis</span>
            </GlassAIButton>
          </Link>

          <div className="h-5 w-px bg-border-pearl hidden sm:block"></div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta-light border border-terracotta/20 text-terracotta flex items-center justify-center font-bold text-xs">
              {user?.name?.slice(0, 2) || 'CV'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-charcoal leading-tight">{user?.name}</div>
              <div className="text-[10px] text-charcoal-muted font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-digital"></span>
                <span>{user?.role}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-charcoal-muted hover:text-rose-600 hover:bg-ivory-warm transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Sidebar + Outlet */}
      <div className="flex-1 flex min-h-0 relative z-10">
        {/* Soft Ivory Developer Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } transition-all duration-300 border-r border-border-pearl bg-ivory backdrop-blur-xl flex flex-col justify-between p-3 flex-shrink-0 shadow-pearl-sm`}
        >
          <div className="space-y-4 overflow-y-auto pr-1">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {sidebarOpen && (
                  <div className="px-3 text-[10px] font-mono uppercase font-bold text-charcoal-muted tracking-wider mb-1.5">
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
                          ? 'bg-terracotta-light text-terracotta font-bold border border-terracotta/30 shadow-pearl-sm'
                          : 'text-charcoal-muted hover:text-charcoal hover:bg-white'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-terracotta' : 'text-charcoal-muted'}`} />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                      {sidebarOpen && item.highlight && (
                        <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono bg-terracotta text-white font-bold">
                          IDE
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Status Footer */}
          {sidebarOpen && (
            <div className="p-3 rounded-xl bg-white border border-border-pearl text-[11px] text-charcoal-muted space-y-1 shadow-pearl-sm">
              <div className="flex items-center justify-between text-charcoal font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lime-digital"></span>
                  Atlas Database
                </span>
                <span className="text-[10px] text-terracotta font-mono font-bold">LIVE</span>
              </div>
              <p className="text-[10px] text-charcoal-muted font-mono truncate">Engine: Multi-Provider LLM</p>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
