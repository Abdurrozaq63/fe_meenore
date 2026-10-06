import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignUp } from '../auth/hooks/sign-up.hook';
import type { SignUpPayload } from '../auth/types/sign-up.type';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpPayload>({
    name: '',
    email: '',
    password: '',
  });

  // 2. Panggil custom hook yang telah dibuat
  const { registerUser, loading, error, success } = useSignUp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      // Opsional: Lakukan sesuatu setelah sukses, misal redirect ke halaman login
      alert('Pendaftaran berhasil!');
      navigate('sign-in');
    } catch (err) {
      // Error sudah ditangani oleh hook untuk ditampilkan di UI
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
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

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-mono font-bold text-2xl text-[var(--foreground)] mb-1">
            Create account
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] font-mono mb-8">
            Start your first session in minutes
          </p>

          {/* Tampilkan pesan error jika ada */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Tampilkan pesan sukses jika ada */}
          {success && <p style={{ color: 'green' }}>Akun berhasil dibuat!</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-3 py-2.5 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--ring)] focus:outline-none transition-colors font-[inherit] placeholder:text-[var(--muted-foreground)]"
              />
            </div>
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
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full px-3 py-2.5 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--ring)] focus:outline-none transition-colors font-[inherit] placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-mono font-medium text-sm transition-colors">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-xs font-mono text-[var(--muted-foreground)] text-center">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
