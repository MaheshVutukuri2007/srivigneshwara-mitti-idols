import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '../components/GoogleIcon';

export default function LoginPage() {
  const { user, isAdmin, loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else if (mode === 'signup') {
        await signupWithEmail(email, password, fullName, phone);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setInfoMsg('Password reset link sent to your email.');
      }
    } catch (err: any) {
      console.error('Auth action failed:', err);
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 dark:border-stone-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif font-extrabold text-2xl text-stone-900 dark:text-stone-100">
            {mode === 'login' ? 'Welcome Back Devotee' : mode === 'signup' ? 'Create Customer Account' : 'Reset Password'}
          </h1>
          <p className="text-xs text-stone-500">Sri Vigneshwara Mitti Idols • Vijayawada</p>
        </div>

        {/* Google Login Button */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow hover:bg-stone-50"
          >
            <GoogleIcon />
            <span>Sign In With Google Account</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
            <span>or email</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Receiver Name"
                  className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300">Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Primary Phone Number"
                  className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                required
              />
            </div>
          )}

          {errorMsg && <p className="text-rose-600 font-bold text-xs">{errorMsg}</p>}
          {infoMsg && <p className="text-emerald-600 font-bold text-xs">{infoMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7A00] hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow text-xs transition-transform active:scale-95"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In To Account'
              : mode === 'signup'
              ? 'Register New Account'
              : 'Send Password Reset Email'}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200 dark:border-stone-800">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('signup')} className="text-[#FF7A00] font-bold hover:underline">
                Create Account
              </button>
              <button onClick={() => setMode('forgot')} className="hover:underline">
                Forgot Password?
              </button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-[#FF7A00] font-bold hover:underline mx-auto">
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
