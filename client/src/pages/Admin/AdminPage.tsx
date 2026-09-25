import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { User } from '../../types';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  Zap,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'activity'>('users');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, logsRes] = await Promise.all([
        apiClient.get('/admin/analytics'),
        apiClient.get('/admin/users', { params: { search: userSearch || undefined } }),
        apiClient.get('/admin/activity'),
      ]);

      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.users || []);
      if (logsRes.data.success) setActivityLogs(logsRes.data.logs || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [userSearch]);

  const handleToggleActive = async (userId: string, currentActive?: boolean) => {
    try {
      const res = await apiClient.put(`/admin/users/${userId}`, {
        isActive: !currentActive,
      });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
        );
      }
    } catch (err: any) {
      alert('Failed to update user: ' + err.message);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await apiClient.put(`/admin/users/${userId}`, {
        role: newRole,
      });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
        );
      }
    } catch (err: any) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Delete this user and all associated projects & data permanently?')) return;
    try {
      const res = await apiClient.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err: any) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Admin Administration Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global ecosystem metrics, user role governance, and audit trails.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono">
          ADMIN PRIVILEGES ACTIVE
        </span>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="text-[11px] text-slate-400 font-mono">Total Users</span>
            <div className="text-2xl font-black text-white mt-1">{analytics.totalUsers}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">{analytics.activeUsers} active</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="text-[11px] text-slate-400 font-mono">Total Projects</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">{analytics.totalProjects}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Persistent repos</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="text-[11px] text-slate-400 font-mono">Total Analyses</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">{analytics.totalAnalyses}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">AST pipelines</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="text-[11px] text-slate-400 font-mono">Total Reports</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{analytics.totalReports}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">PDF/HTML exports</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="text-[11px] text-slate-400 font-mono">Avg Quality</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{analytics.averageQualityScore}/100</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Global index</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Users Management
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          System Analytics
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'activity'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Platform Activity Logs
        </button>
      </div>

      {/* 1. USERS MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold bg-slate-950/40">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-200">{u.name}</td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 focus:outline-none"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.isActive !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {u.isActive !== false ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ANALYTICS TAB */}
      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <h3 className="text-sm font-bold text-white mb-4">Projects by Programming Language</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.projectsByLanguage || []}>
                  <XAxis dataKey="language" stroke="#475569" fontSize={11} />
                  <YAxis stroke="#475569" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <h3 className="text-sm font-bold text-white mb-4">Recent Daily Activity Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.recentActivityTrend || []}>
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold bg-slate-950/40">
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Project</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {activityLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-300">{log.userId?.name || 'User'}</td>
                  <td className="p-4 font-mono text-cyan-300">{log.action}</td>
                  <td className="p-4 text-slate-400">{log.projectId?.name || log.details?.name || '—'}</td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
