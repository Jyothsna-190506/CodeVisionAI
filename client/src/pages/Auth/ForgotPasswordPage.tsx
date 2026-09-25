import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Code2, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ThreeBackground } from '../../components/ThreeUI/ThreeBackground';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitted(true); // Don't disclose user existence
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Computational Background */}
      <ThreeBackground opacity={0.35} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-terracotta" />
            </div>
            <span className="text-2xl font-black tracking-tight text-charcoal">CodeVision AI</span>
          </Link>
          <p className="text-xs text-secondary-text font-medium">Password Reset Instructions</p>
        </div>

        <div className="bg-white border border-border-pearl rounded-3xl p-8 shadow-2xl">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-lime-digital/20 border border-lime-digital/40 rounded-2xl flex items-center justify-center mx-auto text-lime-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-charcoal">Check Your Inbox</h3>
              <p className="text-xs text-secondary-text leading-relaxed font-medium">
                If an account matches <span className="text-terracotta font-bold">{email}</span>, password reset instructions have been generated.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-terracotta hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta shadow-sm transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-terracotta hover:bg-orange-warm text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-terracotta/20 disabled:opacity-50 transition-all cursor-pointer mt-6"
              >
                {isSubmitting ? (
                  <span>Sending Instructions...</span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs text-secondary-text hover:text-charcoal font-medium">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
