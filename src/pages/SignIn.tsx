import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn } from '../auth/hooks/sign-in.hook';
import type { SignInPayload } from '../auth/types/sign-in.type';
import { useAuth } from '../auth/context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignInPayload>({
    email: '',
    password: '',
  });

  const { loginUser, loading, error } = useSignIn();

  const { refreshUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(formData);
      await refreshUser();
      navigate('/archives');
    } catch (err) {
      console.error('SignIn error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Left panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-12 border-r border-[var(--border)] bg-[var(--card)]">
        <Link to="" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1a2 2 0 00-2 2v4a2 2 0 004 0V3a2 2 0 00-2-2z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3 7a4 4 0 008 0"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-mono font-semibold text-sm text-[var(--foreground)]">
            Audio Summarization
          </span>
        </Link>
        <div className="space-y-6">
          {[
            { label: 'Upload audio', done: true },
            { label: 'AI-generated summary', done: true },
            { label: 'Tag & archive session', done: true },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-blue-600' : 'border border-[var(--border)]'}`}>
                {step.done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2.5 2.5L8 2.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm font-mono ${step.done ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-mono font-bold text-2xl text-[var(--foreground)] mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] font-mono mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--ring)] focus:outline-none transition-colors font-[inherit] placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--ring)] focus:outline-none transition-colors font-[inherit] placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-mono font-medium text-sm transition-colors">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-xs font-mono text-[var(--muted-foreground)] text-center">
            No account?{' '}
            <Link
              to="/sign-up"
              className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
