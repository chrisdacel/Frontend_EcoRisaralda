import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile, changePassword, uploadAvatar, deleteAvatar, deleteAccount, logout, login } from './services/api';
import { useAuth } from './context/AuthContext';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';

export default function ProfilePageOperador() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({ name: '', last_name: '', email: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false });
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [inlinePasswordError, setInlinePasswordError] = useState('');

  const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchProfile();
      setProfile({
        name: data.name || '',
        last_name: data.last_name || '',
        email: data.email || '',
      });
      if (data.avatar_url) setAvatarUrl(data.avatar_url);
      setError('');
    } catch (err) {
      setError(err.message || 'Error cargando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setError('');
      setSuccess('');
      const updated = await updateProfile(profile);
      // Preservar avatar_url del user actual si el backend no lo incluye
      setUser({ ...updated, avatar_url: updated.avatar_url || user?.avatar_url });
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.message || 'No se pudo actualizar');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      setError('');
      setSuccess('');
      const result = await uploadAvatar(file);
      setAvatarUrl(result.avatar_url);
      // Actualizar el usuario en el contexto con los datos actualizados
      if (result.user) {
        const updatedUser = { ...result.user, avatar_url: result.avatar_url };
        setUser(updatedUser);
      }
      setSuccess('Foto actualizada correctamente');
    } catch (err) {
      setError(err.message || 'No se pudo subir la foto');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadingAvatar(true);
      setError('');
      setSuccess('');
      const result = await deleteAvatar();
      setAvatarUrl('');
      setUser({ ...result.user, avatar_url: null });
      setSuccess('Foto eliminada');
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la foto');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setConfirmState({
      open: true,
      title: 'Eliminar cuenta',
      message: '¿Eliminar tu cuenta? Esta accion no se puede deshacer.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          setDeletingAccount(true);
          setDeleteError('');
          await deleteAccount(deletePassword);
          setUser(null);
          navigate('/login');
        } catch (err) {
          setDeleteError(err.message || 'No se pudo eliminar la cuenta');
        } finally {
          setDeletingAccount(false);
          setConfirmState({ open: false });
        }
      },
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const pwd = passwords.password;
    if (pwd.length < 8 || pwd.length > 64) {
      setPasswordError('La contraseña debe tener entre 8 y 64 caracteres');
      setPasswordSuccess('');
      return;
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('La contraseña debe incluir al menos una letra mayúscula');
      setPasswordSuccess('');
      return;
    }
    if (!/[a-z]/.test(pwd)) {
      setPasswordError('La contraseña debe incluir al menos una letra minúscula');
      setPasswordSuccess('');
      return;
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('La contraseña debe incluir al menos un dígito');
      setPasswordSuccess('');
      return;
    }
    if (!/^[A-Za-z0-9@?#$%()_=*\\:;'.\/\+<>¿,\[\]]+$/.test(pwd)) {
      setPasswordError('La contraseña contiene caracteres no permitidos');
      setPasswordSuccess('');
      return;
    }
    if (passwords.password !== passwords.password_confirmation) {
      setPasswordError('La nueva contraseña y la confirmación no coinciden');
      setPasswordSuccess('');
      return;
    }

    try {
      setSavingPass(true);
      setPasswordError('');
      setPasswordSuccess('');
      await changePassword(passwords.current_password, passwords.password, passwords.password_confirmation);
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
      setPasswordSuccess('Contraseña actualizada correctamente');
      // Forzar logout y login con la nueva contraseña para renovar sesión/cookie y evitar bug de eliminación
      setTimeout(async () => {
        try {
          await logout();
          const userEmail = profile.email;
          const user = await login(userEmail, passwords.password);
          setUser(user);
          setPasswordSuccess('Contraseña actualizada y sesión renovada');
        } catch (err) {
          setUser(null);
          navigate('/login');
        }
      }, 1200);
    } catch (err) {
      setPasswordError(err.message || 'No se pudo actualizar la contraseña');
    } finally {
      setSavingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 overflow-x-hidden pt-14">
      <div className="max-w-4xl mx-auto pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-slate-600">Administra tu información y seguridad</p>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert type="success" className="mb-4">
            {success}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="bg-white rounded-lg p-6 ring-1 ring-slate-200 flex flex-col items-center gap-4">
            <div className="relative h-28 w-28 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img loading="lazy" src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                  {profile.name?.charAt(0).toUpperCase() || 'O'}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400"></div>
                </div>
              )}
            </div>
            <label className="inline-flex items-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Cambiar foto
              <input type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp" className="hidden" onChange={handleAvatar} disabled={uploadingAvatar} />
            </label>
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={uploadingAvatar || !avatarUrl}
              className="inline-flex items-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-3h4m-7 3h10" />
              </svg>
              Eliminar foto
            </button>
            <p className="text-xs text-slate-500 text-center">JPG, PNG o GIF (máx. 2MB)</p>
          </div>

          {/* Datos de perfil */}
          <form onSubmit={handleProfileSave} className="bg-white rounded-lg p-6 ring-1 ring-slate-200 space-y-4 lg:col-span-2">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Nombre</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value.slice(0, 50) })}
                maxLength={50}
                required
                className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Máximo 50 caracteres</p>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Apellido</label>
              <input
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg bg-slate-50 px-4 py-2 text-slate-500 ring-1 ring-slate-200 cursor-not-allowed"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
              >
                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-emerald-700">Cambiar contraseña</h2>
          <p className="mt-1 text-sm text-slate-600">Usa tu contraseña actual para establecer una nueva.</p>
          <button
            type="button"
            onClick={() => setShowPasswordForm((prev) => !prev)}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            {showPasswordForm ? 'Ocultar formulario' : 'Cambiar contraseña'}
          </button>
          {passwordError && (
            <div className="mt-4 rounded-lg bg-rose-100 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="mt-4 rounded-lg bg-emerald-100 p-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
              {passwordSuccess}
            </div>
          )}
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  value={passwords.current_password}
                  onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                  required
                  className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={passwords.password}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setPasswords({ ...passwords, password: nextValue });
                    if (!nextValue) {
                      setInlinePasswordError('');
                      return;
                    }
                    if (nextValue.length < 8 || nextValue.length > 64) {
                      setInlinePasswordError('La contraseña debe tener entre 8 y 64 caracteres');
                      return;
                    }
                    if (!/[A-Z]/.test(nextValue)) {
                      setInlinePasswordError('La contraseña debe incluir al menos una letra mayúscula');
                      return;
                    }
                    if (!/[a-z]/.test(nextValue)) {
                      setInlinePasswordError('La contraseña debe incluir al menos una letra minúscula');
                      return;
                    }
                    if (!/[0-9]/.test(nextValue)) {
                      setInlinePasswordError('La contraseña debe incluir al menos un dígito');
                      return;
                    }
                    if (!/^[A-Za-z0-9@?#$%()_=*\\:;'.\/\+<>¿,\[\]]+$/.test(nextValue)) {
                      setInlinePasswordError('La contraseña contiene caracteres no permitidos');
                      return;
                    }
                    setInlinePasswordError('');
                  }}
                  required
                  minLength={8}
                  maxLength={64}
                  className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
                {inlinePasswordError && (
                  <p className="mt-1 text-xs text-rose-600">{inlinePasswordError}</p>
                )}
                <div className="mt-2 text-xs text-slate-600">
                  <p className="mb-1">Tu contraseña debe incluir:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Entre 8 y 64 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un dígito</li>
                    <li>Solo símbolos permitidos: @ ? # $ % ( ) _ = * \ : ; ' . / + &lt; &gt; &amp; ¿ , [ ]</li>
                  </ul>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={passwords.password_confirmation}
                  onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })}
                  required
                  minLength={8}
                  maxLength={64}
                  className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPass}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  {savingPass ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-rose-700">Eliminar cuenta</h2>
          <p className="mt-1 text-sm text-slate-600">Esta acción es permanente. Para continuar, confirma tu contraseña.</p>
          <button
            type="button"
            onClick={() => setShowDeleteForm((prev) => !prev)}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            {showDeleteForm ? 'Ocultar formulario' : 'Eliminar cuenta'}
          </button>
          {deleteError && (
            <div className="mt-4 rounded-lg bg-rose-100 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
              {deleteError}
            </div>
          )}
          {showDeleteForm && (
            <form onSubmit={handleDeleteAccount} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="block text-sm text-slate-700 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-rose-200 focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={deletingAccount || !deletePassword}
                className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
              >
                {deletingAccount ? 'Eliminando...' : 'Eliminar cuenta'}
              </button>
            </form>
          )}
        </section>
      </div>
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        tone={confirmState.tone}
        onClose={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}
