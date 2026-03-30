import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { login } from './services/api';
import Alert from './components/Alert';

function LoginPage({ onNavigateHome, onNavigateRegister, onNavigateForgot, onNavigatePreferences }) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      setUser(user);
      setEmail('');
      setPassword('');
      
      onNavigateHome();
    } catch (err) {
      const msg = err?.message || err?.error || 'Credenciales inválidas';
      setError(typeof msg === 'string' ? msg : 'Error en inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white overflow-x-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10">
        {/* Lado izquierdo: mensaje/branding */}
        <div className="hidden flex-1 md:flex md:flex-col md:pr-4 lg:pr-10">
          <span className="text-emerald-300/80 text-xs tracking-[0.4em]">ECOTURISMO</span>
          <h1 className="mt-4 lg:mt-6 text-3xl lg:text-5xl leading-tight font-semibold">
            Explora destinos sostenibles y conecta con la naturaleza.
          </h1>
          <p className="mt-3 lg:mt-4 max-w-xl text-sm lg:text-base text-emerald-100/80">
            Accede con tu cuenta para descubrir rutas verdes, alojamientos responsables y experiencias locales.
          </p>
        </div>

        {/* Lado derecho: formulario */}
        <div className="w-full md:w-[420px]">
          <div className="rounded-lg bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
              <p className="mt-1 text-sm text-emerald-100/80">Bienvenido de nuevo</p>
            </div>

            {error && (
              <Alert type="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-emerald-100">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-xs text-emerald-200 hover:text-emerald-100"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  disabled={loading}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60 disabled:opacity-60"
                  placeholder="••••••••"
                />
                <div className="mt-2 text-right text-xs text-emerald-200">
                  <button
                    type="button"
                    onClick={onNavigateForgot}
                    className="underline underline-offset-4 hover:text-emerald-100"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
              >
                {loading ? 'Iniciando…' : 'Entrar'}
              </button>

              <p className="text-center text-sm text-emerald-100/80">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={onNavigateRegister}
                  className="underline underline-offset-4 hover:text-emerald-100"
                >
                  Crea tu cuenta
                </button>
              </p>

              <p className="text-center text-xs text-emerald-100/70">
                Al continuar aceptas nuestros Términos y Política de privacidad
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
