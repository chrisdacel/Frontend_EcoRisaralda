import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { fetchPreferencesOptions, fetchUserPreferences, updateUserPreferences } from './services/api';
import Alert from './components/Alert';

export default function PreferencesPage({ onNavigateHome, onNavigateLogin, isFirstTime = false }) {
  const { user, loading: authLoading } = useAuth();
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const [opts, mine] = await Promise.all([
          fetchPreferencesOptions(),
          fetchUserPreferences(),
        ]);
        setOptions(opts);
        setSelected(mine.map((p) => p.id));
      } catch (e) {
        const msg = e?.message || 'No se pudieron cargar las preferencias';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading && user) load();
  }, [authLoading, user]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await updateUserPreferences(selected);
      setSuccess('Preferencias guardadas');
      setTimeout(() => {
        if (isFirstTime) {
          onNavigateHome();
        }
      }, 800);
    } catch (e) {
      const msg = e?.message || 'No se pudieron guardar las preferencias';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <p className="text-emerald-600">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-white px-6">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-8 text-center">
          <p className="mb-4 text-slate-700">Debes iniciar sesion para configurar tus preferencias.</p>
          <button onClick={onNavigateLogin} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Iniciar sesion</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Preferencias
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isFirstTime
                ? 'Selecciona las actividades que mas te interesan para recibir recomendaciones personalizadas.'
                : 'Elige los temas que mas te interesan para recomendarte destinos.'}
            </p>
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

          {loading ? (
            <div className="rounded-2xl border border-emerald-100 bg-white p-8">Cargando opciones...</div>
          ) : (
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggle(opt.id)}
                    className={`flex items-center justify-center text-center rounded-xl px-4 py-5 ring-1 transition min-h-[120px] ${
                      selected.includes(opt.id)
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-white text-slate-700 ring-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="block text-sm font-semibold leading-tight">{opt.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex gap-3 justify-end">
                {!isFirstTime && (
                  <button
                    onClick={onNavigateHome}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
                >
                  {saving ? 'Guardando...' : 'Guardar preferencias'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
