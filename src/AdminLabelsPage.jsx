import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminPreference, deleteAdminPreference, getAdminPreferences, updateAdminPreference } from './services/adminApi';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Pagination from './components/Pagination';

const defaultForm = { name: '', color: '' };

export default function AdminLabelsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [labels, setLabels] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false });
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAdminPreferences();
      setLabels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Error cargando etiquetas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const normalizeColor = (value) => {
    if (!value) return '';
    return value.startsWith('#') ? value : `#${value}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.color) {
      setError('Completa nombre y color');
      return;
    }

    const payload = {
      name: form.name.trim(),
      image: '',
      color: normalizeColor(form.color.trim()).replace('#', ''),
    };

    try {
      setSaving(true);
      if (editingId) {
        await updateAdminPreference(editingId, payload);
        setSuccess('Etiqueta actualizada');
      } else {
        await createAdminPreference(payload);
        setSuccess('Etiqueta creada');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err?.message || 'Error guardando etiqueta');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (label) => {
    setEditingId(label.id);
    setForm({ name: label.name || '', color: label.color || '' });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    setConfirmState({
      open: true,
      title: 'Eliminar etiqueta',
      message: '¿Eliminar esta etiqueta? Esta accion no se puede deshacer.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await deleteAdminPreference(id);
          setLabels((prev) => prev.filter((item) => item.id !== id));
          setError('');
        } catch (err) {
          setError(err?.message || 'Error eliminando etiqueta');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(labels.length / ITEMS_PER_PAGE);
  const currentLabels = labels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestionar etiquetas</h1>
              <p className="text-sm text-slate-600">Crea, edita o elimina etiquetas para clasificar los sitios.</p>
            </div>
          </div>
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

          <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2"
                  placeholder="Ej: Senderismo (hiking)"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Color (hex)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={normalizeColor(form.color || '#10b981')}
                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value.replace('#', '') }))}
                    className="color-circle h-10 w-10 rounded-full border border-emerald-200"
                    aria-label="Seleccionar color"
                  />
                  <input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-emerald-200 px-3 py-2"
                    placeholder="Ej: FF6B6B"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>

          {loading ? (
            <div className="text-sm text-slate-600">Cargando etiquetas...</div>
          ) : (
            <div className="w-full bg-white border-b border-slate-200 rounded-lg overflow-hidden md:max-w-6xl md:mx-auto">
              <table className="w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-2 py-2 text-left text-slate-700 uppercase tracking-wider text-xs whitespace-nowrap md:px-6">Nombre</th>
                    <th className="px-2 py-2 text-left text-slate-700 uppercase tracking-wider text-xs whitespace-nowrap md:px-6">Color</th>
                    <th className="px-2 py-2 text-left text-slate-700 uppercase tracking-wider text-xs whitespace-nowrap md:px-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentLabels.map((label) => (
                    <tr key={label.id} className="hover:bg-slate-50">
                      <td className="px-2 py-2 text-slate-800 break-words max-w-[120px] md:px-6 md:max-w-none">{label.name}</td>
                      <td className="px-2 py-2 md:px-6">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: `#${label.color}` }}
                          />
                          <span className="text-slate-600">#{label.color}</span>
                        </span>
                      </td>
                      <td className="px-2 py-2 md:px-6">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEdit(label)}
                            className="rounded-full border border-emerald-200 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(label.id)}
                            className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-700 hover:bg-rose-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {labels.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-6 text-center text-slate-600">No hay etiquetas registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {labels.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
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
