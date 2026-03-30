import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Footer({ onNavigateSobreNosotros, onNavigatePrivacidad, onNavigateQueOfrecemos, onNavigateColeccion, onNavigateLogin, onNavigateInicio }) {
  const { user, logout } = useAuth();
  const handleLoginOrLogout = () => {
    if (user) {
      logout();
    } else {
      if (onNavigateLogin) onNavigateLogin();
      else window.location.href = '/login';
    }
  };
  const handleNavigateInicio = () => {
    // Siempre lleva a '/' sin importar el rol, manteniendo la sesión
    window.location.href = '/';
  };
  return (
    <footer className="border-t border-emerald-100 bg-emerald-50/50 py-12 px-6 text-slate-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-8 md:gap-4 lg:gap-8 text-center lg:text-left justify-items-center lg:justify-items-start">
        {/* Columna 1 */}
        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Conexión</h2>
          <p className="text-slate-700 mb-4">EcoRisaralda</p>
        </div>
        {/* Columna 2 */}
        <div className="md:col-span-3 lg:col-span-1">
          <h4 className="mb-4 font-bold text-slate-900">Información</h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <button onClick={onNavigateQueOfrecemos} className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700">Qué ofrecemos</button>
            </li>
            <li>
              <button onClick={onNavigateSobreNosotros} className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700">Sobre nosotros</button>
            </li>
            <li>
              <button onClick={onNavigatePrivacidad} className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700">Privacidad</button>
            </li>
          </ul>
        </div>
        {/* Columna 3 */}
        <div className="md:col-span-3 lg:col-span-1">
          <h4 className="mb-4 font-bold text-slate-900">Navegación rápida</h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <button onClick={handleNavigateInicio} className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700">Inicio</button>
            </li>
            <li>
              <button onClick={onNavigateColeccion} className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700">Colección</button>
            </li>
            <li>
              <button onClick={handleLoginOrLogout} className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700">
                {user ? 'Cerrar sesión' : 'Iniciar sesión'}
              </button>
            </li>
          </ul>
        </div>
        {/* Columna 4 */}
        <div className="md:col-span-4 lg:col-span-1">
          <h4 className="mb-4 font-bold text-slate-900">Contacto</h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li><a href="mailto:conexion@ecorisaralda.co.com" className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700 break-all lg:break-normal">conexion@ecorisaralda.co.com</a></li>
            <li>+57 314 635 5214</li>
            <li><button onClick={() => window.location.href = '/preguntas-frecuentes'} className="transition-colors duration-200 hover:text-emerald-700 focus:text-emerald-700">Preguntas Frecuentes (FAQ)</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-slate-500">
        <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
        <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
