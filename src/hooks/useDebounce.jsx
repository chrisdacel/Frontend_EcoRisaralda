import { useState, useEffect } from 'react';

/**
 * Hook personalizado para retrasar la actualización de un valor
 * de texto (ideal para no saturar búsquedas).
 * @param {any} value - El estado que queremos "debouncear" (ej: texto tecleado)
 * @param {number} delay - Milisegundos a esperar (ej: 500)
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Instalamos un temporizador que actualizará el debouncedValue
    // solo si dejamos de recibir el 'value' antes de que el delay termine.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si el usuario presiona otra tecla antes del delay,
    // este return limpia el temporizador anterior y comienza uno nuevo.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el usuario escribe o el delay cambia

  return debouncedValue;
}
