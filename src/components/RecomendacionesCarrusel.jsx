import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecomendacionesCarrusel({ loading, list, user }) {
  const navigate = useNavigate();

  const shortText = (value, max = 110) => {
    if (!value) return '';
    const text = value.toString().trim();
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
  };

  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');

  return (
    <section id="recomendaciones" className="w-full bg-white py-16 pb-20 px-0 md:px-0">
      <div className="mb-8 px-6 md:px-12 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Recomendaciones</h2>
        <div className="flex items-center rounded-full border border-emerald-100 bg-white shadow-sm overflow-hidden">
          <button type="button" onClick={() => document.getElementById('recomendaciones-scroll')?.scrollBy({ left: -340, behavior: 'smooth' })} className="grid place-items-center w-10 h-8 px-2 text-emerald-600/60 hover:bg-emerald-50 transition"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div className="w-[1px] h-4 bg-emerald-100/60"></div>
          <button type="button" onClick={() => document.getElementById('recomendaciones-scroll')?.scrollBy({ left: 340, behavior: 'smooth' })} className="grid place-items-center w-10 h-8 px-2 text-emerald-600/60 hover:bg-emerald-50 transition"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>
      <div id="recomendaciones-scroll" className="overflow-x-auto scrollbar-none px-6 md:px-12">
        <div className="flex gap-6 md:gap-8 snap-x snap-mandatory pr-6 md:pr-12">
          {loading ? (
            <div className="text-sm text-slate-600">Cargando recomendaciones...</div>
          ) : list.length === 0 ? (
            <div className="text-sm text-slate-600">No hay recomendaciones disponibles para ti todavía.</div>
          ) : (
            list.map((rec, index) => (
              <article key={rec.id} className="group relative shrink-0 snap-start w-[260px] sm:w-[300px] md:w-[340px] aspect-[9/16] rounded-[26px] overflow-hidden shadow-xl cursor-pointer stagger-item" style={{ '--stagger-delay': `${Math.min(index, 10) * 50}ms` }} onClick={() => { if (user?.role === 'admin') navigate(`/admin/sitio/${rec.id}`); else if (user && user.role !== 'operator') navigate(`/turista/sitio/${rec.id}`); else navigate(`/sitio/${rec.id}`); }}>
                <img loading={index < 3 ? "eager" : "lazy"} decoding="async" src={rec.imagen || storageUrl(rec.cover)} alt={rec.nombre || rec.name} className="absolute inset-0 h-full w-full object-cover rounded-[26px] origin-center transform transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]" />
                <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]">
                  <div className="relative z-10 space-y-1 text-white"><p className="text-white/80 text-xs font-semibold">Recomendado</p><h3 className="text-2xl font-bold leading-tight">{shortText(rec.nombre || rec.name, 38)}</h3><p className="text-sm">{shortText(rec.slogan || 'Explora este destino increíble', 84)}</p></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">{(Array.isArray(rec.label) && rec.label.length > 0 ? rec.label : [{ id: 'none', name: 'Sin etiquetas' }]).slice(0, 3).map((label, idx) => (<span key={label.id ?? `${rec.id}-label-${idx}`} className="rounded-full bg-white/20 text-white text-xs px-3 py-1 backdrop-blur">{label.name || 'Etiqueta'}</span>))}</div>
                    <button className="grid place-items-center h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition">+</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
