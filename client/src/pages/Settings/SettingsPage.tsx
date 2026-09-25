import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, User, Lock, CheckCircle2, AlertCircle, Code2, Cpu } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'editor' | 'ai' | 'security'>('profile');

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Editor settings
  const [theme, setTheme] = useState(user?.settings?.theme || 'light');
  const [fontSize, setFontSize] = useState(user?.settings?.fontSize || 14);
  const [wordWrap, setWordWrap] = useState(user?.settings?.wordWrap || 'on');
  const [minimap, setMinimap] = useState(user?.settings?.minimap !== false);

  // AI settings
  const [aiProvider, setAiProvider] = useState(user?.settings?.aiProvider || 'groq');
  const [aiModel, setAiModel] = useState(user?.settings?.aiModel || 'llama-3.3-70b-versatile');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status flags
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setProfileSuccess(null);
    try {
      await updateProfile({
        name,
        avatar,
        settings: {
          theme,
          fontSize,
          wordWrap,
          minimap,
          aiProvider,
          aiModel,
        },
      });
      setProfileSuccess('Settings updated successfully.');
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setProfileSuccess(null), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'editor', label: 'IDE & Editor', icon: Code2 },
    { id: 'ai', label: 'AI Inference Engine', icon: Cpu },
    { id: 'security', label: 'Security & Auth', icon: Lock },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-terracotta" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-xs text-secondary-text mt-1 font-medium">
          Customize your profile, Monaco editor parameters, AI model endpoints, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-terracotta text-white shadow-md shadow-terracotta/20'
                    : 'text-secondary-text hover:text-charcoal hover:bg-secondary-card border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-secondary-text'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Tab Content */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl border border-border-pearl bg-white shadow-sm space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-sm font-black text-charcoal flex items-center gap-2">
                <User className="w-4 h-4 text-terracotta" /> Profile Information
              </h3>

              {profileSuccess && (
                <div className="p-3.5 rounded-2xl bg-lime-digital/20 border border-lime-digital/40 text-lime-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-700" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal focus:outline-none focus:border-terracotta font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-2xl bg-secondary-card border border-border-pearl text-xs text-secondary-text cursor-not-allowed font-mono font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold shadow-md shadow-terracotta/20 transition-all cursor-pointer"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {/* Editor Tab */}
          {activeTab === 'editor' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-sm font-black text-charcoal flex items-center gap-2">
                <Code2 className="w-4 h-4 text-terracotta" /> Monaco Editor Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">Font Size (px)</label>
                  <input
                    type="number"
                    min={11}
                    max={24}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal focus:outline-none focus:border-terracotta font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">Word Wrap</label>
                  <select
                    value={wordWrap}
                    onChange={(e) => setWordWrap(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal font-bold focus:outline-none focus:border-terracotta"
                  >
                    <option value="on">Enabled (On)</option>
                    <option value="off">Disabled (Off)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="minimapCheck"
                  checked={minimap}
                  onChange={(e) => setMinimap(e.target.checked)}
                  className="rounded border-border-pearl accent-terracotta cursor-pointer"
                />
                <label htmlFor="minimapCheck" className="text-xs text-charcoal font-medium cursor-pointer">
                  Display Code Minimap on right margin
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold shadow-md shadow-terracotta/20 transition-all cursor-pointer"
                >
                  Save Editor Preferences
                </button>
              </div>
            </form>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-sm font-black text-charcoal flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-warm" /> AI Provider & LLM Engine
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">Active AI Provider</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal font-bold focus:outline-none focus:border-terracotta"
                  >
                    <option value="groq">Groq (Llama 3.3 70B - Ultra Fast)</option>
                    <option value="openrouter">OpenRouter API</option>
                    <option value="ollama">Ollama Local Instance (localhost:11434)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">Model Identifier</label>
                  <input
                    type="text"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal focus:outline-none focus:border-terracotta font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary-card border border-border-pearl text-xs text-secondary-text leading-relaxed">
                <strong className="text-charcoal block mb-1">Resilient Code Reasoning Engine:</strong>
                CodeVision AI automatically falls back to static AST execution simulation if provider quotas or network latencies occur.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold shadow-md shadow-terracotta/20 transition-all cursor-pointer"
                >
                  Save AI Configuration
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h3 className="text-sm font-black text-charcoal flex items-center gap-2">
                <Lock className="w-4 h-4 text-terracotta" /> Password & Credentials
              </h3>

              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-lime-digital/20 border border-lime-digital/40 text-lime-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-700" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal focus:outline-none focus:border-terracotta font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal focus:outline-none focus:border-terracotta font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal focus:outline-none focus:border-terracotta font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold shadow-md shadow-terracotta/20 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
