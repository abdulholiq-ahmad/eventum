'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { X, Mail, Chrome, KeyRound } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Registration failed');
          setIsLoading(false);
          return;
        }
        // Auto-login after registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        if (result?.ok) {
          setEmail('');
          setPassword('');
          setName('');
          onClose();
          router.push('/my-events');
          if (onLogin) onLogin();
        } else {
          setError('Login failed after registration');
        }
      } else {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        if (result?.ok) {
          setEmail('');
          setPassword('');
          onClose();
          router.push('/my-events');
          if (onLogin) onLogin();
        } else {
          setError('Invalid email or password');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px] transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className={`relative w-full max-w-[440px] bg-[#1E1E1E] rounded-3xl border border-white/10 shadow-2xl p-8 transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8 mt-2">
           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
             <span className="text-2xl font-bold tracking-tighter text-white">
                E<span className="text-pink-500">.</span>
             </span>
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Eventumga xush kelibsiz</h2>
           <p className="text-gray-400 text-sm">
             {mode === 'login' ? "Iltimos, akkauntga kiring." : "Yangi akkaunt yarating."}
           </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Name Input (Register only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                 <label className="text-xs font-medium text-gray-400 ml-1">Ism</label>
                 <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sizning ismingiz"
                  className="w-full h-12 bg-[#141414] border border-white/10 rounded-xl pl-4 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                  required
                 />
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
               <label className="text-xs font-medium text-gray-400 ml-1">Email</label>
               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sizning@email.com"
                    className="w-full h-12 bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                    required
                  />
               </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
               <label className="text-xs font-medium text-gray-400 ml-1">Parol</label>
               <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                    required
                  />
               </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-white hover:bg-gray-100 disabled:opacity-50 text-black font-semibold rounded-xl transition-colors flex items-center justify-center"
            >
                {isLoading ? 'Kutilmoqda...' : (mode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish')}
            </button>

            {/* Mode Toggle */}
            <div className="text-center text-sm text-gray-500">
              {mode === 'login' ? (
                <>
                  Akkauntingiz yo\'qmi?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(''); }}
                    className="text-white hover:underline"
                  >
                    Ro'yxatdan o'ting
                  </button>
                </>
              ) : (
                <>
                  Allaqachon akkauntingiz bormi?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); }}
                    className="text-white hover:underline"
                  >
                    Kiring
                  </button>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-[#1E1E1E] px-2 text-gray-500">yoki</span>
                </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
                <button
                    type="button"
                    disabled
                    className="w-full h-11 bg-[#141414]/50 border border-white/5 text-gray-500 font-medium rounded-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group cursor-not-allowed"
                >
                    <Chrome size={18} />
                    <span>Google orqali kirish</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity pointer-events-none"></div>
                    
                    {/* Tez orada tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Tez orada
                    </div>
                </button>
            </div>
        </form>

        {/* Footer */}
        <p className="text-[10px] text-gray-500 text-center mt-6 leading-relaxed">
           Davom etish orqali siz Eventum <a href="#" className="underline hover:text-gray-300">Foydalanish shartlari</a> va <a href="#" className="underline hover:text-gray-300">Maxfiylik siyosati</a>ga rozilik bildirasiz.
        </p>

      </div>
    </div>
  );
};

export default LoginModal;
