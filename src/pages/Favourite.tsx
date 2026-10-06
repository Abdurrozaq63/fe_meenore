import Layout from '../components/Layout';
import SessionCard from '../components/SessionCard';

import { useGetFavourites } from '../sessions/hooks/use-get-favourites.hook';

export default function Favourite() {
  const { favourites, loading, error } = useGetFavourites();

  return (
    <Layout>
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-mono font-bold text-xl text-[var(--foreground)] mb-1">
            Favourites
          </h1>

          {!loading && !error && (
            <p className="text-xs font-mono text-[var(--muted-foreground)]">
              {favourites.length} starred session
              {favourites.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--muted-foreground)] font-mono">
            <p className="text-sm">Loading favourite sessions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-[var(--muted-foreground)] font-mono">
            <p className="text-sm text-red-400">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 text-xs underline hover:text-[var(--foreground)] transition-colors">
              Try again
            </button>
          </div>
        ) : favourites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favourites.map((session) => (
              <SessionCard key={session.id} data={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--muted-foreground)] font-mono">
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              className="mx-auto mb-4 opacity-20">
              <path
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>

            <p className="text-sm">No favourited sessions yet.</p>

            <p className="text-xs mt-1 text-[var(--muted-foreground)]/60">
              Star a session from its detail page.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
