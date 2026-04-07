import React, { useRef } from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const containerRef = useRef(null);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (!containerRef.current) {
      onPageChange(page);
      return;
    }
    
    // Guardamos la posición exacta del contenedor respecto a la ventana
    const oldBottom = containerRef.current.getBoundingClientRect().bottom;
    
    onPageChange(page);
    
    // Ajustamos el scroll para que el componente no salte bruscamente.
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const newBottom = containerRef.current.getBoundingClientRect().bottom;
        window.scrollBy(0, newBottom - oldBottom);
      }
    });
  };

  return (
    <div ref={containerRef} className="mt-8 mb-4 flex items-center justify-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
           page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-1 text-slate-400">...</span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => handlePageClick(page)}
              className={`min-w-[36px] h-9 sm:min-w-[40px] sm:h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-500 pointer-events-none'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
