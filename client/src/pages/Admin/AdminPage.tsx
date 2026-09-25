import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { User } from '../../types';
import {
  ShieldAlert,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
          <h1 className="text-2xl font-black text-charcoal flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-terracotta" />
            <span>Admin Administration Console</span>
          </h1>
          <p className="text-xs text-secondary-text mt-1 font-medium">
            Global ecosystem metrics, user role governance, and audit trails.
          </p>
        </div>

        <span className="px-3.5 py-1 rounded-full bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-bold font-mono">
          ADMIN PRIVILEGES ACTIVE
        </span>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm">
            <span className="text-[11px] text-secondary-text font-mono font-bold">Total Users</span>
            <div className="text-2xl font-black text-charcoal mt-1">{analytics.totalUsers}</div>
            <div className="text-[10px] text-lime-700 font-bold mt-0.5">{analytics.activeUsers} active</div>
          </div>
          <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm">
            <span className="text-[11px] text-secondary-text font-mono font-bold">Total Projects</span>
            <div className="text-2xl font-black text-terracotta mt-1">{analytics.totalProjects}</div>
            <div className="text-[10px] text-secondary-text mt-0.5 font-medium">Persistent repos</div>
          </div>
          <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm">
            <span className="text-[11px] text-secondary-text font-mono font-bold">Total Analyses</span>
            <div className="text-2xl font-black text-orange-warm mt-1">{analytics.totalAnalyses}</div>
            <div className="text-[10px] text-secondary-text mt-0.5 font-medium">AST pipelines</div>
          </div>
          <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm">
            <span className="text-[11px] text-secondary-text font-mono font-bold">Total Reports</span>
            <div className="text-2xl font-black text-charcoal mt-1">{analytics.totalReports}</div>
            <div className="text-[10px] text-secondary-text mt-0.5 font-medium">PDF/HTML exports</div>
          </div>
          <div className="p-5 rounded-3xl border border-border-pearl bg-white shadow-sm">
            <span className="text-[11px] text-secondary-text font-mono font-bold">Avg Quality</span>
            <div className="text-2xl font-black text-lime-700 mt-1">{analytics.averageQualityScore}/100</div>
            <div className="text-[10px] text-secondary-text mt-0.5 font-medium">Global index</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-pearl pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-secondary-text hover:text-charcoal hover:bg-secondary-card'
          }`}
        >
          Users Management
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-secondary-text hover:text-charcoal hover:bg-secondary-card'
          }`}
        >
          System Analytics
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-secondary-text hover:text-charcoal hover:bg-secondary-card'
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
              <Search className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-border-pearl text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta shadow-sm font-medium"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border-pearl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-pearl text-[11px] text-secondary-text uppercase font-bold bg-ivory font-mono">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-pearl text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-pearl/60 transition-colors">
                    <td className="p-4 font-black text-charcoal">{u.name}</td>
                    <td className="p-4 text-secondary-text font-mono text-[11px]">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="px-2.5 py-1 rounded-xl bg-pearl border border-border-pearl text-[11px] font-mono text-terracotta font-bold focus:outline-none"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                          u.isActive !== false
                            ? 'bg-lime-digital/20 text-lime-800 border border-lime-digital/40'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {u.isActive !== false ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-4 text-secondary-text font-mono text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-secondary-text hover:text-terracotta hover:bg-secondary-card transition-colors cursor-pointer"
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
          <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm">
            <h3 className="text-sm font-black text-charcoal mb-4">Projects by Programming Language</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.projectsByLanguage || []}>
                  <XAxis dataKey="language" stroke="#6F6A61" fontSize={11} />
                  <YAxis stroke="#6F6A61" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFDF8', borderColor: 'rgba(35,32,28,0.1)', color: '#242321', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#D85C32" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm">
            <h3 className="text-sm font-black text-charcoal mb-4">Recent Daily Activity Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.recentActivityTrend || []}>
                  <XAxis dataKey="date" stroke="#6F6A61" fontSize={10} />
                  <YAxis stroke="#6F6A61" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFDF8', borderColor: 'rgba(35,32,28,0.1)', color: '#242321', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="count" stroke="#F28A3D" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="rounded-3xl border border-border-pearl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-pearl text-[11px] text-secondary-text uppercase font-bold bg-ivory font-mono">
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Project</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-pearl text-xs">
              {activityLogs.map((log) => (
                <tr key={log._id} className="hover:bg-pearl/60 transition-colors">
                  <td className="p-4 font-bold text-charcoal">{log.userId?.name || 'User'}</td>
                  <td className="p-4 font-mono text-terracotta font-bold">{log.action}</td>
                  <td className="p-4 text-secondary-text">{log.projectId?.name || log.details?.name || '—'}</td>
                  <td className="p-4 text-secondary-text font-mono text-[11px]">
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
