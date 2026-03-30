import React from 'react';

export default function SitioCard({
  sitio,
  index,
  user,
  isTourist,
  isGuest,
  isFavorite,
  onToggleFavorite,
  onNavigate,
}) {
  const shortText = (value, max = 110) => {
    if (!value) return '';
    const text = value.toString().trim();
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
  };

  const handleClick = () => {
    if (user?.role === 'admin') {
      onNavigate(`/admin/sitio/${sitio.id}`);
    } else if (user && user.role !== 'operator') {
      onNavigate(`/turista/sitio/${sitio.id}`);
    } else {
      onNavigate(`/sitio/${sitio.id}`);
    }
  };

  return (
    <article
      className="group cursor-pointer rounded-lg border border-emerald-100 bg-white shadow-sm shadow-emerald-100/50 overflow-hidden hover:shadow-lg transition relative stagger-item"
      style={{ '--stagger-delay': `${Math.min(index, 12) * 40}ms` }}
      onClick={handleClick}
    >
      {/* Estado de aprobación para admin/operador */}
      {(user?.role === 'admin' || (user?.role === 'operator' && sitio.user_id === user.id)) && (
        <span
          className={`absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow transition
            ${
              sitio.approval_status === 'approved'
                ? 'bg-emerald-500/90 text-white shadow-emerald-500/30'
                : sitio.approval_status === 'rejected'
                  ? 'bg-rose-500/90 text-white shadow-rose-500/30'
                  : 'bg-yellow-400/90 text-yellow-900 shadow-yellow-400/30'
            }
          `}
          title={`Estado: ${
            sitio.approval_status === 'approved' ? 'Aprobado' : sitio.approval_status === 'rejected' ? 'Rechazado' : 'Pendiente'
          }`}
        >
          {sitio.approval_status === 'approved'
            ? 'Aprobado'
            : sitio.approval_status === 'rejected'
              ? 'Rechazado'
              : 'Pendiente'}
        </span>
      )}
      {user?.role === 'operator' && sitio.user_id === user.id && (
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6-4-3.9 5.5-.8L12 3z" />
          </svg>
          Tu sitio
        </span>
      )}

      {/* Botón Guardar en Favoritos */}
      {isTourist && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(event, sitio.id);
          }}
          className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 transition ${
            isFavorite
              ? 'bg-emerald-600 text-white ring-emerald-200'
              : 'bg-white/90 text-emerald-700 ring-emerald-100 hover:bg-emerald-50'
          }`}
          aria-label="Guardar en favoritos"
          title="Guardar en favoritos"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      )}

      {/* Imagen */}
      <div className="h-48 w-full overflow-hidden">
        <img
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
          src={`${import.meta.env.VITE_API_URL}/api/files/${sitio.cover}`}
          alt={sitio.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Contenido Texto */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{shortText(sitio.name, 44)}</h3>
        {isGuest ? (
          <>
            <p className="text-sm text-slate-600 mb-2">{shortText(sitio.description || sitio.slogan, 120)}</p>
            <p className="text-xs text-emerald-600">Registrate para ver mas detalles.</p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-2">{shortText(sitio.slogan, 90)}</p>
            <p className="text-xs text-emerald-600">📍 {shortText(sitio.localization, 70)}</p>
          </>
        )}
      </div>
    </article>
  );
}
