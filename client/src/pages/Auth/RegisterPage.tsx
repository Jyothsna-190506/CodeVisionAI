import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Code2, Lock, Mail, User, Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { ThreeBackground } from '../../components/ThreeUI/ThreeBackground';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
                Accelerate code mastery with{' '}
                <span className="text-terracotta">
                  AI-powered visual intelligence.
                </span>
              </h2>
              <p className="text-xs text-secondary-text leading-relaxed font-normal">
                Create a persistent developer profile with custom projects, automated test generation, and AI explanations.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-2 text-[11px] font-mono text-secondary-text font-bold">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-lime-600" /> Instant Execution Traces
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-terracotta" /> Automated Code Refactoring
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-orange-warm" /> Interactive AST Visualizer
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="md:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-center space-y-5">
          <div>
            <h3 className="text-xl font-black text-charcoal">Create Developer Account</h3>
            <p className="text-xs text-secondary-text mt-1 font-medium">Get started with full-stack code analysis in seconds.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ada@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Password</label>
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

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pearl border border-border-pearl text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-secondary-text font-bold">
                  <span>Password Complexity</span>
                  <span className={strength >= 75 ? 'text-lime-700' : strength >= 50 ? 'text-orange-warm' : 'text-terracotta'}>
                    {strength >= 75 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-pearl rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength >= 75 ? 'bg-lime-600' : strength >= 50 ? 'bg-orange-warm' : 'bg-terracotta'
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-terracotta/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-1 text-center text-xs text-secondary-text font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-terracotta font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
