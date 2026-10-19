import React, { useState } from 'react';
import {
  Stethoscope,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Heart,
  AlertCircle
} from 'lucide-react';
import { User as UserType, UserRole } from '../types.ts';

interface LoginGateProps {
  onLogin: (user: UserType) => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>('patient');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please provide your full name');
      return;
    }

    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      name: mode === 'signup' ? name : (email.split('@')[0] || 'Member'),
      email: email,
      role: role,
      avatar: role === 'doctor'
        ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=300&q=80',
      title: role === 'doctor' ? 'Emeritus Physician, MD' : 'Patient Member'
    };

    onLogin(newUser);
  };

  const handleQuickDemoLogin = (demoRole: UserRole, demoName: string, demoEmail: string, avatar: string, title?: string) => {
    onLogin({
      id: demoRole === 'doctor' ? 'dr-sterling' : 'user-pt-001',
      name: demoName,
      email: demoEmail,
      role: demoRole,
      avatar: avatar,
      title: title || (demoRole === 'doctor' ? 'Emeritus Physician' : 'Patient')
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-white">YourDr.</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300">
              Authentication Portal
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Unhurried Care with Experienced Retired Physicians
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 relative z-10">
        {/* Notice of Mandatory Login */}
        <div className="mb-5 p-3 rounded-xl bg-teal-950/40 border border-teal-800/40 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-200 leading-relaxed">
            <span className="font-bold text-teal-300">Secure Access Required:</span> Please sign in to view your doctor booking status, edit pending appointments within the 30-minute window, and access your consultation history.
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signin'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signup'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Select Your Portal Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition ${
                  role === 'patient'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Patient / Member</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition ${
                  role === 'doctor'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Physician / Doctor</span>
              </button>
            </div>
          </div>

          {/* Full Name for Sign Up */}
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Higgins"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition"
          >
            <span>{mode === 'signin' ? 'Sign In to Portal' : 'Register & Enter Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or One-Click Demo Access
          </span>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin(
              'patient',
              'Eleanor Higgins',
              'eleanor.higgins@example.com',
              'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=300&q=80',
              'Patient Member (Has Active Pending Booking)'
            )}
            className="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left flex items-center justify-between group transition"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=300&q=80"
                alt="Eleanor"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500/50"
              />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-teal-300 transition">
                  Login as Eleanor Higgins (Patient)
                </div>
                <div className="text-[10px] text-teal-400">
                  Has active pending booking with 30-min edit window
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin(
              'doctor',
              'Dr. Arthur Sterling, MD, FACC',
              'dr.sterling@yourdoctor.care',
              'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
              'Emeritus Chief of Cardiology (Johns Hopkins)'
            )}
            className="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left flex items-center justify-between group transition"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                alt="Dr. Sterling"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500/50"
              />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-teal-300 transition">
                  Login as Dr. Arthur Sterling (Doctor)
                </div>
                <div className="text-[10px] text-amber-400">
                  Review & accept pending patient requests
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Connected to Vercel deployment: <span className="text-teal-400 font-mono">your-doctor-nine.vercel.app</span>
          </p>
        </div>
      </div>
    </div>
  );
};
