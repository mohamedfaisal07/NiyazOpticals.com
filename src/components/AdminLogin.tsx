import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onSuccess: (adminToken: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : { error: 'Admin API is not available in this deployment.' };

      if (!response.ok || !data.token) {
        throw new Error(data?.error || 'Incorrect password. Try again.');
      }

      onSuccess(data.token);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Admin login failed.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 bg-[#261606] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-7 h-7 text-[#fbe311]" />
          </div>
          <h1 className="text-2xl font-sans font-black tracking-tight text-[#111111]">
            NIYAZ OPTICALS
          </h1>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Admin Command Center
          </p>
        </div>

        <motion.div
          animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-neutral-200/60 shadow-xl p-8 space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-base font-sans font-black text-[#111111]">Sign in to Dashboard</h2>
            <p className="text-xs text-neutral-400">Enter your admin password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  required
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#261606] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-[11px] text-red-500 font-semibold pl-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#261606] hover:bg-[#111111] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {submitting ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>

          <p className="text-[10px] text-neutral-300 text-center font-mono">
            This portal is restricted to Niyaz Opticals staff only.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
