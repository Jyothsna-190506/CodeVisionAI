import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Code2, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { ThreeBackground } from '../../components/ThreeUI/ThreeBackground';

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
    <div className="min-h-screen bg-pearl flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* 3D Computational Background */}
      <ThreeBackground opacity={0.35} />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-border-pearl shadow-2xl overflow-hidden relative z-10 bg-white">
        {/* Left Manifesto Pane */}
        <div className="md:col-span-5 bg-ivory p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border-pearl">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-terracotta" />
              </div>
              <span className="text-base font-black tracking-tight text-charcoal">CodeVision AI</span>
            </Link>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-charcoal leading-snug">
                Understand code.{' '}
                <span className="text-terracotta">
                  See it think.
                </span>
              </h2>
              <p className="text-xs text-secondary-text leading-relaxed font-normal">
                Connect your workspace to next-generation multi-language AST inspection, control flow diagrams, and execution simulation.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-2 text-[11px] font-mono text-secondary-text font-bold">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-lime-600" /> 11 Analytical Domains
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-terracotta" /> Project-Aware AI Assistant
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-orange-warm" /> MongoDB Atlas Synchronized
            </div>
          </div>
        </div>

        {/* Right Sign-in Form */}
        <div className="md:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl font-black text-charcoal">Sign In to CodeVision</h3>
            <p className="text-xs text-secondary-text mt-1 font-medium">Enter your credentials to access your projects & analyses.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-charcoal">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-terracotta font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-secondary-text hover:text-charcoal absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-terracotta/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-secondary-text font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-terracotta font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
