import { useEffect, useState } from 'react';
import { initializeCsrfToken, requestPasswordReset } from './services/api';
import Alert from './components/Alert';

export default function ForgotPasswordPage({ onNavigateLogin, onNavigateRegister }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    initializeCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const message = await requestPasswordReset(email.trim());
      setSuccess(message || 'Te enviamos el enlace de recuperación a tu correo.');
    } catch (err) {
      const msg = err?.message || err?.error || 'No se pudo enviar el enlace';
      setError(typeof msg === 'string' ? msg : 'No se pudo enviar el enlace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white overflow-x-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10">
        {/* Lado izquierdo: mensaje/branding */}
        <div className="hidden flex-1 md:flex md:flex-col md:pr-10">
          <span className="text-emerald-300/80 text-xs tracking-[0.4em]">ECOTURISMO</span>
          <h1 className="mt-6 text-5xl leading-tight font-semibold">
            Recupera tu acceso y vuelve a explorar experiencias sostenibles.
          </h1>
          <p className="mt-4 max-w-xl text-emerald-100/80">
            Enviaremos un enlace seguro a tu correo (Mailtrap) para que puedas restablecer tu contraseña.
          </p>
        </div>

        {/* Lado derecho: formulario */}
        <div className="w-full md:w-[420px]">
          <div className="rounded-lg bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Recuperar contraseña</h2>
              <p className="mt-1 text-sm text-emerald-100/80">Ingresa tu correo y te enviaremos el enlace</p>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-emerald-100">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60 disabled:opacity-60"
                  placeholder="tu@correo.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
              >
                {loading ? 'Enviando…' : 'Enviar enlace'}
              </button>

              <p className="text-center text-sm text-emerald-100/80">
                ¿Recordaste tu contraseña?{' '}
                <button type="button" onClick={onNavigateLogin} className="underline underline-offset-4 hover:text-emerald-100">Inicia sesión</button>
              </p>

              <p className="text-center text-xs text-emerald-100/70">
                ¿No tienes cuenta?{' '}
                <button type="button" onClick={onNavigateRegister} className="underline underline-offset-4 hover:text-emerald-100">Crea una cuenta</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
