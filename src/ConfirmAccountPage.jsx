import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { initializeCsrfToken, resendVerificationEmail } from './services/api';

export default function ConfirmAccountPage({ onNavigateHome, onNavigateLogin }) {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const emailToVerify = location.state?.email || user?.email;

  useEffect(() => {
    initializeCsrfToken();
  }, []);

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const msg = await resendVerificationEmail(emailToVerify);
      setSuccess(msg || 'Correo de verificación enviado');
    } catch (err) {
      const msg = err?.message || err?.error || 'No se pudo reenviar el correo';
      setError(typeof msg === 'string' ? msg : 'No se pudo reenviar el correo');
    } finally {
      setLoading(false);
    }
  };

  const maskedEmail = emailToVerify || 'tu correo';

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white overflow-x-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10">
        <div className="hidden flex-1 md:flex md:flex-col md:pr-10">
          <span className="text-emerald-300/80 text-xs tracking-[0.4em]">ECOTURISMO</span>
          <h1 className="mt-6 text-5xl leading-tight font-semibold">Confirma tu cuenta para empezar.</h1>
          <p className="mt-4 max-w-xl text-emerald-100/80">
            Te enviamos un enlace de verificación a {maskedEmail}. Ábrelo desde Mailtrap y confirma tu correo para activar la cuenta.
          </p>
        </div>

        <div className="w-full md:w-[460px]">
          <div className="rounded-lg bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Revisa tu correo</h2>
              <p className="mt-1 text-sm text-emerald-100/80">Si no lo ves, reenvía el enlace</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-emerald-100/80">
                Usa el enlace que llegó a tu correo. Si expiró o no lo encuentras, reenvíalo con el botón.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleResend}
                className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
              >
                {loading ? 'Enviando…' : 'Reenviar enlace de verificación'}
              </button>

              <div className="flex items-center justify-between text-sm text-emerald-100/70">
                <button type="button" onClick={onNavigateLogin} className="underline underline-offset-4 hover:text-emerald-100">Ir a iniciar sesión</button>
                <button type="button" onClick={onNavigateHome} className="underline underline-offset-4 hover:text-emerald-100">Volver al inicio</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
