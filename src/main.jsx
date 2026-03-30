import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { initializeCsrfToken } from './services/api';

// Manejador Global de Imágenes Corruptas
window.addEventListener('error', function(e) {
  const target = e.target;
  // Si el elemento que falló al cargar es un <img>
  if (target && target.tagName === 'IMG') {
    // Prevenir loop infinito
    if (target.dataset.fallback) return;
    target.dataset.fallback = 'true';

    // Obtener texto alt para mostrar
    const altText = target.alt ? target.alt.substring(0, 35) : 'Imagen no disponible';

    // Generar SVG con los colores de la aplicación (emerald)
    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <rect width="100%" height="100%" fill="#ecfdf5" rx="8" ry="8" />
        <g transform="translate(176, 110)">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
            <line x1="3" y1="3" x2="21" y2="21" stroke="#10b981"></line>
          </svg>
        </g>
        <text x="50%" y="185" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="16" fill="#047857" text-anchor="middle" font-weight="600">${altText}</text>
      </svg>
    `;

    // Asignar el SVG generado como Base64 directamente a la imagen
    target.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgCode)));
    
    // Asegurar que la imagen cubra todo su contenedor sin dejar espacios blancos
    target.style.objectFit = 'cover';
  }
}, true); // Debe ser true (fase de captura) o los eventos img de error no llegarán.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Inicializar CSRF token en segundo plano para no bloquear el render
initializeCsrfToken();
