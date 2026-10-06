import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SessionCard from '../components/SessionCard';
import Button from '../components/Button';
import { useSessions } from '../sessions/hooks/get-sessions-list.hook'; // Impor custom hook baru

export default function Archives() {
  const navigate = useNavigate();

  // Panggil custom hook
  const { sessions, loading, error } = useSessions();
  console.log({
    sessions,
    sessionsLength: sessions.length,
    loading,
    error,
  });

  return (
    <Layout>
      <div className="px-8 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-mono font-bold text-xl text-[var(--foreground)] mb-1">
              Session Archive
            </h1>
            <p className="text-xs font-mono text-[var(--muted-foreground)]">
              {loading ? 'Loading...' : `${sessions.length} sessions recorded`}
            </p>
          </div>
          <Button
            title="New Session"
            action={() => navigate('/record')}
            type="create"
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v10M1 6h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </div>

        {/* Kondisi Loading */}
        {loading && (
          <div className="text-center py-20 text-[var(--muted-foreground)] font-mono">
            <p className="text-sm animate-pulse">
              Memuat data sesi dari server...
            </p>
          </div>
        )}

        {/* Kondisi Error */}
        {error && !loading && (
          <div className="text-center py-20 text-red-500 font-mono">
            <p className="text-sm">Terjadi kesalahan: {error}</p>
          </div>
        )}

        {/* Tampilan Grid Utama */}
        {loading === false &&
          !error &&
          (sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} data={session} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[var(--muted-foreground)] font-mono">
              <div className="text-4xl mb-3 opacity-30">⌀</div>
              <p className="text-sm">No sessions recorded yet.</p>
            </div>
          ))}
      </div>
    </Layout>
  );
}
