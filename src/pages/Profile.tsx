import { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import Button from '../components/Button';

import { useGetCurrentUser } from '../users/hooks/use-get-currentUser.hook';
import { useUpdateUser } from '../users/hooks/use-update-user.hook';
import { useUpdatePassword } from '../users/hooks/use-update-password.hook';

import { getTags } from '../tags/services/tags.service';
import { getFavourites } from '../sessions/services/favourite.service';
import { getSessions } from '../sessions/services/sessions.service';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from '../auth/hooks/use-sign-out.hook';
import ConfirmSignOut from '../components/ConfirmSignOut';
import { useAuth } from '../auth/context/AuthContext';

export default function Profile() {
  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useGetCurrentUser();

  const {
    update,
    loading: updateLoading,
    error: updateError,
    clearError: clearUpdateError,
  } = useUpdateUser();

  const {
    update: updatePassword,
    loading: passwordLoading,
    error: passwordError,
    clearError: clearPasswordError,
  } = useUpdatePassword();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [totalSessions, setTotalSessions] = useState(0);

  const [totalFav, setTotalFav] = useState(0);

  const [totalTags, setTotalTags] = useState(0);

  const [statsLoading, setStatsLoading] = useState(true);

  const [statsError, setStatsError] = useState<string | null>(null);

  // --------------------------------
  // Profile edit
  // --------------------------------

  const [editingProfile, setEditingProfile] = useState(false);

  const [draftName, setDraftName] = useState('');

  const [draftEmail, setDraftEmail] = useState('');

  const [saved, setSaved] = useState(false);

  // --------------------------------
  // Password edit
  // --------------------------------

  const [editingPassword, setEditingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordValidationError, setPasswordValidationError] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  const { logout, loading: signingOut, error: signOutError } = useSignOut();

  const { clearUser } = useAuth();

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setDraftName(user.name);
      setDraftEmail(user.email);
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // --------------------------------
  // Fetch statistics
  // --------------------------------

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);

        const [sessionsResponse, favouriteResponse, tagsResponse] =
          await Promise.all([getSessions(), getFavourites(), getTags()]);

        setTotalSessions(sessionsResponse.meta.total);

        setTotalFav(favouriteResponse.data.length);

        setTotalTags(tagsResponse.length);
      } catch (err: any) {
        console.error('Failed to fetch profile statistics:', err);

        const message =
          err.response?.data?.message || 'Gagal mengambil statistik profile.';

        if (Array.isArray(message)) {
          setStatsError(message.join(', '));
        } else {
          setStatsError(message);
        }
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --------------------------------
  // Profile editing
  // --------------------------------

  const handleStartEditProfile = () => {
    if (!user) return;

    clearUpdateError();

    setDraftName(user.name);
    setDraftEmail(user.email);

    setEditingProfile(true);
    setSaved(false);
  };

  const handleCancelEditProfile = () => {
    if (!user) return;

    clearUpdateError();

    setDraftName(user.name);
    setDraftEmail(user.email);

    setEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!user || updateLoading) return;

    const trimmedName = draftName.trim();
    const trimmedEmail = draftEmail.trim();

    if (!trimmedName) {
      return;
    }

    if (!trimmedEmail) {
      return;
    }

    const hasNameChanged = trimmedName !== user.name;

    const hasEmailChanged = trimmedEmail !== user.email;

    if (!hasNameChanged && !hasEmailChanged) {
      setEditingProfile(false);
      return;
    }

    const result = await update(user.id, {
      name: trimmedName,
      email: trimmedEmail,
    });

    if (!result) return;

    setDraftName(result.name);
    setDraftEmail(result.email);
    setName(result.name);
    setEmail(result.email);

    setEditingProfile(false);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  // --------------------------------
  // Password editing
  // --------------------------------

  const handleStartEditPassword = () => {
    clearPasswordError();

    setPasswordValidationError(null);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setEditingPassword(true);
  };

  const handleCancelEditPassword = () => {
    clearPasswordError();

    setPasswordValidationError(null);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setEditingPassword(false);
  };

  const handleSavePassword = async () => {
    if (!user || passwordLoading) return;

    setPasswordValidationError(null);
    clearPasswordError();

    if (!currentPassword) {
      setPasswordValidationError('Current password is required.');
      return;
    }

    if (!newPassword) {
      setPasswordValidationError('New password is required.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordValidationError('New password must be at least 8 characters.');
      return;
    }

    if (!confirmPassword) {
      setPasswordValidationError('Please confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordValidationError(
        'New password and confirmation password do not match.',
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordValidationError(
        'New password must be different from your current password.',
      );
      return;
    }

    const success = await updatePassword(user.id, {
      currentPassword,
      newPassword,
    });

    if (!success) return;

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setEditingPassword(false);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleConfirmSignOut = async () => {
    try {
      await logout();

      clearUser();

      navigate('/sign-in', {
        replace: true,
      });
    } catch {
      // Tetap di halaman Profile jika logout gagal.
    }
  };

  // --------------------------------
  // Initial
  // --------------------------------

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  const stats = [
    {
      label: 'Sessions',
      value: totalSessions,
    },
    {
      label: 'Favourites',
      value: totalFav,
    },
    {
      label: 'Tags',
      value: totalTags,
    },
  ];

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <Layout>
      <div className="px-8 py-8 max-w-2xl mx-auto">
        <h1 className="font-mono font-bold text-xl text-[var(--foreground)] mb-8">
          Profile
        </h1>

        {/* Loading */}
        {userLoading && (
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <p className="text-sm font-mono text-[var(--muted-foreground)]">
              Loading profile...
            </p>
          </div>
        )}

        {/* User error */}
        {!userLoading && userError && (
          <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10">
            <p className="text-xs font-mono text-red-400">{userError}</p>
          </div>
        )}

        {/* Profile */}
        {!userLoading && user && (
          <>
            {/* Avatar + stats */}
            <div
              className="flex items-start gap-6 mb-8 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset',
              }}>
              {/* Avatar */}
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-bold text-xl text-blue-400">
                    {initials}
                  </span>
                </div>
              )}

              {/* User information */}
              <div className="flex-1 min-w-0">
                <h2 className="font-mono font-bold text-base text-[var(--foreground)] mb-0.5 truncate">
                  {user.name}
                </h2>

                <p className="text-xs font-mono text-[var(--muted-foreground)] mb-4 truncate">
                  {user.email}
                </p>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-mono font-bold text-xl text-[var(--foreground)]">
                        {statsLoading ? '—' : stat.value}
                      </p>

                      <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistics error */}
            {statsError && (
              <p className="mb-4 text-xs font-mono text-red-400">
                {statsError}
              </p>
            )}

            {/* Account settings */}
            <div className="space-y-4">
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
                Account settings
              </p>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden divide-y divide-[var(--border)]">
                {/* -------------------------------- */}
                {/* Display name + Email */}
                {/* -------------------------------- */}

                <div className="p-4">
                  {!editingProfile ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0 space-y-4">
                        {/* Display name */}
                        <div>
                          <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                            Display name
                          </p>

                          <p className="text-sm font-mono text-[var(--foreground)] truncate">
                            {name}
                          </p>
                        </div>

                        {/* Email */}
                        <div>
                          <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                            Email
                          </p>

                          <p className="text-sm font-mono text-[var(--foreground)] truncate">
                            {email}
                          </p>
                        </div>
                      </div>

                      <Button
                        title="Edit"
                        action={handleStartEditProfile}
                        type="edit"
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Display name input */}
                      <div>
                        <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                          Display name
                        </p>

                        <input
                          autoFocus
                          value={draftName}
                          onChange={(event) => setDraftName(event.target.value)}
                          disabled={updateLoading}
                          className="w-full px-3 py-2 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-50"
                        />
                      </div>

                      {/* Email input */}
                      <div>
                        <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                          Email
                        </p>

                        <input
                          type="email"
                          value={draftEmail}
                          onChange={(event) =>
                            setDraftEmail(event.target.value)
                          }
                          disabled={updateLoading}
                          className="w-full px-3 py-2 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-50"
                        />
                      </div>

                      {/* Update error */}
                      {updateError && (
                        <p className="text-xs font-mono text-red-400">
                          {updateError}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={
                            updateLoading ||
                            !draftName.trim() ||
                            !draftEmail.trim()
                          }
                          className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          {updateLoading ? 'Saving...' : 'Save changes'}
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelEditProfile}
                          disabled={updateLoading}
                          className="text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* -------------------------------- */}
                {/* Password */}
                {/* -------------------------------- */}

                <div className="p-4">
                  {!editingPassword ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                          Password
                        </p>

                        <p className="text-sm font-mono text-[var(--foreground)]">
                          ••••••••••••
                        </p>
                      </div>

                      <Button
                        title="Edit"
                        action={handleStartEditPassword}
                        type="edit"
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Current password */}
                      <div>
                        <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                          Current password
                        </p>

                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(event) =>
                            setCurrentPassword(event.target.value)
                          }
                          disabled={passwordLoading}
                          autoComplete="current-password"
                          className="w-full px-3 py-2 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-50"
                        />
                      </div>

                      {/* New password */}
                      <div>
                        <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                          New password
                        </p>

                        <input
                          type="password"
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                          disabled={passwordLoading}
                          autoComplete="new-password"
                          className="w-full px-3 py-2 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-50"
                        />
                      </div>

                      {/* Confirm password */}
                      <div>
                        <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                          Confirm new password
                        </p>

                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          disabled={passwordLoading}
                          autoComplete="new-password"
                          className="w-full px-3 py-2 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-50"
                        />
                      </div>

                      {/* Password validation error */}
                      {passwordValidationError && (
                        <p className="text-xs font-mono text-red-400">
                          {passwordValidationError}
                        </p>
                      )}

                      {/* API error */}
                      {passwordError && (
                        <p className="text-xs font-mono text-red-400">
                          {passwordError}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={handleSavePassword}
                          disabled={passwordLoading}
                          className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          {passwordLoading ? 'Saving...' : 'Save password'}
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelEditPassword}
                          disabled={passwordLoading}
                          className="text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved notification */}
              {saved && (
                <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Changes saved
                </p>
              )}

              {/* Sign out */}
              <div className="pt-4">
                <Button
                  title="SignOut"
                  type="delete"
                  size="sm"
                  action={() => setShowSignOutConfirm(true)}
                />
              </div>
            </div>
          </>
        )}
        <ConfirmSignOut
          open={showSignOutConfirm}
          loading={signingOut}
          error={signOutError}
          onClose={() => setShowSignOutConfirm(false)}
          onConfirm={() => void handleConfirmSignOut()}
        />
      </div>
    </Layout>
  );
}
