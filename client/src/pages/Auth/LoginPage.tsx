import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Code2, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, Check } from 'lucide-react';
import { ThreeBackground } from '../../components/ThreeUI/ThreeBackground';
import { GlassAIButton } from '../../components/ThreeUI/GlassAIButton';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* ThreeUI Constellation Background */}
      <ThreeBackground opacity={0.3} />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 glass-panel rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden relative z-10">
        {/* Left Manifesto Pane */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#080d1a] to-[#040711] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-black tracking-tight text-white">CodeVision AI</span>
            </Link>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white leading-snug">
                Understand code.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  Build better software.
                </span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your workspace to next-generation multi-language AST inspection and execution simulation.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> 11 Analytical Domains
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-cyan-400" /> Project-Aware AI Assistant
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-purple-400" /> MongoDB Atlas Synchronized
            </div>
          </div>
        </div>

        {/* Right Sign-in Form */}
        <div className="md:col-span-7 p-8 sm:p-10 bg-[#060b18]/90 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Sign In to CodeVision</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your credentials to access your projects & analyses.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-cyan-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <GlassAIButton
              type="submit"
              disabled={isSubmitting}
              size="md"
              variant="primary"
              className="w-full"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </GlassAIButton>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
