import { useState } from 'react';

export default function RegistroTurista2({ onNavigateHome, onNavigateLogin, onNavigatePreferencias }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    pais: '',
    mes: '',
    dia: '',
    anio: '',
    terminos: false,
    privacidad: false
  });
  const [ageError, setAgeError] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 33 }, (_, i) => 2025 - i);

  const calculateAge = (year, month, day) => {
    if (!year || !month || !day) return null;
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateAge = () => {
    const age = calculateAge(formData.anio, formData.mes, formData.dia);
    if (age !== null && age < 16) {
      setAgeError('Debes ser mayor de 16 años para registrarte');
      return false;
    }
    setAgeError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAge()) return;
    if (formData.terminos && formData.privacidad) {
      onNavigatePreferencias();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80">
            <img loading="lazy" src="/images/datos_turista/nature-svgrepo-com.svg" alt="Logo" className="h-10 w-10" />
            <div>
              <div className="flex gap-1 leading-none">
                <h3 className="text-lg font-semibold">Conexion</h3>
                <h5 className="text-sm font-semibold text-gray-600">EcoRisaralda</h5>
              </div>
              <p className="text-xs text-gray-600">Turista</p>
            </div>
          </button>
          
          <button
            onClick={onNavigateLogin}
            className="hidden rounded-md border border-gray-300 bg-[#267E1B] px-6 py-2 text-sm font-semibold text-white hover:bg-white hover:text-[#267E1B] md:block"
          >
            ¿Ya tienes una cuenta?
          </button>

          {/* Mobile Dropdown */}
          <img loading="lazy" src="/images/datos_turista/menu-alt-2-svgrepo-com.webp" alt="Menu" className="h-8 w-8 md:hidden" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-20 md:gap-6">
        {/* Título */}
        <div className="w-full max-w-[35vw] md:max-w-none">
          <button
            onClick={onNavigateHome}
            className="mb-2 text-left text-xs text-gray-600 hover:underline md:text-sm"
          >
            &lt; Regresar
          </button>
          <h1 className="text-left text-xl font-medium text-[#267E1B] md:text-2xl">Cuéntanos un poco más sobre ti</h1>
        </div>

        {/* Nombre */}
        <div className="w-full max-w-[35vw] flex flex-col md:max-w-none">
          <label className="mb-1 text-left text-xs text-gray-600 md:text-sm">Nombre</label>
          <input
            type="text"
            placeholder="Ingrese su nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="rounded-md border border-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:w-[35vw]"
          />
        </div>

        {/* Apellido */}
        <div className="w-full max-w-[35vw] flex flex-col md:max-w-none">
          <label className="mb-1 text-left text-xs text-gray-600 md:text-sm">Apellido</label>
          <input
            type="text"
            placeholder="Ingrese su apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            className="rounded-md border border-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:w-[35vw]"
          />
        </div>

        {/* País */}
        <div className="w-full max-w-[35vw] flex flex-col md:max-w-none">
          <label className="mb-1 text-left text-xs text-gray-600 md:text-sm">País donde reside</label>
          <select
            value={formData.pais}
            onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
            className="rounded-md border border-gray-500 px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:w-[35vw]"
          >
            <option value="">Seleccionar</option>
            <option value="Colombia">Colombia</option>
            <option value="Perú">Perú</option>
          </select>
        </div>

        {/* Fecha de Nacimiento */}
        <div className="w-full max-w-[35vw] flex flex-col md:max-w-none">
          <label className="mb-1 text-left text-xs text-gray-600 md:text-sm">Fecha de nacimiento</label>
          <div className="flex gap-2 md:gap-3">
            <select
              value={formData.mes}
              onChange={(e) => {
                const newFormData = { ...formData, mes: e.target.value };
                setFormData(newFormData);
                const age = calculateAge(newFormData.anio, newFormData.mes, newFormData.dia);
                if (age !== null && age < 16) {
                  setAgeError('Debes ser mayor de 16 años para registrarte');
                } else {
                  setAgeError('');
                }
              }}
              className="flex-1 rounded-md border border-gray-500 px-2 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:text-sm"
            >
              <option value="">Mes</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>

            <select
              value={formData.dia}
              onChange={(e) => {
                const newFormData = { ...formData, dia: e.target.value };
                setFormData(newFormData);
                const age = calculateAge(newFormData.anio, newFormData.mes, newFormData.dia);
                if (age !== null && age < 16) {
                  setAgeError('Debes ser mayor de 16 años para registrarte');
                } else {
                  setAgeError('');
                }
              }}
              className="flex-1 rounded-md border border-gray-500 px-2 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:text-sm"
            >
              <option value="">Día</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <select
              value={formData.anio}
              onChange={(e) => {
                const newFormData = { ...formData, anio: e.target.value };
                setFormData(newFormData);
                const age = calculateAge(newFormData.anio, newFormData.mes, newFormData.dia);
                if (age !== null && age < 16) {
                  setAgeError('Debes ser mayor de 16 años para registrarte');
                } else {
                  setAgeError('');
                }
              }}
              className="flex-1 rounded-md border border-gray-500 px-2 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:text-sm"
            >
              <option value="">Año</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {ageError && (
            <p className="mt-1 text-xs text-red-600">{ageError}</p>
          )}
        </div>

        {/* Términos y Condiciones */}
        <div className="flex w-full max-w-[35vw] flex-col gap-2 md:max-w-none">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terminos"
              checked={formData.terminos}
              onChange={(e) => setFormData({ ...formData, terminos: e.target.checked })}
              className="mt-1 h-3 w-3"
            />
            <label htmlFor="terminos" className="text-xs text-gray-600 md:text-sm">
              He leído y acepto los{' '}
              <a href="#" className="text-[#267E1B] hover:underline">
                Términos y condiciones
              </a>
              {' '}de Conexión EcoRisaralda
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="privacidad"
              checked={formData.privacidad}
              onChange={(e) => setFormData({ ...formData, privacidad: e.target.checked })}
              className="mt-1 h-3 w-3"
            />
            <label htmlFor="privacidad" className="text-xs text-gray-600 md:text-sm">
              He leído y aceptado la{' '}
              <a href="#" className="text-[#267E1B] hover:underline">
                política de privacidad
              </a>
              {' '}de Conexión EcoRisaralda
            </label>
          </div>
        </div>

        {/* Finalizar Button */}
        <button
          onClick={handleSubmit}
          disabled={!formData.terminos || !formData.privacidad || ageError !== ''}
          className="w-full max-w-[35vw] rounded-md bg-[#267E1B] py-2.5 text-sm font-semibold text-white transition-all hover:border hover:border-[#267E1B] hover:bg-white hover:text-[#267E1B] disabled:opacity-50 md:max-w-none"
        >
          Finalizar
        </button>
      </main>
    </div>
  );
}
