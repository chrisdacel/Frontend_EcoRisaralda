import { useState } from 'react';

export default function RegistroTurista1({ onNavigateHome, onNavigateLogin, onNavigateNext }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80">
            <img loading="lazy" src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-10 w-10" />
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
          <img loading="lazy" src="/images/roles/menu-alt-2-svgrepo-com.webp" alt="Menu" className="h-8 w-8 md:hidden" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 pt-20 md:gap-8">
        {/* Título */}
        <div className="w-full max-w-[35vw] md:max-w-none">
          <p className="text-left text-xs text-gray-600 md:text-sm">Paso 1 de 2</p>
          <h1 className="text-left text-2xl font-bold text-[#267E1B] md:text-4xl">Crea tu cuenta</h1>
        </div>

        {/* Email Input */}
        <div className="w-full max-w-[35vw] flex flex-col md:max-w-none">
          <label className="mb-1 text-left text-xs text-gray-600 md:text-sm">Correo Electrónico</label>
          <input
            type="email"
            placeholder="Ingrese su correo"
            className="rounded-md border border-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:w-[35vw] md:py-2.5"
          />
        </div>

        {/* Password Input */}
        <div className="w-full max-w-[35vw] flex flex-col md:max-w-none">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-gray-600 md:text-sm">Contraseña</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-end"
            >
              <img loading="lazy"
                src="/images/register_turista/view-svgrepo-com.webp"
                alt="Ver contraseña"
                className="h-5 w-5"
              />
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingrese su contraseña"
            className="rounded-md border border-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:w-[35vw] md:py-2.5"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="w-full max-w-[35vw] flex flex-col md:max-w-none">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-gray-600 md:text-sm">Confirme su contraseña</label>
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="flex items-end"
            >
              <img loading="lazy"
                src="/images/register_turista/view-svgrepo-com.webp"
                alt="Ver contraseña"
                className="h-5 w-5"
              />
            </button>
          </div>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Vuelva a ingresar su contraseña"
            className="rounded-md border border-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#267E1B] md:w-[35vw] md:py-2.5"
          />
        </div>

        {/* Password Requirements */}
        <div className="w-full max-w-[35vw] text-left md:max-w-none">
          <p className="mb-2 text-xs text-gray-600 md:text-sm">Tu contraseña debe incluir</p>
          <ul className="list-inside list-disc space-y-1 text-xs text-gray-600 md:text-sm">
            <li>Entre 8 y 64 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un dígito</li>
            <li>Opcional: Caracteres especiales como @ ? # $ % ( ) _ = * \ : ; ' . / + &lt; &gt; &amp; ¿ ,[</li>
          </ul>
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
          disabled={!formData.terminos || !formData.privacidad}
          className="w-full max-w-[35vw] rounded-md bg-[#267E1B] py-2.5 text-sm font-semibold text-white transition-all hover:border hover:border-[#267E1B] hover:bg-white hover:text-[#267E1B] disabled:opacity-50 md:max-w-none"
        >
          Finalizar
        </button>
      </main>
    </div>
  );
}
