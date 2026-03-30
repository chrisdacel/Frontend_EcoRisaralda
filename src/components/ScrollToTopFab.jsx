import React, { useState, useEffect } from 'react';

export default function ScrollToTopFab() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScrollTop) return null;

  return (
    <button
      id="scroll-to-top-widget"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[9999] rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
}
