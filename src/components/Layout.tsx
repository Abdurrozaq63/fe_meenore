import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/archives',
    label: 'Archives',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 3h12v2.5H2V3zM3 5.5v7.5h10V5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 8.5h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    path: '/record',
    label: 'Record',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0V4a2 2 0 0 0-2-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M4 8a4 4 0 0 0 8 0M8 12v2.5M6 14.5h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    path: '/favourite',
    label: 'Favourites',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    path: '/tags',
    label: 'Tags',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M1.5 8.5L8.5 1.5H14v5.5L7 14l-5.5-5.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="11.5" cy="4.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isOnDetail = location.pathname.startsWith('/detail/');

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar */}
      <aside className="flex-shrink-0 w-60 flex flex-col border-r border-[var(--border)] bg-[var(--card)]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <NavLink to="" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-900/50">
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
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition-colors ${
                  isActive || (isOnDetail && item.path === '/archives')
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] border border-transparent'
                }`
              }>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom record CTA */}
        <div className="p-3 border-t border-[var(--border)]">
          <NavLink
            to="/record"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-mono font-medium text-white">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2a2 2 0 00-2 2v3a2 2 0 004 0V4a2 2 0 00-2-2z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3.5 7A3.5 3.5 0 0010.5 7M7 10.5v2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            New Session
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
