export default function FavoriteBtn({ isFavorite, isLoading, onToggle, className = '' }) {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={isLoading}
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ring-1 backdrop-blur transition ${
          isFavorite
            ? 'bg-emerald-600 text-white ring-emerald-200'
            : 'bg-white/85 text-emerald-700 ring-white/60 hover:bg-white'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      >
        <svg
          className={`h-6 w-6 transition-transform ${isFavorite ? 'scale-110' : 'scale-100'}`}
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      </button>
    );
  }
  