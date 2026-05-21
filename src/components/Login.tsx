import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ChevronRight, Store, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoSignIn = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      onLoginSuccess('ritikaasathua@gmail.com');
      setLoading(false);
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (
        (email.toLowerCase() === 'ritikaasathua@gmail.com' || email.toLowerCase() === 'admin@merchant.com') && 
        password === 'merchant123'
      ) {
        onLoginSuccess(email.toLowerCase());
      } else if (password === 'merchant123') {
        // Allow general logins with demo password
        onLoginSuccess(email);
      } else {
        setError('Invalid email address or passcode. (Use demo: merchant123)');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -translate-x-12 -translate-y-12 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-100/80 rounded-full blur-3xl translate-x-12 translate-y-12 pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden grid md:grid-cols-12 relative z-10 transition-all duration-300">
        
        {/* Left Side: Dynamic Brand Message & Highlights */}
        <div className="md:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg w-fit">
              <Store className="w-4.5 h-4.5 text-indigo-300" />
              <span className="text-[10px] font-bold text-indigo-205 uppercase tracking-wider">Merchant Portal</span>
            </div>
            
            <div className="mt-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                Unified Payment <br />
                <span className="text-indigo-300 font-semibold">Control Center</span>
              </h1>
              <p className="mt-4 text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                Accept, monitor, and settle store collections with pristine real-time analytics and multiple VPA handling.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 md:mt-24">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-white/10 text-indigo-300 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">ISO 27001 Secure</h4>
                  <p className="text-[11px] text-slate-400">Bank-level encryption & real-time fraud monitoring.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-white/10 text-indigo-300 mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">T+1 Settlement</h4>
                  <p className="text-[11px] text-slate-400">Automated morning batch settlements with clean logging.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Powered by Merchant Pay</span>
              <span>v3.4.1</span>
            </div>
          </div>
        </div>

        {/* Right Side: Elegant Form */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-905 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-550 mt-1">Please authenticate to operate your store registers.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div id="login-error" className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Merchant Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs md:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900"
                  placeholder="e.g. ritikaasathua@gmail.com"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="pass" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Access Code
                </label>
                <span className="text-xs text-indigo-650 font-medium hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="pass"
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs md:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900"
                  placeholder="Enter 11-digit passcode"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs md:text-sm transition-all focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Merchant</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Demo Account Details</span>
              <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                User: <code className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded font-mono font-medium">ritikaasathua@gmail.com</code> <br />
                Pass: <code className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded font-mono font-medium">merchant123</code>
              </span>
            </div>

            <button
              id="demo-login-btn"
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 text-[11px] font-semibold py-2.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Instant Demo Access</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
