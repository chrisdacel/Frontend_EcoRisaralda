import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AccessibilityButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [contrast, setContrast] = useState('normal');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  
  const menuRef = useRef(null);
  const location = useLocation();

  // Cerrar menú al cambiar de página
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Cerrar menú al hacer clic por fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // Escuchar el scroll para moverse arriba del botón "Scroll to top"
    // El botón original normalmente aparece cuando scrollY > 100 o 300
    const handleScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTextSize = () => {
    if (textSize === 'normal') {
      document.documentElement.classList.add('text-large');
      setTextSize('large');
    } else if (textSize === 'large') {
      document.documentElement.classList.remove('text-large');
      document.documentElement.classList.add('text-xlarge');
      setTextSize('xlarge');
    } else {
      document.documentElement.classList.remove('text-xlarge');
      setTextSize('normal');
    }
  };

  const toggleContrast = () => {
    if (contrast === 'normal') {
      document.documentElement.classList.add('high-contrast');
      setContrast('high');
    } else {
      document.documentElement.classList.remove('high-contrast');
      setContrast('normal');
    }
  };

  const toggleReduceMotion = () => {
    if (reduceMotion) {
      document.documentElement.classList.remove('reduce-motion');
      setReduceMotion(false);
    } else {
      document.documentElement.classList.add('reduce-motion');
      setReduceMotion(true);
    }
  };

  const toggleReadableFont = () => {
    if (readableFont) {
      document.documentElement.classList.remove('readable-font');
      setReadableFont(false);
    } else {
      document.documentElement.classList.add('readable-font');
      setReadableFont(true);
    }
  };

  const resetAll = () => {
    document.documentElement.classList.remove('text-large', 'text-xlarge', 'high-contrast', 'reduce-motion', 'readable-font');
    setTextSize('normal');
    setContrast('normal');
    setReduceMotion(false);
    setReadableFont(false);
  };

  const isAuthPage = 
    location.pathname === "/login" || 
    location.pathname === "/seleccionar-rol" || 
    location.pathname.includes("/registro");

  const positionClass = showScrollTop
    ? (isAuthPage ? 'bottom-6 xl:bottom-[5.5rem]' : 'bottom-[5.5rem]')
    : 'bottom-6';

  return (
    <div id="accessibility-widget" ref={menuRef} className={`fixed right-4 z-[9999] transition-all duration-300 ${positionClass}`}>
      <div className="relative flex items-center">
        {/* Menú Desplegable a la Izquierda */}
        {isOpen && (
          <div className="absolute right-full bottom-0 mr-4 bg-white/95 backdrop-blur-md border border-emerald-100 shadow-xl shadow-emerald-500/20 rounded-xl py-2 w-64 max-h-[75vh] overflow-y-auto animate-fadeInDown origin-bottom-right text-slate-800" style={{ animationDuration: '200ms' }}>
             <div className="px-4 py-2 border-b border-emerald-50 mb-1">
               <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Accesibilidad</span>
             </div>
             
             <button onClick={toggleTextSize} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
               </svg>
               {textSize === 'normal' ? 'Aumentar Texto' : textSize === 'large' ? 'Aumentar Más el Texto' : 'Texto Normal'}
             </button>
             
             <button onClick={toggleContrast} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>
               {contrast === 'normal' ? 'Alto Contraste' : 'Contraste Normal'}
             </button>
             
             <button onClick={toggleReduceMotion} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {reduceMotion ? 'Restaurar Animaciones' : 'Pausar Animaciones'}
             </button>

             <button onClick={toggleReadableFont} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
               </svg>
               {readableFont ? 'Fuente Original' : 'Fuente Legible'}
             </button>
             
             <div className="border-t border-emerald-50 mt-1"></div>
             
             <button onClick={resetAll} className="w-full text-left px-4 py-2.5 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
               Restablecer Todo
             </button>
          </div>
        )}

        {/* Botón Principal (Basado en el Scroll to top) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 flex items-center justify-center ${isOpen ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          aria-label="Opciones de Accesibilidad"
          title="Accesibilidad"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AccessibilityButton;
