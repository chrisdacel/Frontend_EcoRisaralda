import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Componente interactivo para buscador con Debounce y listado de sugerencias.
 *
 * @param {Function} onSearch - Función que se ejecuta cuando el debounce lanza la búsqueda
 * @param {Array} suggestions - Lista de resultados sugeridos para el dropdown
 * @param {Function} onSelectSuggestion - Función al hacer clic en un elemento del dropdown
 */
export default function SearchBar({ onSearch, suggestions = [], onSelectSuggestion }) {
  const [localText, setLocalText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Activamos el motor Debounce (espera 400ms tras dejar de escribir)
  const debouncedText = useDebounce(localText, 400);

  // Cada vez que el debounce diga "ya terminó de escribir", avisar a ColeccionPage
  useEffect(() => {
    onSearch(debouncedText);
  }, [debouncedText, onSearch]);

  // Si damos clic fuera del cuadro flotante del buscador, se cierra el menú de sugerencias
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setLocalText(e.target.value);
    setShowDropdown(true); // Abrir el dropdown tan pronto como teclee
  };

  const handleSelect = (item) => {
    setLocalText(item.nombre); // Autocompletar el campo con el nombre elegido
    setShowDropdown(false);    // Ocultar caja de sugerencias
    if (onSelectSuggestion) onSelectSuggestion(item);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input de Buscador (Tu HTML y CSS exacto original) */}
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 w-full min-h-[44px] shadow-sm">
        <svg
          className="h-4 w-4 text-emerald-500 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m1.6-4.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z"
          />
        </svg>
        <input
          type="text"
          value={localText}
          onChange={handleInputChange}
          onFocus={() => {
            if (localText.trim().length > 0) setShowDropdown(true);
          }}
          placeholder="Buscar destinos, sitios maravillosos..."
          className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
        />
      </div>

      {/* Caja Flotante de Sugerencias (El Dropdown interactivo) */}
      {showDropdown && localText.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg ring-1 ring-slate-200/60 overflow-hidden z-[99] max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
          {suggestions.length > 0 ? (
            <ul className="py-2">
              <li className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sugerencias
              </li>
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate w-3/4">{item.nombre}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full inline-block truncate max-w-[80px]">
                      {item.clima || 'Sitio'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-slate-500 text-center">
              No se encontraron coincidencias para "{localText}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}