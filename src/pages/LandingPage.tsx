import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 2a2.5 2.5 0 00-2.5 2.5v5a2.5 2.5 0 005 0v-5A2.5 2.5 0 009 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 9a5 5 0 0010 0M9 14v2.5M7 16.5h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: 'Live Recording',
      desc: 'Capture mic or system audio directly in your browser.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 1l1.618 4.98H16l-4.19 3.045L13.236 14 9 10.956 4.764 14l1.426-4.975L2 6.98h5.382L9 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: 'AI Summaries',
      desc: 'Hugging Face + Gemini extract structured topics & key points.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M1.5 9.5L9.5 1.5H17v7.5L9 17l-7.5-7.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13.5" cy="4.5" r="1.25" fill="currentColor" />
        </svg>
      ),
      title: 'Smart Tags',
      desc: 'Organize sessions by work, class, or personal contexts.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M2 4h14v2.5H2V4zM3.5 6.5v9h11v-9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 10h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: 'Session Archive',
      desc: 'Every recording saved with inline editing and full history.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Top nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
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
          <span className="font-mono font-semibold text-sm text-[var(--foreground)] tracking-tight">
            Audio Summarization
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/sign-in')}
            className="px-4 py-2 text-sm font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Sign in
          </button>
          <button
            onClick={() => navigate('/sign-up')}
            className="px-4 py-2 text-sm font-mono bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(59,130,246,0.06) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(59,130,246,0.04) 1px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            AI-powered · TypeScript · React
          </div> */}

          <h1 className="font-mono font-bold text-5xl md:text-6xl text-[var(--foreground)] leading-tight mb-6 tracking-tight">
            Audio to insight,
            <br />
            <span className="text-blue-400">structured.</span>
          </h1>
          <p className="text-base text-[var(--muted-foreground)] max-w-xl mx-auto mb-10 leading-relaxed">
            Record or upload audio. Meenoore transcribes and generates clean,
            structured summaries — discussion topics with nested key points —
            ready to archive, tag, and revisit.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate('/sign-up')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-medium text-sm rounded transition-colors shadow-lg shadow-blue-900/30">
              Start recording
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--border)] px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-widest mb-8 text-center">
            Core capabilities
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]"
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset' }}>
                <div className="text-blue-400 mb-3">{f.icon}</div>
                <h3 className="font-mono font-semibold text-sm text-[var(--foreground)] mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack footer */}
      <footer className="border-t border-[var(--border)] px-8 py-6 flex items-center justify-between">
        <span className="font-mono text-[10px] text-[var(--muted-foreground)] tracking-wider">
          © 2026 MEENOORE
        </span>
        <div className="flex gap-4 items-center">
          {['React', 'TypeScript', 'Tailwind', 'Hugging Face', 'Gemini'].map(
            (tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                {tech}
              </span>
            ),
          )}
        </div>
      </footer>
    </div>
  );
}
